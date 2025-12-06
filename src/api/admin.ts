
import api from '@/lib/axios';
import { DashboardStats, Department, Class, Course, User } from '@/types';

// Dashboard Stats
export const fetchAdminStats = async (): Promise<DashboardStats> => {
  // Backend doesn't have a dedicated "stats" endpoint yet, 
  // so we might need to fetch counts separately or implement a stats endpoint.
  // For now, let's keep the mock implementation logic but with real data fetching where possible,
  // OR just fetch lists and count them (inefficient but works for now).
  // Actually, let's stick to mock stats for dashboard to avoid heavy loading until backend adds /stats.
  // TODO: Implement /admin/stats endpoint in backend.

  // Returning mock stats as placeholder to not break dashboard immediately
  return {
    studentsCount: 0, // Placeholder
    teachersCount: 0, // Placeholder
    classesCount: 0,  // Placeholder
    departmentsCount: 0, // Placeholder
  };
};

/* --- Departments --- */

export const fetchDepartmentsForAdmin = async (): Promise<Department[]> => {
  const response = await api.get('/api/admin/departments');
  // Backend likely returns { id, code, name } which matches frontend interface.
  // But verifying json tags in Go models is safe practice. 
  // detailed check: Department struct usually has json:"id", json:"name", json:"code".
  return response.data;
};

export const createDepartment = async (departmentData: Omit<Department, 'id'>) => {
  const response = await api.post('/api/admin/departments', departmentData);
  return response.data;
};

export const updateDepartment = async (departmentData: Department) => {
  const response = await api.put(`/api/admin/departments/${departmentData.id}`, departmentData);
  return response.data;
};

export const deleteDepartment = async (departmentId: string) => {
  const response = await api.delete(`/api/admin/departments/${departmentId}`);
  return response.data;
};

/* --- Courses --- */

const mapBackendCourseToFrontend = (backendCourse: any): Course => ({
  id: backendCourse.id,
  departmentId: backendCourse.dept_code, // Assuming dept_code is used as ID reference or foreign key
  departmentCode: backendCourse.dept_code,
  code: backendCourse.code,
  name: backendCourse.name,
  credits: backendCourse.credits || 3.0, // Default if missing
});

export const fetchCoursesForAdmin = async (): Promise<Course[]> => {
  const response = await api.get('/api/admin/courses');
  return response.data.map(mapBackendCourseToFrontend);
};

export const createCourse = async (courseData: Omit<Course, 'id'>) => {
  // Transform frontend data to backend expectation if needed
  // Backend expects: { code, name, dept_code, credits }
  const payload = {
    code: courseData.code,
    name: courseData.name,
    dept_code: courseData.departmentCode || courseData.departmentId,
    credits: courseData.credits,
  };
  const response = await api.post('/api/admin/courses', payload);
  return mapBackendCourseToFrontend(response.data);
};

export const updateCourse = async (courseData: Course) => {
  const payload = {
    code: courseData.code,
    name: courseData.name,
    dept_code: courseData.departmentCode || courseData.departmentId,
    credits: courseData.credits,
  };
  const response = await api.put(`/api/admin/courses/${courseData.id}`, payload);
  return mapBackendCourseToFrontend(response.data);
};

export const deleteCourse = async (courseId: string) => {
  const response = await api.delete(`/api/admin/courses/${courseId}`);
  return response.data;
};

/* --- Classes --- */

const mapBackendClassToFrontend = (backendClass: any): Class => ({
  id: backendClass.id,
  departmentCode: backendClass.dept_code, // Class table has dept_code
  courseId: backendClass.course_id,
  section: backendClass.section,
  session: backendClass.batch, // 'batch' in DB maps to 'session' in frontend usually
  teacherId: backendClass.teacher_id, // If returned
  // Frontend might expect courseName/code populated. Backend might return it via join or separate fields.
  // If backend returns joined data, map it. Otherwise might need to lookup from courses list.
  // Assuming DB view or join returns course_name, course_code if implied.
  courseName: backendClass.course_name,
  courseCode: backendClass.course_code,
  code: `${backendClass.dept_code}-${backendClass.section}`, // Derived
});

export const fetchClassesForAdmin = async (): Promise<Class[]> => {
  const response = await api.get('/api/admin/classes');
  return response.data.map(mapBackendClassToFrontend);
};

export const createClass = async (classData: Omit<Class, 'id'>) => {
  const payload = {
    course_id: classData.courseId,
    dept_code: classData.departmentCode,
    section: classData.section,
    batch: classData.session,
  };
  const response = await api.post('/api/admin/classes', payload);
  return mapBackendClassToFrontend(response.data);
};

export const updateClass = async (classData: Class) => {
  const payload = {
    course_id: classData.courseId,
    dept_code: classData.departmentCode,
    section: classData.section,
    batch: classData.session,
  };
  const response = await api.put(`/api/admin/classes/${classData.id}`, payload);
  return mapBackendClassToFrontend(response.data);
};

export const deleteClass = async (classId: string) => {
  const response = await api.delete(`/api/admin/classes/${classId}`);
  return response.data;
};

/* --- Users --- */

// Helper to map backend user to frontend user
const mapBackendUserToFrontend = (backendUser: any): User => ({
  id: backendUser.id,
  name: backendUser.full_name,
  email: backendUser.email,
  role: backendUser.role,
  department: backendUser.dept_code,
  session: backendUser.batch,
  section: backendUser.section,
  profileImage: backendUser.picture_url,
  isClassRepresentative: backendUser.role === 'cr',
});

export const fetchUsersForAdmin = async (): Promise<User[]> => {
  const response = await api.get('/api/admin/users');
  return response.data.map(mapBackendUserToFrontend);
};

export const createUser = async (userData: any) => {
  // Mapper for outgoing data might be needed if backend expects different structure than what frontend form sends
  // For now assuming userData matches backend expectations or is mapped in the component
  const response = await api.post('/api/admin/users', userData);
  return mapBackendUserToFrontend(response.data);
};

export const updateUser = async (userId: string, userData: any) => {
  const response = await api.put(`/api/admin/users/${userId}`, userData);
  return mapBackendUserToFrontend(response.data);
};

export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/api/admin/users/${userId}`);
  return response.data;
};

export const promoteStudentToCR = async (userId: string) => {
  const response = await api.post(`/api/admin/users/${userId}/promote-cr`);
  return mapBackendUserToFrontend(response.data.user);
};

export const demoteCRToStudent = async (userId: string) => {
  const response = await api.post(`/api/admin/users/${userId}/demote-cr`);
  return mapBackendUserToFrontend(response.data.user);
};

/* --- Class Teacher Assignment --- */

export const assignTeachersToClass = async (classId: string, teacherIds: string[]) => {
  const response = await api.post('/api/admin/class-teacher-assignments/assign', {
    class_id: classId,
    teacher_ids: teacherIds
  });
  return response.data;
};

export const unassignTeachersFromClass = async (classId: string, teacherIds: string[]) => {
  const response = await api.post('/api/admin/class-teacher-assignments/unassign', {
    class_id: classId,
    teacher_ids: teacherIds
  });
  return response.data;
};

export const fetchTeachersByClass = async (classId: string) => {
  const response = await api.get(`/api/admin/classes/${classId}/teachers`);
  return response.data;
};

/* --- Bulk Upload --- */
export const bulkUploadStudents = async (formData: FormData) => {
  const response = await api.post('/api/admin/students/bulk-upload-profiles', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/* --- Auth (Admin Login) --- */
// adminLogin is not needed here as standard login handles role-based redirection, 
// and there is no separate admin login API in backend currently (it's unified).
// But we can keep an optional wrapper if strictly needed by existing code.

