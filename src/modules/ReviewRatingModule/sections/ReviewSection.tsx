"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useReviews } from '@/lib/hooks/useReview'
import { AuthService } from '@/lib/services/auth.service'
import { RatingSummarySection } from './RatingSummarySection'
import { ReviewFiltersSection } from './ReviewFiltersSection'
import { ReviewListSection } from './ReviewListSection'

interface ReviewSectionProps {
  courseId: string
}

export const ReviewSection = ({ courseId }: ReviewSectionProps) => {
  const {
    reviews,
    loading,
    error,
    averageRating,
    clearError,
    fetchAverageRating
  } = useReviews(parseInt(courseId))

  const [filter, setFilter] = useState('all')
  const [sort, setSortBy] = useState('newest')
  const [avgRatingLoading, setAvgRatingLoading] = useState(false)
  
  const currentUser = AuthService.getCurrentUser()
  const currentUserId = currentUser?.userId

  const userReview = reviews.find(r => r.studentId !== null && r.studentId === currentUserId)
  const canCreateReview = Boolean(currentUser && !userReview)

  useEffect(() => {
    const fetchAverage = async () => {
      if (reviews.length > 0) {
        setAvgRatingLoading(true)
        try {
          await fetchAverageRating(parseInt(courseId))
        } catch (error) {
          console.error('Failed to fetch average rating:', error)
        } finally {
          setAvgRatingLoading(false)
        }
      }
    }

    fetchAverage()
  }, [reviews.length, courseId, fetchAverageRating])

  const handleReviewChange = async () => {
    setAvgRatingLoading(true)
    try {
      await fetchAverageRating(parseInt(courseId))
    } finally {
      setAvgRatingLoading(false)
    }
  }

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = [...reviews]

    if (filter !== 'all') {
      filtered = filtered.filter(r => r.rating === parseInt(filter))
    }

    switch (sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating)
        break
    }

    return filtered
  }, [reviews, filter, sort])

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-32 bg-gray-200 rounded mb-4" />
          <div className="h-24 bg-gray-200 rounded mb-4" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={clearError}>
              Tutup
            </Button>
          </CardContent>
        </Card>
      )}

      {reviews.length > 0 && (
        <RatingSummarySection 
          reviews={reviews} 
          averageRating={averageRating}
          isLoading={avgRatingLoading}
        />
      )}

      {reviews.length > 0 && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-xl font-semibold">
              Ulasan ({reviews.length})
            </h3>
            <ReviewFiltersSection 
              onFilterChange={setFilter}
              onSortChange={setSortBy}
            />
          </div>

          <ReviewListSection
            courseId={courseId}
            reviews={filteredAndSortedReviews}
            currentUserId={currentUserId}
            canCreateReview={canCreateReview}
            onReviewChange={handleReviewChange}
          />

          {filteredAndSortedReviews.length === 0 && filter !== 'all' && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-600">
                  Tidak ada ulasan dengan rating {filter} bintang.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setFilter('all')}
                >
                  Tampilkan Semua Ulasan
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {reviews.length === 0 && !loading && (
        <ReviewListSection
          courseId={courseId}
          reviews={[]}
          currentUserId={currentUserId}
          canCreateReview={canCreateReview}
          onReviewChange={handleReviewChange}
        />
      )}

      {loading && reviews.length > 0 && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Memuat ulasan...</p>
        </div>
      )}
    </div>
  )
}