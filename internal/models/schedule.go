package models

import (
	"github.com/google/uuid"
	"time"
)

// ScheduleEntry represents a single entry in the class schedule.
type ScheduleEntry struct {
	ID         int        `json:"id,omitempty" db:"id"`
	ClassID    int        `json:"class_id" db:"class_id"`
	DayOfWeek  int        `json:"day_of_week" db:"day_of_week"`           // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
	StartTime  string     `json:"start_time" db:"start_time"`             // HH:MM format (e.g., "09:00")
	EndTime    string     `json:"end_time" db:"end_time"`                 // HH:MM format (e.g., "10:30")
	CourseCode *string    `json:"course_code,omitempty" db:"course_code"` // Optional: Can be FK to courses.code
	TeacherID  *uuid.UUID `json:"teacher_id,omitempty" db:"teacher_id"`   // Optional: Specific teacher for this slot (FK to users.id)
	RoomNumber *string    `json:"room_number,omitempty" db:"room_number"`
	CreatedAt  time.Time  `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at,omitempty" db:"updated_at"`
	// For display, if joining with courses/teachers:
	CourseName  *string `json:"course_name,omitempty" db:"course_name"`
	TeacherName *string `json:"teacher_name,omitempty" db:"teacher_name"`
}

// ScheduleEntryInput is used for creating and updating schedule entries.
type ScheduleEntryInput struct {
	ClassID    int        `json:"class_id" binding:"required"` // Should match path param usually
	DayOfWeek  int        `json:"day_of_week" binding:"required,gte=0,lte=6"`
	StartTime  string     `json:"start_time" binding:"required"` // Add regex for HH:MM if possible with Gin's validator
	EndTime    string     `json:"end_time" binding:"required"`   // Add regex for HH:MM
	CourseCode *string    `json:"course_code,omitempty"`
	TeacherID  *uuid.UUID `json:"teacher_id,omitempty"`
	RoomNumber *string    `json:"room_number,omitempty"`
}
