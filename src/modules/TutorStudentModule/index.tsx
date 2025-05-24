"use client";

import React from 'react';
import { EnrolledStudentsSection } from './sections/EnrolledStudentsSection';

interface TutorStudentsModuleProps {
  courseId: number;
}

export const TutorStudentsModule: React.FC<TutorStudentsModuleProps> = ({ courseId }) => {
  return (
    <main>
      <EnrolledStudentsSection courseId={courseId} />
    </main>
  );
};