'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, AlertCircle } from 'lucide-react';
import { ReportService } from '@/lib/services/reports.service';
import { AuthService } from '@/lib/services/auth.service';
import { ReportResponseDto } from '@/lib/services/interface';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ReportListSection = () => {
  const [reports, setReports] = useState<ReportResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
          setError('User not authenticated');
          setIsLoading(false);
          return;
        }

        const userReports = await ReportService.getUserReports();
        
        setReports(userReports);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch reports');
        console.error('Error fetching user reports:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserReports();
  }, []);

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

  return (
    <section className="w-full pb-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Laporan Saya
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild className="h-12 px-6 font-medium">
              <Link href="/reports/create">
                <Plus className="mr-2 h-4 w-4" />
                Buat Laporan
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 px-6 font-medium">
              <Link href="/reports">
                Lihat Semua Laporan
              </Link>
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Belum ada laporan</h3>
            <p className="text-gray-500 mb-6">Anda belum membuat laporan apapun</p>
            <Button asChild>
              <Link href="/reports/create">
                <Plus className="mr-2 h-4 w-4" />
                Buat Laporan Pertama
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.reportId} className="border-0 shadow-md">
                <CardContent className="px-6 py-4">
                  <div className="relative mb-2">
                    <Badge className={`font-medium border-0 mb-4 ${getStatusBadgeClass(report.status)}`}>
                      {report.status}
                    </Badge>
                    <h3 className="text-lg font-semibold mb-2">
                      {report.title}
                    </h3>
                    <p className="text-gray-600 relative z-10 mb-2">
                      {report.detail}
                    </p>
                    <p className="text-xs text-gray-500">
                      Dibuat: {new Date(report.createdAt).toLocaleDateString('id-ID')}
                    </p>
                    {report.rejectionMessage && (
                      <div className="mt-3 p-3 bg-red-50 rounded-md">
                        <p className="text-sm font-medium text-red-800">Alasan Penolakan:</p>
                        <p className="text-sm text-red-700">{report.rejectionMessageText}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReportListSection;