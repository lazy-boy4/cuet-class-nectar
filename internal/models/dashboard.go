package models

import (
	// "github.com/google/uuid" // Not directly in this struct, but its components use it
	"time"
)

// TeacherDashboardData aggregates information for the teacher's dashboard.
type TeacherDashboardData struct {
	AssignedClasses []ClassSummary         `json:"assigned_classes"`
	UpcomingEvents  []ScheduleEntryDetails `json:"upcoming_events"` // e.g., for next 7 days
	RecentNotices   []NoticeSummary        `json:"recent_notices"`  // e.g., last 5 class notices
	// Stats can be added later, e.g., total students, pending tasks etc.
}

// ClassSummary provides minimal class details for the dashboard.
type ClassSummary struct {
	ID             int    `json:"id" db:"id"`
	Code           string `json:"code" db:"code"`
	Session        string `json:"session" db:"session"`
	Section        string `json:"section,omitempty" db:"section"`
	DepartmentName string `json:"department_name,omitempty"` // From join
}

// ScheduleEntryDetails provides more context for schedule entries on the dashboard.
type ScheduleEntryDetails struct {
	ID         int     `json:"id" db:"id"`
	ClassCode  string  `json:"class_code"` // From joining with Classes table
	ClassID    int     `json:"class_id"`
	DayOfWeek  int     `json:"day_of_week"`
	StartTime  string  `json:"start_time"`
	EndTime    string  `json:"end_time"`
	CourseCode *string `json:"course_code,omitempty"`
	CourseName *string `json:"course_name,omitempty"` // From joining with Courses table
	RoomNumber *string `json:"room_number,omitempty"`
	// DateOfEvent string `json:"date_of_event"` // Calculated for display
}

// NoticeSummary provides minimal notice details for the dashboard.
type NoticeSummary struct {
	ID        int       `json:"id" db:"id"`
	ClassCode *string   `json:"class_code,omitempty"` // If it's a class notice
	Content   string    `json:"content"`              // Potentially truncated
	CreatedAt time.Time `json:"created_at"`
}

// StudentDashboardData aggregates information for the student's dashboard.
type StudentDashboardData struct {
	EnrolledClasses []ClassSummary                 `json:"enrolled_classes"`
	RecentNotices   []NoticeSummary                `json:"recent_notices"`             // Global and for enrolled classes
	AttendanceStats *StudentAttendanceOverallStats `json:"attendance_stats,omitempty"` // Basic stats for now
}

// StudentAttendanceOverallStats provides a simple overview.
// Detailed stats for charts might be separate endpoints.
type StudentAttendanceOverallStats struct {
	TotalAttended     int     `json:"total_attended"`
	TotalClasses      int     `json:"total_classes"` // Total classes for which attendance was taken
	OverallPercentage float32 `json:"overall_percentage"`
	// PerCourseStats []CourseAttendanceStat `json:"per_course_stats,omitempty"` // For later
}
