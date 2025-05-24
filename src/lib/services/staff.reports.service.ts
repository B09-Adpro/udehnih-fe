import axios from 'axios';
import { ReportResponseDto, RejectionMessageDto } from './interface';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_URL}/api/staff`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const StaffReportService = {
  getAllReports: async (): Promise<ReportResponseDto[]> => {
    try {
      const response = await api.get<ReportResponseDto[]>('/reports');
      return response.data;
    } catch (error: any) {
      throw new Error('Network error during reports retrieval');
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
