package services

import (
	"fmt"
	"github.com/google/uuid" // For userID types
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	sbClient "github.com/lazy-boy4/cuet-class-nectar/internal/supabase"
)

// CreateScheduleEntry creates a new schedule entry for a class.
// userID is the ID of the user (teacher/CR/admin) creating the entry.
func CreateScheduleEntry(input models.ScheduleEntryInput, userID uuid.UUID) (models.ScheduleEntry, error) {
	client := sbClient.GetClient()
	if client == nil {
		return models.ScheduleEntry{}, fmt.Errorf("Supabase client not initialized")
	}

	// TODO: Authorization: Verify userID (teacher/CR) is authorized to modify schedule for input.ClassID.

	insertData := map[string]interface{}{
		"class_id":    input.ClassID,
		"day_of_week": input.DayOfWeek,
		"start_time":  input.StartTime,
		"end_time":    input.EndTime,
	}
	// Add optional fields if provided
	if input.CourseCode != nil && *input.CourseCode != "" {
		insertData["course_code"] = *input.CourseCode
	} else {
		insertData["course_code"] = nil
	}
	if input.TeacherID != nil {
		insertData["teacher_id"] = *input.TeacherID
	} else {
		insertData["teacher_id"] = nil
	}
	if input.RoomNumber != nil && *input.RoomNumber != "" {
		insertData["room_number"] = *input.RoomNumber
	} else {
		insertData["room_number"] = nil
	}
	// 'created_by' or similar field could be added, populated with userID. (Not in schema for now)

	var results []models.ScheduleEntry
	// Using simplified Insert(data) for nedpals/supabase-go@v0.5.0
	err := client.DB.From("schedules").Insert(insertData).Execute(&results)
	if err != nil {
		return models.ScheduleEntry{}, fmt.Errorf("failed to create schedule entry: %w", err)
	}
	if len(results) == 0 {
		return models.ScheduleEntry{}, fmt.Errorf("schedule entry creation returned no data (check RLS or if 'Prefer: return=representation' is needed)")
	}
	return results[0], nil
}

// GetScheduleByClassID retrieves all schedule entries for a given class.
// TODO: Enhance to join with courses and users table to get course_name and teacher_name.
func GetScheduleByClassID(classID string) ([]models.ScheduleEntry, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}
	var entries []models.ScheduleEntry
	// Ordering by day_of_week then start_time is ideal.
	// .Order("day_of_week", true, false).Order("start_time", true, false)
	// Omitting .Order due to prior build issues.
	err := client.DB.From("schedules").Select("*").Eq("class_id", classID).Execute(&entries)
	if err != nil {
		return nil, fmt.Errorf("failed to get schedule for class ID %s: %w", classID, err)
	}
	return entries, nil
}

// UpdateScheduleEntry updates an existing schedule entry.
// userID is the ID of the user attempting the update, for authorization checks.
func UpdateScheduleEntry(entryID string, input models.ScheduleEntryInput, userID uuid.UUID) (models.ScheduleEntry, error) {
	client := sbClient.GetClient()
	if client == nil {
		return models.ScheduleEntry{}, fmt.Errorf("Supabase client not initialized")
	}

	// TODO: Authorization: Verify userID is authorized for input.ClassID and this entry.
	// Also, ensure entryID belongs to input.ClassID if ClassID is part of the update logic.
	// The input struct has ClassID, but it's usually not updated for an existing schedule entry.
	// We are updating the entry identified by entryID.

	updateData := map[string]interface{}{
		"day_of_week": input.DayOfWeek,
		"start_time":  input.StartTime,
		"end_time":    input.EndTime,
	}
	// Allow unsetting fields by providing them as nil or empty string (which we convert to nil for DB)
	if input.CourseCode != nil {
		if *input.CourseCode == "" {
			updateData["course_code"] = nil
		} else {
			updateData["course_code"] = *input.CourseCode
		}
	} else {
		updateData["course_code"] = nil
	} // Explicitly set to NULL if not provided (if desired behavior)

	if input.TeacherID != nil {
		updateData["teacher_id"] = *input.TeacherID
	} else {
		updateData["teacher_id"] = nil
	}

	if input.RoomNumber != nil {
		if *input.RoomNumber == "" {
			updateData["room_number"] = nil
		} else {
			updateData["room_number"] = *input.RoomNumber
		}
	} else {
		updateData["room_number"] = nil
	}
	// class_id should generally not be updatable for an existing schedule entry.
	// If input.ClassID is part of the input struct and needs to be updated, it should be added to updateData too.
	// For now, assuming class_id of an entry doesn't change.

	var results []models.ScheduleEntry
	// Using simplified Update(data) for nedpals/supabase-go@v0.5.0
	err := client.DB.From("schedules").Update(updateData).Eq("id", entryID).Execute(&results)
	if err != nil {
		return models.ScheduleEntry{}, fmt.Errorf("failed to update schedule entry ID %s: %w", entryID, err)
	}
	if len(results) == 0 {
		return models.ScheduleEntry{}, fmt.Errorf("schedule entry update for ID %s returned no data (may not exist or RLS issue)")
	}
	return results[0], nil
}

// DeleteScheduleEntry deletes a schedule entry.
// userID is for authorization checks.
func DeleteScheduleEntry(entryID string, userID uuid.UUID) error {
	client := sbClient.GetClient()
	if client == nil {
		return fmt.Errorf("Supabase client not initialized")
	}

	// TODO: Authorization: Verify userID is authorized to delete this entry for its class.
	var results []map[string]interface{} // Result not typically used for delete
	// Using simplified Delete() for nedpals/supabase-go@v0.5.0
	err := client.DB.From("schedules").Delete().Eq("id", entryID).Execute(&results)
	if err != nil {
		return fmt.Errorf("failed to delete schedule entry ID %s: %w", entryID, err)
	}
	return nil
}
