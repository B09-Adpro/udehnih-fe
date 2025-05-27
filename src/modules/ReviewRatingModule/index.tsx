"use client"

import React from 'react'
import { ReviewSection } from './sections/ReviewSection'
import { ReviewRatingModuleProps } from './interface'

export function ReviewRatingModule({ courseId }: ReviewRatingModuleProps) {
  return (
    <div className="w-full">
      <ReviewSection courseId={courseId} />
    </div>
  )
}

export default ReviewRatingModule