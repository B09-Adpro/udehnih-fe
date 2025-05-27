import React, { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ReviewCard } from '../components/ReviewCard'
import { EditReviewForm } from '../components/EditReviewForm'
import { CreateReviewForm } from '../components/CreateReviewForm'
import { useReviews } from '@/lib/hooks/useReview'

interface Review {
  id: string
  studentId: number
  studentName: string
  rating: number
  reviewText: string
  createdAt: string
  updatedAt: string
}

interface ReviewListSectionProps {
  courseId: string
  reviews: Review[]
  currentUserId?: number
  canCreateReview: boolean
  onReviewChange?: () => void
}

export const ReviewListSection = ({ 
  courseId, 
  reviews, 
  currentUserId, 
  canCreateReview,
  onReviewChange
}: ReviewListSectionProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [loadingReviewId, setLoadingReviewId] = useState<string | null>(null)
  const [updatingReviewId, setUpdatingReviewId] = useState<string | null>(null)
  const { deleteReview } = useReviews()

  const handleDeleteReview = async (reviewId: string) => {
    setLoadingReviewId(reviewId)
    try {
      await deleteReview(reviewId)
      onReviewChange?.()
    } catch (error: any) {
      console.error('Failed to delete review:', error)
    } finally {
      setLoadingReviewId(null)
    }
  }

  const handleUpdateStart = (reviewId: string) => {
    setUpdatingReviewId(reviewId)
  }

  const handleUpdateEnd = () => {
    setUpdatingReviewId(null)
    setEditingReviewId(null)
    onReviewChange?.()
  }

  const handleCreateSuccess = () => {
    setShowCreateForm(false)
    onReviewChange?.()
  }

  if (reviews.length === 0) {
    return (
      <div className="space-y-6">
        {canCreateReview && (
          <div>
            {!showCreateForm ? (
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="w-full sm:w-auto"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Tulis Ulasan
              </Button>
            ) : (
              <CreateReviewForm 
                courseId={courseId}
                onSuccess={handleCreateSuccess}
              />
            )}
          </div>
        )}

        <Card>
          <CardContent className="pt-6 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Ulasan</h3>
            <p className="text-gray-600 mb-4">
              Jadilah yang pertama memberikan ulasan untuk kursus ini!
            </p>
            {canCreateReview && !showCreateForm && (
              <Button onClick={() => setShowCreateForm(true)}>
                Tulis Ulasan Pertama
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {canCreateReview && (
        <div>
          {!showCreateForm ? (
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="w-full sm:w-auto"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Tulis Ulasan
            </Button>
          ) : (
            <CreateReviewForm 
              courseId={courseId}
              onSuccess={handleCreateSuccess}
            />
          )}
        </div>
      )}

      <div className="space-y-4">
        {reviews.map(review => (
          editingReviewId === review.id ? (
            <EditReviewForm
              key={review.id}
              review={review}
              onSuccess={handleUpdateEnd}
              onCancel={() => setEditingReviewId(null)}
              onUpdateStart={() => handleUpdateStart(review.id)}
              isLoading={updatingReviewId === review.id}
            />
          ) : (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={currentUserId}
              onEdit={() => setEditingReviewId(review.id)}
              onDelete={() => handleDeleteReview(review.id)}
              isLoading={loadingReviewId === review.id}
            />
          )
        ))}
      </div>
    </div>
  )
}