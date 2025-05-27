import React, { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { InteractiveStarRating } from './StarRating'
import { useReviews } from '@/lib/hooks/useReview'

interface CreateReviewFormProps {
  courseId: string
  onSuccess: () => void
}

export const CreateReviewForm = ({ courseId, onSuccess }: CreateReviewFormProps) => {
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { createReview } = useReviews()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    setSubmitting(true)
    try {
      await createReview({
        courseId: parseInt(courseId),
        reviewText,
        rating
      })
      
      setRating(0)
      setReviewText('')
      onSuccess()
    } catch (error: any) {
      console.error('Failed to create review:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Tulis Ulasan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <InteractiveStarRating rating={rating} onRatingChange={setRating} />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Ulasan (Opsional)
            </label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Bagikan pengalaman Anda tentang kursus ini..."
              className="min-h-[100px]"
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {reviewText.length}/1000 karakter
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={rating === 0 || submitting}
              className="flex-1"
            >
              {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}