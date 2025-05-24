"use client";

import React from 'react';
import { TutorStatsSection } from './sections/TutorStatsSection';
import { RecentCoursesSection } from './sections/RecentCoursesSection';
import { QuickActionsSection } from './sections/QuickActionsSection';

export const TutorDashboardModule = () => {
  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Dashboard Tutor
        </h1>
        <p className="text-gray-600">
          Selamat datang di panel tutor. Kelola kursus dan pantau progress Anda.
        </p>
      </div>
      
      <div className="space-y-8">
        <TutorStatsSection />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentCoursesSection />
          <QuickActionsSection />
        </div>
      </div>
    </main>
  );
};