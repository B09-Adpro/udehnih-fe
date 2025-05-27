"use client"

import React, { useState, useEffect } from 'react'
import { Star, MessageSquare, Calendar, BookOpen, Edit2, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useReviews } from '@/lib/hooks/useReview'
import { AuthService } from '@/lib/services/auth.service'
import { EditReviewForm } from '@/modules/ReviewRatingModule/components/EditReviewForm'

export const UserReviewsSection = () => {
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null)
  
  const { 
    reviews, 
    loading, 
    error, 
    fetchReviewsByStudent, 
    deleteReview 
  } = useReviews()
  
  const currentUser = AuthService.getCurrentUser()

  useEffect(() => {
    if (currentUser?.userId) {
      fetchReviewsByStudent(currentUser.userId)
    }
  }, [currentUser?.userId, fetchReviewsByStudent])

  const handleDeleteReview = async (reviewId: string) => {
    setDeletingReviewId(reviewId)
    try {
      await deleteReview(reviewId)
    } catch (error: any) {
      console.error('Failed to delete review:', error)
    } finally {
      setDeletingReviewId(null)
    }
  }

  const handleUpdateSuccess = () => {
    setEditingReviewId(null)
  }

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Ulasan Saya
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-16 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Ulasan Saya
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    )
  }

  if (reviews.length === 0) {
    return (
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Ulasan Saya
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum Ada Ulasan</h3>
              <p className="text-gray-600 mb-4">
                Anda belum memberikan ulasan untuk kursus apapun.
              </p>
              <Button onClick={() => window.location.href = '/courses'}>
                Jelajahi Kursus
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Ulasan Saya ({reviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id}>
                {editingReviewId === review.id ? (
                  <EditReviewForm
                    review={review}
                    onSuccess={handleUpdateSuccess}
                    onCancel={() => setEditingReviewId(null)}
                    onUpdateStart={() => {}}
                    isLoading={false}
                  />
                ) : (
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            <h4 className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                              {review.courseName}
                            </h4>
                          </div>
                          <div className="flex items-center gap-4 mb-2">
                            <StarRating rating={review.rating} />
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar className="h-4 w-4" />
                              {new Date(review.createdAt).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            {review.updatedAt !== review.createdAt && (
                              <Badge variant="secondary" className="text-xs">
                                Diedit
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingReviewId(review.id)}
                            disabled={deletingReviewId === review.id}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={deletingReviewId === review.id}
                              >
                                {deletingReviewId === review.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Ulasan</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus ulasan untuk "{review.courseName}"? 
                                  Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      
                      {review.reviewText && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-700 leading-relaxed">
                            {review.reviewText}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}