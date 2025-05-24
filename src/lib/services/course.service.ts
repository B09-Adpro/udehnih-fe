import api from './api';

export interface CourseCreateRequest {
  title: string;
  description: string;
  category: string;
  price: number;
}

export interface CourseUpdateRequest {
  title?: string;
  description?: string;
  price?: number;
}

export interface CourseResponse {
  message: string;
  courseId: number;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'REJECTED' | 'PUBLISHED';
}

export interface TutorCourse {
  id: number;
  title: string;
  category: string;
  price: number;
  enrollmentCount: number;
  createdAt: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'REJECTED' | 'PUBLISHED';
}

export interface CourseDetail extends TutorCourse {
  description: string;
  tutorId: string;
  updatedAt: string;
}

export interface EnrolledStudent {
  studentId: string;
  studentName: string;
  enrolledAt: string;
}

export const CourseService = {
  // Create new course
  createCourse: async (data: CourseCreateRequest): Promise<CourseResponse> => {
    try {
      const response = await api.post('/api/courses', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to create course');
    }
  },

  // Get tutor's courses
  getTutorCourses: async (): Promise<{ courses: TutorCourse[] }> => {
    try {
      const response = await api.get('/api/tutors/courses');
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch courses');
    }
  },

  // Get course details by ID
  getCourseById: async (courseId: number): Promise<CourseDetail> => {
    try {
      const response = await api.get(`/api/courses/${courseId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch course details');
    }
  },

  // Update course
  updateCourse: async (courseId: number, data: CourseUpdateRequest): Promise<CourseResponse> => {
    try {
      const response = await api.put(`/api/courses/${courseId}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to update course');
    }
  },

  // Delete course
  deleteCourse: async (courseId: number): Promise<{ message: string }> => {
    try {
      const response = await api.delete(`/api/courses/${courseId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to delete course');
    }
  },

  // Get enrolled students
  getEnrolledStudents: async (courseId: number): Promise<EnrolledStudent[]> => {
    try {
      const response = await api.get(`/api/courses/${courseId}/enrollments`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch enrolled students');
    }
  },

  // Submit course for review
  submitForReview: async (courseId: number): Promise<{ message: string }> => {
    try {
      const response = await api.post(`/api/courses/${courseId}/submit-review`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to submit course for review');
    }
  }
};