"use client";

import React from 'react';
import { SectionListSection } from './sections/SectionListSection';

interface CourseContentModuleProps {
  courseId: number;
}

export const CourseContentModule: React.FC<CourseContentModuleProps> = ({ courseId }) => {
  return (
    <main>
      <SectionListSection courseId={courseId} />
    </main>
  );
};
