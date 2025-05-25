import axios from 'axios';
import { ReportResponseDto, RejectionMessageDto } from './interface';
import { AuthService } from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_URL}/api/staff`,
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

export const StaffReportService = {
  getAllReports: async (): Promise<ReportResponseDto[]> => {
    try {
      // Check if user is authenticated
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Authentication required');
      }

      // Check if user has staff role
      const hasStaffRole = currentUser.roles?.some(role => 
        role === 'ROLE_STAFF' || role === 'STAFF'
      );
      
      if (!hasStaffRole) {
        throw new Error('Access denied: STAFF role required');
      }

      const response = await api.get<ReportResponseDto[]>('/reports');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied: STAFF role required');
      } else if (error.response?.data) {
        throw new Error(error.response.data);
      }
      throw new Error(error.message || 'Network error during reports retrieval');
    }
  },

  processReport: async (reportId: number, rejectionMessage?: RejectionMessageDto): Promise<ReportResponseDto> => {
    try {
      const response = await api.put<ReportResponseDto>(`/reports/${reportId}`, rejectionMessage);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Report not found');
      }
      throw new Error('Network error during report processing');
    }
  }
};
