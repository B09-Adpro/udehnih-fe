import { useState, useEffect, useCallback } from 'react';
import { ReviewResponse, CreateReviewRequest, UpdateReviewRequest } from '../interfaces';
import { AuthService } from '../services/auth.service';
import { ReviewService } from '../services/review.service';
import { UseReviewsState } from '../interfaces';
import { UseReviewsReturn } from '../interfaces';


export const useReviews = (initialCourseId?: number): UseReviewsReturn => {
  const [state, setState] = useState<UseReviewsState>({
    reviews: [],
    loading: false,
    error: null,
    averageRating: 0
  });

  const [lastFetchType, setLastFetchType] = useState<'course' | 'student' | null>(null);
  const [lastFetchId, setLastFetchId] = useState<number | null>(null);

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  };

  const setReviews = (reviews: ReviewResponse[]) => {
    setState(prev => ({ ...prev, reviews, loading: false, error: null }));
  };

  const setAverageRating = (averageRating: number) => {
    setState(prev => ({ ...prev, averageRating }));
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchReviewsByCourse = useCallback(async (courseId: number) => {
    setLoading(true);
    setLastFetchType('course');
    setLastFetchId(courseId);
    
    try {
      const reviews = await ReviewService.getReviewsByCourse(courseId);
      setReviews(reviews);
    } catch (error: any) {
      setError(error.message);
    }
  }, []);

  const fetchReviewsByStudent = useCallback(async (studentId: number) => {
    setLoading(true);
    setLastFetchType('student');
    setLastFetchId(studentId);
    
    try {
      const reviews = await ReviewService.getReviewsByStudent(studentId);
      setReviews(reviews);
    } catch (error: any) {
      setError(error.message);
    }
  }, []);

  const fetchAverageRating = useCallback(async (courseId: number) => {
    try {
      const rating = await ReviewService.getAverageRatingForCourse(courseId);
      setAverageRating(rating);
    } catch (error: any) {
      console.error('Failed to fetch average rating:', error.message);
    }
  }, []);

  const createReview = useCallback(async (request: CreateReviewRequest): Promise<ReviewResponse> => {
    setLoading(true);
    
    try {
      
      if (!ReviewService.validateRating(request.rating)) {
        throw new Error('Rating must be between 1 and 5');
      }

      
      if (!ReviewService.validateReviewText(request.reviewText)) {
        throw new Error('Review text is too long');
      }

      const newReview = await ReviewService.createReview(request);
      
      
      setState(prev => ({
        ...prev,
        reviews: [newReview, ...prev.reviews],
        loading: false,
        error: null
      }));

      
      if (lastFetchType === 'course' && lastFetchId === request.courseId) {
        fetchAverageRating(request.courseId);
      }

      return newReview;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  }, [lastFetchType, lastFetchId, fetchAverageRating]);

  const updateReview = useCallback(async (reviewId: string, request: UpdateReviewRequest): Promise<ReviewResponse> => {
    setLoading(true);
    
    try {
      
      if (!ReviewService.validateRating(request.rating)) {
        throw new Error('Rating must be between 1 and 5');
      }

      
      if (!ReviewService.validateReviewText(request.reviewText)) {
        throw new Error('Review text is too long');
      }

      const updatedReview = await ReviewService.updateReview(reviewId, request);
      
      
      setState(prev => ({
        ...prev,
        reviews: prev.reviews.map(review => 
          review.id === reviewId ? updatedReview : review
        ),
        loading: false,
        error: null
      }));

      
      if (lastFetchType === 'course' && lastFetchId) {
        fetchAverageRating(lastFetchId);
      }

      return updatedReview;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  }, [lastFetchId, fetchAverageRating]);

  const deleteReview = useCallback(async (reviewId: string): Promise<boolean> => {
    const reviewToDelete = state.reviews.find(r => r.id === reviewId);
    if (!reviewToDelete) {
      throw new Error('Review not found');
    }

    
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || reviewToDelete.studentId !== currentUser.user?.id) {
      throw new Error('Unauthorized to delete this review');
    }

    setLoading(true);
    
    try {
      const success = await ReviewService.deleteReview(reviewId);
      
      if (success) {
        
        setState(prev => ({
          ...prev,
          reviews: prev.reviews.filter(review => review.id !== reviewId),
          loading: false,
          error: null
        }));

        
        if (lastFetchType === 'course' && lastFetchId) {
          fetchAverageRating(lastFetchId);
        }
      }

      return success;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  }, [state.reviews, lastFetchType, lastFetchId, fetchAverageRating]);

  const refresh = useCallback(async () => {
    if (lastFetchType && lastFetchId) {
      if (lastFetchType === 'course') {
        await fetchReviewsByCourse(lastFetchId);
        await fetchAverageRating(lastFetchId);
      } else if (lastFetchType === 'student') {
        await fetchReviewsByStudent(lastFetchId);
      }
    }
  }, [lastFetchType, lastFetchId, fetchReviewsByCourse, fetchReviewsByStudent, fetchAverageRating]);

  
  useEffect(() => {
    if (initialCourseId) {
      fetchReviewsByCourse(initialCourseId);
      fetchAverageRating(initialCourseId);
    }
  }, [initialCourseId, fetchReviewsByCourse, fetchAverageRating]);

  return {
    ...state,
    fetchReviewsByCourse,
    fetchReviewsByStudent,
    createReview,
    updateReview,
    deleteReview,
    fetchAverageRating,
    clearError,
    refresh
  };
};


export const useReview = (reviewId?: string) => {
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReview = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedReview = await ReviewService.getReviewById(id);
      setReview(fetchedReview);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (reviewId) {
      fetchReview(reviewId);
    }
  }, [reviewId, fetchReview]);

  return {
    review,
    loading,
    error,
    fetchReview,
    clearError: () => setError(null)
  };
};