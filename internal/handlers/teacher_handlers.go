package handlers

import (
	"fmt"
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	"github.com/lazy-boy4/cuet-class-nectar/internal/services"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// --- Teacher: Notice Management Handlers ---
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
	if input.ClassID == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ClassID is required for teachers to post a notice."})
		return
	}
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
func GetNoticesByClassForTeacherHandler(c *gin.Context) {
	classID := c.Param("classId")
	if classID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Class ID parameter is required."})
		return
	}
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

// --- Teacher: Attendance Management Handlers ---
func UpsertAttendanceHandler(c *gin.Context) {
	classIDStr := c.Param("classId")
	if classIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Class ID parameter is required in path."})
		return
	}
	var input models.AttendanceInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
	userIDval, _ := c.Get("userID")
	markerID, err := uuid.Parse(userIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid marker user ID in token"})
		return
	}
	processedCount, serviceErrors := services.UpsertAttendanceRecords(input.ClassID, input.Date, input.Records, markerID)
	if len(serviceErrors) > 0 {
		var errorMessages []string
		for _, e := range serviceErrors {
			errorMessages = append(errorMessages, e.Error())
		}
		if processedCount > 0 {
			c.JSON(http.StatusMultiStatus, gin.H{"message": "Attendance processing completed with some errors.", "records_processed": processedCount, "errors_count": len(serviceErrors), "error_details": errorMessages})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to process any attendance records.", "errors_count": len(serviceErrors), "error_details": errorMessages})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Attendance recorded/updated successfully.", "records_processed": processedCount})
}
func GetAttendanceByClassAndDateHandler(c *gin.Context) {
	classID := c.Param("classId")
	date := c.Query("date")
	if classID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Class ID parameter is required."})
		return
	}
	if date == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Date query parameter is required."})
		return
	}
	attendanceData, err := services.GetAttendanceByClassAndDate(classID, date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to retrieve attendance: %v", err)})
		return
	}
	if attendanceData == nil {
		c.JSON(http.StatusOK, []models.AttendanceQueryResponse{})
		return
	}
	c.JSON(http.StatusOK, attendanceData)
}
func GetStudentAttendanceInClassHandler(c *gin.Context) {
	classID := c.Param("classId")
	studentID := c.Param("studentId")
	if classID == "" || studentID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Class ID and Student ID parameters are required."})
		return
	}
	records, err := services.GetAttendanceForStudentInClass(classID, studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve attendance records: " + err.Error()})
		return
	}
	if records == nil {
		c.JSON(http.StatusOK, []models.AttendanceRecord{})
		return
	}
	c.JSON(http.StatusOK, records)
}

// --- Teacher: Schedule Management Handlers ---
func CreateScheduleEntryHandler(c *gin.Context) {
	var input models.ScheduleEntryInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
	userIDval, _ := c.Get("userID")
	creatorID, err := uuid.Parse(userIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid creator user ID in token"})
		return
	}
	entry, err := services.CreateScheduleEntry(input, creatorID)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "23505") || strings.Contains(strings.ToLower(err.Error()), "duplicate key") {
			c.JSON(http.StatusConflict, gin.H{"error": "Schedule entry conflicts with an existing one."})
		} else if strings.Contains(strings.ToLower(err.Error()), "violates foreign key constraint") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data for schedule entry (e.g., non-existent course_code or teacher_id): " + err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create schedule entry: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusCreated, entry)
}
func GetScheduleByClassHandler(c *gin.Context) {
	classID := c.Param("classId")
	if classID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Class ID parameter is required."})
		return
	}
	scheduleEntries, err := services.GetScheduleByClassID(classID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve schedule: " + err.Error()})
		return
	}
	if scheduleEntries == nil {
		c.JSON(http.StatusOK, []models.ScheduleEntry{})
		return
	}
	c.JSON(http.StatusOK, scheduleEntries)
}
func UpdateScheduleEntryHandler(c *gin.Context) {
	entryID := c.Param("entryId")
	var input models.ScheduleEntryInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
	userIDval, _ := c.Get("userID")
	updaterID, err := uuid.Parse(userIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid updater user ID in token"})
		return
	}
	updatedEntry, err := services.UpdateScheduleEntry(entryID, input, updaterID)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": "Schedule entry not found."})
		} else if strings.Contains(strings.ToLower(err.Error()), "23505") || strings.Contains(strings.ToLower(err.Error()), "duplicate key") {
			c.JSON(http.StatusConflict, gin.H{"error": "Update conflicts with an existing schedule entry."})
		} else if strings.Contains(strings.ToLower(err.Error()), "violates foreign key constraint") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data for schedule update (e.g., non-existent course_code or teacher_id): " + err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update schedule entry: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, updatedEntry)
}
func DeleteScheduleEntryHandler(c *gin.Context) {
	entryID := c.Param("entryId")
	userIDval, _ := c.Get("userID")
	deleterID, err := uuid.Parse(userIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid deleter user ID in token"})
		return
	}
	err = services.DeleteScheduleEntry(entryID, deleterID)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": "Schedule entry not found or already deleted."})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete schedule entry: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Schedule entry deleted successfully"})
}

// --- Teacher: Dashboard Handler ---
func GetTeacherDashboardHandler(c *gin.Context) {
	userIDval, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
		return
	}
	teacherID, err := uuid.Parse(userIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid teacher ID in token context"})
		return
	}

	dashboardData, err := services.GetTeacherDashboardData(teacherID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve teacher dashboard data: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, dashboardData)
}
