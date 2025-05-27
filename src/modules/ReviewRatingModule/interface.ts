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
  
  export interface StarRatingProps {
    rating: number
    size?: 'sm' | 'md' | 'lg'
    showNumber?: boolean
  }

  export interface ReviewRatingModuleProps {
    courseId: string
  }