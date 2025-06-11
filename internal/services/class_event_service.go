package services

import (
	"fmt"
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	sbClient "github.com/lazy-boy4/cuet-class-nectar/internal/supabase" // internal supabase client package
	// "time"

	"github.com/google/uuid"
	// "github.com/nedpals/supabase-go" // Not directly needed if using sbClient.GetClient()
)

// isCRForClass checks if a user is an approved CR for a specific class.
func isCRForClass(crUserID uuid.UUID, classID int) (bool, error) {
	client := sbClient.GetClient()
	if client == nil {
		return false, fmt.Errorf("Supabase client not initialized in isCRForClass check")
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

func CreateClassEvent(classID int, input models.ClassEventInput, crUserID uuid.UUID) (models.ClassEvent, error) {
	client := sbClient.GetClient()
	if client == nil {
		return models.ClassEvent{}, fmt.Errorf("Supabase client not initialized")
	}

	isAuthorized, authErr := isCRForClass(crUserID, classID) // client param removed
	if authErr != nil {
		return models.ClassEvent{}, fmt.Errorf("authorization check failed: %w", authErr)
	}
	if !isAuthorized {
		return models.ClassEvent{}, fmt.Errorf("user %s is not authorized to create events for class %d", crUserID, classID)
	}

	insertData := map[string]interface{}{
		"class_id":      classID,
		"event_type":    input.EventType,
		"title":         input.Title,
		"event_date":    input.EventDate,
		"created_by_id": crUserID,
	}
	if input.Description != nil && *input.Description != "" {
		insertData["description"] = *input.Description
	} else {
		insertData["description"] = nil
	}

	var results []models.ClassEvent
	err := client.DB.From("class_events").Insert(insertData).Execute(&results)
	if err != nil {
		return models.ClassEvent{}, fmt.Errorf("failed to create class event: %w", err)
	}
	if len(results) == 0 {
		return models.ClassEvent{}, fmt.Errorf("class event creation returned no data (check RLS or if 'Prefer: return=representation' is needed)")
	}
	return results[0], nil
}

func GetClassEventsByClassID(classID int) ([]models.ClassEvent, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}
	var events []models.ClassEvent
	err := client.DB.From("class_events").Select("*").Eq("class_id", fmt.Sprintf("%d", classID)).Execute(&events)
	if err != nil {
		return nil, fmt.Errorf("failed to get events for class ID %d: %w", classID, err)
	}
	return events, nil
}

func UpdateClassEvent(eventID int, classID int, input models.ClassEventInput, crUserID uuid.UUID) (models.ClassEvent, error) {
	client := sbClient.GetClient()
	if client == nil {
		return models.ClassEvent{}, fmt.Errorf("Supabase client not initialized")
	}

	isAuthorized, authErr := isCRForClass(crUserID, classID) // client param removed
	if authErr != nil {
		return models.ClassEvent{}, fmt.Errorf("authorization check failed for update: %w", authErr)
	}
	if !isAuthorized {
		return models.ClassEvent{}, fmt.Errorf("user %s is not authorized to update events for class %d", crUserID, classID)
	}

	var existingEvent []struct {
		ClassID int `json:"class_id"`
	}
	err := client.DB.From("class_events").Select("class_id").Eq("id", fmt.Sprintf("%d", eventID)).Execute(&existingEvent)
	if err != nil {
		return models.ClassEvent{}, fmt.Errorf("event with ID %d not found or error fetching: %w", eventID, err)
	}
	if len(existingEvent) == 0 {
		return models.ClassEvent{}, fmt.Errorf("event with ID %d not found", eventID)
	}
	if existingEvent[0].ClassID != classID {
		return models.ClassEvent{}, fmt.Errorf("event ID %d does not belong to class ID %d", eventID, classID)
	}

	updateData := map[string]interface{}{
		"event_type": input.EventType,
		"title":      input.Title,
		"event_date": input.EventDate,
		"updated_at": "now()",
	}
	if input.Description != nil && *input.Description != "" {
		updateData["description"] = *input.Description
	} else {
		updateData["description"] = nil
	}

	var results []models.ClassEvent
	err = client.DB.From("class_events").Update(updateData).Eq("id", fmt.Sprintf("%d", eventID)).Execute(&results)
	if err != nil {
		return models.ClassEvent{}, fmt.Errorf("failed to update class event ID %d: %w", eventID, err)
	}
	if len(results) == 0 {
		return models.ClassEvent{}, fmt.Errorf("class event update for ID %d returned no data (may not exist or RLS issue)", eventID)
	}
	return results[0], nil
}

func DeleteClassEvent(eventID int, classID int, crUserID uuid.UUID) error {
	client := sbClient.GetClient()
	if client == nil {
		return fmt.Errorf("Supabase client not initialized")
	}

	isAuthorized, authErr := isCRForClass(crUserID, classID) // client param removed
	if authErr != nil {
		return fmt.Errorf("authorization check failed for delete: %w", authErr)
	}
	if !isAuthorized {
		return fmt.Errorf("user %s is not authorized to delete events for class %d", crUserID, classID)
	}

	var existingEvent []struct {
		ClassID int `json:"class_id"`
	}
	err := client.DB.From("class_events").Select("class_id").Eq("id", fmt.Sprintf("%d", eventID)).Execute(&existingEvent)
	if err != nil {
		return fmt.Errorf("event with ID %d not found or error fetching: %w", eventID, err)
	}
	if len(existingEvent) == 0 {
		return fmt.Errorf("event with ID %d not found", eventID)
	}
	if existingEvent[0].ClassID != classID {
		return fmt.Errorf("event ID %d does not belong to class ID %d, cannot delete", eventID, classID)
	}

	var results []map[string]interface{}
	err = client.DB.From("class_events").Delete().Eq("id", fmt.Sprintf("%d", eventID)).Execute(&results)
	if err != nil {
		return fmt.Errorf("failed to delete class event ID %d: %w", eventID, err)
	}
	return nil
}
