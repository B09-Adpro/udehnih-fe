import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { InteractiveStarRating } from './StarRating'
import { useReviews } from '@/lib/hooks/useReview'

interface EditReviewFormProps {
  review: {
    id: string
    rating: number
    reviewText: string
  }
  onSuccess: () => void
  onCancel: () => void
  onUpdateStart: () => void
  isLoading: boolean
}

export const EditReviewForm = ({ review, onSuccess, onCancel, onUpdateStart, isLoading }: EditReviewFormProps) => {
  const [rating, setRating] = useState(review.rating)
  const [reviewText, setReviewText] = useState(review.reviewText)
  const [submitting, setSubmitting] = useState(false)
  const { updateReview } = useReviews()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || submitting) return

    setSubmitting(true)
    onUpdateStart()
    try {
      await updateReview(review.id, {
        reviewText,
        rating
      })
      onSuccess()
    } catch (error: any) {
      console.error('Failed to update review:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Edit Ulasan
          {submitting && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <InteractiveStarRating 
              rating={rating} 
              onRatingChange={setRating}
              disabled={submitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Ulasan</label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-[100px]"
              maxLength={1000}
              disabled={submitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              {reviewText.length}/1000 karakter
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={rating === 0 || submitting}
              size="sm"
              className="flex items-center gap-2"
            >
              {submitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              )}
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={onCancel}
              disabled={submitting}
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}