package models

import (
	"github.com/google/uuid"
	"time"
)

// ClassRoutinePDF represents the metadata for an uploaded class routine PDF.
type ClassRoutinePDF struct {
	ID           int       `json:"id,omitempty" db:"id"`
	ClassID      int       `json:"class_id" db:"class_id"`             // Should be unique or PK with versioning
	FileName     string    `json:"file_name" db:"file_name"`           // Original name of the uploaded file
	FileURL      string    `json:"file_url" db:"file_url"`             // (Dummy) URL where the file is supposedly stored
	UploadedByID uuid.UUID `json:"uploaded_by_id" db:"uploaded_by_id"` // User ID of the CR who uploaded
	UploadedAt   time.Time `json:"uploaded_at,omitempty" db:"uploaded_at"`
	UpdatedAt    time.Time `json:"updated_at,omitempty" db:"updated_at"`
}

// ClassRoutineUploadInput - no specific input struct needed if file comes from multipart form directly
// and classID from path. FileName can be from FileHeader.
