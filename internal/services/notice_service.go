package services

import (
	"fmt"
	"sort"

	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	sb "github.com/lazy-boy4/cuet-class-nectar/internal/supabase"

	"github.com/google/uuid"
)

// --- Existing CRUD Functions (Restored with Matching Signatures) ---

func CreateNotice(input models.NoticeInput, authorID uuid.UUID) (*models.Notice, error) {
	client := sb.GetClient()
	if client == nil {
		return nil, fmt.Errorf("supabase client not initialized")
	}

	noticeData := map[string]interface{}{
		"content":   input.Content,
		"author_id": authorID.String(),
	}
	if input.ClassID != nil {
		noticeData["class_id"] = *input.ClassID
	} else {
		noticeData["class_id"] = nil // Global or Dept
	}
	if input.DeptCode != nil && *input.DeptCode != "" {
		noticeData["dept_code"] = *input.DeptCode
	} else {
		noticeData["dept_code"] = nil
	}

	var results []models.Notice
	err := client.DB.From("notices").Insert(noticeData).Execute(&results)
	if err != nil {
		return nil, fmt.Errorf("failed to create notice: %v", err)
	}
	if len(results) == 0 {
		return nil, fmt.Errorf("no notice returned after creation")
	}
	return &results[0], nil
}

// GetNoticesByClass accepts string classID
func GetNoticesByClass(classID string) ([]models.Notice, error) {
	client := sb.GetClient()
	if client == nil {
		return nil, fmt.Errorf("supabase client not initialized")
	}

	var notices []models.Notice
	err := client.DB.From("notices").
		Select("*, users(full_name)").
		Eq("class_id", classID).
		Execute(&notices)

	if err != nil {
		return nil, fmt.Errorf("failed to fetch class notices: %v", err)
	}

	sort.Slice(notices, func(i, j int) bool {
		return notices[i].CreatedAt.After(notices[j].CreatedAt)
	})

	return notices, nil
}

// GetGlobalNotices fetches global notices
func GetGlobalNotices() ([]models.Notice, error) {
	client := sb.GetClient()
	if client == nil {
		return nil, fmt.Errorf("supabase client not initialized")
	}

	var notices []models.Notice
	err := client.DB.From("notices").
		Select("*, users(full_name)").
		Filter("class_id", "is", "null").
		Filter("dept_code", "is", "null").
		Execute(&notices)

	if err != nil {
		return nil, fmt.Errorf("failed to fetch global notices: %v", err)
	}

	sort.Slice(notices, func(i, j int) bool {
		return notices[i].CreatedAt.After(notices[j].CreatedAt)
	})

	return notices, nil
}

func UpdateNotice(noticeID string, content string, authorID uuid.UUID) (*models.Notice, error) {
	client := sb.GetClient()
	if client == nil {
		return nil, fmt.Errorf("supabase client not initialized")
	}

	updateData := map[string]interface{}{
		"content": content,
	}

	var results []models.Notice
	err := client.DB.From("notices").Update(updateData).Eq("id", noticeID).Eq("author_id", authorID.String()).Execute(&results)
	if err != nil {
		return nil, fmt.Errorf("failed to update notice: %v", err)
	}
	if len(results) == 0 {
		return nil, fmt.Errorf("notice not found or not authorized to update")
	}
	return &results[0], nil
}

// DeleteNotice accepts role as 3rd argument
func DeleteNotice(noticeID string, authorID uuid.UUID, role string) error {
	client := sb.GetClient()
	if client == nil {
		return fmt.Errorf("supabase client not initialized")
	}

	// Assuming we enforce 'own' delete here via author_id, skipping role specific logic for now
	// unless role is 'admin' (who can delete anything).
	// teacher_handlers passes current user's role.

	deleteQuery := client.DB.From("notices").Delete().Eq("id", noticeID)
	// If not admin, enforce ownership
	if role != "admin" {
		deleteQuery = deleteQuery.Eq("author_id", authorID.String())
	}

	var results []models.Notice
	err := deleteQuery.Execute(&results)
	if err != nil {
		return fmt.Errorf("failed to delete notice: %v", err)
	}
	if len(results) == 0 {
		return fmt.Errorf("notice not found or not authorized to delete")
	}
	return nil
}

// --- Student Dashboard Function ---

func GetRelevantNotices(studentID uuid.UUID) ([]models.Notice, error) {
	client := sb.GetClient()
	if client == nil {
		return nil, fmt.Errorf("supabase client not initialized")
	}

	var users []models.User
	err := client.DB.From("users").Select("*").Eq("id", studentID.String()).Execute(&users)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user info: %v", err)
	}
	if len(users) == 0 {
		return nil, fmt.Errorf("user not found")
	}
	user := users[0]

	var enrollments []models.Enrollment
	err = client.DB.From("enrollments").Select("class_id").Eq("user_id", studentID.String()).Eq("status", "approved").Execute(&enrollments)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch enrollments: %v", err)
	}

	var classIDStrs []string
	for _, e := range enrollments {
		classIDStrs = append(classIDStrs, fmt.Sprintf("%d", e.ClassID))
	}

	type NoticeWithDetails struct {
		models.Notice
		Class *struct {
			Code string `json:"code"`
		} `json:"classes"`
		Author *struct {
			FullName string `json:"full_name"`
		} `json:"users"`
	}

	var allNotices []NoticeWithDetails
	uniqueMap := make(map[int]bool)

	var globalRes []NoticeWithDetails
	err = client.DB.From("notices").
		Select("*, classes(code), users(full_name)").
		Filter("class_id", "is", "null").
		Filter("dept_code", "is", "null").
		Execute(&globalRes)

	if err != nil {
		return nil, fmt.Errorf("failed to fetch global notices: %v", err)
	}
	for _, n := range globalRes {
		if !uniqueMap[n.ID] {
			uniqueMap[n.ID] = true
			allNotices = append(allNotices, n)
		}
	}

	if user.DeptCode != nil && *user.DeptCode != "" {
		var deptRes []NoticeWithDetails
		err = client.DB.From("notices").
			Select("*, classes(code), users(full_name)").
			Eq("dept_code", *user.DeptCode).
			Execute(&deptRes)
		if err != nil {
			return nil, fmt.Errorf("failed to fetch dept notices: %v", err)
		}
		for _, n := range deptRes {
			if !uniqueMap[n.ID] {
				uniqueMap[n.ID] = true
				allNotices = append(allNotices, n)
			}
		}
	}

	if len(classIDStrs) > 0 {
		var classRes []NoticeWithDetails
		err = client.DB.From("notices").
			Select("*, classes(code), users(full_name)").
			In("class_id", classIDStrs).
			Execute(&classRes)
		if err != nil {
			return nil, fmt.Errorf("failed to fetch class notices: %v", err)
		}
		for _, n := range classRes {
			if !uniqueMap[n.ID] {
				uniqueMap[n.ID] = true
				allNotices = append(allNotices, n)
			}
		}
	}

	sort.Slice(allNotices, func(i, j int) bool {
		return allNotices[i].CreatedAt.After(allNotices[j].CreatedAt)
	})

	var finalNotices []models.Notice
	for _, jn := range allNotices {
		n := jn.Notice
		if jn.Author != nil {
			n.AuthorName = &jn.Author.FullName
		}
		finalNotices = append(finalNotices, n)
	}

	return finalNotices, nil
}
