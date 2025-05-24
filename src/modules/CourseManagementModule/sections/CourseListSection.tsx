"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Eye, 
  Send,
  BookOpen,
  Calendar,
  DollarSign
} from 'lucide-react';
import { COURSE_STATUS_LABELS } from '@/modules/CourseManagementModule/constant';
import { TutorCourse } from '@/lib/services/course.service';
import Link from 'next/link';



export const CourseListSection = () => {
  const [courses, setCourses] = useState<TutorCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  console.log("=== COURSE LIST SECTION MOUNTED ===");

  useEffect(() => {
    console.log("=== CourseListSection useEffect triggered ===");
    fetchCourses();
  }, []);

   const handleDeleteCourse = async (courseId: number, title: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus kursus "${title}"?`)) {
      return;
    }

    setDeletingId(courseId);
    try {
      const { CourseService } = await import('@/lib/services/course.service');
      await CourseService.deleteCourse(courseId);
      toast.success('Kursus berhasil dihapus');
      fetchCourses(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus kursus');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmitForReview = async (courseId: number, title: string) => {
    if (!window.confirm(`Kirim kursus "${title}" untuk direview?`)) {
      return;
    }

    setSubmittingId(courseId);
    try {
      const { CourseService } = await import('@/lib/services/course.service');
      await CourseService.submitForReview(courseId);
      toast.success('Kursus berhasil dikirim untuk review');
      fetchCourses(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengirim kursus untuk review');
    } finally {
      setSubmittingId(null);
    }
  };

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

  const fetchCourses = async () => {
    console.log("=== FETCHING COURSES ===");
    
    try {
      // Now calling real API
      console.log("Calling CourseService.getTutorCourses()...");
      
      const { CourseService } = await import('@/lib/services/course.service');
      const data = await CourseService.getTutorCourses();
      
      console.log("✅ API Response received:", data);
      setCourses(data.courses);
      setError(null);
      console.log("✅ Course fetch completed successfully");
      
    } catch (error: any) {
      console.log("❌ Course fetch failed:", error);
      console.log("Error message:", error.message);
      
      setError(error.message);
      toast.error(error.message || 'Gagal memuat daftar kursus');
      
      // Check if it's an authorization error
      if (error.message?.includes('unauthorized') || error.message?.includes('forbidden')) {
        console.log("🔥 AUTHORIZATION ERROR - This might cause redirect");
      }
      
    } finally {
      console.log("Setting isLoading to false");
      setIsLoading(false);
    }
  };

  console.log("=== COURSE LIST SECTION RENDER ===");
  console.log("isLoading:", isLoading);
  console.log("courses:", courses);
  console.log("error:", error);

  if (isLoading) {
    console.log("Rendering loading state");
    return (
      <section className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.log("Rendering error state");
    return (
      <section className="w-full py-12">
        <div className="container mx-auto px-4">
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-red-500 mb-4">❌</div>
              <h3 className="text-lg font-medium mb-2">Error Loading Courses</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={fetchCourses}>Retry</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  console.log("Rendering course list");
  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Kelola Kursus
            </h1>
            <p className="text-gray-600">
              Kelola dan pantau kursus yang telah Anda buat
            </p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link href="/tutor/courses/create">
              <Plus className="mr-2 h-4 w-4" />
              Buat Kursus Baru
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Kursus</p>
                  <p className="text-2xl font-bold">{courses.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Diterbitkan</p>
                  <p className="text-2xl font-bold">
                    {courses.filter(c => c.status === 'PUBLISHED').length}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Siswa</p>
                  <p className="text-2xl font-bold">
                    {courses.reduce((sum, course) => sum + course.enrollmentCount, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendapatan</p>
                  <p className="text-2xl font-bold">
                    {formatPrice(courses.reduce((sum, course) => 
                      sum + (course.price * course.enrollmentCount), 0
                    ))}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course List */}
        {courses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Belum Ada Kursus</h3>
              <p className="text-gray-600 mb-6">
                Mulai berbagi pengetahuan Anda dengan membuat kursus pertama
              </p>
              <Button asChild>
                <Link href="/tutor/courses/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Kursus Pertama
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const statusConfig = COURSE_STATUS_LABELS[course.status];
              
              return (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
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
                  
                  <CardContent className="flex flex-col gap-2 pt-0">
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
                          onClick={() => handleSubmitForReview(course.id, course.title)}
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
                        onClick={() => handleDeleteCourse(course.id, course.title)}
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
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};