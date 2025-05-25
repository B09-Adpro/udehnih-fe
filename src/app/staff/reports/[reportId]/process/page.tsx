'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProcessReportForm } from '@/modules/StaffReportsModule/sections/ProcessReportForm';
import { StaffReportService } from '@/lib/services/staff.reports.service';
import { ReportResponseDto } from '@/lib/services/interface';
import { AuthService } from '@/lib/services/auth.service';
import { toast } from 'sonner';

export default function ProcessReportPage() {
  const params = useParams();
  const [report, setReport] = useState<ReportResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // Check if user is authenticated and has staff role
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
          throw new Error('Authentication required');
        }

        const hasStaffRole = currentUser.roles?.some(role => 
          role === 'ROLE_STAFF' || role === 'STAFF'
        );
        
        if (!hasStaffRole) {
          throw new Error('Access denied: STAFF role required');
        }

        const reportId = Number(params.reportId);
        if (isNaN(reportId)) {
          throw new Error('Invalid report ID');
        }
        
        // Get all reports and find the one with matching ID
        const reports = await StaffReportService.getAllReports();
        const foundReport = reports.find(r => r.reportId === reportId);
        
        if (!foundReport) {
          throw new Error('Report not found');
        }

        // Check if report is already processed
        if (foundReport.status.toUpperCase() !== 'OPEN') {
          throw new Error('Only reports with OPEN status can be processed');
        }
        
        setReport(foundReport);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch report');
        toast.error(err.message || 'Failed to fetch report');
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

  return <ProcessReportForm report={report} />;
}