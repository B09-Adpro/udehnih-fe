"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Send, User, Award, FileText } from 'lucide-react';
import { tutorApplicationSchema, TutorApplicationFormValues } from '../constant';
import { TutorService } from '@/lib/services/tutor.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const ApplicationFormSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<TutorApplicationFormValues>({
    resolver: zodResolver(tutorApplicationSchema),
    defaultValues: {
      experience: '',
      qualifications: '',
      bio: ''
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data: TutorApplicationFormValues) => {
    setIsLoading(true);
    
    try {
      await TutorService.applyAsTutor(data);
      toast.success('Aplikasi tutor berhasil dikirim!');
      router.push('/tutor/status');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengirim aplikasi');
    } finally {
      setIsLoading(false);
    }
  };

  const getCharacterCount = (field: keyof TutorApplicationFormValues, max: number) => {
    const current = watchedValues[field]?.length || 0;
    return `${current}/${max}`;
  };

  const getCharacterColor = (field: keyof TutorApplicationFormValues, max: number) => {
    const current = watchedValues[field]?.length || 0;
    if (current > max * 0.9) return 'text-red-500';
    if (current > max * 0.7) return 'text-yellow-500';
    return 'text-gray-500';
  };

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Daftar Sebagai Tutor
          </h1>
          <p className="text-gray-600">
            Bagikan pengalaman dan keahlian Anda dengan ribuan siswa di platform kami
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informasi Tutor
            </CardTitle>
            <CardDescription>
              Ceritakan tentang latar belakang dan keahlian Anda sebagai pengajar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Experience */}
              <div className="space-y-2">
                <Label htmlFor="experience" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Pengalaman Mengajar
                </Label>
                <textarea
                  id="experience"
                  placeholder="Ceritakan pengalaman mengajar Anda, metode pengajaran yang digunakan, dan pencapaian yang pernah diraih..."
                  className={`min-h-[120px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y ${
                    errors.experience ? 'border-red-500' : ''
                  }`}
                  disabled={isLoading}
                  {...register('experience')}
                />
                <div className="flex justify-between items-center">
                  {errors.experience ? (
                    <p className="text-xs text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.experience.message}
                    </p>
                  ) : (
                    <div></div>
                  )}
                  <span className={`text-xs ${getCharacterColor('experience', 2000)}`}>
                    {getCharacterCount('experience', 2000)}
                  </span>
                </div>
              </div>

              {/* Qualifications */}
              <div className="space-y-2">
                <Label htmlFor="qualifications" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Kualifikasi & Pendidikan
                </Label>
                <textarea
                  id="qualifications"
                  placeholder="Sebutkan latar belakang pendidikan, sertifikat, dan kualifikasi relevan lainnya..."
                  className={`min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y ${
                    errors.qualifications ? 'border-red-500' : ''
                  }`}
                  disabled={isLoading}
                  {...register('qualifications')}
                />
                <div className="flex justify-between items-center">
                  {errors.qualifications ? (
                    <p className="text-xs text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.qualifications.message}
                    </p>
                  ) : (
                    <div></div>
                  )}
                  <span className={`text-xs ${getCharacterColor('qualifications', 1000)}`}>
                    {getCharacterCount('qualifications', 1000)}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio Singkat</Label>
                <textarea
                  id="bio"
                  placeholder="Tulis bio singkat tentang diri Anda yang akan dilihat oleh calon siswa..."
                  className={`min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y ${
                    errors.bio ? 'border-red-500' : ''
                  }`}
                  disabled={isLoading}
                  {...register('bio')}
                />
                <div className="flex justify-between items-center">
                  {errors.bio ? (
                    <p className="text-xs text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.bio.message}
                    </p>
                  ) : (
                    <div></div>
                  )}
                  <span className={`text-xs ${getCharacterColor('bio', 500)}`}>
                    {getCharacterCount('bio', 500)}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Tips untuk Aplikasi yang Baik:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Jelaskan pengalaman mengajar dengan detail dan spesifik</li>
                  <li>• Sertakan metode pengajaran yang Anda kuasai</li>
                  <li>• Sebutkan pencapaian atau prestasi dalam bidang pendidikan</li>
                  <li>• Tulis dengan bahasa yang jelas dan profesional</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12" 
                disabled={isLoading}
              >
                {isLoading ? (
                  'Mengirim Aplikasi...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Kirim Aplikasi
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