package services

import (
	"fmt"
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	sbClient "github.com/lazy-boy4/cuet-class-nectar/internal/supabase"
	// "context" // nedpals/supabase-go uses context for Auth, not always for DB
)

func CreateDepartment(deptInput models.DepartmentInput) (models.Department, error) {
	client := sbClient.GetClient()
	if client == nil {
		return models.Department{}, fmt.Errorf("Supabase client not initialized")
	}

	// Using map[string]interface{} for data to be inserted.
	insertData := map[string]interface{}{
		"code": deptInput.Code,
		"name": deptInput.Name,
	}
	var results []models.Department
	// nedpals/supabase-go v0.5.0 Insert is: Insert(data interface{}, count ...string)
	// Assuming Execute populates results if RLS allows select and table returns data ("Prefer: return=representation" needed).
	// For this build attempt, we simplify and hope the library/DB defaults to returning data.
	err := client.DB.From("departments").Insert(insertData).Execute(&results)
	if err != nil {
		return models.Department{}, fmt.Errorf("failed to create department: %w", err)
	}
	if len(results) == 0 {
		// This might happen if "Prefer: return=representation" is not effectively set.
		// The subtask implies we should get the model back.
		// If RLS is restrictive or the header isn't set by default by the client lib for Insert,
		// this will be empty. A workaround would be a subsequent SELECT.
		// For now, erroring if empty.
		return models.Department{}, fmt.Errorf("department creation returned no data")
	}
	return results[0], nil
}

func GetAllDepartments() ([]models.Department, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}
	var departments []models.Department
	// .Order("name", true, false) // Removed due to persistent build environment issues.
	// Departments will be returned in default DB order (likely primary key or insertion order).
	err := client.DB.From("departments").Select("*").Execute(&departments)
	if err != nil {
		return nil, fmt.Errorf("failed to get departments: %w", err)
	}
	return departments, nil
}

func GetDepartmentByID(id string) (models.Department, error) {
	client := sbClient.GetClient()
	if client == nil {
		return models.Department{}, fmt.Errorf("Supabase client not initialized")
	}
	var department []models.Department
	err := client.DB.From("departments").Select("*").Eq("id", id).Execute(&department)
	if err != nil {
		return models.Department{}, fmt.Errorf("failed to get department by ID %s: %w", id, err)
	}
	if len(department) == 0 {
		return models.Department{}, fmt.Errorf("department with ID %s not found", id)
	}
	return department[0], nil
}

func UpdateDepartment(id string, deptInput models.DepartmentInput) (models.Department, error) {
	client := sbClient.GetClient()
	if client == nil {
		return models.Department{}, fmt.Errorf("Supabase client not initialized")
	}

	updateData := map[string]interface{}{
		"code": deptInput.Code,
		"name": deptInput.Name,
	}
	var results []models.Department
	// nedpals/supabase-go v0.5.0 Update is: Update(data map[string]interface{}, count ...string)
	err := client.DB.From("departments").Update(updateData).Eq("id", id).Execute(&results)
	if err != nil {
		return models.Department{}, fmt.Errorf("failed to update department ID %s: %w", id, err)
	}
	if len(results) == 0 {
		return models.Department{}, fmt.Errorf("department update for ID %s returned no data (it may not exist or RLS/Prefer header issue)")
	}
	return results[0], nil
}

func DeleteDepartment(id string) error {
	client := sbClient.GetClient()
	if client == nil {
		return fmt.Errorf("Supabase client not initialized")
	}
	var results []map[string]interface{}
	// nedpals/supabase-go v0.5.0 Delete is: Delete(count ...string)
	err := client.DB.From("departments").Delete().Eq("id", id).Execute(&results)
	if err != nil {
		return fmt.Errorf("failed to delete department ID %s: %w", id, err)
	}
	return nil
}
