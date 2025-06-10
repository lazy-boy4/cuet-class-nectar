package services

import (
	"fmt"
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	sbClient "github.com/lazy-boy4/cuet-class-nectar/internal/supabase"
	// "strings" // Removed as strings.Join is no longer needed with []string for In
	"time"

	"github.com/google/uuid"
)

// CreateEnrollmentRequest allows a student to request enrollment in a class.
func CreateEnrollmentRequest(studentID uuid.UUID, classID int) (models.Enrollment, error) {
	client := sbClient.GetClient()
	if client == nil {
		return models.Enrollment{}, fmt.Errorf("Supabase client not initialized")
	}

	var existingEnrollments []models.Enrollment
	err := client.DB.From("enrollments").Select("*").
		Eq("user_id", studentID.String()).
		Eq("class_id", fmt.Sprintf("%d", classID)).
		Execute(&existingEnrollments)

	if err == nil && len(existingEnrollments) > 0 {
		for _, enr := range existingEnrollments {
			if enr.Status == "approved" {
				return models.Enrollment{}, fmt.Errorf("already approved for class ID %d", classID)
			}
			if enr.Status == "pending" {
				return models.Enrollment{}, fmt.Errorf("enrollment request already pending for class ID %d", classID)
			}
		}
	} else if err != nil {
		return models.Enrollment{}, fmt.Errorf("failed to check existing enrollments: %w", err)
	}

	now := time.Now()
	enrollmentData := models.Enrollment{
		UserID:      studentID,
		ClassID:     classID,
		Status:      "pending",
		RequestedAt: &now,
	}
	insertMap := map[string]interface{}{
		"user_id":      studentID,
		"class_id":     classID,
		"status":       "pending",
		"requested_at": now,
	}

	var results []models.Enrollment
	err = client.DB.From("enrollments").Upsert(insertMap).Execute(&results)
	if err != nil {
		return models.Enrollment{}, fmt.Errorf("failed to create/update enrollment request: %w", err)
	}
	if len(results) == 0 {
		fmt.Printf("Warning: Enrollment upsert for student %s, class %d returned no data. Assuming success based on no error.\n", studentID, classID)
		return enrollmentData, nil
	}
	return results[0], nil
}

// GetEnrollmentsByStudentID retrieves all enrollment records for a student.
func GetEnrollmentsByStudentID(studentID uuid.UUID) ([]models.EnrollmentView, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}

	var enrollments []models.Enrollment
	err := client.DB.From("enrollments").Select("*").Eq("user_id", studentID.String()).Execute(&enrollments)
	if err != nil {
		return nil, fmt.Errorf("failed to get enrollments for student %s: %w", studentID, err)
	}

	if len(enrollments) == 0 {
		return []models.EnrollmentView{}, nil
	}

	var enrollmentViews []models.EnrollmentView
	for _, enr := range enrollments {
		var classDetails []struct {
			Code    string
			Session string
		}
		errClass := client.DB.From("classes").Select("code,session").Eq("id", fmt.Sprintf("%d", enr.ClassID)).Execute(&classDetails)

		view := models.EnrollmentView{
			UserID:      enr.UserID,
			ClassID:     enr.ClassID,
			Status:      enr.Status,
			RequestedAt: enr.RequestedAt,
			ReviewedBy:  enr.ReviewedBy,
			ReviewedAt:  enr.ReviewedAt,
		}
		if errClass == nil && len(classDetails) > 0 {
			view.ClassCode = classDetails[0].Code
			view.ClassSession = classDetails[0].Session
		} else {
			fmt.Printf("Warning: Could not fetch class details for class_id %d during enrollment list: %v\n", enr.ClassID, errClass)
		}
		enrollmentViews = append(enrollmentViews, view)
	}
	return enrollmentViews, nil
}

// ListAvailableClassesForStudent shows classes a student is not yet approved or pending for.
func ListAvailableClassesForStudent(studentID uuid.UUID) ([]models.ClassSummary, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}

	var existingEnrollments []struct {
		ClassID int `json:"class_id"`
	}
	err := client.DB.From("enrollments").Select("class_id").
		Eq("user_id", studentID.String()).
		In("status", []string{"approved", "pending"}).
		Execute(&existingEnrollments)

	if err != nil {
		return nil, fmt.Errorf("failed to check existing enrollments for available classes: %w", err)
	}

	var availableClasses []models.Class
	// baseQuery is a *supabase.QueryBuilder (from nedpals/supabase-go)
	baseQuery := client.DB.From("classes").Select("id,code,session,section,dept_id")

	if len(existingEnrollments) > 0 {
		var excludedClassIDStrings []string
		for _, enr := range existingEnrollments {
			excludedClassIDStrings = append(excludedClassIDStrings, fmt.Sprintf("%d", enr.ClassID))
		}
		// .Not() negates the next filter. .In() for postgrest-go FilterRequestBuilder expects (column, []string).
		// The error `cannot use ... as *postgrest_go.SelectRequestBuilder value in assignment`
		// means that `baseQuery.Not().In(...)` returns a different type than `baseQuery`.
		// We need to assign to a new variable or directly execute.
		// The error `cannot use excludedInterfaceSlice (variable of type []interface{}) as []string value in argument to queryBuilder.Not().In`
		// means that the `In` method after `Not()` specifically wants `[]string`.

		// finalQuery will be of type *postgrest_go.FilterRequestBuilder
		finalQuery := baseQuery.Not().In("id", excludedClassIDStrings)
		err = finalQuery.Execute(&availableClasses)
	} else {
		err = baseQuery.Execute(&availableClasses)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to list available classes: %w", err)
	}

	var classSummaries []models.ClassSummary
	if len(availableClasses) > 0 {
		allDepts, deptErr := GetAllDepartments()
		deptMap := make(map[int]string)
		if deptErr == nil && allDepts != nil {
			for _, dept := range allDepts {
				deptMap[dept.ID] = dept.Name
			}
		} else if deptErr != nil {
			fmt.Printf("Warning: Could not fetch departments for listing available classes: %v\n", deptErr)
		}

		for _, class := range availableClasses {
			classSummaries = append(classSummaries, models.ClassSummary{
				ID: class.ID, Code: class.Code, Session: class.Session, Section: class.Section,
				DepartmentName: deptMap[class.DeptID],
			})
		}
	}
	return classSummaries, nil
}

// ReviewEnrollmentRequest allows a CR to approve or reject a pending enrollment.
func ReviewEnrollmentRequest(classID int, studentIDToReview uuid.UUID, newStatus string, crUserID uuid.UUID) (models.Enrollment, error) {
	client := sbClient.GetClient()
	if client == nil {
		return models.Enrollment{}, fmt.Errorf("Supabase client not initialized")
	}

	// Step 1: Verify crUserID is indeed a CR and is enrolled and approved in classID.
	var crUserResults []models.User // Fetch more user details if needed for logging/context
	err := client.DB.From("users").Select("id,role,email").Eq("id", crUserID.String()).Execute(&crUserResults)
	if err != nil || len(crUserResults) == 0 {
		return models.Enrollment{}, fmt.Errorf("CR user %s not found or error fetching: %w", crUserID, err)
	}
	if crUserResults[0].Role != "cr" {
		return models.Enrollment{}, fmt.Errorf("user %s (%s) is not a Class Representative", crUserResults[0].Email, crUserID)
	}

	var crEnrollment []models.Enrollment
	err = client.DB.From("enrollments").Select("status").
		Eq("user_id", crUserID.String()).
		Eq("class_id", fmt.Sprintf("%d", classID)).
		Eq("status", "approved").
		Execute(&crEnrollment)
	if err != nil {
		return models.Enrollment{}, fmt.Errorf("error verifying CR's enrollment in class %d: %w", classID, err)
	}
	if len(crEnrollment) == 0 {
		return models.Enrollment{}, fmt.Errorf("CR %s (%s) is not an approved member of class %d", crUserResults[0].Email, crUserID, classID)
	}

	// Step 2: Find the pending enrollment request for studentIDToReview in classID.
	var targetEnrollment []models.Enrollment
	err = client.DB.From("enrollments").Select("*").
		Eq("user_id", studentIDToReview.String()).
		Eq("class_id", fmt.Sprintf("%d", classID)).
		Eq("status", "pending").
		Execute(&targetEnrollment)

	if err != nil {
		return models.Enrollment{}, fmt.Errorf("error finding enrollment request for student %s in class %d: %w", studentIDToReview, classID, err)
	}
	if len(targetEnrollment) == 0 {
		return models.Enrollment{}, fmt.Errorf("no pending enrollment request found for student %s in class %d (it may have been already reviewed or cancelled)", studentIDToReview, classID)
	}

	// Step 3: Update the status.
	updateData := map[string]interface{}{
		"status":      newStatus,
		"reviewed_by": crUserID,
		"reviewed_at": time.Now(), // time.Now() will be correctly formatted by the DB client
	}
	var updatedEnrollmentResult []models.Enrollment // nedpals client expects a slice
	// Using simplified Update(data) for nedpals/supabase-go@v0.5.0
	err = client.DB.From("enrollments").Update(updateData).
		Eq("user_id", studentIDToReview.String()).
		Eq("class_id", fmt.Sprintf("%d", classID)).
		Eq("status", "pending"). // Ensure we only update if it's still pending (atomicity)
		Execute(&updatedEnrollmentResult)

	if err != nil {
		return models.Enrollment{}, fmt.Errorf("failed to update enrollment status: %w", err)
	}
	if len(updatedEnrollmentResult) == 0 {
		// This could happen if the status was changed by another CR/Admin between Step 2 and Step 3.
		return models.Enrollment{}, fmt.Errorf("enrollment status update returned no data (request may no longer be pending or already processed by another reviewer)")
	}

	return updatedEnrollmentResult[0], nil
}

// GetPendingEnrollmentsForClass retrieves pending enrollment requests for a specific class (for CR/Admin view).
func GetPendingEnrollmentsForClass(classID int, requestorUserID uuid.UUID) ([]models.EnrollmentView, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}

	// Authorization: Check if requestorUserID is CR for this class or an Admin
	requestorRole, err := GetUserRole(requestorUserID.String())
	if err != nil {
		return nil, fmt.Errorf("failed to get role for user %s: %w", requestorUserID, err)
	}

	isAuthorized := false
	if requestorRole == "admin" {
		isAuthorized = true
	} else if requestorRole == "cr" {
		var crEnrollment []models.Enrollment
		err = client.DB.From("enrollments").Select("status").
			Eq("user_id", requestorUserID.String()).
			Eq("class_id", fmt.Sprintf("%d", classID)).
			Eq("status", "approved").Execute(&crEnrollment)
		if err != nil {
			return nil, fmt.Errorf("error verifying CR's enrollment in class %d: %w", classID, err)
		}
		if len(crEnrollment) > 0 {
			isAuthorized = true
		}
	}

	if !isAuthorized {
		return nil, fmt.Errorf("user %s (role: %s) is not authorized to view pending enrollments for class %d", requestorUserID, requestorRole, classID)
	}
	// End Authorization

	var pendingEnrollments []models.Enrollment
	err = client.DB.From("enrollments").Select("*").
		Eq("class_id", fmt.Sprintf("%d", classID)).
		Eq("status", "pending").
		Execute(&pendingEnrollments)

	if err != nil {
		return nil, fmt.Errorf("failed to get pending enrollments for class %d: %w", classID, err)
	}
	if len(pendingEnrollments) == 0 {
		return []models.EnrollmentView{}, nil
	}

	var enrollmentViews []models.EnrollmentView
	for _, enr := range pendingEnrollments {
		var studentUser []struct{ FullName string } // Fetch only FullName
		errUser := client.DB.From("users").Select("full_name").Eq("id", enr.UserID.String()).Execute(&studentUser)

		view := models.EnrollmentView{ // Populate common fields
			UserID:      enr.UserID,
			ClassID:     enr.ClassID,
			Status:      enr.Status,
			RequestedAt: enr.RequestedAt,
		}
		if errUser == nil && len(studentUser) > 0 {
			// view.StudentName = studentUser[0].FullName // Add StudentName to EnrollmentView model if this is needed
		} else {
			fmt.Printf("Warning: Could not fetch student details for user_id %s when listing pending enrollments: %v\n", enr.UserID, errUser)
		}
		// Populate class details (code, session)
		var classDetails []struct {
			Code    string
			Session string
		}
		errClass := client.DB.From("classes").Select("code,session").Eq("id", fmt.Sprintf("%d", enr.ClassID)).Execute(&classDetails)
		if errClass == nil && len(classDetails) > 0 {
			view.ClassCode = classDetails[0].Code
			view.ClassSession = classDetails[0].Session
		} else {
			fmt.Printf("Warning: Could not fetch class details for class_id %d when listing pending enrollments: %v\n", enr.ClassID, errClass)
		}
		enrollmentViews = append(enrollmentViews, view)
	}
	return enrollmentViews, nil
}
