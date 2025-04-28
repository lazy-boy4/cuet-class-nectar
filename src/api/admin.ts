
import axios from 'axios';
import { DashboardStats } from '@/types';
import { mockUsers } from './mockData/users';
import { mockClasses } from './mockData/classes';
import { mockDepartments } from './mockData/departments';

// Function to fetch admin dashboard stats
export const fetchAdminStats = async (): Promise<DashboardStats> => {
  // In a real application, this would be an API call
  // For now, we'll use mock data
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Calculate stats from mock data
    const studentsCount = mockUsers.filter(user => user.role === 'student').length;
    const teachersCount = mockUsers.filter(user => user.role === 'teacher').length;
    const classesCount = mockClasses.length;
    const departmentsCount = mockDepartments.length;
    
    return {
      studentsCount,
      teachersCount,
      classesCount,
      departmentsCount,
    };
    
    // In a real application, it would be:
    // const response = await axios.get('/api/admin/stats');
    // return response.data;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    // Return default values in case of error
    return {
      studentsCount: 0,
      teachersCount: 0,
      classesCount: 0,
      departmentsCount: 0,
    };
  }
};

// Function to fetch departments for admin
export const fetchDepartmentsForAdmin = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockDepartments;
    
    // In a real application:
    // const response = await axios.get('/api/departments');
    // return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

// Function to create a new department
export const createDepartment = async (departmentData: Omit<any, 'id'>) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate a new department with a random ID
    const newDepartment = {
      id: `dept-${Date.now()}`,
      ...departmentData,
    };
    
    // In a real application:
    // const response = await axios.post('/api/departments', departmentData);
    // return response.data;
    
    return newDepartment;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

// Function to update an existing department
export const updateDepartment = async (departmentData: any) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real application:
    // const response = await axios.put(`/api/departments/${departmentData.id}`, departmentData);
    // return response.data;
    
    return departmentData;
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};

// Function to delete a department
export const deleteDepartment = async (departmentId: string) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real application:
    // await axios.delete(`/api/departments/${departmentId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};

// Function for admin authentication
export const adminLogin = async (email: string, password: string) => {
  try {
    // In a real application, this would be an API call
    // For now, we'll check against hardcoded values
    if (email === 'u2309026@student.cuet.ac.bd' && password === 'Saadctg') {
      return {
        success: true,
        token: 'mock-admin-token',
        user: {
          id: 'admin-1',
          name: 'Admin User',
          email,
          role: 'admin',
        },
      };
    } else {
      throw new Error('Invalid credentials');
    }
    
    // In a real application:
    // const response = await axios.post('/api/auth/admin-login', { email, password });
    // return response.data;
  } catch (error) {
    console.error('Error during admin login:', error);
    throw error;
  }
};

// Add other admin-related API functions as needed
