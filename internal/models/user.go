package models

import "github.com/google/uuid"

// User represents a user in the public.users table, mirrors Supabase auth.users where possible
type User struct {
	ID         uuid.UUID `json:"id" db:"id"` // Comes from auth.users.id
	Email      string    `json:"email" db:"email"`
	FullName   string    `json:"full_name" db:"full_name"`
	DeptCode   *string   `json:"dept_code,omitempty" db:"dept_code"` // Pointer for nullable fields
	Role       string    `json:"role" db:"role"`                     // admin, teacher, student, cr
	StudentID  *string   `json:"student_id,omitempty" db:"student_id"`
	Batch      *string   `json:"batch,omitempty" db:"batch"`
	Section    *string   `json:"section,omitempty" db:"section"`
	PictureURL *string   `json:"picture_url,omitempty" db:"picture_url"`
	CreatedAt  string    `json:"created_at,omitempty" db:"created_at"`
}

// SignUpInput (already defined, used for self-registration)
type SignUpInput struct {
	Email      string `json:"email" binding:"required,email"`
	Password   string `json:"password" binding:"required,min=6"`
	FullName   string `json:"full_name" binding:"required"`
	DeptCode   string `json:"dept_code"`               // Optional for general signup, but might be required by role
	Role       string `json:"role" binding:"required"` // student or teacher for initial signup by user
	StudentID  string `json:"student_id"`              // Required if role is student/cr
	Batch      string `json:"batch"`                   // Required if role is student/cr
	Section    string `json:"section,omitempty"`
	PictureURL string `json:"picture_url,omitempty"`
}

// SignInInput (already defined)
type SignInInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// AdminCreateUserInput is used when an admin creates a new user.
type AdminCreateUserInput struct {
	Email      string  `json:"email" binding:"required,email"`
	Password   string  `json:"password" binding:"required,min=6"`
	FullName   string  `json:"full_name" binding:"required"`
	Role       string  `json:"role" binding:"required"`
	DeptCode   *string `json:"dept_code,omitempty"`
	StudentID  *string `json:"student_id,omitempty"`
	Batch      *string `json:"batch,omitempty"`
	Section    *string `json:"section,omitempty"`
	PictureURL *string `json:"picture_url,omitempty"`
}

// AdminUpdateUserInput is used when an admin updates a user's details.
type AdminUpdateUserInput struct {
	FullName   *string `json:"full_name,omitempty"`
	DeptCode   *string `json:"dept_code,omitempty"`
	Role       *string `json:"role,omitempty"`
	StudentID  *string `json:"student_id,omitempty"`
	Batch      *string `json:"batch,omitempty"`
	Section    *string `json:"section,omitempty"`
	PictureURL *string `json:"picture_url,omitempty"`
}

// StudentProfileUpdateInput defines fields a student can update for their own profile.
type StudentProfileUpdateInput struct {
	FullName   *string `json:"full_name,omitempty"`
	PictureURL *string `json:"picture_url,omitempty"`
	Section    *string `json:"section,omitempty"`
}

// BulkUploadStudentData represents the expected structure for a student in a CSV.
type BulkUploadStudentData struct {
	UUID       string  `csv:"uuid"`
	Email      string  `csv:"email"`
	FullName   string  `csv:"full_name"`
	StudentID  string  `csv:"student_id"`
	DeptCode   string  `csv:"dept_code"`
	Batch      string  `csv:"batch"`
	Section    *string `csv:"section"`
	PictureURL *string `csv:"picture_url"`
}
