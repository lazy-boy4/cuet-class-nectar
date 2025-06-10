package services

import (
	// "context" // No longer directly used as admin auth calls are stubbed
	"fmt"
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	sbClient "github.com/lazy-boy4/cuet-class-nectar/internal/supabase"
	// "os" // No longer directly used as admin auth calls are stubbed
	// "github.com/nedpals/supabase-go" // No longer directly used for types like AdminUserCredentials
)

// GetUserRole (already defined)
func GetUserRole(userID string) (string, error) {
	client := sbClient.GetClient()
	if client == nil {
		return "", fmt.Errorf("Supabase client not initialized")
	}
	var results []struct {
		Role string `json:"role"`
	}
	err := client.DB.From("users").Select("role").Eq("id", userID).Execute(&results)
	if err != nil {
		return "", fmt.Errorf("error fetching user role for ID %s: %w", userID, err)
	}
	if len(results) == 0 {
		return "", fmt.Errorf("user profile with ID %s not found or role is null", userID)
	}
	if results[0].Role == "" {
		return "", fmt.Errorf("role for user ID %s is empty", userID)
	}
	return results[0].Role, nil
}

// AdminCreateUser - STUBBED DUE TO LIBRARY LIMITATIONS
func AdminCreateUser(userInput models.AdminCreateUserInput) (*models.User, error) {
	fmt.Printf("Attempted to call AdminCreateUser for email %s, but it's not supported by the current Supabase Go client version.\n", userInput.Email)
	return nil, fmt.Errorf("AdminCreateUser functionality is not supported by the current Supabase Go client (nedpals/supabase-go@v0.5.0)")
}

func GetAllUsers() ([]models.User, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}
	var users []models.User
	err := client.DB.From("users").Select("*").Execute(&users)
	if err != nil {
		return nil, fmt.Errorf("failed to get all users: %w", err)
	}
	return users, nil
}

func GetUserByIDByAdmin(userID string) (*models.User, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}
	var user []models.User
	err := client.DB.From("users").Select("*").Eq("id", userID).Execute(&user)
	if err != nil {
		return nil, fmt.Errorf("failed to get user by ID (admin) %s: %w", userID, err)
	}
	if len(user) == 0 {
		return nil, fmt.Errorf("user with ID %s not found (admin)", userID)
	}
	return &user[0], nil
}

func AdminUpdateUser(userID string, userInput models.AdminUpdateUserInput) (*models.User, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}

	updateData := make(map[string]interface{})
	if userInput.FullName != nil {
		updateData["full_name"] = *userInput.FullName
	}
	if userInput.DeptCode != nil {
		updateData["dept_code"] = *userInput.DeptCode
	}
	if userInput.Role != nil {
		updateData["role"] = *userInput.Role
	}
	if userInput.StudentID != nil {
		updateData["student_id"] = *userInput.StudentID
	}
	if userInput.Batch != nil {
		updateData["batch"] = *userInput.Batch
	}
	if userInput.Section != nil {
		updateData["section"] = *userInput.Section
	}
	if userInput.PictureURL != nil {
		updateData["picture_url"] = *userInput.PictureURL
	}

	if len(updateData) == 0 {
		return GetUserByIDByAdmin(userID)
	}

	var updatedUserModels []models.User
	err := client.DB.From("users").Update(updateData).Eq("id", userID).Execute(&updatedUserModels)
	if err != nil {
		return nil, fmt.Errorf("failed to update user profile (admin) for ID %s: %w", userID, err)
	}
	if len(updatedUserModels) == 0 {
		return nil, fmt.Errorf("user profile update (admin) for ID %s returned no data (user may not exist or RLS issue, or no actual change occurred)", userID)
	}
	return &updatedUserModels[0], nil
}

// AdminDeleteUser - STUBBED DUE TO LIBRARY LIMITATIONS
func AdminDeleteUser(userID string) error {
	fmt.Printf("Attempted to call AdminDeleteUser for userID %s, but it's not supported by the current Supabase Go client version.\n", userID)
	return fmt.Errorf("AdminDeleteUser functionality is not supported by the current Supabase Go client (nedpals/supabase-go@v0.5.0)")
}

// BulkUpsertStudentProfiles processes a list of student data to insert profiles.
// It currently attempts to INSERT profiles. True upsert (update on conflict) functionality
// is complex with nedpals/supabase-go@v0.5.0's simple Insert API and would require
// custom header management (e.g., "Prefer: resolution=merge-duplicates") or a database function.
// This implementation will likely error on duplicate unique keys (email, student_id, id).
// Returns counts of successful creations and a list of errors.
func BulkUpsertStudentProfiles(students []models.BulkUploadStudentData) (createdCount int, updatedCount int, errors []error) {
	client := sbClient.GetClient()
	if client == nil {
		errors = append(errors, fmt.Errorf("Supabase client not initialized"))
		return
	}

	for i, studentData := range students { // Added index for more specific error messages
		if studentData.Email == "" || studentData.FullName == "" || studentData.StudentID == "" || studentData.DeptCode == "" || studentData.Batch == "" {
			errors = append(errors, fmt.Errorf("row %d: missing required fields (Email, FullName, StudentID, DeptCode, Batch) for student email '%s' (or student_id '%s')", i+1, studentData.Email, studentData.StudentID))
			continue
		}

		profileData := map[string]interface{}{
			"email":      studentData.Email,
			"full_name":  studentData.FullName,
			"student_id": studentData.StudentID,
			"dept_code":  studentData.DeptCode,
			"batch":      studentData.Batch,
			"role":       "student", // Default role for bulk upload
		}
		if studentData.UUID != "" {
			profileData["id"] = studentData.UUID // Admin provides auth.user.id
		}
		if studentData.Section != nil && *studentData.Section != "" {
			profileData["section"] = *studentData.Section
		} else {
			profileData["section"] = nil // Explicitly set to null if empty or not provided
		}
		if studentData.PictureURL != nil && *studentData.PictureURL != "" {
			profileData["picture_url"] = *studentData.PictureURL
		} else {
			profileData["picture_url"] = nil // Explicitly set to null
		}

		var results []models.User // nedpals/supabase-go Insert expects a slice to populate

		// Using simplified Insert(data) for nedpals/supabase-go@v0.5.0
		// This will fail if a user with the same unique key (id, email, student_id) already exists.
		// A true "upsert" is not directly supported by this simple Insert method.
		err := client.DB.From("users").Insert(profileData).Execute(&results)

		if err != nil {
			errors = append(errors, fmt.Errorf("row %d (email: %s, student_id: %s): failed to insert profile: %w", i+1, studentData.Email, studentData.StudentID, err))
			continue
		}

		if len(results) > 0 {
			createdCount++
		} else {
			// This case might indicate that the insert operation succeeded (no error) but didn't return the created row.
			// This can happen if "Prefer: return=representation" is not set by default by the client library.
			// For simplicity, we count it as a success if no error, but log a warning/error for investigation.
			// However, the service function signature implies it should return the created model.
			// Let's consider it a successful operation for now if no error, but it's a bit ambiguous.
			// The previous service functions for single CRUD operations error out if len(results) == 0.
			// For bulk, we might be more lenient or just note it.
			// For consistency with other Create methods, let's treat no results as an issue.
			errors = append(errors, fmt.Errorf("row %d (email: %s, student_id: %s): insert reported success but returned no data", i+1, studentData.Email, studentData.StudentID))
		}
	}
	// updatedCount is not used in this simplified insert-only version.
	return
}

// PromoteStudentToCR changes a user's role from 'student' to 'cr'.
func PromoteStudentToCR(userID string) (*models.User, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}

	// Step 1: Fetch the user to check their current role
	var users []models.User
	err := client.DB.From("users").Select("*").Eq("id", userID).Execute(&users)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user %s for promotion: %w", userID, err)
	}
	if len(users) == 0 {
		return nil, fmt.Errorf("user with ID %s not found", userID)
	}

	currentUser := users[0]
	if currentUser.Role != "student" {
		return nil, fmt.Errorf("user %s (ID: %s) is not a student (current role: %s). Cannot promote to CR", currentUser.Email, userID, currentUser.Role)
	}

	// Step 2: Update the role to 'cr'
	updateData := map[string]interface{}{
		"role": "cr",
	}
	var updatedUserResult []models.User
	// Using simplified Update(data) for nedpals/supabase-go@v0.5.0
	err = client.DB.From("users").Update(updateData).Eq("id", userID).Execute(&updatedUserResult)
	if err != nil {
		return nil, fmt.Errorf("failed to update role to 'cr' for user ID %s: %w", userID, err)
	}
	if len(updatedUserResult) == 0 {
		// This implies "Prefer: return=representation" was not set or RLS issues.
		// Or the user record was not actually updated (e.g., RLS prevented or data was identical).
		return nil, fmt.Errorf("role update to 'cr' for user ID %s returned no data (user may not exist, RLS issue, or no change)", userID)
	}

	return &updatedUserResult[0], nil
}

// DemoteCRToStudent changes a user's role from 'cr' back to 'student'.
func DemoteCRToStudent(userID string) (*models.User, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}

	var users []models.User
	err := client.DB.From("users").Select("*").Eq("id", userID).Execute(&users)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user %s for demotion: %w", userID, err)
	}
	if len(users) == 0 {
		return nil, fmt.Errorf("user with ID %s not found for demotion", userID)
	}

	currentUser := users[0]
	if currentUser.Role != "cr" {
		return nil, fmt.Errorf("user %s (ID: %s) is not a CR (current role: %s). Cannot demote", currentUser.Email, userID, currentUser.Role)
	}

	updateData := map[string]interface{}{"role": "student"}
	var updatedUserDetails []models.User
	// Using simplified Update(data) for nedpals/supabase-go@v0.5.0
	err = client.DB.From("users").Update(updateData).Eq("id", userID).Execute(&updatedUserDetails)
	if err != nil {
		return nil, fmt.Errorf("failed to update role to 'student' for user ID %s: %w", userID, err)
	}
	if len(updatedUserDetails) == 0 {
		return nil, fmt.Errorf("role update to 'student' for user ID %s returned no data (user may not exist, RLS issue, or no change)", userID)
	}
	return &updatedUserDetails[0], nil
}
