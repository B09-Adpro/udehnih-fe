import reviewApi from './reviewApiClient'; 
import { CreateReviewRequest } from '../interfaces';
import { UpdateReviewRequest } from '../interfaces';
import { ReviewResponse } from '../interfaces';

export const ReviewService = {
  createReview: async (request: CreateReviewRequest): Promise<ReviewResponse> => {
    try {
      const res = await reviewApi.post('/api/reviews', request);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to create review');
    }
  },

  getReviewById: async (reviewId: string): Promise<ReviewResponse> => {
    try {
      const res = await reviewApi.get(`/api/reviews/${reviewId}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch review');
    }
  },

  getReviewsByCourse: async (courseId: number): Promise<ReviewResponse[]> => {
    try {
      const res = await reviewApi.get(`/api/reviews/course/${courseId}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch course reviews');
    }
  },

  getReviewsByStudent: async (studentId: number): Promise<ReviewResponse[]> => {
    try {
      const res = await reviewApi.get(`/api/reviews/student/${studentId}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch student reviews');
    }
  },

  updateReview: async (reviewId: string, request: UpdateReviewRequest): Promise<ReviewResponse> => {
    try {
      const res = await reviewApi.put(`/api/reviews/${reviewId}`, request);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to update review');
    }
  },

  deleteReview: async (reviewId: string): Promise<boolean> => {
    try {
      const res = await reviewApi.delete(`/api/reviews/${reviewId}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to delete review');
    }
  },

  getAverageRatingForCourse: async (courseId: number): Promise<number> => {
    try {
      const res = await reviewApi.get(`/api/reviews/course/${courseId}/average-rating`);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch average rating');
    }
  },

  validateRating: (rating: number): boolean => {
    return rating >= 1 && rating <= 5 && Number.isInteger(rating);
  },

  validateReviewText: (text: string, maxLength: number = 1000): boolean => {
    return text.length <= maxLength;
  }
};

export const ReviewUtils = {
  formatRating: (rating: number): string => {
    return `${rating.toFixed(1)} star${rating !== 1 ? 's' : ''}`;
  },

  getStarDisplay: (rating: number): string => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
  },

  calculateAverageRating: (reviews: ReviewResponse[]): number => {
    if (reviews.length === 0) return 0;
    
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10; 
  },

  groupReviewsByRating: (reviews: ReviewResponse[]): Record<number, ReviewResponse[]> => {
    return reviews.reduce((acc, review) => {
      if (!acc[review.rating]) {
        acc[review.rating] = [];
      }
      acc[review.rating].push(review);
      return acc;
    }, {} as Record<number, ReviewResponse[]>);
  },

  getRatingDistribution: (reviews: ReviewResponse[]): Array<{ rating: number; count: number; percentage: number }> => {
    const total = reviews.length;
    if (total === 0) return [];

    const distribution = [5, 4, 3, 2, 1].map(rating => {
      const count = reviews.filter(review => review.rating === rating).length;
      return {
        rating,
        count,
        percentage: Math.round((count / total) * 100)
      };
    });

    return distribution;
  },

  formatReviewDate: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  canUserModifyReview: (review: ReviewResponse, currentUserId: number): boolean => {
    return review.studentId === currentUserId;
  },

  truncateReviewText: (text: string, maxLength: number = 150): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }
};