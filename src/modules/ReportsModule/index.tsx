'use client';

import React, { useEffect, useState } from 'react'
import { AllReportsSection } from './sections/AllReportsSection'
import { ReportService } from '@/lib/services/reports.service'

export const ReportsModule = () => {
    const [showReports, setShowReports] = useState(false);
    
    useEffect(() => {
        // Check if user has student role
        const canViewReports = ReportService.shouldShowReports();
        setShowReports(canViewReports);
    }, []);

    if (!showReports) {
        return (
            <main className="w-full py-20 bg-gray-50">
                <div className="container px-4 mx-auto">
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                        <h3 className="text-xl font-medium text-gray-700 mb-2">Akses Tidak Tersedia</h3>
                        <p className="text-gray-500">Fitur laporan hanya tersedia untuk pengguna dengan peran Mahasiswa.</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main>
            <AllReportsSection/>
        </main>
    )
}