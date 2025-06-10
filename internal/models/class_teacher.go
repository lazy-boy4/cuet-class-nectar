package models

import "github.com/google/uuid"

// ClassTeacher represents the assignment of a teacher to a class.
type ClassTeacher struct {
	UserID  uuid.UUID `json:"user_id" db:"user_id"`   // Teacher's User ID
	ClassID int       `json:"class_id" db:"class_id"` // Class ID
	// User    User      `json:"teacher_details,omitempty"` // For returning teacher info
	// Class   Class     `json:"class_details,omitempty"`   // For returning class info
}

// AssignTeachersInput is used when assigning one or more teachers to a single class.
type AssignTeachersInput struct {
	ClassID    int         `json:"class_id" binding:"required"`
	TeacherIDs []uuid.UUID `json:"teacher_ids" binding:"required,dive,uuid"` // List of teacher User IDs
}

// UnassignTeachersInput is similar, for removing assignments.
type UnassignTeachersInput struct {
	ClassID    int         `json:"class_id" binding:"required"`
	TeacherIDs []uuid.UUID `json:"teacher_ids" binding:"required,dive,uuid"`
}

// TeacherAssignmentDetail could be used to return teacher details along with assignment.
type TeacherAssignmentDetail struct {
	UserID   uuid.UUID `json:"user_id"`
	FullName string    `json:"full_name"`
	Email    string    `json:"email"`
	// Add other relevant teacher fields if needed
}
