package services

import (
	"context"
	"fmt"
	"os"

	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	sbClient "github.com/lazy-boy4/cuet-class-nectar/internal/supabase"

	"github.com/nedpals/supabase-go"
)

var _ supabase.User // supabase.User is a known type.

// UserResponse is a simplified struct for returning user info after auth operations.
type UserResponse struct {
	ID    string `json:"id"`
	Email string `json:"email"`
}

// SignUp registers a new user using nedpals/supabase-go.
func SignUp(input models.SignUpInput) (*UserResponse, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client (nedpals/supabase-go) not initialized")
	}

	credentials := supabase.UserCredentials{
		Email:    input.Email,
		Password: input.Password,
	}
	// client.Auth.SignUp returns supabase.User (a struct)
	signedUpUser, err := client.Auth.SignUp(context.Background(), credentials)
	if err != nil {
		return nil, fmt.Errorf("nedpals/supabase-go Auth SignUp failed: %w", err)
	}
	if signedUpUser.ID == "" {
		return nil, fmt.Errorf("nedpals/supabase-go Auth SignUp returned empty user ID")
	}

	profileData := map[string]interface{}{
		"id":        signedUpUser.ID,
		"email":     signedUpUser.Email,
		"full_name": input.FullName,
		"role":      input.Role,
	}
	if input.DeptCode != "" {
		profileData["dept_code"] = input.DeptCode
	}
	if input.StudentID != "" {
		profileData["student_id"] = input.StudentID
	}
	if input.Batch != "" {
		profileData["batch"] = input.Batch
	}
	if input.Section != "" {
		profileData["section"] = input.Section
	}
	if input.PictureURL != "" {
		profileData["picture_url"] = input.PictureURL
	}

	var insertResults []map[string]interface{}
	err = client.DB.From("users").Insert(profileData).Execute(&insertResults)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Warning: Failed to insert user profile data for %s after auth signup: %v. Auth user might be orphaned.\n", signedUpUser.Email, err)
		return &UserResponse{ID: signedUpUser.ID, Email: signedUpUser.Email},
			fmt.Errorf("Supabase DB Insert into 'users' table failed: %w. Auth user created but profile data may be missing", err)
	}

	fmt.Printf("User signed up and profile created: %s (ID: %s)\n", signedUpUser.Email, signedUpUser.ID)
	return &UserResponse{ID: signedUpUser.ID, Email: signedUpUser.Email}, nil
}

// SignIn authenticates a user using nedpals/supabase-go.
// client.Auth.SignIn returns *supabase.AuthenticatedDetails.
func SignIn(input models.SignInInput) (*supabase.AuthenticatedDetails, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client (nedpals/supabase-go) not initialized")
	}

	credentials := supabase.UserCredentials{
		Email:    input.Email,
		Password: input.Password,
	}
	// client.Auth.SignIn returns *supabase.AuthenticatedDetails
	authDetails, err := client.Auth.SignIn(context.Background(), credentials)
	if err != nil {
		return nil, fmt.Errorf("nedpals/supabase-go Auth SignIn failed: %w", err)
	}

	// supabase.AuthenticatedDetails has a .User field (which is supabase.User)
	// and also token fields directly (e.g. AccessToken)
	if authDetails == nil || authDetails.User.ID == "" {
		return nil, fmt.Errorf("nedpals/supabase-go Auth SignIn returned invalid authentication details or user ID")
	}

	fmt.Printf("User signed in: %s\n", authDetails.User.Email)
	return authDetails, nil
}
