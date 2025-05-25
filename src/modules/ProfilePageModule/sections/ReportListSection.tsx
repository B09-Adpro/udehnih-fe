'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, AlertCircle, Pencil, Trash2, X, ExternalLink } from 'lucide-react';
import { ReportService } from '@/lib/services/reports.service';
import { AuthService } from '@/lib/services/auth.service';
import { ReportResponseDto } from '@/lib/services/interface';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

export const ReportListSection = () => {
  const router = useRouter();
  const [reports, setReports] = useState<ReportResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportResponseDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Use useEffect to fetch reports on component mount
  useEffect(() => {
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

  const handleEdit = (reportId: number) => {
    router.push(`/reports/edit/${reportId}`);
  };

  // Function to fetch reports asynchronously
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
      
      const sortedReports = userReports
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
      
      setReports(sortedReports);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reports');
      console.error('Error fetching user reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (reportId: number) => {
    try {
      setIsDeleting(reportId);
      await ReportService.deleteReport(reportId);
      
      // Update the reports list after successful deletion
      setReports(reports.filter(report => report.reportId !== reportId));
      toast.success('Laporan berhasil dihapus');
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus laporan');
      console.error('Error deleting report:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <section className="w-full pb-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Laporan Terbaru
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
              <Card 
                key={report.reportId} 
                className="mb-4 overflow-hidden hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  setSelectedReport(report);
                  setIsDialogOpen(true);
                }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <Badge className={`font-medium border-0 ${getStatusBadgeClass(report.status)}`}>
                      {report.status}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                        disabled={report.status.toUpperCase() === 'RESOLVED' || report.status.toUpperCase() === 'SELESAI'}
                        title="Edit Laporan"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={`/reports/${report.reportId}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        onClick={async (e) => {
                          e.stopPropagation();
                          await handleDelete(report.reportId);
                          // Refresh data after deletion
                          await fetchUserReports();
                        }}
                        disabled={isDeleting === report.reportId}
                        title="Hapus Laporan"
                      >
                        {isDeleting === report.reportId ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-red-600" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-semibold line-clamp-1">{report.title}</h3>
                    <div className="text-gray-600">
                      <div className="max-h-[80px] overflow-hidden relative">
                        <p className="whitespace-pre-line line-clamp-3">{report.detail}</p>
                        {report.detail && report.detail.split('\n').length > 3 && (
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
                        )}
                      </div>
                      {report.detail && report.detail.split('\n').length > 3 && (
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-blue-600 mt-1 font-medium flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport(report);
                            setIsDialogOpen(true);
                          }}
                        >
                          Show more
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm text-gray-500">Dibuat: {new Date(report.createdAt).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">Diperbarui: {report.updatedAt && report.updatedAt !== report.createdAt ? new Date(report.updatedAt).toLocaleDateString() : '-'}</p>
                    </div>
                  </div>
                  {report.rejectionMessage && (
                    <div className="mt-3 p-3 bg-red-50 rounded-md">
                      <p className="text-sm font-medium text-red-800">Alasan Penolakan:</p>
                      <p className="text-sm text-red-700">{report.rejectionMessageText}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Report Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <div className="p-6">
            <DialogHeader className="pb-4">
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl font-bold">{selectedReport?.title}</DialogTitle>
                <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors">
                  <X className="h-4 w-4" />
                </DialogClose>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Detail</h3>
                <p className="whitespace-pre-line text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md">{selectedReport?.detail}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <div className="flex items-center">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {selectedReport?.status}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Dibuat</h3>
                <p className="text-gray-700">{selectedReport ? new Date(selectedReport.createdAt).toLocaleDateString() : ''}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Diperbarui</h3>
                <p className="text-gray-700">{selectedReport && selectedReport.updatedAt && selectedReport.updatedAt !== selectedReport.createdAt ? new Date(selectedReport.updatedAt).toLocaleDateString() : '-'}</p>
              </div>
            </div>
          </div>
          <div className="border-t p-4 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={async () => {
                  if (selectedReport) {
                    await handleDelete(selectedReport.reportId);
                    setIsDialogOpen(false);
                    // Refresh the reports list after deletion
                    await fetchUserReports();
                  }
                }}
                disabled={isDeleting === selectedReport?.reportId}
                className="px-4"
              >
                {isDeleting === selectedReport?.reportId ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-red-600 mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Hapus
              </Button>
              <Button 
                variant="default"
                disabled={selectedReport?.status.toUpperCase() === 'RESOLVED' || selectedReport?.status.toUpperCase() === 'SELESAI'}
                onClick={() => {
                  if (selectedReport) {
                    router.push(`/reports/${selectedReport.reportId}/edit`);
                  }
                }}
                className="px-4"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReportListSection;