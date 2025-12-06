package models

import (
	"time"

	"github.com/google/uuid"
)

type Notice struct {
	ID         int       `json:"id,omitempty" db:"id"`
	ClassID    *int      `json:"class_id,omitempty" db:"class_id"`   // Pointer for nullable (global/dept notices)
	DeptCode   *string   `json:"dept_code,omitempty" db:"dept_code"` // Pointer for nullable (global/class notices)
	Content    string    `json:"content" db:"content" binding:"required"`
	AuthorID   uuid.UUID `json:"author_id,omitempty" db:"author_id"`
	CreatedAt  time.Time `json:"created_at,omitempty" db:"created_at"`
	UpdatedAt  time.Time `json:"updated_at,omitempty" db:"updated_at"`
	AuthorName *string   `json:"author_name,omitempty" db:"author_name"` // For display, from a join
}

type NoticeInput struct {
	ClassID  *int    `json:"class_id"`  // Optional
	DeptCode *string `json:"dept_code"` // Optional
	Content  string  `json:"content" binding:"required,min=5,max=2000"`
}
