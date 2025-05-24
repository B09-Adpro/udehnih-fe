import api from './api';

export interface TutorApplicationRequest {
  experience: string;
  qualifications: string;
  bio: string;
}

export interface TutorApplicationResponse {
  message: string;
  applicationId: number;
  status: 'PENDING' | 'ACCEPTED' | 'DENIED';
}

export interface TutorApplicationStatus {
  applicationId: number;
  status: 'PENDING' | 'ACCEPTED' | 'DENIED';
  submittedAt: string;
  experience: string;
  qualifications: string;
}

export const TutorService = {
  // Apply as tutor
  applyAsTutor: async (data: TutorApplicationRequest): Promise<TutorApplicationResponse> => {
    try {
      const response = await api.post('/api/tutors/apply', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to submit tutor application');
    }
  },

  // Check application status
  getApplicationStatus: async (): Promise<TutorApplicationStatus> => {
    try {
      const response = await api.get('/api/tutors/status');
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to get application status');
    }
  },

  // Cancel application
  cancelApplication: async (): Promise<{ message: string }> => {
    try {
      const response = await api.delete('/api/tutors/apply');
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to cancel application');
    }
  },
};