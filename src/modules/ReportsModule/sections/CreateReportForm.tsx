"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReportService } from '@/lib/services/reports.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createReportSchema } from '../constant';
import { CreateReportFormValues } from '../interface';

export const CreateReportForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);  

  const { 
    register, 
    handleSubmit, 
    formState: { errors }
  } = useForm<CreateReportFormValues>({
    resolver: zodResolver(createReportSchema),
    defaultValues: {
      title: '',
      detail: ''
    }
  });

  const onSubmit = async (data: CreateReportFormValues) => {
    setIsLoading(true);

    try {
      await ReportService.create({
        title: data.title,
        detail: data.detail
      });
      toast.success('Berhasil membuat laporan');
      router.push('/reports');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Terjadi kesalahan pada server, silakan coba lagi nanti');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full py-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Buat Laporan
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Judul Laporan</Label>
            <Input 
              id="title" 
              placeholder="Masukkan judul laporan" 
              className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-11 ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="detail" className="text-sm font-medium">Detail Laporan</Label>
            <textarea 
              id="detail" 
              placeholder="Masukkan detail laporan" 
              className={`w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.detail ? 'border-red-500 focus:ring-red-500' : ''}`}
              {...register('detail')}
            />
            {errors.detail && (
              <p className="text-xs text-red-500 mt-1">
                {errors.detail.message}
              </p>
            )}
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button 
              type="button"
              variant="outline"
              className="h-11 flex-1"
              onClick={() => router.push('/reports')}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              className="h-11 flex-1" 
              disabled={isLoading}
            >
              {isLoading ? 'Mengirim laporan...' : 'Kirim Laporan'}
            </Button>
          </div>
        </form>

      </div>
    </section>
  );
};

export default CreateReportForm;