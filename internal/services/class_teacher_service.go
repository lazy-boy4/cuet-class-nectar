package services

import (
	"fmt"
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	sbClient "github.com/lazy-boy4/cuet-class-nectar/internal/supabase"
	"strings"

	"github.com/google/uuid"
)

// AssignTeachersToClass assigns multiple teachers to a single class.
// It checks if teachers are actual 'teacher' role users.
// It attempts to insert all assignments and returns a list of errors if any fail.
func AssignTeachersToClass(classID int, teacherIDs []uuid.UUID) (successfulAssignments int, serviceErrors []error) {
	client := sbClient.GetClient()
	if client == nil {
		serviceErrors = append(serviceErrors, fmt.Errorf("Supabase client not initialized"))
		return
	}

	for _, teacherID := range teacherIDs {
		// Step 1: Verify the user is a teacher
		var userRoleResults []struct{ Role string }
		err := client.DB.From("users").Select("role").Eq("id", teacherID.String()).Execute(&userRoleResults)
		if err != nil {
			serviceErrors = append(serviceErrors, fmt.Errorf("failed to verify role for teacher ID %s: %w", teacherID, err))
			continue
		}
		if len(userRoleResults) == 0 {
			serviceErrors = append(serviceErrors, fmt.Errorf("user with ID %s not found", teacherID))
			continue
		}
		if userRoleResults[0].Role != "teacher" {
			serviceErrors = append(serviceErrors, fmt.Errorf("user with ID %s is not a teacher (role: %s)", teacherID, userRoleResults[0].Role))
			continue
		}

		// Step 2: Create the assignment
		// Using map[string]interface{} for data to be inserted to match nedpals/supabase-go Insert signature.
		assignmentData := map[string]interface{}{
			"user_id":  teacherID,
			"class_id": classID,
		}
		var insertResult []models.ClassTeacher

		// Using simplified Insert(data) for nedpals/supabase-go@v0.5.0
		err = client.DB.From("class_teachers").Insert(assignmentData).Execute(&insertResult)
		if err != nil {
			if strings.Contains(strings.ToLower(err.Error()), "23505") || strings.Contains(strings.ToLower(err.Error()), "duplicate key") {
				serviceErrors = append(serviceErrors, fmt.Errorf("teacher %s already assigned to class %d or assignment invalid", teacherID, classID))
			} else {
				serviceErrors = append(serviceErrors, fmt.Errorf("failed to assign teacher %s to class %d: %w", teacherID, classID, err))
			}
			continue
		}
		// Assuming "Prefer: return=representation" is default or handled by client to get data back.
		// If len(insertResult) == 0, it means data wasn't returned.
		if len(insertResult) > 0 {
			successfulAssignments++
		} else {
			// This could indicate that the insert happened but data wasn't returned (e.g. Prefer header not set by lib)
			// Or, for an upsert-like behavior (if the DB had it), it might mean conflict and no change.
			// Given simple Insert, this implies no data returned. For now, count as success if no error.
			// However, to be consistent with other Create methods, let's assume we expect data back.
			// If the PK is (user_id, class_id), a duplicate insert would error out (caught above).
			// So, if no error and no result, it's unusual.
			serviceErrors = append(serviceErrors, fmt.Errorf("assignment for teacher %s to class %d reported success but returned no data", teacherID, classID))
		}
	}
	return
}

// UnassignTeachersFromClass removes assignments of multiple teachers from a single class.
func UnassignTeachersFromClass(classID int, teacherIDs []uuid.UUID) (successfulUnassignments int, serviceErrors []error) {
	client := sbClient.GetClient()
	if client == nil {
		serviceErrors = append(serviceErrors, fmt.Errorf("Supabase client not initialized"))
		return
	}

	for _, teacherID := range teacherIDs {
		var deleteResult []map[string]interface{}
		// Using simplified Delete() for nedpals/supabase-go@v0.5.0
		err := client.DB.From("class_teachers").Delete().
			Eq("class_id", fmt.Sprintf("%d", classID)). // Ensure class_id is string if DB expects it, though Eq handles types
			Eq("user_id", teacherID.String()).
			Execute(&deleteResult)

		if err != nil {
			serviceErrors = append(serviceErrors, fmt.Errorf("failed to unassign teacher %s from class %d: %w", teacherID, classID, err))
			continue
		}
		// Delete operations might not return data in deleteResult unless 'Prefer: return=representation' is used
		// and the deleted rows are returned. For many clients, no error means success.
		// We'll assume success if no error. A more robust check might look at affected rows if the client supports it.
		successfulUnassignments++
	}
	return
}

// GetTeachersByClassID retrieves all teachers assigned to a specific class.
func GetTeachersByClassID(classID string) ([]models.TeacherAssignmentDetail, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}

	var assignments []struct { // Fetch only user_id from class_teachers
		UserID uuid.UUID `json:"user_id"`
	}
	err := client.DB.From("class_teachers").Select("user_id").Eq("class_id", classID).Execute(&assignments)
	if err != nil {
		return nil, fmt.Errorf("failed to get teacher assignments for class ID %s: %w", classID, err)
	}

	if len(assignments) == 0 {
		return []models.TeacherAssignmentDetail{}, nil
	}

	var teacherDetailsList []models.TeacherAssignmentDetail
	var queryErrors []string

	for _, assignment := range assignments {
		var userResults []struct {
			ID       uuid.UUID `json:"id"`
			FullName string    `json:"full_name"`
			Email    string    `json:"email"`
		}
		// Fetch details for each teacher. This is an N+1 query pattern.
		// A database view or RPC function would be more efficient for larger sets.
		err := client.DB.From("users").Select("id,full_name,email").Eq("id", assignment.UserID.String()).Execute(&userResults)
		if err != nil {
			queryErrors = append(queryErrors, fmt.Sprintf("failed to fetch details for teacher ID %s: %v", assignment.UserID, err))
			continue
		}
		if len(userResults) > 0 {
			teacherDetailsList = append(teacherDetailsList, models.TeacherAssignmentDetail{
				UserID:   userResults[0].ID,
				FullName: userResults[0].FullName,
				Email:    userResults[0].Email,
			})
		} else {
			// This case means a user_id was in class_teachers but not in users table (data inconsistency)
			queryErrors = append(queryErrors, fmt.Sprintf("details not found for teacher ID %s (present in class_teachers but not users table)", assignment.UserID))
		}
	}
	if len(queryErrors) > 0 {
		// Return successfully fetched data along with a composite error for missing details
		return teacherDetailsList, fmt.Errorf("completed fetching teachers with some errors: %s", strings.Join(queryErrors, "; "))
	}
	return teacherDetailsList, nil
}
