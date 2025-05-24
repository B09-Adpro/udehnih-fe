"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Users, 
  Send,
  Calendar,
  Settings
} from 'lucide-react';
import { COURSE_STATUS_LABELS } from '@/modules/CourseManagementModule/constant';
import { TutorCourse } from '@/lib/services/course.service';

interface CourseCardProps {
  course: TutorCourse;
  onDelete: (courseId: number, title: string) => void;
  onSubmitForReview: (courseId: number, title: string) => void;
  deletingId: number | null;
  submittingId: number | null;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onDelete,
  onSubmitForReview,
  deletingId,
  submittingId
}) => {
  const statusConfig = COURSE_STATUS_LABELS[course.status];

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 line-clamp-2">
              {course.title}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${statusConfig.color} border-0 text-xs`}>
                {statusConfig.label}
              </Badge>
              <span className="text-sm text-gray-500">
                {course.category}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Harga:</span>
          <span className="font-medium">{formatPrice(course.price)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Siswa:</span>
          <span className="font-medium">{course.enrollmentCount} orang</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Dibuat {formatDate(course.createdAt)}</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        <div className="flex w-full gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link href={`/tutor/courses/${course.id}`}>
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link href={`/tutor/courses/${course.id}/content`}>
              <Settings className="mr-1 h-4 w-4" />
              Konten
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link href={`/tutor/courses/${course.id}/students`}>
              <Users className="mr-1 h-4 w-4" />
              Siswa
            </Link>
          </Button>
        </div>
        
        <div className="flex w-full gap-2">
          {course.status === 'DRAFT' && (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onSubmitForReview(course.id, course.title)}
              disabled={submittingId === course.id}
            >
              {submittingId === course.id ? (
                'Mengirim...'
              ) : (
                <>
                  <Send className="mr-1 h-4 w-4" />
                  Submit Review
                </>
              )}
            </Button>
          )}
          
          <Button 
            variant="destructive" 
            size="sm" 
            className={course.status === 'DRAFT' ? '' : 'flex-1'}
            onClick={() => onDelete(course.id, course.title)}
            disabled={deletingId === course.id}
          >
            {deletingId === course.id ? (
              'Menghapus...'
            ) : (
              <>
                <Trash2 className="mr-1 h-4 w-4" />
                Hapus
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};