package services

import (
	"fmt"
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	sbClient "github.com/lazy-boy4/cuet-class-nectar/internal/supabase"
	"strings" // For error messages or constructing queries

	"github.com/google/uuid"
)

// UpsertAttendanceRecords allows a teacher to record or update attendance for multiple students in a class on a specific date.
// It uses Supabase's upsert capability based on the unique constraint (class_id, student_id, date).
func UpsertAttendanceRecords(classID int, date string, records []models.StudentAttendance, markerID uuid.UUID) (processedCount int, serviceErrors []error) {
	client := sbClient.GetClient()
	if client == nil {
		serviceErrors = append(serviceErrors, fmt.Errorf("Supabase client not initialized"))
		return
	}

	var recordsToUpsert []map[string]interface{}
	for _, rec := range records {
		// Basic validation for status, though model binding should handle oneof
		validStatuses := map[string]bool{"present": true, "absent": true, "late": true, "excused": true}
		if !validStatuses[strings.ToLower(rec.Status)] {
			serviceErrors = append(serviceErrors, fmt.Errorf("invalid status '%s' for student ID %s", rec.Status, rec.StudentID))
			continue // Skip this record
		}
		recordsToUpsert = append(recordsToUpsert, map[string]interface{}{
			"class_id":     classID,
			"student_id":   rec.StudentID,
			"date":         date,
			"status":       strings.ToLower(rec.Status),
			"marked_by_id": markerID,
		})
	}

	if len(recordsToUpsert) == 0 {
		if len(records) > 0 && len(serviceErrors) > 0 { // All records had errors before attempting upsert
			// serviceErrors already populated
			return 0, serviceErrors
		}
		serviceErrors = append(serviceErrors, fmt.Errorf("no valid attendance records provided to upsert"))
		return
	}

	var upsertResults []models.AttendanceRecord // nedpals/supabase-go expects a slice

	// nedpals/supabase-go@v0.5.0 Upsert method: Upsert(data interface{}, count ...string)
	// It relies on the table's primary key or unique constraints for conflict resolution.
	// The `attendance` table has a UNIQUE constraint on (class_id, student_id, date).
	err := client.DB.From("attendance").Upsert(recordsToUpsert).Execute(&upsertResults)

	if err != nil {
		serviceErrors = append(serviceErrors, fmt.Errorf("failed to upsert attendance records: %w", err))
		return
	}

	// The number of results returned by Upsert with "Prefer: return=representation" (if default)
	// should ideally match the number of records successfully inserted or updated.
	// If not, it's hard to tell which ones failed without more complex logic or per-row operations.
	// For now, if no error, assume all in recordsToUpsert were processed.
	// A more robust implementation might check len(upsertResults) against len(recordsToUpsert).
	processedCount = len(recordsToUpsert)
	if len(upsertResults) != len(recordsToUpsert) && len(upsertResults) > 0 {
		// This could mean some upserts succeeded and returned data, while others didn't (e.g. RLS, or no change)
		// Or some failed silently on DB side but didn't error out the whole batch.
		// This scenario is complex to report accurately without per-row results or detailed DB response.
		fmt.Printf("Warning: UpsertAttendanceRecords - number of records processed (%d) might differ from records returned by DB (%d)\n", processedCount, len(upsertResults))
		// We could refine processedCount based on len(upsertResults) if "return=representation" is guaranteed.
		// For now, stick to attempted count if no error.
	}
	if len(upsertResults) == 0 && len(recordsToUpsert) > 0 {
		// This means no data was returned, which is unexpected if upsert occurred and representation is returned.
		// Could be an RLS issue or "Prefer" header not working as expected with the client library.
		serviceErrors = append(serviceErrors, fmt.Errorf("upsert operation completed but returned no data for any record"))
	}

	// TODO: Add validation:
	// 1. Ensure markerID (teacher/CR) is authorized for this classID.
	// 2. Ensure each studentID is actually enrolled in classID.

	return
}

// GetAttendanceByClassAndDate retrieves attendance records for a given class on a specific date.
func GetAttendanceByClassAndDate(classID string, date string) ([]models.AttendanceQueryResponse, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}

	var attendanceRecords []models.AttendanceRecord
	err := client.DB.From("attendance").Select("*").
		Eq("class_id", classID).
		Eq("date", date).
		Execute(&attendanceRecords)

	if err != nil {
		return nil, fmt.Errorf("failed to get attendance for class %s on date %s: %w", classID, date, err)
	}

	if len(attendanceRecords) == 0 {
		return []models.AttendanceQueryResponse{}, nil
	}

	var response []models.AttendanceQueryResponse
	var queryErrors []string
	for _, ar := range attendanceRecords {
		var userRes []struct {
			FullName  string
			StudentID string `json:"student_id"`
		}
		err := client.DB.From("users").Select("full_name,student_id").Eq("id", ar.StudentID.String()).Execute(&userRes)
		var studentName, studentCuetID string
		if err == nil && len(userRes) > 0 {
			studentName = userRes[0].FullName
			studentCuetID = userRes[0].StudentID
		} else {
			msg := fmt.Sprintf("Warning: Could not fetch student details for User UUID %s: %v", ar.StudentID, err)
			fmt.Println(msg)
			queryErrors = append(queryErrors, msg)
		}
		response = append(response, models.AttendanceQueryResponse{
			AttendanceRecord: ar,
			StudentName:      studentName,
			StudentIDString:  studentCuetID,
		})
	}
	if len(queryErrors) > 0 {
		// Return partial data along with a composite error for missing details
		return response, fmt.Errorf("completed fetching attendance with some errors in student details: %s", strings.Join(queryErrors, "; "))
	}
	return response, nil
}

// GetAttendanceForStudentInClass retrieves all attendance records for a specific student in a specific class.
func GetAttendanceForStudentInClass(classID string, studentID string) ([]models.AttendanceRecord, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}
	var records []models.AttendanceRecord
	// TODO: Add .Order("date", false, false) for descending date order if build env fixed
	err := client.DB.From("attendance").Select("*").
		Eq("class_id", classID).
		Eq("student_id", studentID).
		Execute(&records)
	if err != nil {
		return nil, fmt.Errorf("failed to get attendance for student %s in class %s: %w", studentID, classID, err)
	}
	return records, nil
}
