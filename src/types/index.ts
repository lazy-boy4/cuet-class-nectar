
// User-related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  department?: string;
  session?: string;
  section?: string;
  profileImage?: string;
  isClassRepresentative?: boolean;
}

// Department-related types
export interface Department {
  id: string;
  code: string;
  name: string;
}

// Course-related types
export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  departmentId: string;
  departmentCode?: string;
}

// Class-related types
export interface Class {
  id: string;
  departmentId: string;
  departmentCode?: string;
  courseId: string;
  courseCode?: string;
  courseName?: string;
  session: string;
  section: string;
  code: string;
  teacherId?: string;
  teacherName?: string;
  name?: string; // Added to support TeacherClassManagement
}

// Notice-related types
export interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
  creatorName?: string;
  classId?: string;
  className?: string;
  isGlobal: boolean;
  date?: string; // Added to support ClassDetails
  author?: string; // Added to support ClassDetails
}

// Attendance-related types
export interface Attendance {
  id: string;
  classId: string;
  className?: string;
  date: string;
  studentId: string;
  studentName?: string;
  status: "present" | "absent" | "late";
  comments?: string; // Added to support ClassDetails
}

// Enrollment-related types
export interface Enrollment {
  id: string;
  classId: string;
  className?: string;
  studentId: string;
  studentName?: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  responseDate?: string;
}

// Schedule-related types
export interface Schedule {
  id: string;
  classId: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  dateTime?: string; // Added to support ClassDetails and TeacherClassManagement
  title?: string; // Added to support ClassDetails
}

// Dashboard stats type
export interface DashboardStats {
  studentsCount: number;
  teachersCount: number;
  classesCount: number;
  departmentsCount: number;
}

// Student stats for API integration
export interface StudentStats {
  enrolledClasses: number;
  overallAttendance: number;
  upcomingAssignments: number;
  unreadNotices: number;
}

// Teacher stats for API integration
export interface TeacherStats {
  assignedClasses: number;
  studentsCount: number;
  upcomingClasses: number;
  pendingAssignments: number;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Admin assignment type
export interface TeacherAssignment {
  id: string;
  teacherId: string;
  teacherName?: string;
  classId: string;
  className?: string;
  assignedAt: string;
}
