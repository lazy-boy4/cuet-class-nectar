package handlers

import (
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	"github.com/lazy-boy4/cuet-class-nectar/internal/services"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	// No direct import of supabase library needed here if types are inferred from service layer
)

func SignUpHandler(c *gin.Context) {
	var input models.SignUpInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	input.Role = strings.ToLower(input.Role)
	if input.Role != "student" && input.Role != "teacher" && input.Role != "cr" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role. Must be 'student', 'teacher', or 'cr'."})
		return
	}

	if (input.Role == "student" || input.Role == "cr") && (input.StudentID == "" || input.DeptCode == "" || input.Batch == "" || input.Section == "") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "StudentID, DeptCode, Batch, and Section are required for students and CRs."})
		return
	}
	if input.Role == "teacher" && input.DeptCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "DeptCode is required for teachers."})
		return
	}

	userResponse, err := services.SignUp(input)
	if err != nil {
		errorMsg := "Sign up failed: " + err.Error()
		statusCode := http.StatusInternalServerError
		additionalInfo := gin.H{}

		if strings.Contains(err.Error(), "User already exists") ||
			strings.Contains(err.Error(), "23505") ||
			strings.Contains(strings.ToLower(err.Error()), "duplicate key value violates unique constraint") ||
			strings.Contains(strings.ToLower(err.Error()), "user already registered") {
			statusCode = http.StatusConflict
			errorMsg = "User with this email already exists."
		} else if strings.Contains(err.Error(), "profile data may be missing") {
			statusCode = http.StatusInternalServerError
			errorMsg = "Sign up for auth succeeded, but profile creation failed: " + err.Error()
			if userResponse != nil {
				additionalInfo["userId"] = userResponse.ID
				additionalInfo["email"] = userResponse.Email
			}
		}

		finalResponse := gin.H{"error": errorMsg}
		for k, v := range additionalInfo {
			finalResponse[k] = v
		}
		c.JSON(statusCode, finalResponse)
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User signed up successfully. Please check your email for verification if enabled in Supabase.",
		"userId":  userResponse.ID,
		"email":   userResponse.Email,
	})
}

func SignInHandler(c *gin.Context) {
	var input models.SignInInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	// services.SignIn now returns *supabase.AuthenticatedDetails
	authDetails, err := services.SignIn(input)
	if err != nil {
		errorMsg := "Sign in failed: " + err.Error()
		statusCode := http.StatusUnauthorized

		if strings.Contains(strings.ToLower(err.Error()), "invalid login credentials") ||
			strings.Contains(strings.ToLower(err.Error()), "password invalid") ||
			strings.Contains(strings.ToLower(err.Error()), "no user found") {
			errorMsg = "Invalid email or password."
		} else if strings.Contains(strings.ToLower(err.Error()), "email not confirmed") {
			statusCode = http.StatusForbidden
			errorMsg = "Email not confirmed. Please check your inbox."
		}
		c.JSON(statusCode, gin.H{"error": errorMsg})
		return
	}

	// authDetails is *supabase.AuthenticatedDetails.
	// It should have .AccessToken, .RefreshToken, etc.
	// And .User which is supabase.User, having .ID and .Email.
	if authDetails.User.ID == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Sign in process error: user data missing from authentication details."})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       "User signed in successfully",
		"access_token":  authDetails.AccessToken,
		"refresh_token": authDetails.RefreshToken,
		"expires_in":    authDetails.ExpiresIn, // Assuming this field exists on AuthenticatedDetails
		"token_type":    authDetails.TokenType, // Assuming this field exists on AuthenticatedDetails
		"user_id":       authDetails.User.ID,
		"email":         authDetails.User.Email,
	})
}
