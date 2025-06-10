package models

import (
	"github.com/google/uuid"
	"time"
)

// Enrollment represents an enrollment record in the 'enrollments' table.
type Enrollment struct {
	UserID      uuid.UUID  `json:"user_id" db:"user_id"`                     // Student's User ID
	ClassID     int        `json:"class_id" db:"class_id"`                   // Class ID
	Status      string     `json:"status" db:"status"`                       // 'pending', 'approved', 'rejected'
	RequestedAt *time.Time `json:"requested_at,omitempty" db:"requested_at"` // Timestamp of request
	ReviewedBy  *uuid.UUID `json:"reviewed_by,omitempty" db:"reviewed_by"`   // UserID of CR/Admin who reviewed
	ReviewedAt  *time.Time `json:"reviewed_at,omitempty" db:"reviewed_at"`   // Timestamp of review
}

// EnrollmentRequestInput is used by students to request enrollment in a class.
type EnrollmentRequestInput struct {
	ClassID int `json:"class_id" binding:"required"`
}

// EnrollmentView is used to display enrollment details, possibly with class/user info.
type EnrollmentView struct {
	UserID       uuid.UUID  `json:"user_id"`
	ClassID      int        `json:"class_id"`
	ClassCode    string     `json:"class_code,omitempty"`    // From joined Class table
	ClassName    string     `json:"class_name,omitempty"`    // (Conceptual, if Class model had Name)
	ClassSession string     `json:"class_session,omitempty"` // From joined Class table
	Status       string     `json:"status"`
	RequestedAt  *time.Time `json:"requested_at,omitempty"`
	ReviewedBy   *uuid.UUID `json:"reviewed_by,omitempty"`
	ReviewedAt   *time.Time `json:"reviewed_at,omitempty"`
	// StudentName    string     `json:"student_name,omitempty"` // If needed, from User table
}

// ReviewEnrollmentInput is used by CRs to approve or reject an enrollment request.
type ReviewEnrollmentInput struct {
	StudentIDToReview uuid.UUID `json:"student_id_to_review" binding:"required,uuid"`
	NewStatus         string    `json:"new_status" binding:"required,oneof=approved rejected"`
}
