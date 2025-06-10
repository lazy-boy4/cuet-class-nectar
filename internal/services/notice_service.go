package services

import (
	"fmt"
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	sbClient "github.com/lazy-boy4/cuet-class-nectar/internal/supabase"
	// "time" // Not strictly needed here unless doing manual timestamping

	"github.com/google/uuid"
)

// CreateNotice creates a new notice.
func CreateNotice(noticeInput models.NoticeInput, authorID uuid.UUID) (models.Notice, error) {
	client := sbClient.GetClient()
	if client == nil {
		return models.Notice{}, fmt.Errorf("Supabase client not initialized")
	}

	// TODO: Add validation: if noticeInput.ClassID is not nil for a non-admin user,
	// check if authorID (teacher/CR) is actually associated with that class.
	// This requires checking class_teachers or enrollments table with role='cr'.

	insertData := map[string]interface{}{
		"content":   noticeInput.Content,
		"author_id": authorID,
	}
	if noticeInput.ClassID != nil {
		insertData["class_id"] = *noticeInput.ClassID
	} else {
		// For global notices (class_id IS NULL), ensure author is admin (this check should be in handler/middleware)
	}

	var results []models.Notice
	// Using simplified Insert(data) for nedpals/supabase-go@v0.5.0
	err := client.DB.From("notices").Insert(insertData).Execute(&results)
	if err != nil {
		return models.Notice{}, fmt.Errorf("failed to create notice: %w", err)
	}
	if len(results) == 0 {
		// This implies "Prefer: return=representation" was not set or RLS issues.
		return models.Notice{}, fmt.Errorf("notice creation returned no data")
	}
	return results[0], nil
}

// GetNoticesByClass retrieves all notices for a specific class.
// TODO: Enhance to also fetch author's name via a join or separate query.
func GetNoticesByClass(classID string) ([]models.Notice, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}
	var notices []models.Notice
	// Consider adding .Order("created_at", false, false) for descending order by creation time.
	err := client.DB.From("notices").Select("*").Eq("class_id", classID).Execute(&notices)
	if err != nil {
		return nil, fmt.Errorf("failed to get notices for class ID %s: %w", classID, err)
	}
	return notices, nil
}

// GetGlobalNotices retrieves all notices where class_id is null.
// TODO: Enhance to also fetch author's name.
func GetGlobalNotices() ([]models.Notice, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}
	var notices []models.Notice
	// Consider .Order("created_at", false, false)
	err := client.DB.From("notices").Select("*").IsNull("class_id").Execute(&notices)
	if err != nil {
		return nil, fmt.Errorf("failed to get global notices: %w", err)
	}
	return notices, nil
}

// GetNoticeByID retrieves a single notice by its ID.
// TODO: Enhance to also fetch author's name.
func GetNoticeByID(noticeID string) (models.Notice, error) {
	client := sbClient.GetClient()
	if client == nil {
		return models.Notice{}, fmt.Errorf("Supabase client not initialized")
	}
	var notice []models.Notice // nedpals client expects a slice
	err := client.DB.From("notices").Select("*").Eq("id", noticeID).Execute(&notice)
	if err != nil {
		return models.Notice{}, fmt.Errorf("failed to get notice by ID %s: %w", noticeID, err)
	}
	if len(notice) == 0 {
		return models.Notice{}, fmt.Errorf("notice with ID %s not found", noticeID)
	}
	return notice[0], nil
}

// UpdateNotice updates the content of an existing notice.
// It ensures that the user attempting the update is the author of the notice.
func UpdateNotice(noticeID string, content string, userID uuid.UUID) (models.Notice, error) {
	client := sbClient.GetClient()
	if client == nil {
		return models.Notice{}, fmt.Errorf("Supabase client not initialized")
	}

	var existingNotice []struct {
		AuthorID uuid.UUID `json:"author_id"`
	} // Fetch only author_id
	err := client.DB.From("notices").Select("author_id").Eq("id", noticeID).Execute(&existingNotice)
	if err != nil {
		return models.Notice{}, fmt.Errorf("failed to retrieve notice %s for update check: %w", noticeID, err)
	}
	if len(existingNotice) == 0 {
		return models.Notice{}, fmt.Errorf("notice with ID %s not found", noticeID)
	}
	if existingNotice[0].AuthorID != userID {
		return models.Notice{}, fmt.Errorf("user %s is not authorized to update notice %s (author is %s)", userID, noticeID, existingNotice[0].AuthorID)
	}

	updateData := map[string]interface{}{"content": content, "updated_at": "now()"} // Assuming DB handles now()
	var results []models.Notice
	// Using simplified Update(data) for nedpals/supabase-go@v0.5.0
	err = client.DB.From("notices").Update(updateData).Eq("id", noticeID).Execute(&results)
	if err != nil {
		return models.Notice{}, fmt.Errorf("failed to update notice %s: %w", noticeID, err)
	}
	if len(results) == 0 {
		return models.Notice{}, fmt.Errorf("notice update for ID %s returned no data")
	}
	return results[0], nil
}

// DeleteNotice deletes a notice.
// It ensures that the user attempting the deletion is the author or an admin.
func DeleteNotice(noticeID string, userID uuid.UUID, userRole string) error {
	client := sbClient.GetClient()
	if client == nil {
		return fmt.Errorf("Supabase client not initialized")
	}

	if userRole != "admin" { // Admin can delete any notice
		var existingNotice []struct {
			AuthorID uuid.UUID `json:"author_id"`
		}
		err := client.DB.From("notices").Select("author_id").Eq("id", noticeID).Execute(&existingNotice)
		if err != nil {
			return fmt.Errorf("failed to retrieve notice %s for delete check: %w", noticeID, err)
		}
		if len(existingNotice) == 0 {
			// This means the notice doesn't exist, so deletion is effectively "successful" or "not applicable".
			// Depending on desired idempotency, one might return nil here.
			// For now, let's be strict and say it should exist to be deleted by a non-admin.
			return fmt.Errorf("notice with ID %s not found for deletion", noticeID)
		}
		if existingNotice[0].AuthorID != userID {
			return fmt.Errorf("user %s is not authorized to delete notice %s (author is %s)", userID, noticeID, existingNotice[0].AuthorID)
		}
	}

	var results []map[string]interface{} // Result not typically used for delete
	// Using simplified Delete() for nedpals/supabase-go@v0.5.0
	err := client.DB.From("notices").Delete().Eq("id", noticeID).Execute(&results)
	if err != nil {
		return fmt.Errorf("failed to delete notice %s: %w", noticeID, err)
	}
	return nil
}
