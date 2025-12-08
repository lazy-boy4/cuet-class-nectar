
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
  role: 'student' | 'teacher' | 'admin' | 'cr';
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
  deptCode?: string; // Added for departmental notices
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
  className?: string;
  studentName?: string;
  requestDate?: string;
  responseDate?: string;
}

// Auth response model
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

// ========== CLASSROOM FEATURE TYPES ==========

// Classroom model (Google Classroom-like)
export interface Classroom {
  id: string;
  name: string;
  code: string; // 6-character unique join code
  departmentId: string;
  departmentCode?: string;
  departmentName?: string;
  section: string;
  session: string;
  crId: string;
  crName?: string;
  createdAt: string;
  memberCount?: number;
  courseCount?: number;
}

// Classroom Course (courses linked to a classroom)
export interface ClassroomCourse {
  id: string;
  classroomId: string;
  courseId?: string;
  courseCode: string;
  courseName: string;
  credits: number;
  teacherIds: string[];
  teachers?: ClassroomTeacher[];
}

// Classroom Teacher (teacher assigned to a course in classroom)
export interface ClassroomTeacher {
  id: string;
  userId: string;
  name: string;
  email: string;
}

// Classroom Member (student in a classroom)
export interface ClassroomMember {
  id: string;
  classroomId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentIdNumber?: string;
  joinedAt: string;
  status: 'active' | 'pending' | 'removed';
  isCR?: boolean;
}

// CR Attendance Permission (daily permission for CR to take attendance)
export interface CRAttendancePermission {
  id: string;
  classroomId: string;
  courseId: string;
  crId: string;
  grantedBy: string; // teacher ID
  grantedByName?: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

// Classroom Attendance Record
export interface ClassroomAttendance {
  id: string;
  classroomId: string;
  courseId: string;
  studentId: string;
  studentName?: string;
  studentIdNumber?: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  markedBy: string; // teacher or CR ID
  markedByName?: string;
  createdAt: string;
  updatedAt?: string;
}

// Teacher's Assigned Classroom view
export interface TeacherAssignedClassroom {
  id: string;
  classroomId: string;
  classroomName: string;
  classroomCode: string;
  section: string;
  session: string;
  departmentName: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  studentCount: number;
  crName?: string;
}
