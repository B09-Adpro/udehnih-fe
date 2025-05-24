import api from './courseApiClient';

export interface EnrollmentRequest {
  courseId: number;
  studentId: string;
}

export interface EnrollmentResponse {
  id: number;
  courseId: number;
  studentId: string;
  status: string;
  enrolledAt: string;
}

export const EnrollmentService = {
  // Enroll student (for future use)
  enrollStudent: async (data: EnrollmentRequest): Promise<EnrollmentResponse> => {
    try {
      const response = await api.post('/api/enrollments', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to enroll student');
    }
  },

  // Get student enrollments (for future use)
  getStudentEnrollments: async (studentId: string): Promise<EnrollmentResponse[]> => {
    try {
      const response = await api.get(`/api/enrollments/student/${studentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch enrollments');
    }
  }
};