package services

import (
	"fmt"
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	sbClient "github.com/lazy-boy4/cuet-class-nectar/internal/supabase"
)

func CreateClass(classInput models.ClassInput) (models.Class, error) {
	client := sbClient.GetClient()
	if client == nil {
		return models.Class{}, fmt.Errorf("Supabase client not initialized")
	}

	insertData := map[string]interface{}{
		"dept_id": classInput.DeptID,
		"session": classInput.Session,
		"code":    classInput.Code,
	}
	// Only include section if it's not empty, to allow DB default or NULL if appropriate
	if classInput.Section != "" {
		insertData["section"] = classInput.Section
	}

	var results []models.Class
	// Using simplified Insert(data) for nedpals/supabase-go@v0.5.0
	err := client.DB.From("classes").Insert(insertData).Execute(&results)
	if err != nil {
		return models.Class{}, fmt.Errorf("failed to create class: %w", err)
	}
	if len(results) == 0 {
		return models.Class{}, fmt.Errorf("class creation returned no data (check RLS or if 'Prefer: return=representation' is needed and not set by default)")
	}
	return results[0], nil
}

// GetAllClasses - Consider adding joins for department details if needed frequently
func GetAllClasses() ([]models.Class, error) { // Potentially []models.ClassDetail
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}
	var classes []models.Class
	// Ordering removed for now. If needed and build env fixed: .Order("code", true, false)
	err := client.DB.From("classes").Select("*").Execute(&classes)
	if err != nil {
		return nil, fmt.Errorf("failed to get classes: %w", err)
	}
	return classes, nil
}

func GetClassByID(id string) (models.Class, error) { // Potentially models.ClassDetail
	client := sbClient.GetClient()
	if client == nil {
		return models.Class{}, fmt.Errorf("Supabase client not initialized")
	}
	var class []models.Class // nedpals client expects a slice
	err := client.DB.From("classes").Select("*").Eq("id", id).Execute(&class)
	if err != nil {
		return models.Class{}, fmt.Errorf("failed to get class by ID %s: %w", id, err)
	}
	if len(class) == 0 {
		return models.Class{}, fmt.Errorf("class with ID %s not found", id)
	}
	return class[0], nil
}

func UpdateClass(id string, classInput models.ClassInput) (models.Class, error) {
	client := sbClient.GetClient()
	if client == nil {
		return models.Class{}, fmt.Errorf("Supabase client not initialized")
	}
	updateData := map[string]interface{}{
		"dept_id": classInput.DeptID,
		"session": classInput.Session,
		"code":    classInput.Code,
	}
	if classInput.Section != "" {
		updateData["section"] = classInput.Section
	} else {
		// If section is being explicitly cleared, need to send null or handle as per DB schema.
		// For now, omitting means it won't be updated if empty in input.
		// To explicitly set to NULL: updateData["section"] = nil (if map value is interface{})
	}

	var results []models.Class
	// Using simplified Update(data) for nedpals/supabase-go@v0.5.0
	err := client.DB.From("classes").Update(updateData).Eq("id", id).Execute(&results)
	if err != nil {
		return models.Class{}, fmt.Errorf("failed to update class ID %s: %w", id, err)
	}
	if len(results) == 0 {
		return models.Class{}, fmt.Errorf("class update for ID %s returned no data (it may not exist or RLS issue)")
	}
	return results[0], nil
}

func DeleteClass(id string) error {
	client := sbClient.GetClient()
	if client == nil {
		return fmt.Errorf("Supabase client not initialized")
	}
	var results []map[string]interface{} // Result not typically used for delete
	// Using simplified Delete() for nedpals/supabase-go@v0.5.0
	err := client.DB.From("classes").Delete().Eq("id", id).Execute(&results)
	if err != nil {
		return fmt.Errorf("failed to delete class ID %s: %w", id, err)
	}
	return nil
}
