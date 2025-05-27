export interface FeaturedCourse {
    id: number;
    title: string;
    description: string;
    category: string;
    price: string;
    duration: string;
    level: string;
    instructor: string;
    isPopular?: boolean;
    students?: number;
    rating?: string;
}

export interface CourseCardProps {
    course: FeaturedCourse;
    isBlurred?: boolean;
    showIndex?: number;
}

export interface Category {
    id: number;
    name: string;
    count: number;
    icon: string;
}

export interface HomepageSectionProps {
    isLoggedIn?: boolean;
}

export interface NavigationProps {
    onLoginRedirect?: () => void;
    onCourseRedirect?: () => void;
}