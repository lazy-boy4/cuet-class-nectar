package handlers

import (
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	"github.com/lazy-boy4/cuet-class-nectar/internal/services"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// --- Student Dashboard & Profile ---
func GetStudentDashboardHandler(c *gin.Context) { /* ... */
	userIDval, _ := c.Get("userID")
	studentID, err := uuid.Parse(userIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid student ID in token context"})
		return
	}
	dashboardData, err := services.GetStudentDashboardData(studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve student dashboard data: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, dashboardData)
}
func GetOwnProfileHandler(c *gin.Context) { /* ... */
	userIDval, _ := c.Get("userID")
	userIDstr := userIDval.(string)
	user, err := services.GetUserByIDByAdmin(userIDstr)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": "Profile not found for user: " + userIDstr})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve profile: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, user)
}
func UpdateOwnProfileHandler(c *gin.Context) { /* ... */
	userIDval, _ := c.Get("userID")
	userID, err := uuid.Parse(userIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID in token for profile update"})
		return
	}
	var input models.StudentProfileUpdateInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
	updatedUser, err := services.UpdateOwnUserProfile(userID, input)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") || strings.Contains(strings.ToLower(err.Error()), "returned no data") {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found or update failed to apply."})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, updatedUser)
}

// --- Student Enrollment Handlers ---
func CreateEnrollmentRequestHandler(c *gin.Context) { /* ... */
	userIDval, _ := c.Get("userID")
	studentID, err := uuid.Parse(userIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid student ID in token"})
		return
	}
	var input models.EnrollmentRequestInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
	enrollment, err := services.CreateEnrollmentRequest(studentID, input.ClassID)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "already approved") || strings.Contains(strings.ToLower(err.Error()), "already pending") {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		} else if strings.Contains(strings.ToLower(err.Error()), "violates foreign key constraint") && strings.Contains(err.Error(), "classes") {
			c.JSON(http.StatusNotFound, gin.H{"error": "Class not found."})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create enrollment request: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusCreated, enrollment)
}
func GetMyEnrollmentsHandler(c *gin.Context) { /* ... */
	userIDval, _ := c.Get("userID")
	studentID, err := uuid.Parse(userIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid student ID in token"})
		return
	}
	enrollments, err := services.GetEnrollmentsByStudentID(studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve enrollments: " + err.Error()})
		return
	}
	if enrollments == nil {
		c.JSON(http.StatusOK, []models.EnrollmentView{})
	}
	c.JSON(http.StatusOK, enrollments)
}
func ListAvailableClassesForEnrollmentHandler(c *gin.Context) { /* ... */
	userIDval, _ := c.Get("userID")
	studentID, err := uuid.Parse(userIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid student ID in token"})
		return
	}
	availableClasses, err := services.ListAvailableClassesForStudent(studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list available classes: " + err.Error()})
		return
	}
	if availableClasses == nil {
		c.JSON(http.StatusOK, []models.ClassSummary{})
	}
	c.JSON(http.StatusOK, availableClasses)
}

// --- CR Enrollment Review Handlers ---
func ReviewEnrollmentRequestHandler(c *gin.Context) { /* ... */
	crUserIDval, _ := c.Get("userID")
	crUserID, err := uuid.Parse(crUserIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid CR User ID in token"})
		return
	}
	classIDStr := c.Param("classId")
	classID, err := strconv.Atoi(classIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Class ID in path: " + err.Error()})
		return
	}
	var input models.ReviewEnrollmentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
	updatedEnrollment, err := services.ReviewEnrollmentRequest(classID, input.StudentIDToReview, input.NewStatus, crUserID)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else if strings.Contains(strings.ToLower(err.Error()), "is not a Class Representative") || strings.Contains(strings.ToLower(err.Error()), "not an approved member of class") {
			c.JSON(http.StatusForbidden, gin.H{"error": "Authorization failed: " + err.Error()})
		} else if strings.Contains(strings.ToLower(err.Error()), "request may no longer be pending") || strings.Contains(strings.ToLower(err.Error()), "returned no data") {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to review enrollment request: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Enrollment request reviewed successfully.", "enrollment": updatedEnrollment})
}
func GetPendingEnrollmentsForClassHandler(c *gin.Context) { /* ... */
	requestorUserIDval, _ := c.Get("userID")
	requestorUserID, err := uuid.Parse(requestorUserIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid User ID in token"})
		return
	}
	classIDStr := c.Param("classId")
	classID, err := strconv.Atoi(classIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Class ID in path: " + err.Error()})
		return
	}
	pendingEnrollments, err := services.GetPendingEnrollmentsForClass(classID, requestorUserID)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not authorized") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get pending enrollments: " + err.Error()})
		}
		return
	}
	if pendingEnrollments == nil {
		c.JSON(http.StatusOK, []models.EnrollmentView{})
	}
	c.JSON(http.StatusOK, pendingEnrollments)
}

// --- CR Class Event Management Handlers ---
func CreateClassEventHandler(c *gin.Context) {
	crUserIDval, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
		return
	}
	crUserID, err := uuid.Parse(crUserIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid CR User ID in token"})
		return
	}

	classIDStr := c.Param("classId")
	classID, err := strconv.Atoi(classIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Class ID in path: " + classIDStr})
		return
	}

	var input models.ClassEventInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	event, err := services.CreateClassEvent(classID, input, crUserID)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not authorized") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		} else if strings.Contains(strings.ToLower(err.Error()), "violates foreign key constraint") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data for event (e.g., class_id): " + err.Error()})
		} else if strings.Contains(strings.ToLower(err.Error()), "23505") || strings.Contains(strings.ToLower(err.Error()), "unique constraint") { // Generic unique constraint
			c.JSON(http.StatusConflict, gin.H{"error": "Class event conflicts with an existing one."})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create class event: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusCreated, event)
}

// GetClassEventsHandler can be used by students, CRs, teachers for a class they are part of.
// Authorization for which classes a user can view events for should be handled by RLS or service layer if needed.
func GetClassEventsHandler(c *gin.Context) {
	classIDStr := c.Param("classId")
	classID, err := strconv.Atoi(classIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Class ID in path: " + classIDStr})
		return
	}

	events, err := services.GetClassEventsByClassID(classID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve class events: " + err.Error()})
		return
	}
	if events == nil {
		c.JSON(http.StatusOK, []models.ClassEvent{})
		return
	}
	c.JSON(http.StatusOK, events)
}

func UpdateClassEventHandler(c *gin.Context) {
	crUserIDval, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
		return
	}
	crUserID, err := uuid.Parse(crUserIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid CR User ID in token"})
		return
	}

	classIDStr := c.Param("classId")
	classID, err := strconv.Atoi(classIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Class ID in path: " + classIDStr})
		return
	}

	eventIDStr := c.Param("eventId")
	eventID, err := strconv.Atoi(eventIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Event ID in path: " + eventIDStr})
		return
	}

	var input models.ClassEventInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	updatedEvent, err := services.UpdateClassEvent(eventID, classID, input, crUserID)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not authorized") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		} else if strings.Contains(strings.ToLower(err.Error()), "not found") || strings.Contains(strings.ToLower(err.Error()), "does not belong to class") {
			c.JSON(http.StatusNotFound, gin.H{"error": "Event not found or does not belong to the specified class."})
		} else if strings.Contains(strings.ToLower(err.Error()), "23505") || strings.Contains(strings.ToLower(err.Error()), "unique constraint") {
			c.JSON(http.StatusConflict, gin.H{"error": "Update conflicts with an existing class event."})
		} else if strings.Contains(strings.ToLower(err.Error()), "violates foreign key constraint") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data for event update: " + err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update class event: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, updatedEvent)
}

func DeleteClassEventHandler(c *gin.Context) {
	crUserIDval, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
		return
	}
	crUserID, err := uuid.Parse(crUserIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid CR User ID in token"})
		return
	}

	classIDStr := c.Param("classId")
	classID, err := strconv.Atoi(classIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Class ID in path: " + classIDStr})
		return
	}

	eventIDStr := c.Param("eventId")
	eventID, err := strconv.Atoi(eventIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Event ID in path: " + eventIDStr})
		return
	}

	err = services.DeleteClassEvent(eventID, classID, crUserID)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not authorized") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		} else if strings.Contains(strings.ToLower(err.Error()), "not found") || strings.Contains(strings.ToLower(err.Error()), "does not belong to class") {
			c.JSON(http.StatusNotFound, gin.H{"error": "Event not found or does not belong to the specified class."})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete class event: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Class event deleted successfully"})
}
