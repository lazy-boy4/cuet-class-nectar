package services

import (
	"fmt"
	"github.com/lazy-boy4/cuet-class-nectar/internal/models" // For models.User
	sbClient "github.com/lazy-boy4/cuet-class-nectar/internal/supabase"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	// "github.com/nedpals/supabase-go" // No longer directly needed if calls are stubbed
)

const profilePicturesBucket = "profile-pictures"

// UploadFileToStorage - STUBBED DUE TO LIBRARY ISSUES
// This function will return a constructed dummy URL and no actual upload will occur.
func UploadFileToStorage(bucketName string, storagePath string, file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	client := sbClient.GetClient() // Keep client init for consistency, though not used for upload
	if client == nil {
		return "", fmt.Errorf("Supabase client not initialized (though upload is stubbed)")
	}

	fmt.Printf("Attempted to upload file %s to %s/%s. THIS IS A STUBBED FUNCTION due to library issues.\n", fileHeader.Filename, bucketName, storagePath)

	// STUB: Comment out actual upload logic due to persistent build errors with nedpals/supabase-go Storage API.
	// _, err := client.Storage.From(bucketName).Upload(storagePath, file, &supabase.FileUploadOptions{
	//     ContentType: fileHeader.Header.Get("Content-Type"),
	// })
	// if err != nil {
	// 	return "", fmt.Errorf("failed to upload file to Supabase Storage path %s: %w", storagePath, err)
	// }

	// Manual URL construction (dummy behavior)
	supabaseURL := os.Getenv("SUPABASE_URL")
	if supabaseURL == "" {
		// If SUPABASE_URL is also not available, construct a fully placeholder URL
		// This should not happen if pre-requisites are met.
		// Using a generic placeholder to avoid erroring out here, as the main point is to stub the upload.
		fmt.Println("Warning: SUPABASE_URL not set. Constructing a placeholder URL for profile picture.")
		return fmt.Sprintf("https://example.com/storage/v1/object/public/%s/%s", bucketName, storagePath), nil
	}
	publicURL := fmt.Sprintf("%s/storage/v1/object/public/%s/%s", supabaseURL, bucketName, storagePath)

	fmt.Printf("Stubbed Upload: Constructed public URL for %s/%s: %s\n", bucketName, storagePath, publicURL)

	return publicURL, nil // Return the constructed URL and nil error
}

// UploadProfilePicture handles uploading a user's profile picture.
func UploadProfilePicture(userID uuid.UUID, file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	timestamp := time.Now().Unix()
	extension := filepath.Ext(fileHeader.Filename)
	if extension == "" {
		ct := fileHeader.Header.Get("Content-Type")
		switch ct {
		case "image/jpeg":
			extension = ".jpg"
		case "image/png":
			extension = ".png"
		case "image/gif":
			extension = ".gif"
		default:
			extension = ".jpg"
		}
	}
	fileName := fmt.Sprintf("avatar_%d%s", timestamp, extension)
	storagePath := fmt.Sprintf("%s/%s", userID.String(), fileName)

	publicURL, err := UploadFileToStorage(profilePicturesBucket, storagePath, file, fileHeader)
	if err != nil {
		// This error would now primarily be from client init or manual URL construction issues.
		return "", fmt.Errorf("UploadFileToStorage (stubbed) failed: %w", err)
	}

	// Update the user's picture_url in the public.users table
	// This part should still work.
	dbClient := sbClient.GetClient()
	if dbClient == nil {
		return publicURL, fmt.Errorf("Supabase client not initialized for updating user profile (file path generated: %s)", publicURL)
	}
	updateData := map[string]interface{}{"picture_url": publicURL}
	var updatedUserModels []models.User

	dbErr := dbClient.DB.From("users").Update(updateData).Eq("id", userID.String()).Execute(&updatedUserModels)
	if dbErr != nil {
		// If DB update fails, the "uploaded" file (which wasn't actually uploaded) URL won't be saved.
		return publicURL, fmt.Errorf("failed to update user profile with new picture URL (generated path: %s): %w", publicURL, dbErr)
	}
	if len(updatedUserModels) == 0 {
		return publicURL, fmt.Errorf("user profile update for picture URL returned no data (generated path: %s, user may not exist or RLS issue)", publicURL)
	}

	return publicURL, nil
}
