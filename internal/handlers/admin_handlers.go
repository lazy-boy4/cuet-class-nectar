package handlers

import (
	"encoding/csv"
	"fmt"
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	"github.com/lazy-boy4/cuet-class-nectar/internal/services"
	"io"
	"mime/multipart"
	"net/http"
	"strings"
	// "strconv"
	"github.com/google/uuid" // Added back for uuid.Parse

	"github.com/gin-gonic/gin"
)

var _ *multipart.FileHeader // To use mime/multipart import

// --- Department Handlers ---
func CreateDepartmentHandler(c *gin.Context) {
	var input models.DepartmentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
	department, err := services.CreateDepartment(input)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "23505") ||
			strings.Contains(strings.ToLower(err.Error()), "duplicate key value violates unique constraint departments_code_key") ||
			strings.Contains(strings.ToLower(err.Error()), "duplicate key") {
			c.JSON(http.StatusConflict, gin.H{"error": "Department code already exists."})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create department."})
		}
		return
	}
	c.JSON(http.StatusCreated, department)
}
func GetDepartmentsHandler(c *gin.Context) {
	departments, err := services.GetAllDepartments()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve departments."})
		return
	}
	if departments == nil {
		c.JSON(http.StatusOK, []models.Department{})
		return
	}
	c.JSON(http.StatusOK, departments)
}
func GetDepartmentHandler(c *gin.Context) {
	id := c.Param("id")
	department, err := services.GetDepartmentByID(id)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve department."})
		}
		return
	}
	c.JSON(http.StatusOK, department)
}
func UpdateDepartmentHandler(c *gin.Context) {
	id := c.Param("id")
	var input models.DepartmentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
	department, err := services.UpdateDepartment(id, input)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") || strings.Contains(strings.ToLower(err.Error()), "returned no data") {
			c.JSON(http.StatusNotFound, gin.H{"error": "Department not found or RLS prevented update."})
		} else if strings.Contains(strings.ToLower(err.Error()), "23505") || strings.Contains(strings.ToLower(err.Error()), "duplicate key value violates unique constraint departments_code_key") || strings.Contains(strings.ToLower(err.Error()), "duplicate key") {
			c.JSON(http.StatusConflict, gin.H{"error": "Update failed: this department code already exists for another department."})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update department."})
		}
		return
	}
	c.JSON(http.StatusOK, department)
}
func DeleteDepartmentHandler(c *gin.Context) {
	id := c.Param("id")
	err := services.DeleteDepartment(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete department."})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Department deleted successfully."})
}

// --- Course Handlers ---
func CreateCourseHandler(c *gin.Context) {
	var input models.CourseInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
	course, err := services.CreateCourse(input)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "23505") || strings.Contains(strings.ToLower(err.Error()), "duplicate key") {
			c.JSON(http.StatusConflict, gin.H{"error": "Course with this code already exists."})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create course: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusCreated, course)
}
func GetCoursesHandler(c *gin.Context) {
	courses, err := services.GetAllCourses()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve courses: " + err.Error()})
		return
	}
	if courses == nil {
		c.JSON(http.StatusOK, []models.Course{})
		return
	}
	c.JSON(http.StatusOK, courses)
}
func GetCourseHandler(c *gin.Context) {
	id := c.Param("id")
	course, err := services.GetCourseByID(id)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve course: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, course)
}
func UpdateCourseHandler(c *gin.Context) {
	id := c.Param("id")
	var input models.CourseInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
	course, err := services.UpdateCourse(id, input)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") || strings.Contains(strings.ToLower(err.Error()), "returned no data") {
			c.JSON(http.StatusNotFound, gin.H{"error": "Course not found or update failed."})
		} else if strings.Contains(strings.ToLower(err.Error()), "23505") || strings.Contains(strings.ToLower(err.Error()), "duplicate key") {
			c.JSON(http.StatusConflict, gin.H{"error": "Update failed: course code already exists for another course."})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update course: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, course)
}
func DeleteCourseHandler(c *gin.Context) {
	id := c.Param("id")
	err := services.DeleteCourse(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete course: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Course deleted successfully"})
}

// --- Class Handlers ---
func CreateClassHandler(c *gin.Context) {
	var input models.ClassInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
	class, err := services.CreateClass(input)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "23505") || strings.Contains(strings.ToLower(err.Error()), "duplicate key") {
			if strings.Contains(err.Error(), "classes_code_key") {
				c.JSON(http.StatusConflict, gin.H{"error": "Class with this code already exists."})
			} else if strings.Contains(err.Error(), "unique_class_session_section") {
				c.JSON(http.StatusConflict, gin.H{"error": "A class with the same department, session, and section already exists."})
			} else {
				c.JSON(http.StatusConflict, gin.H{"error": "Class creation failed due to a uniqueness constraint."})
			}
		} else if strings.Contains(strings.ToLower(err.Error()), "violates foreign key constraint") && strings.Contains(err.Error(), "dept_id") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Department ID: The specified department does not exist."})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create class: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusCreated, class)
}
func GetClassesHandler(c *gin.Context) {
	classes, err := services.GetAllClasses()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve classes: " + err.Error()})
		return
	}
	if classes == nil {
		c.JSON(http.StatusOK, []models.Class{})
		return
	}
	c.JSON(http.StatusOK, classes)
}
func GetClassHandler(c *gin.Context) {
	id := c.Param("id")
	class, err := services.GetClassByID(id)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve class: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, class)
}
func UpdateClassHandler(c *gin.Context) {
	id := c.Param("id")
	var input models.ClassInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
	class, err := services.UpdateClass(id, input)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") || strings.Contains(strings.ToLower(err.Error()), "returned no data") {
			c.JSON(http.StatusNotFound, gin.H{"error": "Class not found or RLS prevented update."})
		} else if strings.Contains(strings.ToLower(err.Error()), "23505") || strings.Contains(strings.ToLower(err.Error()), "duplicate key") {
			if strings.Contains(err.Error(), "classes_code_key") {
				c.JSON(http.StatusConflict, gin.H{"error": "Update failed: Class with this code already exists."})
			} else if strings.Contains(err.Error(), "unique_class_session_section") {
				c.JSON(http.StatusConflict, gin.H{"error": "Update failed: A class with the same department, session, and section already exists."})
			} else {
				c.JSON(http.StatusConflict, gin.H{"error": "Update failed due to a uniqueness constraint."})
			}
		} else if strings.Contains(strings.ToLower(err.Error()), "violates foreign key constraint") && strings.Contains(err.Error(), "dept_id") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Update failed: Invalid Department ID. The specified department does not exist."})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update class: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, class)
}
func DeleteClassHandler(c *gin.Context) {
	id := c.Param("id")
	err := services.DeleteClass(id)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "violates foreign key constraint") {
			c.JSON(http.StatusConflict, gin.H{"error": "Failed to delete class: It is referenced by other data."})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete class: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Class deleted successfully"})
}

// --- User Management Handlers (Admin) ---
func AdminCreateUserHandler(c *gin.Context) {
	var input models.AdminCreateUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
	if input.Role == "student" || input.Role == "cr" {
		if input.StudentID == nil || *input.StudentID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "StudentID is required for students and CRs."})
			return
		}
		if input.Batch == nil || *input.Batch == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Batch is required for students and CRs."})
			return
		}
		if input.DeptCode == nil || *input.DeptCode == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "DeptCode is required for students and CRs."})
			return
		}
	}
	if input.Role == "teacher" && (input.DeptCode == nil || *input.DeptCode == "") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "DeptCode is required for teachers."})
		return
	}

	user, err := services.AdminCreateUser(input)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "user already exists") ||
			strings.Contains(strings.ToLower(err.Error()), "email rate limit exceeded") ||
			(strings.Contains(strings.ToLower(err.Error()), "duplicate key") && strings.Contains(err.Error(), "users_email_key")) ||
			(strings.Contains(strings.ToLower(err.Error()), "23505") && strings.Contains(err.Error(), "users_email_key")) {
			c.JSON(http.StatusConflict, gin.H{"error": "User with this email already exists."})
		} else if strings.Contains(strings.ToLower(err.Error()), "duplicate key") && strings.Contains(err.Error(), "users_student_id_key") {
			c.JSON(http.StatusConflict, gin.H{"error": "User with this Student ID already exists."})
		} else if strings.Contains(err.Error(), "not supported") {
			c.JSON(http.StatusNotImplemented, gin.H{"error": "Admin auth user creation is not supported by the current backend library setup."})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusCreated, user)
}
func GetUsersHandler(c *gin.Context) {
	users, err := services.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve users: " + err.Error()})
		return
	}
	if users == nil {
		c.JSON(http.StatusOK, []models.User{})
		return
	}
	c.JSON(http.StatusOK, users)
}
func GetUserHandler(c *gin.Context) {
	userID := c.Param("id")
	user, err := services.GetUserByIDByAdmin(userID)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, user)
}
func AdminUpdateUserHandler(c *gin.Context) {
	userID := c.Param("id")
	var input models.AdminUpdateUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
	user, err := services.AdminUpdateUser(userID, input)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") || strings.Contains(strings.ToLower(err.Error()), "returned no data") {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found or update failed to apply."})
		} else if strings.Contains(strings.ToLower(err.Error()), "duplicate key") && strings.Contains(err.Error(), "users_student_id_key") {
			c.JSON(http.StatusConflict, gin.H{"error": "Update failed: Student ID already exists for another user."})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, user)
}
func AdminDeleteUserHandler(c *gin.Context) {
	userID := c.Param("id")
	err := services.AdminDeleteUser(userID)
	if err != nil {
		if strings.Contains(err.Error(), "not supported") {
			c.JSON(http.StatusNotImplemented, gin.H{"error": "Admin auth user deletion is not supported by the current backend library setup."})
		} else if strings.Contains(strings.ToLower(err.Error()), "user not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found."})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User deletion process initiated."})
}

// --- Bulk Student Profile Upload Handler ---
func BulkUploadStudentsHandler(c *gin.Context) {
	fileHeader, err := c.FormFile("csv_file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CSV file not provided or invalid: " + err.Error()})
		return
	}
	file, err := fileHeader.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open uploaded file: " + err.Error()})
		return
	}
	defer file.Close()
	if !strings.HasSuffix(strings.ToLower(fileHeader.Filename), ".csv") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type. Only CSV files are accepted."})
		return
	}
	csvReader := csv.NewReader(file)
	var studentsToUpload []models.BulkUploadStudentData
	header, err := csvReader.Read()
	if err == io.EOF {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CSV file is empty."})
		return
	}
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read CSV header: " + err.Error()})
		return
	}
	headerMap := make(map[string]int)
	expectedHeaders := []string{"uuid", "email", "full_name", "student_id", "dept_code", "batch", "section", "picture_url"}
	for i, h := range header {
		trimmedHeader := strings.ToLower(strings.TrimSpace(h))
		isExpected := false
		for _, eh := range expectedHeaders {
			if trimmedHeader == eh {
				isExpected = true
				break
			}
		}
		if isExpected {
			headerMap[trimmedHeader] = i
		}
	}
	requiredCsvHeaders := []string{"email", "full_name", "student_id", "dept_code", "batch"}
	for _, rh := range requiredCsvHeaders {
		if _, ok := headerMap[rh]; !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Missing required CSV header: %s", rh)})
			return
		}
	}
	for {
		record, err := csvReader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading CSV record: " + err.Error()})
			return
		}
		var student models.BulkUploadStudentData
		if idx, ok := headerMap["uuid"]; ok && idx < len(record) {
			student.UUID = strings.TrimSpace(record[idx])
		}
		if idx, ok := headerMap["email"]; ok && idx < len(record) {
			student.Email = strings.TrimSpace(record[idx])
		}
		if idx, ok := headerMap["full_name"]; ok && idx < len(record) {
			student.FullName = strings.TrimSpace(record[idx])
		}
		if idx, ok := headerMap["student_id"]; ok && idx < len(record) {
			student.StudentID = strings.TrimSpace(record[idx])
		}
		if idx, ok := headerMap["dept_code"]; ok && idx < len(record) {
			student.DeptCode = strings.TrimSpace(record[idx])
		}
		if idx, ok := headerMap["batch"]; ok && idx < len(record) {
			student.Batch = strings.TrimSpace(record[idx])
		}
		if idx, ok := headerMap["section"]; ok && idx < len(record) {
			val := strings.TrimSpace(record[idx])
			if val != "" {
				student.Section = &val
			}
		}
		if idx, ok := headerMap["picture_url"]; ok && idx < len(record) {
			val := strings.TrimSpace(record[idx])
			if val != "" {
				student.PictureURL = &val
			}
		}
		studentsToUpload = append(studentsToUpload, student)
	}
	if len(studentsToUpload) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No student data found in CSV after header."})
		return
	}
	created, _, serviceErrors := services.BulkUpsertStudentProfiles(studentsToUpload)
	if len(serviceErrors) > 0 {
		var errorMessages []string
		for _, e := range serviceErrors {
			errorMessages = append(errorMessages, e.Error())
		}
		c.JSON(http.StatusMultiStatus, gin.H{"message": "Bulk student profile upload processed with some errors.", "profiles_processed": created, "errors_count": len(serviceErrors), "error_details": errorMessages})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Bulk student profiles processed successfully.", "profiles_processed": created})
}

// --- Class Teacher Assignment Handlers ---
func AssignTeachersToClassHandler(c *gin.Context) {
	var input models.AssignTeachersInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
	if len(input.TeacherIDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No teacher IDs provided for assignment."})
		return
	}
	successfulAssignments, serviceErrors := services.AssignTeachersToClass(input.ClassID, input.TeacherIDs)
	if len(serviceErrors) > 0 {
		var errorMessages []string
		for _, e := range serviceErrors {
			errorMessages = append(errorMessages, e.Error())
		}
		if successfulAssignments > 0 {
			c.JSON(http.StatusMultiStatus, gin.H{"message": "Teacher assignment process completed with some errors.", "successful_assignments": successfulAssignments, "errors_count": len(serviceErrors), "error_details": errorMessages})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to assign any teachers.", "errors_count": len(serviceErrors), "error_details": errorMessages})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Teachers assigned to class successfully.", "successful_assignments": successfulAssignments})
}
func UnassignTeachersFromClassHandler(c *gin.Context) {
	var input models.UnassignTeachersInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
	if len(input.TeacherIDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No teacher IDs provided for unassignment."})
		return
	}
	successfulUnassignments, serviceErrors := services.UnassignTeachersFromClass(input.ClassID, input.TeacherIDs)
	if len(serviceErrors) > 0 {
		var errorMessages []string
		for _, e := range serviceErrors {
			errorMessages = append(errorMessages, e.Error())
		}
		if successfulUnassignments > 0 {
			c.JSON(http.StatusMultiStatus, gin.H{"message": "Teacher unassignment process completed with some errors.", "successful_unassignments": successfulUnassignments, "errors_count": len(serviceErrors), "error_details": errorMessages})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to unassign any teachers.", "errors_count": len(serviceErrors), "error_details": errorMessages})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Teachers unassigned from class successfully.", "successful_unassignments": successfulUnassignments})
}
func GetTeachersByClassHandler(c *gin.Context) { // This was defined in teacher_handlers.go as well. Consolidating here.
	classID := c.Param("classId")
	if classID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Class ID is required in path."})
		return
	}
	teachers, err := services.GetTeachersByClassID(classID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve teachers for class: " + err.Error()})
		return
	}
	if teachers == nil {
		c.JSON(http.StatusOK, []models.TeacherAssignmentDetail{})
		return
	}
	c.JSON(http.StatusOK, teachers)
}

// --- Promote/Demote CR Handlers ---
func PromoteStudentToCRHandler(c *gin.Context) {
	userID := c.Param("userId")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required in path."})
		return
	}
	updatedUser, err := services.PromoteStudentToCR(userID)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else if strings.Contains(strings.ToLower(err.Error()), "is not a student") || strings.Contains(strings.ToLower(err.Error()), "cannot promote") {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to promote student to CR: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User successfully promoted to CR.", "user": updatedUser})
}
func DemoteCRToStudentHandler(c *gin.Context) {
	userID := c.Param("userId")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required in path."})
		return
	}
	updatedUser, err := services.DemoteCRToStudent(userID)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else if strings.Contains(strings.ToLower(err.Error()), "is not a cr") {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to demote CR to student: " + err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User successfully demoted to Student.", "user": updatedUser})
}

// --- Global Notice Handler (Admin) ---
func CreateGlobalNoticeHandler(c *gin.Context) {
	var input models.NoticeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
	input.ClassID = nil
	userIDval, _ := c.Get("userID")
	authorID, err := uuid.Parse(userIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID in token for authoring global notice"})
		return
	}
	notice, err := services.CreateNotice(input, authorID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create global notice: " + err.Error()})
		return
	}
	c.JSON(http.StatusCreated, notice)
}
