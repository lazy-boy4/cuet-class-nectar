
import { 
  User, 
  Department, 
  Course, 
  Class, 
  Notice, 
  Attendance, 
  Enrollment, 
  Schedule,
  DashboardStats 
} from "@/types";

// Mock data for testing
import { mockUsers } from "./mockData/users";
import { mockDepartments } from "./mockData/departments";
import { mockCourses } from "./mockData/courses";
import { mockClasses } from "./mockData/classes";
import { mockNotices } from "./mockData/notices";
import { mockAttendance } from "./mockData/attendance";
import { mockEnrollments } from "./mockData/enrollments";
import { mockSchedules } from "./mockData/schedules";

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dashboard API functions
export const fetchAdminDashboardStats = async (): Promise<DashboardStats> => {
  await delay(500);
  return {
    studentsCount: mockUsers.filter(user => user.role === "student").length,
    teachersCount: mockUsers.filter(user => user.role === "teacher").length,
    classesCount: mockClasses.length,
    departmentsCount: mockDepartments.length,
  };
};

// Department API functions
export const fetchDepartments = async (): Promise<Department[]> => {
  await delay(500);
  return mockDepartments;
};

export const createDepartment = async (department: Omit<Department, "id">): Promise<Department> => {
  await delay(500);
  const newDepartment = { ...department, id: `dept-${Date.now()}` };
  return newDepartment;
};

export const updateDepartment = async (department: Department): Promise<Department> => {
  await delay(500);
  return department;
};

export const deleteDepartment = async (id: string): Promise<boolean> => {
  await delay(500);
  return true;
};

// Course API functions
export const fetchCourses = async (): Promise<Course[]> => {
  await delay(500);
  return mockCourses;
};

export const createCourse = async (course: Omit<Course, "id">): Promise<Course> => {
  await delay(500);
  const newCourse = { ...course, id: `course-${Date.now()}` };
  return newCourse;
};

export const updateCourse = async (course: Course): Promise<Course> => {
  await delay(500);
  return course;
};

export const deleteCourse = async (id: string): Promise<boolean> => {
  await delay(500);
  return true;
};

// Class API functions
export const fetchClasses = async (): Promise<Class[]> => {
  await delay(500);
  return mockClasses;
};

export const createClass = async (classObj: Omit<Class, "id">): Promise<Class> => {
  await delay(500);
  const newClass = { ...classObj, id: `class-${Date.now()}` };
  return newClass;
};

export const updateClass = async (classObj: Class): Promise<Class> => {
  await delay(500);
  return classObj;
};

export const deleteClass = async (id: string): Promise<boolean> => {
  await delay(500);
  return true;
};

// User API functions
export const fetchUsers = async (): Promise<User[]> => {
  await delay(500);
  return mockUsers;
};

export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  await delay(500);
  const newUser = { ...user, id: `user-${Date.now()}` };
  return newUser;
};

export const updateUser = async (user: User): Promise<User> => {
  await delay(500);
  return user;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  await delay(500);
  return true;
};

// Notice API functions
export const fetchNotices = async (classId?: string): Promise<Notice[]> => {
  await delay(500);
  if (classId) {
    return mockNotices.filter(notice => notice.classId === classId || notice.isGlobal);
  }
  return mockNotices;
};

export const createNotice = async (notice: Omit<Notice, "id" | "createdAt">): Promise<Notice> => {
  await delay(500);
  const newNotice = { 
    ...notice, 
    id: `notice-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  return newNotice;
};

// Attendance API functions
export const fetchAttendance = async (classId: string, date?: string): Promise<Attendance[]> => {
  await delay(500);
  let filtered = mockAttendance.filter(a => a.classId === classId);
  if (date) {
    filtered = filtered.filter(a => a.date === date);
  }
  return filtered;
};

export const submitAttendance = async (attendance: Omit<Attendance, "id">[]): Promise<boolean> => {
  await delay(500);
  return true;
};

// Enrollment API functions
export const fetchEnrollments = async (studentId?: string, classId?: string): Promise<Enrollment[]> => {
  await delay(500);
  let filtered = mockEnrollments;
  if (studentId) {
    filtered = filtered.filter(e => e.studentId === studentId);
  }
  if (classId) {
    filtered = filtered.filter(e => e.classId === classId);
  }
  return filtered;
};

export const createEnrollment = async (enrollment: Omit<Enrollment, "id" | "requestDate">): Promise<Enrollment> => {
  await delay(500);
  const newEnrollment = {
    ...enrollment,
    id: `enrollment-${Date.now()}`,
    requestDate: new Date().toISOString(),
  };
  return newEnrollment;
};

export const updateEnrollmentStatus = async (id: string, status: "approved" | "rejected"): Promise<Enrollment> => {
  await delay(500);
  const enrollment = mockEnrollments.find(e => e.id === id);
  if (!enrollment) throw new Error("Enrollment not found");
  
  return {
    ...enrollment,
    status,
    responseDate: new Date().toISOString(),
  };
};

// Schedule API functions
export const fetchSchedules = async (classId: string): Promise<Schedule[]> => {
  await delay(500);
  return mockSchedules.filter(s => s.classId === classId);
};

export const createSchedule = async (schedule: Omit<Schedule, "id">): Promise<Schedule> => {
  await delay(500);
  const newSchedule = { ...schedule, id: `schedule-${Date.now()}` };
  return newSchedule;
};

// Teacher-Class assignment
export const assignTeacher = async (teacherId: string, classId: string): Promise<boolean> => {
  await delay(500);
  return true;
};

export const unassignTeacher = async (classId: string): Promise<boolean> => {
  await delay(500);
  return true;
};

// CR promotion
export const toggleCRStatus = async (studentId: string, isCR: boolean): Promise<User> => {
  await delay(500);
  const user = mockUsers.find(u => u.id === studentId);
  if (!user) throw new Error("Student not found");
  
  return {
    ...user,
    isClassRepresentative: isCR,
  };
};
