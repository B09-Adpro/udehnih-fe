import React from 'react';
import { CourseCard } from '../components/CourseCard';
import { FeaturedCourse } from '../interface';

interface CoursesGridSectionProps {
  courses: FeaturedCourse[];
  isLoggedIn: boolean;
}

export const CoursesGridSection: React.FC<CoursesGridSectionProps> = ({ 
  courses, 
  isLoggedIn 
}) => {
  const visibleCourses = isLoggedIn ? courses : courses.slice(0, 3);
  const blurredCourses = isLoggedIn ? [] : courses.slice(3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {visibleCourses.map((course, index) => (
        <CourseCard 
          key={course.id} 
          course={course} 
          showIndex={!isLoggedIn ? index + 1 : undefined}
        />
      ))}

      {blurredCourses.map((course, index) => (
        <CourseCard 
          key={`blurred-${course.id}`} 
          course={course} 
          isBlurred={true}
          showIndex={visibleCourses.length + index + 1}
        />
      ))}
    </div>
  );
};