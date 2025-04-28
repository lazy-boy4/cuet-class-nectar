
// Dashboard statistics
export interface DashboardStats {
  studentsCount: number;
  teachersCount: number;
  classesCount: number;
  departmentsCount: number;
}

// User models
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  department?: string;
  session?: string;
  section?: string;
  profileImage?: string;
  isClassRepresentative?: boolean;
}

// Department model
export interface Department {
  id: string;
  code: string;
  name: string;
}

// Course model
export interface Course {
  id: string;
  departmentId: string;
  code: string;
  name: string;
  credits: number;
}

// Class model
export interface Class {
  id: string;
  departmentCode: string;
  courseId: string;
  courseCode?: string;
  courseName?: string;
  section: string;
  session: string;
  teacherId?: string;
  teacherName?: string;
  schedule?: Schedule[];
}

// Schedule model
export interface Schedule {
  id: string;
  classId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
  dateTime?: string; // For upcoming schedules display
  title?: string; // For display purposes
}

// Attendance model
export interface Attendance {
  id: string;
  classId: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  comments?: string; // Optional comments on attendance
}

// Notice model
export interface Notice {
  id: string;
  title: string;
  content: string;
  isGlobal?: boolean;
  classId?: string;
  className?: string;
  createdAt: string;
  authorId?: string;
  authorName?: string;
  date?: string; // For display purposes
  author?: string; // For display purposes
}

// Enrollment model
export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  status: 'pending' | 'approved' | 'rejected';
  enrolledAt: string;
}

// Auth response model
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}
