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

export interface CreateReviewRequest {
  courseId: number;
  reviewText: string;
  rating: number;
}

export interface UpdateReviewRequest {
  reviewText: string;
  rating: number;
}

export interface ReviewResponse {
  id: string;
  courseId: string;
  courseName: string;
  studentId: number;
  studentName: string;
  reviewText: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface UseReviewsState {
  reviews: ReviewResponse[];
  loading: boolean;
  error: string | null;
  averageRating: number;
}

export interface UseReviewsActions {
  fetchReviewsByCourse: (courseId: number) => Promise<void>;
  fetchReviewsByStudent: (studentId: number) => Promise<void>;
  createReview: (request: CreateReviewRequest) => Promise<ReviewResponse>;
  updateReview: (reviewId: string, request: UpdateReviewRequest) => Promise<ReviewResponse>;
  deleteReview: (reviewId: string) => Promise<boolean>;
  fetchAverageRating: (courseId: number) => Promise<void>;
  clearError: () => void;
  refresh: () => Promise<void>;
}

export type UseReviewsReturn = UseReviewsState & UseReviewsActions;

// Shared enums
export type UserRole = 'STUDENT' | 'TUTOR' | 'STAFF';
export type CourseStatus = 'DRAFT' | 'PENDING_REVIEW' | 'REJECTED' | 'PUBLISHED';
export type EnrollmentStatus = 'ENROLLED' | 'PENDING' | 'DROPPED' | 'PAYMENT_FAILED';