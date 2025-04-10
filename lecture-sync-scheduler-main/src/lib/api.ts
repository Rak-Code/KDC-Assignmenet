// src/lib/api.ts
import axios, { AxiosError } from 'axios';
import { Course, Instructor, Lecture, AuthResponse, CreateInstructorDto } from './types';

const API_BASE_URL = 'http://localhost:5000/api';

// Setup axios interceptors
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// Fix the setAuthToken function
const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Helper function to handle errors
const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    throw {
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data
    };
  }
  throw new Error('An unexpected error occurred');
};

// Courses
export const getCourses = async (): Promise<Course[]> => {
  try {
    const response = await axios.get<Course[]>(`${API_BASE_URL}/courses`);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    handleError(error);
    return [];
  }
};

export const createCourse = async (courseData: Omit<Course, '_id' | 'createdAt' | 'updatedAt'>): Promise<Course> => {
  try {
    const response = await axios.post<Course>(`${API_BASE_URL}/courses`, courseData);
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    handleError(error);
    throw error;
  }

};

export const updateCourse = async (id: string, courseData: Partial<Omit<Course, '_id'>>): Promise<Course> => {
  try {
    const response = await axios.put<Course>(`${API_BASE_URL}/courses/${id}`, courseData);
    return response.data;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

export const deleteCourse = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/courses/${id}`);
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

// Instructors
export const getInstructors = async (): Promise<Instructor[]> => {
  try {
    const response = await axios.get<Instructor[]>(`${API_BASE_URL}/instructors`);
    return response.data;
  } catch (error) {
    console.error("Error fetching instructors:", error);
    throw error;
  }
};

export const createInstructor = async (instructorData: CreateInstructorDto): Promise<Instructor> => {
  try {
    const response = await axios.post<Instructor>(`${API_BASE_URL}/instructors`, instructorData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateInstructor = async (id: string, instructorData: Partial<Omit<Instructor, '_id'>>): Promise<Instructor> => {
  try {
    const response = await axios.put<Instructor>(`${API_BASE_URL}/instructors/${id}`, instructorData);
    return response.data;
  } catch (error) {
    console.error("Error updating instructor:", error);
    throw error;
  }
};

export const deleteInstructor = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/instructors/${id}`);
  } catch (error) {
    console.error("Error deleting instructor:", error);
    throw error;
  }
};

// Lectures
export const getLectures = async (): Promise<Lecture[]> => {
  try {
    const response = await axios.get<Lecture[]>(`${API_BASE_URL}/lectures`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lectures:", error);
    throw error;
  }
};

export const createLecture = async (lectureData: {
  course: string;
  instructor: string;
  date: string;
  startTime: string;
  endTime: string;
  details: string;
  location?: string;
}): Promise<Lecture> => {
  try {
    // Add debug logging
    console.log('Creating lecture with data:', lectureData);
    
    // Ensure date is in ISO format
    const formattedData = {
      ...lectureData,
      date: new Date(lectureData.date).toISOString()
    };

    const response = await axios.post<Lecture>(`${API_BASE_URL}/lectures`, formattedData);
    return response.data;
  } catch (error) {
    console.error('Error creating lecture:', error);
    if (axios.isAxiosError(error)) {
      console.error('Server error details:', error.response?.data);
    }
    throw error;
  }
};

export const updateLecture = async (id: string, lectureData: Partial<Omit<Lecture, '_id'>>): Promise<Lecture> => {
  try {
    const response = await axios.put<Lecture>(`${API_BASE_URL}/lectures/${id}`, lectureData);
    return response.data;
  } catch (error) {
    console.error("Error updating lecture:", error);
    throw error;
  }
};

export const deleteLecture = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/lectures/${id}`);
  } catch (error) {
    console.error("Error deleting lecture:", error);
    throw error;
  }
};

// Authentication
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });

    const { token } = response.data;
    if (token) {
      localStorage.setItem('token', token);
      setAuthToken(token);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Failed to login';
      throw new Error(message);
    }
    throw new Error('An unexpected error occurred');
  }
};

export const registerUser = async (userData: {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'instructor';
}): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getMe = async (): Promise<Omit<AuthResponse, 'token'>> => {
  try {
    const response = await axios.get<Omit<AuthResponse, 'token'>>(`${API_BASE_URL}/auth/me`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  setAuthToken(null);
};

