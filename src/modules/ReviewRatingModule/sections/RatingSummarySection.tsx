import React from 'react'
import { Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StarRating } from '../components/StarRating'

interface RatingSummarySectionProps {
  reviews: Array<{
    id: string
    rating: number
  }>
  averageRating: number
  isLoading?: boolean
}

export const RatingSummarySection = ({ reviews, averageRating, isLoading }: RatingSummarySectionProps) => {
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }))

  if (reviews.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Rating & Ulasan
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 mb-6">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 transition-opacity ${isLoading ? 'opacity-50' : ''}`}>
              {averageRating.toFixed(1)}
            </div>
            <StarRating rating={averageRating} size="md" />
            <p className="text-sm text-gray-600 mt-1">
              {reviews.length} ulasan
            </p>
          </div>
          
          <div className="flex-1">
            {ratingCounts.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2 mb-2">
                <span className="text-sm w-8">{rating}</span>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-yellow-400 h-2 rounded-full transition-all ${isLoading ? 'opacity-50' : ''}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}