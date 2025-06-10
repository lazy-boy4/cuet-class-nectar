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
	CreatedAt  string    `json:"created_at,omitempty" db:"created_at"` // Handled by Supabase
	// LastSignInAt string `json:"last_sign_in_at,omitempty"` // From auth.users if needed
}

// SignUpInput (already defined, used for self-registration)
type SignUpInput struct {
	Email      string `json:"email" binding:"required,email"`
	Password   string `json:"password" binding:"required,min=6"`
	FullName   string `json:"full_name" binding:"required"`
	DeptCode   string `json:"dept_code"`
	Role       string `json:"role" binding:"required"` // student or teacher for initial signup
	StudentID  string `json:"student_id"`
	Batch      string `json:"batch"`
	Section    string `json:"section,omitempty"`
	PictureURL string `json:"picture_url,omitempty"`
}

// SignInInput (already defined)
type SignInInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// AdminCreateUserInput is used when an admin creates a new user.
// Password can be auto-generated or set. Email verification might be handled differently.
type AdminCreateUserInput struct {
	Email      string  `json:"email" binding:"required,email"`
	Password   string  `json:"password" binding:"required,min=6"` // Admin sets initial password
	FullName   string  `json:"full_name" binding:"required"`
	Role       string  `json:"role" binding:"required"` // admin, teacher, student, cr
	DeptCode   *string `json:"dept_code,omitempty"`
	StudentID  *string `json:"student_id,omitempty"`
	Batch      *string `json:"batch,omitempty"`
	Section    *string `json:"section,omitempty"`
	PictureURL *string `json:"picture_url,omitempty"`
	// Add any other fields admin can set, e.g., initial department, etc.
}

// AdminUpdateUserInput is used when an admin updates a user's details.
// Admin can typically change more fields than a user updating their own profile.
type AdminUpdateUserInput struct {
	FullName   *string `json:"full_name,omitempty"`
	DeptCode   *string `json:"dept_code,omitempty"` // Use pointers to distinguish between empty and not provided
	Role       *string `json:"role,omitempty"`      // admin, teacher, student, cr
	StudentID  *string `json:"student_id,omitempty"`
	Batch      *string `json:"batch,omitempty"`
	Section    *string `json:"section,omitempty"`
	PictureURL *string `json:"picture_url,omitempty"`
	// Email and Password changes are typically handled by separate, dedicated endpoints/methods
	// due to their sensitivity and impact (e.g., email verification, password reset flows).
}

// BulkUploadStudentData represents the expected structure for a student in a CSV.
// Admin must ensure 'Email' corresponds to an existing auth.users entry or provide UUID.
// If UUID is provided and valid, it will be used as the primary key for the users table.
type BulkUploadStudentData struct {
	UUID       string  `csv:"uuid"`        // Optional: Auth User ID (if already created)
	Email      string  `csv:"email"`       // Required: Used to link or for new profile if UUID not given
	FullName   string  `csv:"full_name"`   // Required
	StudentID  string  `csv:"student_id"`  // Required (CUET ID)
	DeptCode   string  `csv:"dept_code"`   // Required
	Batch      string  `csv:"batch"`       // Required
	Section    *string `csv:"section"`     // Optional
	PictureURL *string `csv:"picture_url"` // Optional
	// Role will be defaulted to 'student' by the service
}
