'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle, X, ExternalLink } from 'lucide-react';
import { StaffReportService } from '@/lib/services/staff.reports.service';
import { ReportService } from '@/lib/services/reports.service';
import { AuthService } from '@/lib/services/auth.service';
import { ReportResponseDto } from '@/lib/services/interface';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

export const StaffReportsSection = () => {
    const router = useRouter();
    const [reports, setReports] = useState<ReportResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedReport, setSelectedReport] = useState<ReportResponseDto | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Use useEffect to fetch reports on component mount
    useEffect(() => {
        fetchAllReports();
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

    // Function to fetch reports asynchronously
    const fetchAllReports = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // The StaffReportService now handles authentication and role checking internally
            const allReports = await StaffReportService.getAllReports();
            
            // Sort reports by creation date (newest first)
            const sortedReports = allReports
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            
            setReports(sortedReports);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch reports');
            console.error('Error fetching reports:', err);
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
                            Semua Laporan
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <Button asChild className="h-12 px-6 font-medium">
                            <Link href="/staff/reports/process">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Proses Laporan
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
                        <p className="text-gray-500 mb-6">Belum ada laporan yang dibuat oleh mahasiswa</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
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
                                            {report.status.toUpperCase() === 'OPEN' && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                                                    title="Proses Laporan"
                                                    asChild
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Link href={`/staff/reports/process/${report.reportId}`}>
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <h3 className="text-lg font-semibold line-clamp-1">{report.title}</h3>
                                        <div className="text-gray-600">
                                            <div className="max-h-[80px] overflow-hidden relative">
                                                <p className="whitespace-pre-line line-clamp-3">{report.detail}</p>
                                                {report.detail && report.detail.length > 300 && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
                                                )}
                                            </div>
                                            {report.detail && report.detail.length > 300 && (
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
                                            <p className="text-sm text-gray-500">Mahasiswa: {report.studentId}</p>
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
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Mahasiswa</h3>
                                <p className="text-gray-700">{selectedReport?.studentId}</p>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Dibuat</h3>
                                <p className="text-gray-700">{selectedReport ? new Date(selectedReport.createdAt).toLocaleDateString() : ''}</p>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Diperbarui</h3>
                                <p className="text-gray-700">{selectedReport && selectedReport.updatedAt && selectedReport.updatedAt !== selectedReport.createdAt ? new Date(selectedReport.updatedAt).toLocaleDateString() : '-'}</p>
                            </div>

                            {selectedReport?.rejectionMessage && (
                                <div className="p-3 bg-red-50 rounded-md">
                                    <h3 className="text-sm font-medium text-red-800 mb-1">Alasan Penolakan:</h3>
                                    <p className="text-sm text-red-700">{selectedReport.rejectionMessageText}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {selectedReport?.status.toUpperCase() === 'OPEN' && (
                        <div className="border-t p-4 bg-gray-50">
                            <div className="flex justify-end space-x-3">
                                <Button 
                                    variant="default"
                                    onClick={() => {
                                        if (selectedReport) {
                                            router.push(`/staff/reports/process/${selectedReport.reportId}`);
                                        }
                                    }}
                                    className="px-4"
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Proses Laporan
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>


        </section>
    );
};

export default StaffReportsSection;
