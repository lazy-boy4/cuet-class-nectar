package services

import (
	"fmt"
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	sbClient "github.com/lazy-boy4/cuet-class-nectar/internal/supabase"
	"strconv"
	"strings"

	"github.com/google/uuid"
)

// GlobalSearch performs a search across multiple entities.
func GlobalSearch(query string, currentUserID uuid.UUID, currentUserRole string) (*models.SearchResults, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}

	filterValue := "*" + strings.ToLower(query) + "*" // For ILIKE operator in Filter method

	allResults := []models.SearchResultItem{}
	var searchErrors []string

	addedItems := make(map[string]bool) // To handle de-duplication
	addItem := func(item models.SearchResultItem) {
		key := fmt.Sprintf("%s-%s", item.Type, item.ID) // Simple key for de-duplication
		if !addedItems[key] {
			allResults = append(allResults, item)
			addedItems[key] = true
		}
	}

	const maxResultsPerEntityType = 5 // Max results to fetch for each sub-query within an entity type

	// --- Search Users ---
	var usersByName, usersByEmail, usersByStudentID []models.User
	err := client.DB.From("users").Select("id,full_name,email,role,student_id").Limit(maxResultsPerEntityType).Filter("full_name", "ilike", filterValue).Execute(&usersByName)
	if err != nil {
		searchErrors = append(searchErrors, fmt.Sprintf("users search (name) failed: %v", err))
	}
	err = client.DB.From("users").Select("id,full_name,email,role,student_id").Limit(maxResultsPerEntityType).Filter("email", "ilike", filterValue).Execute(&usersByEmail)
	if err != nil {
		searchErrors = append(searchErrors, fmt.Sprintf("users search (email) failed: %v", err))
	}
	err = client.DB.From("users").Select("id,full_name,email,role,student_id").Limit(maxResultsPerEntityType).Filter("student_id", "ilike", filterValue).Execute(&usersByStudentID)
	if err != nil {
		searchErrors = append(searchErrors, fmt.Sprintf("users search (student_id) failed: %v", err))
	}

	mergedUsers := append(usersByName, usersByEmail...)
	mergedUsers = append(mergedUsers, usersByStudentID...)
	for _, u := range mergedUsers {
		subtitle := u.Role
		if (u.Role == "student" || u.Role == "cr") && u.StudentID != nil && *u.StudentID != "" {
			subtitle = fmt.Sprintf("%s (ID: %s)", u.Role, *u.StudentID)
		} else if u.Email != "" {
			subtitle = u.Email
		}
		addItem(models.SearchResultItem{Type: "User", ID: u.ID.String(), Title: u.FullName, Subtitle: &subtitle})
	}

	// --- Search Courses ---
	var coursesByCode, coursesByName []models.Course
	err = client.DB.From("courses").Select("id,code,name").Limit(maxResultsPerEntityType).Filter("code", "ilike", filterValue).Execute(&coursesByCode)
	if err != nil {
		searchErrors = append(searchErrors, fmt.Sprintf("courses search (code) failed: %v", err))
	}
	err = client.DB.From("courses").Select("id,code,name").Limit(maxResultsPerEntityType).Filter("name", "ilike", filterValue).Execute(&coursesByName)
	if err != nil {
		searchErrors = append(searchErrors, fmt.Sprintf("courses search (name) failed: %v", err))
	}

	mergedCourses := append(coursesByCode, coursesByName...)
	for _, co := range mergedCourses {
		addItem(models.SearchResultItem{Type: "Course", ID: strconv.Itoa(co.ID), Title: co.Name, Subtitle: &co.Code})
	}

	// --- Search Classes ---
	var classesByCode, classesBySession, classesBySection []models.Class
	err = client.DB.From("classes").Select("id,code,session,section").Limit(maxResultsPerEntityType).Filter("code", "ilike", filterValue).Execute(&classesByCode)
	if err != nil {
		searchErrors = append(searchErrors, fmt.Sprintf("classes search (code) failed: %v", err))
	}
	err = client.DB.From("classes").Select("id,code,session,section").Limit(maxResultsPerEntityType).Filter("session", "ilike", filterValue).Execute(&classesBySession)
	if err != nil {
		searchErrors = append(searchErrors, fmt.Sprintf("classes search (session) failed: %v", err))
	}
	err = client.DB.From("classes").Select("id,code,session,section").Limit(maxResultsPerEntityType).Filter("section", "ilike", filterValue).Execute(&classesBySection)
	if err != nil {
		searchErrors = append(searchErrors, fmt.Sprintf("classes search (section) failed: %v", err))
	}

	mergedClasses := append(classesByCode, classesBySession...)
	mergedClasses = append(mergedClasses, classesBySection...)
	for _, cl := range mergedClasses {
		sub := cl.Session
		if cl.Section != "" {
			sub = fmt.Sprintf("%s - Section %s", cl.Session, cl.Section)
		}
		addItem(models.SearchResultItem{Type: "Class", ID: strconv.Itoa(cl.ID), Title: cl.Code, Subtitle: &sub})
	}

	// --- Search Departments ---
	var deptsByCode, deptsByName []models.Department
	err = client.DB.From("departments").Select("id,code,name").Limit(maxResultsPerEntityType).Filter("code", "ilike", filterValue).Execute(&deptsByCode)
	if err != nil {
		searchErrors = append(searchErrors, fmt.Sprintf("departments search (code) failed: %v", err))
	}
	err = client.DB.From("departments").Select("id,code,name").Limit(maxResultsPerEntityType).Filter("name", "ilike", filterValue).Execute(&deptsByName)
	if err != nil {
		searchErrors = append(searchErrors, fmt.Sprintf("departments search (name) failed: %v", err))
	}

	mergedDepts := append(deptsByCode, deptsByName...)
	for _, d := range mergedDepts {
		addItem(models.SearchResultItem{Type: "Department", ID: strconv.Itoa(d.ID), Title: d.Name, Subtitle: &d.Code})
	}

	// --- Search Notices ---
	var notices []models.Notice
	err = client.DB.From("notices").Select("id,content,class_id,created_at").
		Limit(10). // Limit before Filter should work
		Filter("content", "ilike", filterValue).
		Execute(&notices)
	if err != nil {
		searchErrors = append(searchErrors, fmt.Sprintf("notices search failed: %v", err))
	} else {
		for _, n := range notices {
			title := n.Content
			if len(title) > 50 {
				title = string([]rune(title)[:47]) + "..."
			}
			var subtitle string
			if n.ClassID != nil {
				var cls []struct{ Code string }
				_ = client.DB.From("classes").Select("code").Eq("id", strconv.Itoa(*n.ClassID)).Execute(&cls)
				if len(cls) > 0 {
					subtitle = fmt.Sprintf("Class Notice (%s)", cls[0].Code)
				} else {
					subtitle = "Class Notice (Unknown Class)"
				}
			} else {
				subtitle = "Global Notice"
			}
			addItem(models.SearchResultItem{Type: "Notice", ID: strconv.Itoa(n.ID), Title: title, Subtitle: &subtitle})
		}
	}

	// --- Search Class Events ---
	var eventsByTitle, eventsByDesc []models.ClassEvent
	err = client.DB.From("class_events").Select("id,title,description,class_id,event_date,event_type").
		Limit(maxResultsPerEntityType).Filter("title", "ilike", filterValue).Execute(&eventsByTitle)
	if err != nil {
		searchErrors = append(searchErrors, fmt.Sprintf("class_events search (title) failed: %v", err))
	}
	err = client.DB.From("class_events").Select("id,title,description,class_id,event_date,event_type").
		Limit(maxResultsPerEntityType).Filter("description", "ilike", filterValue).Execute(&eventsByDesc)
	if err != nil {
		searchErrors = append(searchErrors, fmt.Sprintf("class_events search (description) failed: %v", err))
	}

	mergedEvents := append(eventsByTitle, eventsByDesc...)
	for _, ce := range mergedEvents {
		var cls []struct{ Code string }
		_ = client.DB.From("classes").Select("code").Eq("id", strconv.Itoa(ce.ClassID)).Execute(&cls)
		classCode := "Unknown"
		if len(cls) > 0 {
			classCode = cls[0].Code
		}
		subtitle := fmt.Sprintf("For Class %s - %s (%s)", classCode, ce.EventType, ce.EventDate)
		addItem(models.SearchResultItem{Type: "Class Event", ID: strconv.Itoa(ce.ID), Title: ce.Title, Subtitle: &subtitle})
	}

	// Manually limit total results after merging and de-duplication if needed
	// For now, all de-duplicated results are returned. Max would be ~6 * maxResultsPerEntityType (or 10 for notices)

	finalResults := &models.SearchResults{
		Query: query,
		Items: allResults,
		Count: len(allResults),
	}

	if len(searchErrors) > 0 {
		return finalResults, fmt.Errorf("global search completed with errors: %s", strings.Join(searchErrors, "; "))
	}

	return finalResults, nil
}
