import axios from 'axios';
import { ReportRequestDto, ReportResponseDto } from './interface';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ReportService = {
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

  getUserReports: async (studentId: string, userEmail: string, userRole: string): Promise<ReportResponseDto[]> => {
    try {
      const response = await api.get<ReportResponseDto[]>('/reports', {
        params: { studentId },
        headers: {
          'X-User-Email': userEmail,
          'X-User-Role': userRole
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid request parameters');
      }
      throw new Error('Network error during reports retrieval');
    }
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