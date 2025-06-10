package models

type Course struct {
	ID      int     `json:"id,omitempty" db:"id"`
	Code    string  `json:"code" db:"code" binding:"required"` // e.g., Math-191
	Name    string  `json:"name" db:"name" binding:"required"`
	Credits float32 `json:"credits" db:"credits" binding:"required,gte=0.5,lte=6"` // Assuming credits can be .5
}

type CourseInput struct {
	Code    string  `json:"code" binding:"required,min=3,max=20"`
	Name    string  `json:"name" binding:"required,min=3,max=100"`
	Credits float32 `json:"credits" binding:"required,gte=0.5,lte=6"`
}
