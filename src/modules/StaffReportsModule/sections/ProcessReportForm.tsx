"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { StaffReportService } from '@/lib/services/staff.reports.service';
import { AuthService } from '@/lib/services/auth.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { ReportResponseDto, RejectionMessageDto } from '@/lib/services/interface';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

// Enum for rejection messages that matches the backend enum
enum RejectionMessage {
  INCOMPLETE_DETAIL = "INCOMPLETE_DETAIL",
  SIMILAR_REPORT = "SIMILAR_REPORT",
  OTHER = "OTHER"
}

// Display messages for each rejection reason
const REJECTION_MESSAGE_DISPLAY = {
  [RejectionMessage.INCOMPLETE_DETAIL]: "Detail laporan kurang lengkap",
  [RejectionMessage.SIMILAR_REPORT]: "Laporan serupa sudah ada",
  [RejectionMessage.OTHER]: "Alasan lain"
};

// Schema for rejection message validation
const rejectionMessageSchema = z.object({
  rejectionMessage: z.string().min(1, 'Pilih alasan penolakan'),
});

type RejectionFormValues = z.infer<typeof rejectionMessageSchema>;

interface ProcessReportFormProps {
  report: ReportResponseDto;
}

export const ProcessReportForm = ({ report }: ProcessReportFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResolve, setIsResolve] = useState(true);

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch,
    reset
  } = useForm<RejectionFormValues>({
    resolver: zodResolver(rejectionMessageSchema),
    defaultValues: {
      rejectionMessage: ''
    }
  });
  
  // Update form validation when isResolve changes
  React.useEffect(() => {
    // Reset form when switching between resolve and reject
    reset({ rejectionMessage: '' });
  }, [isResolve, reset]);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED':
      case 'SELESAI':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  // Direct resolve function that bypasses form validation
  const handleResolve = async () => {
    setIsLoading(true);

    try {
      // Check if user is authenticated
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        toast.error('Anda perlu login terlebih dahulu');
        router.push('/login');
        return;
      }

      // Check if user has staff role
      const hasStaffRole = currentUser.roles?.some(role => 
        role === 'ROLE_STAFF' || role === 'STAFF'
      );
      
      if (!hasStaffRole) {
        toast.error('Akses ditolak: Anda memerlukan peran STAFF');
        router.push('/');
        return;
      }

      // Resolve the report without a rejection message
      await StaffReportService.processReport(report.reportId);
      toast.success('Laporan berhasil diselesaikan');
      
      router.push('/staff/reports');
    } catch (error: any) {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Terjadi kesalahan pada server, silakan coba lagi nanti');
      }
      console.error('Error processing report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Form submission handler for rejection
  const onSubmit = async (data: RejectionFormValues) => {
    setIsLoading(true);

    try {
      // Check if user is authenticated
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        toast.error('Anda perlu login terlebih dahulu');
        router.push('/login');
        return;
      }

      // Check if user has staff role
      const hasStaffRole = currentUser.roles?.some(role => 
        role === 'ROLE_STAFF' || role === 'STAFF'
      );
      
      if (!hasStaffRole) {
        toast.error('Akses ditolak: Anda memerlukan peran STAFF');
        router.push('/');
        return;
      }

      // Process the rejection
      const rejectionData: RejectionMessageDto = {
        rejectionMessage: data.rejectionMessage
      };
      await StaffReportService.processReport(report.reportId, rejectionData);
      toast.success('Laporan berhasil ditolak');
      
      router.push('/staff/reports');
    } catch (error: any) {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Terjadi kesalahan pada server, silakan coba lagi nanti');
      }
      console.error('Error processing report:', error);
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
              Proses Laporan
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={isResolve ? (e) => { e.preventDefault(); handleResolve(); } : handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Keputusan</h2>
                <div className="flex items-center space-x-4">
                  <Switch 
                    id="resolve-switch" 
                    checked={isResolve} 
                    onCheckedChange={setIsResolve} 
                  />
                  <Label htmlFor="resolve-switch" className="font-medium">
                    {isResolve ? 'Selesaikan Laporan' : 'Tolak Laporan'}
                  </Label>
                </div>
                <p className="text-sm text-gray-500">
                  {isResolve 
                    ? 'Laporan akan ditandai sebagai selesai dan tidak dapat diubah lagi.' 
                    : 'Laporan akan ditolak dan Anda perlu memberikan alasan penolakan.'}
                </p>
              </div>
              
              {!isResolve && (
                <div className="space-y-2">
                  <Label htmlFor="rejectionMessage" className="text-sm font-medium">Alasan Penolakan</Label>
                  <Select
                    id="rejectionMessage"
                    className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.rejectionMessage ? 'border-red-500 focus:ring-red-500' : ''}`}
                    {...register('rejectionMessage')}
                    defaultValue=""
                  >
                    <option value="" disabled>Pilih alasan penolakan</option>
                    {Object.values(RejectionMessage).map((value) => (
                      <option key={value} value={value}>{REJECTION_MESSAGE_DISPLAY[value]}</option>
                    ))}
                  </Select>
                  {errors.rejectionMessage && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.rejectionMessage.message}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex gap-4 pt-4">
                <Button 
                  type="button"
                  variant="outline"
                  className="h-11 flex-1"
                  onClick={() => router.push('/staff/reports')}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className={`h-11 flex-1 ${isResolve ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                  disabled={isLoading || (!isResolve && !watch('rejectionMessage'))}
                >
                  {isLoading ? 'Memproses...' : isResolve ? 'Selesaikan Laporan' : 'Tolak Laporan'}
                </Button>
              </div>
            </form>
          </div>

          <div className="md:col-span-1">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Detail Laporan</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Judul</h3>
                    <p className="font-medium">{report.title}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                    <Badge className={`font-medium border-0 ${getStatusBadgeClass(report.status)}`}>
                      {report.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Detail</h3>
                    <div className="bg-gray-50 p-3 rounded-md max-h-[200px] overflow-y-auto">
                      <p className="whitespace-pre-line text-gray-700 leading-relaxed break-all">{report.detail}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Pengirim</h3>
                    <div className="flex items-center">
                      <div className="bg-gray-100 rounded-full p-2 mr-2">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <p className="text-gray-700">{report.studentName || 'Unknown'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Dibuat</h3>
                    <p className="text-gray-700">{new Date(report.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessReportForm;
