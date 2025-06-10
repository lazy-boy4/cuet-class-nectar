package models

type Department struct {
	ID   int    `json:"id,omitempty" db:"id"` // omitempty for create where ID is auto-gen
	Code string `json:"code" db:"code" binding:"required"`
	Name string `json:"name" db:"name" binding:"required"`
}

// Used for create/update to ensure ID is not bindable from request body for create
type DepartmentInput struct {
	Code string `json:"code" binding:"required,alphanum,min=2,max=10"`
	Name string `json:"name" binding:"required,min=3,max=100"`
}
