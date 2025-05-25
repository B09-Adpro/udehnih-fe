'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { EditReportForm } from '@/modules/ReportsModule/sections/EditReportForm';
import { ReportService } from '@/lib/services/reports.service';
import { ReportResponseDto } from '@/lib/services/interface';

export default function EditReportPage() {
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
    return (
      <div className="w-full py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="mt-4 text-lg">Loading report data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="text-red-500 text-xl">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="w-full py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="text-gray-700 text-xl">Report not found</div>
          </div>
        </div>
      </div>
    );
  }

  return <EditReportForm report={report} />;
} 