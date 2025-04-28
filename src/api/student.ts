
import axios from 'axios';
import { mockUsers } from './mockData/users';
import { mockClasses } from './mockData/classes';
import { mockAttendance } from './mockData/attendance';
import { mockNotices } from './mockData/notices';

// Function to fetch student profile data
export const fetchStudentProfile = async (studentId: string) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would be an API call like:
    // const response = await axios.get(`/api/student/profile`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return response.data;
    
    // For now, return mock data
    const student = mockUsers.find(user => 
      user.id === studentId && user.role === 'student'
    );
    
    if (!student) {
      throw new Error('Student not found');
    }
    
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      department: student.department || '',
      session: student.session || '',
      section: student.section || '',
      profileImage: student.profileImage || '',
      isClassRepresentative: student.isClassRepresentative || false,
    };
  } catch (error) {
    console.error('Error fetching student profile:', error);
    throw error;
  }
};

// Function to fetch student's enrolled classes
export const fetchStudentClasses = async (studentId: string) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // In a real app:
    // const response = await axios.get(`/api/student/classes`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return response.data;
    
    // For mock data, filter classes that match the student's department and session
    const student = mockUsers.find(user => user.id === studentId);
    
    if (!student) {
      throw new Error('Student not found');
    }
    
    // Filter classes that match the student's department, session, and section
    const enrolledClasses = mockClasses.filter(cls => 
      cls.departmentCode === student.department && 
      cls.session === student.session
    );
    
    return enrolledClasses;
  } catch (error) {
    console.error('Error fetching student classes:', error);
    throw error;
  }
};

// Function to fetch student's attendance
export const fetchStudentAttendance = async (studentId: string, classId?: string) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // In a real app:
    // const url = classId 
    //   ? `/api/student/attendance?classId=${classId}`
    //   : `/api/student/attendance`;
    // const response = await axios.get(url, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return response.data;
    
    // For mock data
    let attendance = mockAttendance.filter(a => a.studentId === studentId);
    
    if (classId) {
      attendance = attendance.filter(a => a.classId === classId);
    }
    
    // Calculate overall attendance
    const totalEntries = attendance.length;
    const presentEntries = attendance.filter(a => a.status === 'present').length;
    
    const overall = totalEntries > 0 ? (presentEntries / totalEntries) * 100 : 0;
    
    // Calculate attendance per course
    const courseAttendance = mockClasses.map(cls => {
      const classAttendance = attendance.filter(a => a.classId === cls.id);
      const total = classAttendance.length;
      const present = classAttendance.filter(a => a.status === 'present').length;
      
      return {
        classId: cls.id,
        className: cls.courseCode || '', // Use courseCode instead of code
        percentage: total > 0 ? (present / total) * 100 : 0,
      };
    });
    
    return {
      overall: Math.round(overall),
      courses: courseAttendance,
    };
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    throw error;
  }
};

// Function to fetch notices relevant to a student
export const fetchStudentNotices = async (studentId: string) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // In a real app:
    // const response = await axios.get(`/api/notices?userId=${studentId}`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return response.data;
    
    // For mock data, get student's classes
    const student = mockUsers.find(user => user.id === studentId);
    
    if (!student) {
      throw new Error('Student not found');
    }
    
    const studentClasses = mockClasses.filter(cls => 
      cls.departmentCode === student.department && 
      cls.session === student.session
    );
    
    const studentClassIds = studentClasses.map(cls => cls.id);
    
    // Get notices that are global or for the student's classes
    const relevantNotices = mockNotices.filter(notice => 
      notice.isGlobal || 
      (notice.classId && studentClassIds.includes(notice.classId))
    );
    
    return relevantNotices;
  } catch (error) {
    console.error('Error fetching student notices:', error);
    throw error;
  }
};

// Add more student-related API functions as needed
