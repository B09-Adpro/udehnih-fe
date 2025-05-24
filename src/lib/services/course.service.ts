import api from './courseApiClient';

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
    console.log("=== COURSE SERVICE: createCourse ===");
    console.log("Request data:", data);
    
    try {
      const response = await api.post('/api/courses', data);
      console.log("✅ Create course SUCCESS:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("❌ Create course FAILED:", error);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);
      throw new Error(error?.response?.data?.message || 'Failed to create course');
    }
  },

  // Get tutor's courses
  getTutorCourses: async (): Promise<{ courses: TutorCourse[] }> => {
    console.log("=== COURSE SERVICE: getTutorCourses ===");
    
    try {
      const response = await api.get('/api/tutors/courses');
      console.log("✅ Get tutor courses SUCCESS:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("❌ Get tutor courses FAILED:", error);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);
      console.log("Error headers:", error.response?.headers);
      
      // Jika 403 Forbidden, kemungkinan user bukan tutor yang accepted
      if (error.response?.status === 403) {
        console.log("🔥 403 FORBIDDEN - User might not be accepted tutor in backend");
      }
      
      throw new Error(error?.response?.data?.message || 'Failed to fetch courses');
    }
  },

  // Get course details by ID
  getCourseById: async (courseId: number): Promise<CourseDetail> => {
    console.log("=== COURSE SERVICE: getCourseById ===");
    console.log("Course ID:", courseId);
    
    try {
      const response = await api.get(`/api/courses/${courseId}`);
      console.log("✅ Get course by ID SUCCESS:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("❌ Get course by ID FAILED:", error);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);
      throw new Error(error?.response?.data?.message || 'Failed to fetch course details');
    }
  },

  // Update course
  updateCourse: async (courseId: number, data: CourseUpdateRequest): Promise<CourseResponse> => {
    console.log("=== COURSE SERVICE: updateCourse ===");
    console.log("Course ID:", courseId);
    console.log("Update data:", data);
    
    try {
      const response = await api.put(`/api/courses/${courseId}`, data);
      console.log("✅ Update course SUCCESS:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("❌ Update course FAILED:", error);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);
      throw new Error(error?.response?.data?.message || 'Failed to update course');
    }
  },

  // Delete course
  deleteCourse: async (courseId: number): Promise<{ message: string }> => {
    console.log("=== COURSE SERVICE: deleteCourse ===");
    console.log("Course ID:", courseId);
    
    try {
      const response = await api.delete(`/api/courses/${courseId}`);
      console.log("✅ Delete course SUCCESS:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("❌ Delete course FAILED:", error);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);
      throw new Error(error?.response?.data?.message || 'Failed to delete course');
    }
  },

  // Get enrolled students
  getEnrolledStudents: async (courseId: number): Promise<EnrolledStudent[]> => {
    console.log("=== COURSE SERVICE: getEnrolledStudents ===");
    console.log("Course ID:", courseId);
    
    try {
      const response = await api.get(`/api/courses/${courseId}/enrollments`);
      console.log("✅ Get enrolled students SUCCESS:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("❌ Get enrolled students FAILED:", error);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);
      throw new Error(error?.response?.data?.message || 'Failed to fetch enrolled students');
    }
  },

  // Submit course for review
  submitForReview: async (courseId: number): Promise<{ message: string }> => {
    console.log("=== COURSE SERVICE: submitForReview ===");
    console.log("Course ID:", courseId);
    
    try {
      const response = await api.post(`/api/courses/${courseId}/submit-review`);
      console.log("✅ Submit for review SUCCESS:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("❌ Submit for review FAILED:", error);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);
      throw new Error(error?.response?.data?.message || 'Failed to submit course for review');
    }
  }
};