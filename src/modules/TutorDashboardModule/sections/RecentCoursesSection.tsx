"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Eye } from 'lucide-react';
import { CourseService, TutorCourse } from '@/lib/services/course.service';
import { COURSE_STATUS_LABELS } from '@/modules/CourseManagementModule/constant';
import Link from 'next/link';

export const RecentCoursesSection = () => {
  const [courses, setCourses] = useState<TutorCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await CourseService.getTutorCourses();
      // Show only 5 most recent courses
      setCourses(data.courses.slice(0, 5));
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Kursus Terbaru
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/tutor/courses">
            <Eye className="mr-2 h-4 w-4" />
            Lihat Semua
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Belum ada kursus</p>
            <Button asChild>
              <Link href="/tutor/courses/create">Buat Kursus Pertama</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => {
              const statusConfig = COURSE_STATUS_LABELS[course.status];
              return (
                <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">{course.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${statusConfig.color} border-0 text-xs`}>
                        {statusConfig.label}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDate(course.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {course.enrollmentCount} siswa
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};