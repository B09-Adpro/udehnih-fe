import React, { useState } from 'react'
import { Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { StarRating } from './StarRating'

interface ReviewCardProps {
  review: {
    id: string
    studentId: number
    studentName: string
    rating: number
    reviewText: string
    createdAt: string
    updatedAt: string
  }
  currentUserId?: number
  onEdit: () => void
  onDelete: () => void
  isLoading?: boolean
}

export const ReviewCard = ({ review, currentUserId, onEdit, onDelete, isLoading }: ReviewCardProps) => {
  const canModify = review.studentId !== null && review.studentId === currentUserId
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  const isLongReview = review.reviewText && review.reviewText.length > 200
  const displayText = expanded || !isLongReview 
    ? review.reviewText 
    : review.reviewText?.substring(0, 200) + '...'

  const studentName = review.studentName || "Anonymous"
  const isAnonymous = !review.studentId || review.studentName === "Anonymous"

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete()
    } catch (error) {
      console.error('Failed to delete review:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card className={`transition-opacity ${isLoading ? "opacity-50" : ""}`}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage 
                src={isAnonymous 
                  ? `https://api.dicebear.com/7.x/initials/svg?seed=Anonymous`
                  : `https://api.dicebear.com/7.x/initials/svg?seed=${studentName}`
                } 
              />
              <AvatarFallback>
                {isAnonymous ? "?" : studentName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                {studentName}
                {isAnonymous && <span className="text-gray-500 text-sm">(Anonim)</span>}
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400" />
                )}
              </h4>
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-sm text-gray-600">
                  {new Date(review.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                {review.updatedAt !== review.createdAt && (
                  <Badge variant="secondary" className="text-xs">
                    Diedit
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {canModify && (
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onEdit}
                disabled={isLoading || deleting}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={isLoading || deleting}
                  >
                    {deleting ? (
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
                      Apakah Anda yakin ingin menghapus ulasan ini? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex items-center gap-2"
                    >
                      {deleting && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      )}
                      {deleting ? 'Menghapus...' : 'Hapus'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        
        {review.reviewText && (
          <div>
            <p className="text-gray-700 leading-relaxed">{displayText}</p>
            {isLongReview && (
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => setExpanded(!expanded)}
                className="mt-2 p-0 h-auto text-blue-600"
                disabled={isLoading}
              >
                {expanded ? (
                  <>Tampilkan lebih sedikit <ChevronUp className="h-4 w-4 ml-1" /></>
                ) : (
                  <>Baca selengkapnya <ChevronDown className="h-4 w-4 ml-1" /></>
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}