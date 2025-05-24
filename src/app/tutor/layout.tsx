"use client";

import React from 'react';
import { TutorSidebar } from '@/components/tutor/TutorSidebar';
import useUserData from '@/lib/hooks/useUserData';
import { Card, CardContent } from '@/components/ui/card';

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated, isTutor } = useUserData();

  // Debug logs untuk TutorLayout
  console.log("=== TUTOR LAYOUT DEBUG ===");
  console.log("isLoading:", isLoading);
  console.log("isAuthenticated:", isAuthenticated);
  console.log("isTutor():", isTutor());
  console.log("========================");

  if (isLoading) {
    console.log("TutorLayout: Showing loading state");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("TutorLayout: User not authenticated, showing login prompt");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">Anda perlu login untuk mengakses halaman ini.</p>
            <a href="/login" className="text-primary hover:underline">
              Login di sini
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log("TutorLayout: Rendering tutor layout with sidebar");
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TutorSidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}