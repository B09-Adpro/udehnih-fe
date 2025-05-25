export interface AuthUser {
  token: string;
  refreshToken: string;
  userId: number;
  email: string;
  name: string;
  roles: string[];
  [key: string]: any;
}

export interface ReportRequestDto {
  title: string;
  detail: string;
  status?: string;
}

export interface ReportResponseDto {
  reportId: number;
  studentId: string;
  studentName: string;
  title: string;
  detail: string;
  status: string;
  rejectionMessage: string | null;
  rejectionMessageText: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RejectionMessageDto {
  rejectionMessage: string;
}

export interface RejectionMessageEnum {
  name: string; // The enum name (e.g., "INCOMPLETE_DETAIL")
  message: string; // The display message (e.g., "Detail laporan kurang lengkap")
}