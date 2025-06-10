package models

import (
	"github.com/google/uuid"
	"time"
)

type Notice struct {
	ID         int       `json:"id,omitempty" db:"id"`
	ClassID    *int      `json:"class_id,omitempty" db:"class_id"` // Pointer for nullable (global notices)
	Content    string    `json:"content" db:"content" binding:"required"`
	AuthorID   uuid.UUID `json:"author_id,omitempty" db:"author_id"`
	CreatedAt  time.Time `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt  time.Time `json:"updated_at,omitempty" db:"updated_at"`
	AuthorName *string   `json:"author_name,omitempty" db:"author_name"` // For display, from a join
}

type NoticeInput struct {
	ClassID *int   `json:"class_id"` // Optional: if nil, it's a global notice (only by admin). For teachers, classID is required.
	Content string `json:"content" binding:"required,min=5,max=2000"`
}
