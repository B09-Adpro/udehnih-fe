"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText, 
  Calendar,
  User,
  GraduationCap,
  ArrowLeft,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { TutorService, TutorApplicationStatus } from '@/lib/services/tutor.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useUserData from '@/lib/hooks/useUserData';

export const ApplicationStatusSection = () => {
  const [applicationStatus, setApplicationStatus] = useState<TutorApplicationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const { refreshUserData } = useUserData();
  const router = useRouter();

  useEffect(() => {
    fetchApplicationStatus();
  }, []);

  const fetchApplicationStatus = async () => {
    try {
      const status = await TutorService.getApplicationStatus();
      setApplicationStatus(status);
      
      // Jika status ACCEPTED, refresh user data untuk mendapatkan role TUTOR terbaru
      if (status.status === 'ACCEPTED') {
        console.log('Application ACCEPTED, refreshing user data...');
        await refreshUserData();
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat status aplikasi');
      router.push('/tutor/apply');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelApplication = async () => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan aplikasi tutor? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }

    setIsCanceling(true);
    try {
      await TutorService.cancelApplication();
      toast.success('Aplikasi tutor berhasil dibatalkan');
      router.push('/tutor/apply');
    } catch (error: any) {
      toast.error(error.message || 'Gagal membatalkan aplikasi');
    } finally {
      setIsCanceling(false);
    }
  };

  // Fungsi untuk force refresh dan redirect
  const handleStartAsTutor = async () => {
    try {
      await refreshUserData();
      toast.success('Data berhasil diperbarui!');
      // Delay sebentar untuk memastikan localStorage ter-update
      setTimeout(() => {
        router.push('/tutor/courses');
      }, 500);
    } catch (error) {
      toast.error('Gagal memperbarui data user');
    }
  };

  const getStatusConfig = (status: 'PENDING' | 'ACCEPTED' | 'DENIED') => {
    switch (status) {
      case 'PENDING':
        return {
          icon: Clock,
          label: 'Menunggu Review',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          description: 'Aplikasi Anda sedang direview oleh tim kami',
          bgColor: 'bg-yellow-50',
          iconColor: 'text-yellow-600'
        };
      case 'ACCEPTED':
        return {
          icon: CheckCircle,
          label: 'Diterima',
          color: 'bg-green-100 text-green-800 border-green-300',
          description: 'Selamat! Aplikasi Anda telah diterima. Anda sekarang adalah tutor.',
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600'
        };
      case 'DENIED':
        return {
          icon: XCircle,
          label: 'Ditolak',
          color: 'bg-red-100 text-red-800 border-red-300',
          description: 'Aplikasi Anda ditolak. Anda dapat mengajukan aplikasi baru.',
          bgColor: 'bg-red-50',
          iconColor: 'text-red-600'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!applicationStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Tidak Ada Aplikasi</h3>
            <p className="text-gray-600 mb-6">
              Anda belum mengajukan aplikasi untuk menjadi tutor.
            </p>
            <Button asChild>
              <Link href="/tutor/apply">Ajukan Aplikasi</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig(applicationStatus.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </Button>

        {/* Main Status Card */}
        <Card className={`border-2 ${statusConfig.bgColor}`}>
          <CardHeader className="text-center">
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${statusConfig.bgColor}`}>
              <StatusIcon className={`h-8 w-8 ${statusConfig.iconColor}`} />
            </div>
            <CardTitle className="text-2xl font-bold">
              Status Aplikasi Tutor
            </CardTitle>
            <CardDescription>
              ID Aplikasi: #{applicationStatus.applicationId}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Status Badge */}
            <div className="text-center">
              <Badge className={`${statusConfig.color} border text-base px-4 py-2`}>
                {statusConfig.label}
              </Badge>
              <p className="text-gray-600 mt-2">
                {statusConfig.description}
              </p>
            </div>

            {/* Application Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Submission Date */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4" />
                  Tanggal Pengajuan
                </div>
                <p className="text-gray-600 pl-6">
                  {formatDate(applicationStatus.submittedAt)}
                </p>
              </div>

              {/* Application ID */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="h-4 w-4" />
                  ID Aplikasi
                </div>
                <p className="text-gray-600 pl-6">
                  #{applicationStatus.applicationId}
                </p>
              </div>
            </div>

            {/* Application Content */}
            <div className="space-y-4">
              {/* Experience */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <GraduationCap className="h-4 w-4" />
                  Pengalaman Mengajar
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {applicationStatus.experience}
                  </p>
                </div>
              </div>

              {/* Qualifications */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="h-4 w-4" />
                  Kualifikasi & Sertifikasi
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {applicationStatus.qualifications}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {applicationStatus.status === 'PENDING' && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={fetchApplicationStatus}
                    className="flex-1"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Status
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleCancelApplication}
                    disabled={isCanceling}
                    className="flex-1"
                  >
                    {isCanceling ? (
                      'Membatalkan...'
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Batalkan Aplikasi
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* Fixed: Add null check before accessing status */}
              {applicationStatus?.status === 'ACCEPTED' && (
                <Button onClick={handleStartAsTutor} className="w-full">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Mulai Sebagai Tutor
                </Button>
              )}

              {applicationStatus?.status === 'DENIED' && (
                <Button asChild className="w-full">
                  <Link href="/tutor/apply">
                    <FileText className="mr-2 h-4 w-4" />
                    Ajukan Aplikasi Baru
                  </Link>
                </Button>
              )}
            </div>

            {/* Additional Info */}
            {applicationStatus?.status === 'PENDING' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Proses review biasanya memakan waktu 1-3 hari kerja. Kami akan mengirimkan notifikasi melalui email ketika review selesai.
                </p>
              </div>
            )}

            {applicationStatus?.status === 'ACCEPTED' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                  Selamat datang di tim tutor! Anda sekarang dapat membuat dan mengelola kursus melalui dashboard tutor.
                </p>
              </div>
            )}

            {applicationStatus?.status === 'DENIED' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">
                  <XCircle className="h-4 w-4 inline mr-2" />
                  Jangan berkecil hati! Anda dapat memperbaiki aplikasi dan mengajukan kembali kapan saja.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};