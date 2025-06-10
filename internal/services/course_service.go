package services

import (
	"fmt"
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	sbClient "github.com/lazy-boy4/cuet-class-nectar/internal/supabase"
)

func CreateCourse(courseInput models.CourseInput) (models.Course, error) {
	client := sbClient.GetClient()
	if client == nil {
		return models.Course{}, fmt.Errorf("Supabase client not initialized")
	}

	insertData := map[string]interface{}{
		"code":    courseInput.Code,
		"name":    courseInput.Name,
		"credits": courseInput.Credits,
	}
	var results []models.Course
	// Using simplified Insert(data) for nedpals/supabase-go@v0.5.0
	err := client.DB.From("courses").Insert(insertData).Execute(&results)
	if err != nil {
		return models.Course{}, fmt.Errorf("failed to create course: %w", err)
	}
	if len(results) == 0 {
		// This implies "Prefer: return=representation" was not set or RLS issues.
		// For robust solution, one might need to set header or do a follow-up select.
		return models.Course{}, fmt.Errorf("course creation returned no data")
	}
	return results[0], nil
}

func GetAllCourses() ([]models.Course, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}
	var courses []models.Course
	// Ordering removed for now to ensure build success.
	// Add .Order("code", true, false) or similar if build env issues are resolved.
	err := client.DB.From("courses").Select("*").Execute(&courses)
	if err != nil {
		return nil, fmt.Errorf("failed to get courses: %w", err)
	}
	return courses, nil
}

func GetCourseByID(id string) (models.Course, error) {
	client := sbClient.GetClient()
	if client == nil {
		return models.Course{}, fmt.Errorf("Supabase client not initialized")
	}
	var course []models.Course // nedpals client expects a slice
	err := client.DB.From("courses").Select("*").Eq("id", id).Execute(&course)
	if err != nil {
		return models.Course{}, fmt.Errorf("failed to get course by ID %s: %w", id, err)
	}
	if len(course) == 0 {
		return models.Course{}, fmt.Errorf("course with ID %s not found", id)
	}
	return course[0], nil
}

func UpdateCourse(id string, courseInput models.CourseInput) (models.Course, error) {
	client := sbClient.GetClient()
	if client == nil {
		return models.Course{}, fmt.Errorf("Supabase client not initialized")
	}
	updateData := map[string]interface{}{
		"code":    courseInput.Code,
		"name":    courseInput.Name,
		"credits": courseInput.Credits,
	}
	var results []models.Course
	// Using simplified Update(data) for nedpals/supabase-go@v0.5.0
	err := client.DB.From("courses").Update(updateData).Eq("id", id).Execute(&results)
	if err != nil {
		return models.Course{}, fmt.Errorf("failed to update course ID %s: %w", id, err)
	}
	if len(results) == 0 {
		return models.Course{}, fmt.Errorf("course update for ID %s returned no data (it may not exist or RLS issue)")
	}
	return results[0], nil
}

func DeleteCourse(id string) error {
	client := sbClient.GetClient()
	if client == nil {
		return fmt.Errorf("Supabase client not initialized")
	}
	var results []map[string]interface{} // Result not typically used for delete
	// Using simplified Delete() for nedpals/supabase-go@v0.5.0
	err := client.DB.From("courses").Delete().Eq("id", id).Execute(&results)
	if err != nil {
		return fmt.Errorf("failed to delete course ID %s: %w", id, err)
	}
	return nil
}
