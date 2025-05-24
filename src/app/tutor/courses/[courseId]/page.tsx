"use client";

import React from 'react';
import { CourseEditSection } from '@/modules/CourseManagementModule/sections/CourseEditSection';
import { useParams } from 'next/navigation';

const CourseDetailPage = () => {
  const params = useParams();
  const courseId = parseInt(params.courseId as string);

  if (isNaN(courseId)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Course ID</h1>
          <a href="/tutor/courses" className="text-primary hover:underline">
            Back to Courses
          </a>
        </div>
      </div>
    );
  }

  return <CourseEditSection courseId={courseId} />;
};

export default CourseDetailPage;