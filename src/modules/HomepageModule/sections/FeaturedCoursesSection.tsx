"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { FEATURED_COURSES } from '../constant';
import { CoursesGridSection } from './CoursesGridSection';
import { LoginCTASection } from './LoginCTASection';
import { HomepageSectionProps } from '../interface';
import useUserData from '@/lib/hooks/useUserData';

export const FeaturedCoursesSection: React.FC<HomepageSectionProps> = () => {
  const { isAuthenticated, isLoading } = useUserData();

  const handleViewAllCourses = () => {
    if (isAuthenticated) {
      window.location.href = '/course';
    } else {
      window.location.href = `/login?returnUrl=/course`;
    }
  };

  if (isLoading) {
    return (
      <section className="w-full py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              {isAuthenticated ? 'Kursus Populer' : 'Cicipi Kursus Terbaik Kami'}
            </h2>
            <p className="text-gray-500 max-w-2xl">
              {isAuthenticated 
                ? 'Jelajahi kursus unggulan kami yang dirancang untuk membantu siswa menguasai pelajaran SMA'
                : 'Lihat sekilas kursus berkualitas tinggi dari tutor berpengalaman. Daftar untuk akses penuh!'
              }
            </p>
          </div>
          <Button 
            variant="link" 
            className="mt-4 md:mt-0 p-0 font-medium"
            onClick={handleViewAllCourses}
          >
            {isAuthenticated ? 'Lihat Semua Kursus' : 'Login untuk Lihat Semua'} →
          </Button>
        </div>

        <CoursesGridSection 
          courses={FEATURED_COURSES} 
          isLoggedIn={isAuthenticated} 
        />
        
        {!isAuthenticated && <LoginCTASection />}
      </div>
    </section>
  );
};