"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, BookOpen, DollarSign, Tag } from 'lucide-react';
import { courseCreateSchema, CourseCreateFormValues, COURSE_CATEGORIES } from '../constant';
import { CourseService } from '@/lib/services/course.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const CreateCourseSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<CourseCreateFormValues>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price: 0
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data: CourseCreateFormValues) => {
    setIsLoading(true);
    
    try {
      const response = await CourseService.createCourse(data);
      toast.success('Kursus berhasil dibuat!');
      router.push(`/tutor/courses/${response.courseId}`);
    } catch (error: any) {
      toast.error(error.message || 'Gagal membuat kursus');
    } finally {
      setIsLoading(false);
    }
  };

  const getCharacterCount = (field: keyof CourseCreateFormValues, max: number) => {
    const current = String(watchedValues[field] || '').length;
    return `${current}/${max}`;
  };

  const getCharacterColor = (field: keyof CourseCreateFormValues, max: number) => {
    const current = String(watchedValues[field] || '').length;
    if (current > max * 0.9) return 'text-red-500';
    if (current > max * 0.7) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

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
              Buat Kursus Baru
            </h1>
            <p className="text-gray-600">
              Bagikan pengetahuan Anda dengan membuat kursus yang menarik
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
              Masukkan detail dasar kursus yang akan Anda buat
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
                  disabled={isLoading}
                  {...register('title')}
                />
                <div className="flex justify-between items-center">
                  {errors.title ? (
                    <p className="text-xs text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.title.message}
                    </p>
                  ) : (
                    <div></div>
                  )}
                  <span className={`text-xs ${getCharacterColor('title', 255)}`}>
                    {getCharacterCount('title', 255)}
                  </span>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Kategori
                </Label>
                <select
                  id="category"
                  className={`w-full h-11 px-3 py-2 bg-transparent border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.category ? 'border-red-500' : ''
                  }`}
                  disabled={isLoading}
                  {...register('category')}
                >
                  <option value="">Pilih kategori kursus</option>
                  {COURSE_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value