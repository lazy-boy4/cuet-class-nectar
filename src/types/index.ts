
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
}

// Dashboard stats type
export interface DashboardStats {
  studentsCount: number;
  teachersCount: number;
  classesCount: number;
  departmentsCount: number;
}
