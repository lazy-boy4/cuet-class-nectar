import axios from 'axios';
import { 
  Classroom, 
  ClassroomCourse, 
  ClassroomMember,
  ClassroomAttendance,
  CRAttendancePermission,
  TeacherAssignedClassroom
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Helper to get auth headers
const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
};

// Generate a random 6-character classroom code
export const generateClassroomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// ========== STUDENT/CR CLASSROOM APIs ==========

// Create a new classroom (creator becomes CR)
export const createClassroom = async (data: {
  name: string;
  departmentId: string;
  section: string;
  session: string;
}): Promise<Classroom> => {
  const response = await axios.post(
    `${API_BASE_URL}/api/student/classrooms`,
    { ...data, code: generateClassroomCode() },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Join a classroom using code
export const joinClassroom = async (code: string): Promise<{ success: boolean; classroom?: Classroom; message?: string }> => {
  const response = await axios.post(
    `${API_BASE_URL}/api/student/classrooms/join`,
    { code },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Get all classrooms the student has joined or created
export const getMyClassrooms = async (): Promise<Classroom[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/api/student/classrooms`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Get a single classroom by ID
export const getClassroomById = async (classroomId: string): Promise<Classroom> => {
  const response = await axios.get(
    `${API_BASE_URL}/api/classrooms/${classroomId}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Get classroom members
export const getClassroomMembers = async (classroomId: string): Promise<ClassroomMember[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/api/classrooms/${classroomId}/members`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Leave a classroom
export const leaveClassroom = async (classroomId: string): Promise<{ success: boolean }> => {
  const response = await axios.delete(
    `${API_BASE_URL}/api/classrooms/${classroomId}/leave`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// ========== CR MANAGEMENT APIs ==========

// Add a course to classroom (CR only)
export const addCourseToClassroom = async (
  classroomId: string,
  courseData: {
    courseCode: string;
    courseName: string;
    credits: number;
  }
): Promise<ClassroomCourse> => {
  const response = await axios.post(
    `${API_BASE_URL}/api/classrooms/${classroomId}/courses`,
    courseData,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Get all courses in a classroom
export const getClassroomCourses = async (classroomId: string): Promise<ClassroomCourse[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/api/classrooms/${classroomId}/courses`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Update a course in classroom (CR only)
export const updateClassroomCourse = async (
  classroomId: string,
  courseId: string,
  courseData: Partial<ClassroomCourse>
): Promise<ClassroomCourse> => {
  const response = await axios.put(
    `${API_BASE_URL}/api/classrooms/${classroomId}/courses/${courseId}`,
    courseData,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Delete a course from classroom (CR only)
export const deleteClassroomCourse = async (
  classroomId: string,
  courseId: string
): Promise<{ success: boolean }> => {
  const response = await axios.delete(
    `${API_BASE_URL}/api/classrooms/${classroomId}/courses/${courseId}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Assign a teacher to a course (CR only)
export const assignTeacherToCourse = async (
  classroomId: string,
  courseId: string,
  teacherId: string
): Promise<{ success: boolean }> => {
  const response = await axios.post(
    `${API_BASE_URL}/api/classrooms/${classroomId}/courses/${courseId}/teachers`,
    { teacherId },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Remove a teacher from a course (CR only)
export const removeTeacherFromCourse = async (
  classroomId: string,
  courseId: string,
  teacherId: string
): Promise<{ success: boolean }> => {
  const response = await axios.delete(
    `${API_BASE_URL}/api/classrooms/${classroomId}/courses/${courseId}/teachers/${teacherId}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Remove a member from classroom (CR only)
export const removeMemberFromClassroom = async (
  classroomId: string,
  memberId: string
): Promise<{ success: boolean }> => {
  const response = await axios.delete(
    `${API_BASE_URL}/api/classrooms/${classroomId}/members/${memberId}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// ========== TEACHER APIs ==========

// Get all classrooms where teacher is assigned
export const getTeacherAssignedClassrooms = async (): Promise<TeacherAssignedClassroom[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/api/teacher/assigned-classrooms`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Get students in a classroom for attendance
export const getClassroomStudentsForAttendance = async (
  classroomId: string
): Promise<ClassroomMember[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/api/classrooms/${classroomId}/students`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Mark attendance for a classroom/course
export const markClassroomAttendance = async (
  classroomId: string,
  courseId: string,
  date: string,
  attendanceRecords: Array<{ studentId: string; status: 'present' | 'absent' | 'late' }>
): Promise<{ success: boolean }> => {
  const response = await axios.post(
    `${API_BASE_URL}/api/classrooms/${classroomId}/attendance`,
    { courseId, date, records: attendanceRecords },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Get attendance records for a classroom
export const getClassroomAttendance = async (
  classroomId: string,
  courseId?: string,
  date?: string
): Promise<ClassroomAttendance[]> => {
  const params = new URLSearchParams();
  if (courseId) params.append('courseId', courseId);
  if (date) params.append('date', date);
  
  const response = await axios.get(
    `${API_BASE_URL}/api/classrooms/${classroomId}/attendance?${params.toString()}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Update a single attendance record
export const updateAttendanceRecord = async (
  classroomId: string,
  attendanceId: string,
  status: 'present' | 'absent' | 'late'
): Promise<ClassroomAttendance> => {
  const response = await axios.put(
    `${API_BASE_URL}/api/classrooms/${classroomId}/attendance/${attendanceId}`,
    { status },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Grant CR permission to take attendance for today
export const grantCRPermission = async (
  classroomId: string,
  courseId: string,
  crId: string,
  date: string
): Promise<CRAttendancePermission> => {
  const response = await axios.post(
    `${API_BASE_URL}/api/classrooms/${classroomId}/cr-permission`,
    { courseId, crId, date },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Revoke CR permission
export const revokeCRPermission = async (
  classroomId: string,
  permissionId: string
): Promise<{ success: boolean }> => {
  const response = await axios.delete(
    `${API_BASE_URL}/api/classrooms/${classroomId}/cr-permission/${permissionId}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Check if CR has permission for a specific date/course
export const checkCRPermission = async (
  classroomId: string,
  courseId: string,
  date: string
): Promise<{ hasPermission: boolean; permission?: CRAttendancePermission }> => {
  const response = await axios.get(
    `${API_BASE_URL}/api/classrooms/${classroomId}/cr-permission?courseId=${courseId}&date=${date}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// ========== UTILITY APIs ==========

// Get all teachers (for assigning to courses)
export const getAllTeachers = async (): Promise<Array<{ id: string; name: string; email: string }>> => {
  const response = await axios.get(
    `${API_BASE_URL}/api/teachers`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Get all departments (for creating classroom)
export const getAllDepartments = async (): Promise<Array<{ id: string; code: string; name: string }>> => {
  const response = await axios.get(
    `${API_BASE_URL}/api/departments`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};
