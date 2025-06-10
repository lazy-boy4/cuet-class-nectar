package handlers

import (
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	"github.com/lazy-boy4/cuet-class-nectar/internal/services"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// --- Teacher: Notice Management Handlers ---

// CreateClassNoticeHandler allows a teacher to create a notice for a specific class.
func CreateClassNoticeHandler(c *gin.Context) {
	var input models.NoticeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	userIDval, _ := c.Get("userID")
	userID, err := uuid.Parse(userIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID in token"})
		return
	}

	// For teachers, ClassID must be provided in the input.
	// The TeacherRequired middleware ensures the user is a teacher or admin.
	// If an admin uses this route, they must also provide a class_id for this handler.
	// A separate admin route for global notices exists.
	// userRoleVal, _ := c.Get("userRole") // This was fetched but not used.
	// userRole := userRoleVal.(string) // Removed as userRole is not used in this function's logic.

	if input.ClassID == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ClassID is required to post a class notice via this endpoint."})
		return
	}

	// TODO: IMPORTANT Validation: Check if the authenticated teacher is assigned to input.ClassID.
	// This requires a new service function like services.IsTeacherAssignedToClass(teacherID, *input.ClassID).
	// If userRole is 'admin', this check can be bypassed. This logic is currently missing.

	notice, err := services.CreateNotice(input, userID)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "violates foreign key constraint") && strings.Contains(err.Error(), "class_id") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ClassID: The specified class does not exist."})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create notice: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusCreated, notice)
}

// GetNoticesByClassForTeacherHandler allows a teacher to get notices for a class they manage.
// classId from path parameter.
func GetNoticesByClassForTeacherHandler(c *gin.Context) {
	classID := c.Param("classId")
	if classID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Class ID parameter is required."})
		return
	}

	// TODO: IMPORTANT Validation: Check if the authenticated teacher is assigned to classID
	// or if user is admin.

	notices, err := services.GetNoticesByClass(classID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve notices: " + err.Error()})
		return
	}
	if notices == nil {
		c.JSON(http.StatusOK, []models.Notice{})
		return
	}
	c.JSON(http.StatusOK, notices)
}

// UpdateOwnNoticeHandler allows a teacher (or admin) to update a notice.
func UpdateOwnNoticeHandler(c *gin.Context) {
	noticeID := c.Param("noticeId")
	if noticeID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Notice ID parameter is required."})
		return
	}

	var input struct {
		Content string `json:"content" binding:"required,min=5,max=2000"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	userIDval, _ := c.Get("userID")
	userID, err := uuid.Parse(userIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID in token"})
		return
	}

	updatedNotice, err := services.UpdateNotice(noticeID, input.Content, userID)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else if strings.Contains(strings.ToLower(err.Error()), "not authorized") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update notice: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, updatedNotice)
}

// DeleteOwnNoticeHandler allows a teacher to delete a notice they authored.
// Admins can delete any notice (handled by service layer logic via userRole).
func DeleteOwnNoticeHandler(c *gin.Context) {
	noticeID := c.Param("noticeId")
	if noticeID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Notice ID parameter is required."})
		return
	}

	userIDval, _ := c.Get("userID")
	userID, err := uuid.Parse(userIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID in token"})
		return
	}

	userRoleVal, _ := c.Get("userRole")
	userRole := userRoleVal.(string)

	err = services.DeleteNotice(noticeID, userID, userRole)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else if strings.Contains(strings.ToLower(err.Error()), "not authorized") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete notice: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Notice deleted successfully"})
}

// GetGlobalNoticesHandler allows any authenticated user to see global notices.
func GetGlobalNoticesHandler(c *gin.Context) {
	notices, err := services.GetGlobalNotices()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve global notices: " + err.Error()})
		return
	}
	if notices == nil {
		c.JSON(http.StatusOK, []models.Notice{})
		return
	}
	c.JSON(http.StatusOK, notices)
}
