export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Shared enums
export type UserRole = 'STUDENT' | 'TUTOR' | 'STAFF';
export type CourseStatus = 'DRAFT' | 'PENDING_REVIEW' | 'REJECTED' | 'PUBLISHED';
export type EnrollmentStatus = 'ENROLLED' | 'PENDING' | 'DROPPED' | 'PAYMENT_FAILED';