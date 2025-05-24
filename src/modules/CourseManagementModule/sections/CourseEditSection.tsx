"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ArrowLeft, BookOpen, DollarSign, Save } from 'lucide-react';
import { courseUpdateSchema, CourseUpdateFormValues, COURSE_STATUS_LABELS } from '../constant';
import { CourseService, CourseDetail } from '@/lib/services/course.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CourseEditSectionProps {
  courseId: number;
}

export const CourseEditSection: React.FC<CourseEditSectionProps> = ({ courseId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<CourseUpdateFormValues>({
    resolver: zodResolver(courseUpdateSchema)
  });

  const watchedValues = watch();

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const courseData = await CourseService.getCourseById(courseId);
      setCourse(courseData);
      // Populate form with existing data
      setValue('title', courseData.title);
      setValue('description', courseData.description);
      setValue('price', courseData.price);
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat data kursus');
      router.push('/tutor/courses');
    } finally {
      setIsFetching(false);
    }
  };

  const onSubmit = async (data: CourseUpdateFormValues) => {
    setIsLoading(true);
    
    try {
      await CourseService.updateCourse(courseId, data);
      toast.success('Kursus berhasil diperbarui!');
      fetchCourse(); // Refresh data
    } catch (error: any) {
      toast.error(error.message || 'Gagal memperbarui kursus');
    } finally {
      setIsLoading(false);
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

  if (isFetching) {
    return (
      <section className="w-full py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (!course) {
    return (
      <section className="w-full py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Kursus tidak ditemukan</h1>
          <Button asChild>
            <Link href="/tutor/courses">Kembali ke Daftar Kursus</Link>
          </Button>
        </div>
      </section>
    );
  }

  const statusConfig = COURSE_STATUS_LABELS[course.status];

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/tutor/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Kursus
            </Link>
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-4">
              Edit Kursus
            </h1>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge className={`${statusConfig.color} border-0`}>
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm">
              {statusConfig.description}
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Informasi Kursus
            </CardTitle>
            <CardDescription>
              Perbarui detail kursus Anda
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Judul Kursus
                </Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul kursus yang menarik..."
                  className={`h-11 ${errors.title ? 'border-red-500' : ''}`}
                  disabled={isLoading || course.status === 'PENDING_REVIEW'}
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Kursus</Label>
                <textarea
                  id="description"
                  placeholder="Jelaskan apa yang akan dipelajari siswa dalam kursus ini..."
                  rows={4}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                  disabled={isLoading || course.status === 'PENDING_REVIEW'}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Harga Kursus
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    Rp
                  </span>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="0"
                    className={`h-11 pl-10 ${errors.price ? 'border-red-500' : ''}`}
                    disabled={isLoading || course.status === 'PENDING_REVIEW'}
                    {...register('price', { valueAsNumber: true })}
                  />
                </div>
                <div className="flex justify-between items-center">
                  {errors.price ? (
                    <p className="text-xs text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.price.message}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Masukkan 0 untuk kursus gratis
                    </p>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatPrice(watchedValues.price || course.price)}
                  </span>
                </div>
              </div>

              {course.status === 'PENDING_REVIEW' && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <AlertCircle className="h-4 w-4 inline mr-2" />
                    Kursus sedang dalam proses review. Anda tidak dapat mengedit saat ini.
                  </p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12" 
                disabled={isLoading || course.status === 'PENDING_REVIEW'}
              >
                {isLoading ? (
                  'Menyimpan...'
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};