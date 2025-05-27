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
