export interface TutorStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
  totalRevenue: number;
}

export interface RecentActivity {
  id: string;
  type: 'course_created' | 'student_enrolled' | 'course_published';
  title: string;
  description: string;
  timestamp: string;
}

export interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}