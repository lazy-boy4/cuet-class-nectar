package models

import (
	"github.com/google/uuid"
	"time"
)

// AttendanceRecord represents a single attendance entry.
type AttendanceRecord struct {
	ID         int       `json:"id,omitempty" db:"id"`
	ClassID    int       `json:"class_id" db:"class_id"`
	StudentID  uuid.UUID `json:"student_id" db:"student_id"`               // User ID of the student
	Date       string    `json:"date" db:"date"`                           // YYYY-MM-DD format
	Status     string    `json:"status" db:"status"`                       // e.g., "present", "absent"
	MarkedByID uuid.UUID `json:"marked_by_id,omitempty" db:"marked_by_id"` // User ID of teacher/CR
	CreatedAt  time.Time `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt  time.Time `json:"updated_at,omitempty" db:"updated_at"` // If records can be updated
}

// AttendanceInput is used by teachers to submit attendance for one or more students for a class on a specific date.
type AttendanceInput struct {
	ClassID int                 `json:"class_id" binding:"required"` // Usually from path, but good to have for validation
	Date    string              `json:"date" binding:"required"`     // YYYY-MM-DD
	Records []StudentAttendance `json:"records" binding:"required,dive"`
}

// StudentAttendance is part of the AttendanceInput.
type StudentAttendance struct {
	StudentID uuid.UUID `json:"student_id" binding:"required,uuid"`
	Status    string    `json:"status" binding:"required,oneof=present absent late excused"` // Example statuses
}

// AttendanceQueryResponse might include student names for easier display.
type AttendanceQueryResponse struct {
	AttendanceRecord
	StudentName     string `json:"student_name,omitempty"`
	StudentIDString string `json:"student_cuet_id,omitempty"` // Student's CUET ID
}
