export interface CourseListDTO {
  id: number;
  title: string;
  category: string;
  instructor: string;
  price: number;
}

export interface ApiResponse {
  courses: CourseListDTO[];
}

export interface CoursesByCategory {
  [category: string]: CourseListDTO[];
}

export interface UseCourseResult {
  data: CoursesByCategory | null;
  rawData: CourseListDTO[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface CourseCardProps {
  course: CourseListDTO;
}

export interface CourseHeaderProps {
  totalCourses: number;
  categories: string[];
  isLoading: boolean;
}

export interface CourseFiltersProps {
  categories: string[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

export interface CourseGridProps {
  courseData: CoursesByCategory | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export interface CourseFooterProps {
  categories: string[];
}