
// Re-export all API functions for easier imports
export * from './admin';
export * from './student';

// Mock function to fetch admin dashboard stats
export const fetchAdminDashboardStats = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return {
    studentsCount: 450,
    teachersCount: 65,
    classesCount: 120,
    departmentsCount: 8
  };
};

// Mock function to fetch student enrollments
export const fetchEnrollments = async (studentId?: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const { mockEnrollments } = await import('./mockData/enrollments');
  
  if (studentId) {
    return mockEnrollments.filter(enrollment => enrollment.studentId === studentId);
  }
  
  // Return mock enrollments data
  return mockEnrollments;
};

// Mock function to fetch notices
export const fetchNotices = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Import mock notices
  const { mockNotices } = await import('./mockData/notices');
  
  // Return mock notices data
  return mockNotices;
};

// Mock function to fetch attendance
export const fetchAttendance = async (classId?: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Import mock attendance data
  const { mockAttendance } = await import('./mockData/attendance');
  
  if (classId) {
    return mockAttendance.filter(record => record.classId === classId);
  }
  
  // Return all attendance data
  return mockAttendance;
};
