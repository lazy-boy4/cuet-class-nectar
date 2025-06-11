package handlers

import (
	"github.com/lazy-boy4/cuet-class-nectar/internal/services"
	"net/http"
	// "strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// UploadProfilePictureHandler handles requests for users to upload/update their profile picture.
func UploadProfilePictureHandler(c *gin.Context) {
	userIDval, exists := c.Get("userID") // From AuthMiddleware
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
		return
	}
	userID, err := uuid.Parse(userIDval.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID in token context"})
		return
	}

	file, fileHeader, err := c.Request.FormFile("profile_picture") // "profile_picture" is the form field name
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Profile picture file not provided or invalid: " + err.Error()})
		return
	}
	defer file.Close() // Important to close the file

	// Basic validation for file size or type can be added here
	// Example: 2MB limit
	if fileHeader.Size > (2 * 1024 * 1024) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File size exceeds 2MB limit."})
		return
	}
	// Example: Check content type (more robust than just extension)
	// contentType := fileHeader.Header.Get("Content-Type")
	// if contentType != "image/jpeg" && contentType != "image/png" && contentType != "image/gif" {
	//     c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type. Only JPEG, PNG, GIF images are accepted."})
	//     return
	// }

	publicURL, err := services.UploadProfilePicture(userID, file, fileHeader)
	if err != nil {
		// Error from service might include "Supabase client not initialized", "failed to upload", "failed to update user profile"
		// Log the full error server-side for debugging.
		// log.Printf("Error uploading profile picture for user %s: %v", userID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload profile picture: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":     "Profile picture uploaded successfully.",
		"picture_url": publicURL,
	})
}
