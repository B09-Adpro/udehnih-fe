'use client';

import React, { useEffect, useState } from 'react';
import { ReportResponseDto } from '@/lib/services/interface';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle, X, ExternalLink, User } from 'lucide-react';
import { StaffReportService } from '@/lib/services/staff.reports.service';
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
                                    <div className="mb-4">
                                        <Badge className={`font-medium border-0 ${getStatusBadgeClass(report.status)}`}>
                                            {report.status}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-col space-y-3">
                                        <h3 className="text-xl font-bold line-clamp-1">{report.title}</h3>
                                        <div className="text-gray-600">
                                            <p className="whitespace-pre-line line-clamp-3 text-gray-700">{report.detail}</p>
                                            {report.detail && report.detail.length > 150 && (
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
                                        <div className="flex items-center">
                                            <div className="bg-gray-100 rounded-full p-2 mr-2">
                                                <User className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <p className="text-sm text-gray-700">{report.studentName || 'Unknown'}</p>
                                        </div>
                                        <div className="flex flex-col space-y-1 mt-1">
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
                                    
                                    {/* Process button at the bottom */}
                                    {report.status.toUpperCase() === 'OPEN' && (
                                        <div className="mt-4 flex justify-end">
                                            <Button 
                                                variant="default" 
                                                size="sm" 
                                                className="text-sm px-4 py-2"
                                                asChild
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Link href={`/staff/reports/process/${report.reportId}`}>
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    Proses Laporan
                                                </Link>
                                            </Button>
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
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh]">
                    <DialogClose className="absolute right-4 top-4 rounded-full h-8 w-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors">
                        <X className="h-4 w-4" />
                    </DialogClose>
                    
                    <div className="p-6">
                        <DialogHeader className="pb-4">
                            <DialogTitle className="text-xl font-bold" style={{ overflowWrap: 'break-word', wordBreak: 'break-all', hyphens: 'auto', maxWidth: '100%' }}>
                                {selectedReport?.title}
                            </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                                <div className="flex items-center">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                        {selectedReport?.status}
                                    </span>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Detail</h3>
                                <div className="bg-gray-50 p-4 rounded-md max-h-[200px] overflow-y-auto">
                                    <p className="whitespace-pre-line text-gray-700 leading-relaxed break-all">{selectedReport?.detail}</p>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Pengirim</h3>
                                <div className="flex items-center">
                                    <div className="bg-gray-100 rounded-full p-2 mr-2">
                                        <User className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <p className="text-gray-700">{selectedReport?.studentName || 'Unknown'}</p>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Dibuat</h3>
                                <p className="text-gray-700">{selectedReport ? new Date(selectedReport.createdAt).toLocaleDateString() : ''}</p>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Diperbarui</h3>
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
