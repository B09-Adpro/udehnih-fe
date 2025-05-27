import React, { useState } from 'react'
import { Star, StarHalf } from 'lucide-react'

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
}

export const StarRating = ({ rating, size = 'sm', showNumber = false }: StarRatingProps) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  
  const starSize = size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className={`${starSize} fill-yellow-400 text-yellow-400`} />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className={`${starSize} text-gray-300`} />
          <StarHalf className={`${starSize} absolute top-0 left-0 fill-yellow-400 text-yellow-400`} />
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={i} className={`${starSize} text-gray-300`} />
      ))}
      {showNumber && <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>}
    </div>
  )
}

interface InteractiveStarRatingProps {
  rating: number
  onRatingChange: (rating: number) => void
  disabled?: boolean
}

export const InteractiveStarRating = ({ rating, onRatingChange, disabled }: InteractiveStarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0)
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none disabled:cursor-not-allowed"
          onMouseEnter={() => !disabled && setHoverRating(star)}
          onMouseLeave={() => !disabled && setHoverRating(0)}
          onClick={() => !disabled && onRatingChange(star)}
          disabled={disabled}
        >
          <Star 
            className={`h-6 w-6 transition-colors ${
              star <= (hoverRating || rating) 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300 hover:text-yellow-200'
            } ${disabled ? 'opacity-50' : ''}`} 
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Pilih rating'}
      </span>
    </div>
  )
}