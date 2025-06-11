package models

import (
	"github.com/google/uuid"
	"time"
)

// ClassEvent represents a class-specific event like a test or assignment deadline.
type ClassEvent struct {
	ID          int       `json:"id,omitempty" db:"id"`
	ClassID     int       `json:"class_id" db:"class_id"`
	EventType   string    `json:"event_type" db:"event_type"` // e.g., "test", "quiz", "assignment_due", "presentation"
	Title       string    `json:"title" db:"title"`
	Description *string   `json:"description,omitempty" db:"description"`
	EventDate   string    `json:"event_date" db:"event_date"` // YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ for timestamp
	CreatedByID uuid.UUID `json:"created_by_id,omitempty" db:"created_by_id"`
	CreatedAt   time.Time `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at,omitempty" db:"updated_at"`
}

// ClassEventInput is used by CRs to create or update class events.
type ClassEventInput struct {
	// ClassID will usually come from path param for CR actions
	EventType   string  `json:"event_type" binding:"required,oneof=test quiz assignment_due presentation holiday other"`
	Title       string  `json:"title" binding:"required,min=3,max=100"`
	Description *string `json:"description,omitempty,max=500"`
	EventDate   string  `json:"event_date" binding:"required"` // Validate format (e.g., ISO8601 date or datetime)
}
