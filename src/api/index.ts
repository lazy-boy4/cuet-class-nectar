
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
export const fetchEnrollments = async (studentId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return mock enrollments data
  return [
    { id: 'enr-1', studentId: studentId, classId: 'class-1', status: 'approved', enrolledAt: '2023-09-01' },
    { id: 'enr-2', studentId: studentId, classId: 'class-2', status: 'approved', enrolledAt: '2023-09-01' },
    { id: 'enr-3', studentId: studentId, classId: 'class-3', status: 'pending', enrolledAt: '2023-09-03' }
  ];
};

// Mock function to fetch notices
export const fetchNotices = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock notices data
  return [
    { 
      id: 'notice-1', 
      title: 'Midterm Exam Schedule', 
      content: 'Midterm exams will start from October 15th. Please check the schedule.', 
      isGlobal: true, 
      createdAt: '2023-10-01', 
      authorName: 'Academic Office' 
    },
    { 
      id: 'notice-2', 
      title: 'Assignment Deadline Extended', 
      content: 'The deadline for CSE-101 assignment has been extended to October 10th.', 
      classId: 'class-1', 
      createdAt: '2023-10-02', 
      authorName: 'Dr. Rahman' 
    },
    { 
      id: 'notice-3', 
      title: 'Lab Report Submission', 
      content: 'Please submit your CSE-102 lab reports by this Friday.', 
      classId: 'class-2', 
      createdAt: '2023-10-03', 
      authorName: 'Md. Karim' 
    }
  ];
};

// Mock function to fetch attendance
export const fetchAttendance = async (classId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Return mock attendance data
  return [
    { id: 'att-1', classId: classId, studentId: 'student-1', date: '2023-09-05', status: 'present' },
    { id: 'att-2', classId: classId, studentId: 'student-1', date: '2023-09-07', status: 'present' },
    { id: 'att-3', classId: classId, studentId: 'student-1', date: '2023-09-12', status: 'absent' },
    { id: 'att-4', classId: classId, studentId: 'student-1', date: '2023-09-14', status: 'late' },
    { id: 'att-5', classId: classId, studentId: 'student-1', date: '2023-09-19', status: 'present' }
  ];
};
