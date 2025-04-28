
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
  departmentCode?: string; // Added for mock data compatibility
  code: string;
  name: string;
  credits: number;
}

// Class model
export interface Class {
  id: string;
  departmentCode: string;
  departmentId?: string; // Added for mock data compatibility
  courseId: string;
  courseCode?: string;
  courseName?: string;
  section: string;
  session: string;
  teacherId?: string;
  teacherName?: string;
  schedule?: Schedule[];
  code?: string; // Added for mock data compatibility
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
  day?: string; // Added for mock data compatibility
  room?: string; // Added for mock data compatibility
}

// Attendance model
export interface Attendance {
  id: string;
  classId: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  comments?: string; // Optional comments on attendance
  className?: string; // Added for mock data compatibility
  studentName?: string; // Added for mock data compatibility
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
  createdBy?: string; // Added for mock data compatibility
  creatorName?: string; // Added for mock data compatibility
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
  className?: string; // Added for mock data compatibility
  studentName?: string; // Added for mock data compatibility
  requestDate?: string; // Added for mock data compatibility
  responseDate?: string; // Added for mock data compatibility
}

// Auth response model
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}
