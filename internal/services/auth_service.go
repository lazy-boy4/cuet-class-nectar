package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	sbClient "github.com/lazy-boy4/cuet-class-nectar/internal/supabase"
)

// SupabaseAuthResponse represents the response from Supabase Auth API
type SupabaseAuthResponse struct {
	AccessToken  string           `json:"access_token"`
	TokenType    string           `json:"token_type"`
	ExpiresIn    int              `json:"expires_in"`
	RefreshToken string           `json:"refresh_token"`
	User         SupabaseAuthUser `json:"user"`
}

type SupabaseAuthUser struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Aud   string `json:"aud"`
	Role  string `json:"role"`
}

// UserResponse is a simplified struct for returning user info after auth operations.
type UserResponse struct {
	ID    string `json:"id"`
	Email string `json:"email"`
}

// SignUp registers a new user using direct HTTP call to Supabase Auth API.
func SignUp(input models.SignUpInput) (*UserResponse, error) {
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseAnonKey := os.Getenv("SUPABASE_ANON_KEY")

	if supabaseURL == "" || supabaseAnonKey == "" {
		return nil, fmt.Errorf("SUPABASE_URL or SUPABASE_ANON_KEY environment variable is not set")
	}

	// Create signup request
	signupData := map[string]string{
		"email":    input.Email,
		"password": input.Password,
	}
	jsonData, err := json.Marshal(signupData)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal signup data: %w", err)
	}

	// Make HTTP request to Supabase Auth
	req, err := http.NewRequest("POST", supabaseURL+"/auth/v1/signup", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create signup request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", supabaseAnonKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("signup request failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read signup response: %w", err)
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("signup failed with status %d: %s", resp.StatusCode, string(body))
	}

	var authResp SupabaseAuthResponse
	if err := json.Unmarshal(body, &authResp); err != nil {
		return nil, fmt.Errorf("failed to parse signup response: %w", err)
	}

	if authResp.User.ID == "" {
		return nil, fmt.Errorf("signup returned empty user ID")
	}

	// Insert user profile into public.users table
	supabaseClient := sbClient.GetClient()
	if supabaseClient != nil {
		profileData := map[string]interface{}{
			"id":        authResp.User.ID,
			"email":     authResp.User.Email,
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
		err = supabaseClient.DB.From("users").Insert(profileData).Execute(&insertResults)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Warning: Failed to insert user profile data for %s: %v. Auth user might be orphaned.\n", authResp.User.Email, err)
			return &UserResponse{ID: authResp.User.ID, Email: authResp.User.Email},
				fmt.Errorf("user profile insert failed: %w. Auth user created but profile data may be missing", err)
		}
	}

	fmt.Printf("User signed up and profile created: %s (ID: %s)\n", authResp.User.Email, authResp.User.ID)
	return &UserResponse{ID: authResp.User.ID, Email: authResp.User.Email}, nil
}

// SignInResponse represents the response for successful sign-in
type SignInResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
	User         struct {
		ID    string `json:"id"`
		Email string `json:"email"`
	} `json:"user"`
}

// SignIn authenticates a user using direct HTTP call to Supabase Auth API.
func SignIn(input models.SignInInput) (*SignInResponse, error) {
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseAnonKey := os.Getenv("SUPABASE_ANON_KEY")

	if supabaseURL == "" || supabaseAnonKey == "" {
		return nil, fmt.Errorf("SUPABASE_URL or SUPABASE_ANON_KEY environment variable is not set")
	}

	// Create signin request
	signinData := map[string]string{
		"email":    input.Email,
		"password": input.Password,
	}
	jsonData, err := json.Marshal(signinData)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal signin data: %w", err)
	}

	// Make HTTP request to Supabase Auth
	req, err := http.NewRequest("POST", supabaseURL+"/auth/v1/token?grant_type=password", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create signin request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", supabaseAnonKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("signin request failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read signin response: %w", err)
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("signin failed with status %d: %s", resp.StatusCode, string(body))
	}

	var authResp SignInResponse
	if err := json.Unmarshal(body, &authResp); err != nil {
		return nil, fmt.Errorf("failed to parse signin response: %w", err)
	}

	if authResp.User.ID == "" {
		return nil, fmt.Errorf("signin returned empty user ID")
	}

	fmt.Printf("User signed in: %s\n", authResp.User.Email)
	return &authResp, nil
}
