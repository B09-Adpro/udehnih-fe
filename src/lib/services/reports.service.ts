import axios from 'axios';
import { ReportRequestDto, ReportResponseDto, AuthUser } from './interface';
import { AuthService } from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const user = AuthService.getCurrentUser();
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const ReportService = {
  hasRole: (role: string): boolean => {
    const user = AuthService.getCurrentUser();
    return user?.roles?.some(r => r === role || r === `ROLE_${role}`) || false;
  },

  isStudent: (): boolean => {
    return ReportService.hasRole('STUDENT');
  },

  isTutor: (): boolean => {
    return ReportService.hasRole('TUTOR');
  },

  isStaff: (): boolean => {
    return ReportService.hasRole('STAFF');
  },
  create: async (request: ReportRequestDto): Promise<ReportResponseDto> => {
    try {
      const response = await api.post<ReportResponseDto>('/reports', {
        ...request,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rejectionMessage: null,
        rejectionMessageText: null
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Report creation failed');
      }
      throw new Error('Network error during report creation');
    }
  },

  getUserReports: async (): Promise<ReportResponseDto[]> => {
    try {
      // Only proceed if user is authenticated
      if (!AuthService.isAuthenticated()) {
        throw new Error('Authentication required');
      }

      // Check if user has student role
      if (!ReportService.isStudent()) {
        // Return empty array if not a student
        return [];
      }

      // Get reports from API
      const response = await api.get<ReportResponseDto[]>('/reports');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to view these reports.');
      } else if (error.response?.status === 404) {
        throw new Error('User not found.');
      } else if (error.response?.status === 400) {
        // If invalid parameters, return empty array instead of throwing error
        console.warn('Invalid request parameters when fetching reports');
        return [];
      }
      throw new Error('Network error during reports retrieval');
    }
  },

  shouldShowReports: (): boolean => {
    // Show reports section only if user has STUDENT role
    return ReportService.isStudent();
  },

  getReportById: async (reportId: number): Promise<ReportResponseDto> => {
    try {
      const response = await api.get<ReportResponseDto>(`/reports/${reportId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Report not found');
      }
      throw new Error('Network error during report retrieval');
    }
  },

  updateReport: async (reportId: number, request: ReportRequestDto): Promise<ReportResponseDto> => {
    try {
      const response = await api.put<ReportResponseDto>(`/reports/${reportId}`, request);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Report not found');
      }
      throw new Error('Network error during report update');
    }
  },

  deleteReport: async (reportId: number): Promise<void> => {
    try {
      await api.delete(`/reports/${reportId}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Report not found');
      }
      throw new Error('Network error during report deletion');
    }
  }
};