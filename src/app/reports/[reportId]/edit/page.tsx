'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { EditReportForm } from '@/modules/ReportsModule/sections/EditReportForm';
import { ReportService } from '@/lib/services/reports.service';
import { ReportResponseDto } from '@/lib/services/interface';

// TODO: Remove mock data when real data is available
const mockReport: ReportResponseDto = {
  reportId: 1,
  studentId: "student123",
  title: "Ballerina Cappuccina",
  detail: "Ballerina Cappuccina, mi-mi-mi-mi. È la moglie di Cappuccino Assassino. E ama la musica, la-la-la-la. La sua passione è il Ballerino Lololo.",
  status: "OPEN",
  rejectionMessage: null,
  rejectionMessageText: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export default function EditReportPage() {
  // TODO: Remove mock data when real data is available
  return <EditReportForm report={mockReport} />;

  // TODO: Uncomment this when real data is available
  /*
  const params = useParams();
  const [report, setReport] = useState<ReportResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const reportId = Number(params.reportId);
        if (isNaN(reportId)) {
          throw new Error('Invalid report ID');
        }
        
        const data = await ReportService.getReportById(reportId);
        setReport(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch report');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [params.reportId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!report) {
    return <div>Report not found</div>;
  }

  return <EditReportForm report={report} />;
  */
} 