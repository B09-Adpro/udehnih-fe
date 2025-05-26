export interface CourseDetail {
  id: number;
  title: string;
  category: string;
  instructor: string;
  price: number;
  description: string;
  created_at: string;
  updated_at: string;
  sections: any[];
  _free: boolean;
}

export interface UseCourseDetailResult {
  data: CourseDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface HeaderProps {
  title: string;
  category: string;
  instructor: string;
  onBack: () => void;
}

export interface DescriptionProps {
  description: string;
}

export interface EnrollmentProps {
  courseId: string;
  price: number;
  title: string;
  isFree: boolean;
  enrolling: boolean;
  onEnroll: () => void;
  onViewContent: () => void;
}