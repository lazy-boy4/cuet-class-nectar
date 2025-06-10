package models

// Class represents a class in the system.
// It links to a department. Specific courses and teachers are usually part of a class's schedule or roster.
type Class struct {
	ID      int    `json:"id,omitempty" db:"id"`
	DeptID  int    `json:"dept_id" db:"dept_id" binding:"required"` // Foreign key to departments table
	Session string `json:"session" db:"session" binding:"required"` // e.g., "2023-2024"
	Section string `json:"section,omitempty" db:"section"`          // e.g., "A", "B", can be optional if class is not sectioned
	Code    string `json:"code" db:"code" binding:"required"`       // e.g., "CSE-21", "ARCH-101" - often a combination
	// Department  Department `json:"department,omitempty" db:"-"` // Optional: for eager loading, not directly in table
}

// ClassInput is used for creating and updating classes.
type ClassInput struct {
	DeptID  int    `json:"dept_id" binding:"required"`
	Session string `json:"session" binding:"required,min=7,max=9"` // "YYYY-YYYY" format like "2023-2024"
	Section string `json:"section,omitempty" binding:"omitempty,max=5"`
	Code    string `json:"code" binding:"required,min=3,max=20"`
}

// ClassDetail might include department info when fetching
type ClassDetail struct {
	Class
	DepartmentName string `json:"department_name,omitempty"`
	DepartmentCode string `json:"department_code,omitempty"`
}
