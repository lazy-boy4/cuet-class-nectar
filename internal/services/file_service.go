package services

import (
	"fmt"
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	sbClient "github.com/lazy-boy4/cuet-class-nectar/internal/supabase"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings" // Added for strings.ToLower and strings.TrimSuffix
	"time"

	"github.com/google/uuid"
	// "github.com/nedpals/supabase-go" // Not directly needed due to stubbing Upload
)

const profilePicturesBucket = "profile-pictures"
const classRoutinesBucket = "class-routines"

// UploadFileToStorage - STUBBED DUE TO LIBRARY ISSUES
func UploadFileToStorage(bucketName string, storagePath string, file io.Reader, fileContentType string) (string, error) {
	client := sbClient.GetClient()
	if client == nil {
		return "", fmt.Errorf("Supabase client not initialized (though upload is stubbed)")
	}

	fmt.Printf("Info: File upload to %s/%s with ContentType %s STUBBED. No actual upload performed.\n", bucketName, storagePath, fileContentType)

	supabaseURL := os.Getenv("SUPABASE_URL")
	if supabaseURL == "" {
		fmt.Println("Warning: SUPABASE_URL not set. Constructing a placeholder URL.")
		return fmt.Sprintf("https://example.com/storage/v1/object/public/%s/%s", bucketName, storagePath), nil
	}
	publicURL := fmt.Sprintf("%s/storage/v1/object/public/%s/%s", supabaseURL, bucketName, storagePath)

	fmt.Printf("Stubbed Upload: Constructed public URL for %s/%s: %s\n", bucketName, storagePath, publicURL)
	return publicURL, nil
}

// UploadProfilePicture handles uploading a user's profile picture.
func UploadProfilePicture(userID uuid.UUID, file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	timestamp := time.Now().UnixNano() / int64(time.Millisecond)
	extension := filepath.Ext(fileHeader.Filename)
	contentType := fileHeader.Header.Get("Content-Type")

	if extension == "" {
		switch contentType {
		case "image/jpeg":
			extension = ".jpg"
		case "image/png":
			extension = ".png"
		case "image/gif":
			extension = ".gif"
		default:
			extension = ".bin"
		}
	}
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	fileName := fmt.Sprintf("avatar_%d%s", timestamp, extension)
	storagePath := fmt.Sprintf("%s/%s", userID.String(), fileName)

	publicURL, err := UploadFileToStorage(profilePicturesBucket, storagePath, file, contentType)
	if err != nil {
		return "", fmt.Errorf("profile picture storage failed (stubbed function error): %w", err)
	}

	dbClient := sbClient.GetClient()
	if dbClient == nil {
		return publicURL, fmt.Errorf("Supabase client not initialized for DB update after file upload (generated path: %s)", publicURL)
	}
	updateData := map[string]interface{}{"picture_url": publicURL}
	var updatedUser []models.User

	dbErr := dbClient.DB.From("users").Update(updateData).Eq("id", userID.String()).Execute(&updatedUser)
	if dbErr != nil {
		return publicURL, fmt.Errorf("failed to update user profile with new picture URL: %w. Generated path: %s", dbErr, publicURL)
	}
	if len(updatedUser) == 0 {
		return publicURL, fmt.Errorf("user profile update for picture URL returned no data (user may not exist). Generated path: %s", publicURL)
	}
	return publicURL, nil
}

// isCRForClassLocal checks if a user is an approved CR for a specific class.
func isCRForClassLocal(crUserID uuid.UUID, classID int) (bool, error) {
	client := sbClient.GetClient()
	if client == nil {
		return false, fmt.Errorf("Supabase client not initialized in isCRForClassLocal check")
	}
	var crUser []struct{ Role string }
	err := client.DB.From("users").Select("role").Eq("id", crUserID.String()).Execute(&crUser)
	if err != nil {
		return false, fmt.Errorf("CR user %s not found or error fetching role: %w", crUserID, err)
	}
	if len(crUser) == 0 {
		return false, fmt.Errorf("CR user %s not found", crUserID)
	}
	if crUser[0].Role != "cr" {
		return false, fmt.Errorf("user %s is not a Class Representative (role: %s)", crUserID, crUser[0].Role)
	}
	var crEnrollment []struct{ Status string }
	err = client.DB.From("enrollments").Select("status").
		Eq("user_id", crUserID.String()).
		Eq("class_id", fmt.Sprintf("%d", classID)).
		Eq("status", "approved").
		Execute(&crEnrollment)
	if err != nil {
		return false, fmt.Errorf("error verifying CR's enrollment in class %d: %w", classID, err)
	}
	if len(crEnrollment) == 0 {
		return false, fmt.Errorf("CR %s is not an approved member of class %d", crUserID, classID)
	}
	return true, nil
}

// UploadClassRoutinePDF handles uploading a class routine PDF by a CR.
func UploadClassRoutinePDF(classID int, crUserID uuid.UUID, file multipart.File, fileHeader *multipart.FileHeader) (*models.ClassRoutinePDF, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}

	isAuthorized, authErr := isCRForClassLocal(crUserID, classID)
	if authErr != nil {
		return nil, fmt.Errorf("authorization check failed: %w", authErr)
	}
	if !isAuthorized {
		return nil, fmt.Errorf("user %s is not CR for class %d or not authorized", crUserID, classID)
	}

	timestamp := time.Now().UnixNano() / int64(time.Millisecond)
	extension := filepath.Ext(fileHeader.Filename)
	if strings.ToLower(extension) != ".pdf" { // Using strings.ToLower
		return nil, fmt.Errorf("invalid file type: only PDF files are allowed for routines")
	}
	baseFileName := strings.TrimSuffix(fileHeader.Filename, extension) // Using strings.TrimSuffix
	storageFileName := fmt.Sprintf("%s_%d.pdf", baseFileName, timestamp)
	storagePath := fmt.Sprintf("%d/%s", classID, storageFileName)

	fileURL, err := UploadFileToStorage(classRoutinesBucket, storagePath, file, fileHeader.Header.Get("Content-Type"))
	if err != nil {
		return nil, fmt.Errorf("class routine file storage (stubbed) failed: %w", err)
	}

	routineMetadata := models.ClassRoutinePDF{ClassID: classID, FileName: fileHeader.Filename, FileURL: fileURL, UploadedByID: crUserID}
	insertData := map[string]interface{}{"class_id": routineMetadata.ClassID, "file_name": routineMetadata.FileName, "file_url": routineMetadata.FileURL, "uploaded_by_id": routineMetadata.UploadedByID}
	var results []models.ClassRoutinePDF
	err = client.DB.From("class_routines").Upsert(insertData).Execute(&results)
	if err != nil {
		return nil, fmt.Errorf("failed to save class routine metadata: %w", err)
	}
	if len(results) == 0 {
		fmt.Printf("Warning: class_routines upsert for class %d returned no data. Returning input model.\n", classID)
		return &routineMetadata, nil
	}
	return &results[0], nil
}

// GetClassRoutineByClassID fetches the routine metadata for a specific class.
func GetClassRoutineByClassID(classID int) (*models.ClassRoutinePDF, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}
	var routines []models.ClassRoutinePDF
	// Corrected: Limit(1) before Eq()
	err := client.DB.From("class_routines").Select("*").Limit(1).Eq("class_id", fmt.Sprintf("%d", classID)).Execute(&routines)
	if err != nil {
		return nil, fmt.Errorf("failed to get class routine for class ID %d: %w", classID, err)
	}
	if len(routines) == 0 {
		return nil, nil
	}
	return &routines[0], nil
}

// DeleteClassRoutine deletes the routine metadata for a class.
func DeleteClassRoutine(classID int, crUserID uuid.UUID) error {
	client := sbClient.GetClient()
	if client == nil {
		return fmt.Errorf("Supabase client not initialized")
	}

	isAuthorized, authErr := isCRForClassLocal(crUserID, classID)
	if authErr != nil {
		return fmt.Errorf("authorization check failed for delete routine: %w", authErr)
	}
	if !isAuthorized {
		return fmt.Errorf("user %s is not CR for class %d or not authorized to delete routine", crUserID, classID)
	}

	routine, err := GetClassRoutineByClassID(classID) // Check if routine exists before attempting delete based on class_id
	if err != nil {
		return fmt.Errorf("failed to fetch routine for deletion check: %w", err)
	}
	if routine == nil {
		return fmt.Errorf("no routine found for class %d to delete", classID)
	}

	var results []map[string]interface{}
	err = client.DB.From("class_routines").Delete().Eq("class_id", fmt.Sprintf("%d", classID)).Execute(&results)
	if err != nil {
		return fmt.Errorf("failed to delete class routine for class ID %d: %w", classID, err)
	}
	return nil
}
