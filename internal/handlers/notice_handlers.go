package handlers

import (
	"net/http"

	"github.com/lazy-boy4/cuet-class-nectar/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetStudentRefinedNoticesHandler handles fetching relevant notices for a student.
func GetStudentRefinedNoticesHandler(c *gin.Context) {
	userIDStr := c.GetString("userID") // Get from Auth middleware
	if userIDStr == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	studentID, err := uuid.Parse(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	notices, err := services.GetRelevantNotices(studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, notices)
}
