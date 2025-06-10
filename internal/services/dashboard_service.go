package services

import (
	"fmt"
	"github.com/lazy-boy4/cuet-class-nectar/internal/models"
	sbClient "github.com/lazy-boy4/cuet-class-nectar/internal/supabase"
	// "time" // Not directly used

	"github.com/google/uuid"
)

// GetTeacherDashboardData compiles data for a teacher's dashboard.
func GetTeacherDashboardData(teacherID uuid.UUID) (*models.TeacherDashboardData, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}

	dashboardData := models.TeacherDashboardData{
		AssignedClasses: []models.ClassSummary{},
		UpcomingEvents:  []models.ScheduleEntryDetails{},
		RecentNotices:   []models.NoticeSummary{},
	}

	// --- 1. Get Assigned Classes ---
	var assignedClassLinks []struct {
		ClassID int `json:"class_id"`
	}
	err := client.DB.From("class_teachers").Select("class_id").Eq("user_id", teacherID.String()).Execute(&assignedClassLinks)
	if err != nil {
		return nil, fmt.Errorf("failed to get assigned classes for teacher %s: %w", teacherID, err)
	}

	var assignedClassIDs []string
	if len(assignedClassLinks) > 0 {
		for _, link := range assignedClassLinks {
			assignedClassIDs = append(assignedClassIDs, fmt.Sprintf("%d", link.ClassID))
		}

		var classes []struct {
			ID      int    `json:"id"`
			Code    string `json:"code"`
			Session string `json:"session"`
			Section string `json:"section"`
			DeptID  int    `json:"dept_id"`
		}
		err = client.DB.From("classes").Select("id,code,session,section,dept_id").In("id", assignedClassIDs).Execute(&classes)
		if err != nil {
			return nil, fmt.Errorf("failed to fetch details for assigned classes: %w", err)
		}

		allDepts, deptErr := GetAllDepartments()
		deptMap := make(map[int]string)
		if deptErr == nil && allDepts != nil {
			for _, dept := range allDepts {
				deptMap[dept.ID] = dept.Name
			}
		} else if deptErr != nil {
			fmt.Printf("Warning: could not fetch departments for dashboard: %v\n", deptErr)
		}

		for _, class := range classes {
			dashboardData.AssignedClasses = append(dashboardData.AssignedClasses, models.ClassSummary{
				ID:             class.ID,
				Code:           class.Code,
				Session:        class.Session,
				Section:        class.Section,
				DepartmentName: deptMap[class.DeptID],
			})
		}
	}

	// --- 2. Get Upcoming Schedule Events (e.g., next 5 for assigned classes) ---
	if len(assignedClassIDs) > 0 {
		allCourses, courseErr := GetAllCourses()
		courseMap := make(map[string]string)
		if courseErr == nil && allCourses != nil {
			for _, course := range allCourses {
				courseMap[course.Code] = course.Name
			}
		} else if courseErr != nil {
			fmt.Printf("Warning: could not fetch courses for dashboard: %v\n", courseErr)
		}

		var scheduleEntries []models.ScheduleEntry
		// Corrected: Apply Limit(5) before In(...)
		err = client.DB.From("schedules").Select("*").Limit(5).In("class_id", assignedClassIDs).Execute(&scheduleEntries)
		if err == nil {
			for _, entry := range scheduleEntries {
				var classCode string
				for _, cls := range dashboardData.AssignedClasses {
					if cls.ID == entry.ClassID {
						classCode = cls.Code
						break
					}
				}

				var courseNameVal *string
				if entry.CourseCode != nil {
					if name, ok := courseMap[*entry.CourseCode]; ok {
						courseNameVal = &name
					}
				}

				dashboardData.UpcomingEvents = append(dashboardData.UpcomingEvents, models.ScheduleEntryDetails{
					ID:         entry.ID,
					ClassCode:  classCode,
					ClassID:    entry.ClassID,
					DayOfWeek:  entry.DayOfWeek,
					StartTime:  entry.StartTime,
					EndTime:    entry.EndTime,
					CourseCode: entry.CourseCode,
					CourseName: courseNameVal,
					RoomNumber: entry.RoomNumber,
				})
			}
		} else {
			fmt.Printf("Warning: could not fetch schedule entries for teacher dashboard: %v\n", err)
		}
	}

	// --- 3. Get Recent Notices (Global + for Enrolled Classes) ---
	// Fetch global notices
	var globalNotices []models.Notice
	// Corrected: Apply Limit(3) before IsNull(...)
	err = client.DB.From("notices").Select("*").Limit(3).IsNull("class_id").Execute(&globalNotices)
	if err == nil {
		for _, notice := range globalNotices {
			dashboardData.RecentNotices = append(dashboardData.RecentNotices, models.NoticeSummary{
				ID: notice.ID, Content: truncateString(notice.Content, 100), CreatedAt: notice.CreatedAt,
			})
		}
	} else {
		fmt.Printf("Warning: could not fetch global notices for student dashboard: %v\n", err)
	}

	// Fetch notices for enrolled classes
	if len(assignedClassIDs) > 0 { // Use assignedClassIDs for teacher's dashboard notices
		var classNotices []models.Notice
		// Corrected: Apply Limit(5) before In(...)
		err = client.DB.From("notices").Select("id, class_id, content, created_at").Limit(5).In("class_id", assignedClassIDs).Execute(&classNotices)

		if err == nil {
			classCodeMap := make(map[int]string)
			for _, cls := range dashboardData.AssignedClasses {
				classCodeMap[cls.ID] = cls.Code
			} // Use AssignedClasses here

			for _, notice := range classNotices {
				var cCode *string
				if notice.ClassID != nil {
					if code, ok := classCodeMap[*notice.ClassID]; ok {
						cCode = &code
					}
				}
				dashboardData.RecentNotices = append(dashboardData.RecentNotices, models.NoticeSummary{
					ID: notice.ID, ClassCode: cCode, Content: truncateString(notice.Content, 100), CreatedAt: notice.CreatedAt,
				})
			}
		} else {
			fmt.Printf("Warning: could not fetch class notices for teacher dashboard: %v\n", err)
		}
	}

	// --- For StudentDashboardData (this function is GetTeacherDashboardData, but the notice fetching logic was from student)
	// The logic for fetching student-specific notices (global + enrolled) should be in GetStudentDashboardData.
	// The current function GetTeacherDashboardData should fetch notices relevant to the teacher,
	// which typically means notices for classes they teach, or global notices.
	// The existing recent notices logic fetches for assignedClassIDs, which is correct for teachers.
	// The global notice fetching logic is also fine for teachers to see.

	// --- 3. Get Basic Attendance Stats (This was from StudentDashboardData, not applicable for Teacher directly) ---
	// Removing this section from GetTeacherDashboardData
	return &dashboardData, nil
}

// GetStudentDashboardData compiles data for a student's dashboard.
func GetStudentDashboardData(studentID uuid.UUID) (*models.StudentDashboardData, error) {
	client := sbClient.GetClient()
	if client == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}

	dashboardData := models.StudentDashboardData{
		EnrolledClasses: []models.ClassSummary{},
		RecentNotices:   []models.NoticeSummary{},
	}

	// --- 1. Get Enrolled Classes ---
	var enrolledClassLinks []struct {
		ClassID int `json:"class_id"`
	}
	err := client.DB.From("enrollments").Select("class_id").
		Eq("user_id", studentID.String()).
		Eq("status", "approved").
		Execute(&enrolledClassLinks)
	if err != nil {
		return nil, fmt.Errorf("failed to get enrolled classes for student %s: %w", studentID, err)
	}

	var enrolledClassIDsForNotices []string // For string based IN clause for notices
	var enrolledClassIDInts []int
	if len(enrolledClassLinks) > 0 {
		for _, link := range enrolledClassLinks {
			enrolledClassIDsForNotices = append(enrolledClassIDsForNotices, fmt.Sprintf("%d", link.ClassID))
			enrolledClassIDInts = append(enrolledClassIDInts, link.ClassID)
		}

		var classes []struct {
			ID      int    `json:"id"`
			Code    string `json:"code"`
			Session string `json:"session"`
			Section string `json:"section"`
			DeptID  int    `json:"dept_id"`
		}
		err = client.DB.From("classes").Select("id,code,session,section,dept_id").In("id", enrolledClassIDsForNotices).Execute(&classes)
		if err != nil {
			return nil, fmt.Errorf("failed to fetch details for enrolled classes: %w", err)
		}

		allDepts, deptErr := GetAllDepartments()
		deptMap := make(map[int]string)
		if deptErr == nil && allDepts != nil {
			for _, dept := range allDepts {
				deptMap[dept.ID] = dept.Name
			}
		} else if deptErr != nil {
			fmt.Printf("Warning: could not fetch departments for student dashboard: %v\n", deptErr)
		}

		for _, class := range classes {
			dashboardData.EnrolledClasses = append(dashboardData.EnrolledClasses, models.ClassSummary{
				ID:             class.ID,
				Code:           class.Code,
				Session:        class.Session,
				Section:        class.Section,
				DepartmentName: deptMap[class.DeptID],
			})
		}
	}

	// --- 2. Get Recent Notices (Global + for Enrolled Classes) ---
	var globalNotices []models.Notice
	// Corrected: Apply Limit(3) before IsNull(...)
	err = client.DB.From("notices").Select("*").Limit(3).IsNull("class_id").Execute(&globalNotices)
	if err == nil {
		for _, notice := range globalNotices {
			dashboardData.RecentNotices = append(dashboardData.RecentNotices, models.NoticeSummary{
				ID: notice.ID, Content: truncateString(notice.Content, 100), CreatedAt: notice.CreatedAt,
			})
		}
	} else {
		fmt.Printf("Warning: could not fetch global notices for student dashboard: %v\n", err)
	}

	if len(enrolledClassIDsForNotices) > 0 {
		var classNotices []models.Notice
		// Corrected: Apply Limit(5) before In(...)
		err = client.DB.From("notices").Select("id, class_id, content, created_at").Limit(5).In("class_id", enrolledClassIDsForNotices).Execute(&classNotices)

		if err == nil {
			classCodeMap := make(map[int]string)
			for _, cls := range dashboardData.EnrolledClasses {
				classCodeMap[cls.ID] = cls.Code
			}

			for _, notice := range classNotices {
				var cCode *string
				if notice.ClassID != nil {
					if code, ok := classCodeMap[*notice.ClassID]; ok {
						cCode = &code
					}
				}
				dashboardData.RecentNotices = append(dashboardData.RecentNotices, models.NoticeSummary{
					ID: notice.ID, ClassCode: cCode, Content: truncateString(notice.Content, 100), CreatedAt: notice.CreatedAt,
				})
			}
		} else {
			fmt.Printf("Warning: could not fetch class notices for student dashboard: %v\n", err)
		}
	}

	// --- 3. Get Basic Attendance Stats ---
	if len(enrolledClassIDsForNotices) > 0 {
		var attendanceRecords []models.AttendanceRecord
		err = client.DB.From("attendance").Select("status").
			Eq("student_id", studentID.String()).
			In("class_id", enrolledClassIDsForNotices).Execute(&attendanceRecords)

		if err == nil && len(attendanceRecords) > 0 {
			stats := models.StudentAttendanceOverallStats{}
			stats.TotalClasses = len(attendanceRecords)
			for _, rec := range attendanceRecords {
				if rec.Status == "present" || rec.Status == "late" {
					stats.TotalAttended++
				}
			}
			if stats.TotalClasses > 0 {
				stats.OverallPercentage = (float32(stats.TotalAttended) / float32(stats.TotalClasses)) * 100
			}
			dashboardData.AttendanceStats = &stats
		} else if err != nil {
			fmt.Printf("Warning: could not fetch attendance for student dashboard stats: %v\n", err)
		}
	}
	return &dashboardData, nil
}

func truncateString(str string, num int) string {
	if len(str) <= num {
		return str
	}
	runes := []rune(str)
	if num > len(runes) {
		num = len(runes)
	}
	return string(runes[0:num]) + "..."
}
