import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, BarChart, Lock, Star, Users } from 'lucide-react';
import { CourseCardProps } from '../interface';

export const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  isBlurred = false, 
  showIndex 
}) => {
  const handleLoginRedirect = () => {
    window.location.href = `/login?returnUrl=/course`;
  };

  const handleCourseClick = () => {
    if (!isBlurred) {
      window.location.href = `/course`;
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Matematika': '🧮',
      'Sains': '🧪',
      'Bahasa': '📖',
      'IPS': '🌏',
      'Teknologi': '💻'
    };
    return icons[category] || '📚';
  };

  return (
    <Card 
      className={`overflow-hidden border-0 shadow-md hover:shadow-lg transition-all group relative cursor-pointer`}
      onClick={isBlurred ? handleLoginRedirect : handleCourseClick}
    >
      {isBlurred && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center p-6">
            <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h4 className="font-semibold text-gray-700 mb-2">Login untuk Melihat</h4>
            <p className="text-sm text-gray-500 mb-4">Daftar gratis untuk mengakses semua kursus</p>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                handleLoginRedirect();
              }}
              className="bg-primary hover:bg-primary/90 text-white"
              size="sm"
            >
              <Lock className="h-4 w-4 mr-2" />
              Login Sekarang
            </Button>
          </div>
        </div>
      )}

      {showIndex && (
        <div className="absolute top-3 left-3 z-20">
          <Badge className="bg-blue-500 text-white border-0 text-xs">
            #{showIndex}
          </Badge>
        </div>
      )}

      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl opacity-20">
            {getCategoryIcon(course.category)}
          </div>
        </div>
        
        {course.isPopular && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-500 text-white border-0">
              🔥 Populer
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge className="font-medium bg-primary/10 text-primary border-0">
            {course.category}
          </Badge>
          <span className="font-bold text-primary">{course.price}</span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-400" />
            {course.duration}
          </div>
          <div className="flex items-center">
            <BarChart className="h-4 w-4 mr-1 text-gray-400" />
            {course.level}
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-gray-400" />
            {course.students || Math.floor(Math.random() * 100) + 20} siswa
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
            {course.rating || (4 + Math.random()).toFixed(1)}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 mr-2 flex items-center justify-center text-white text-xs font-bold">
            {course.instructor ? course.instructor.slice(0, 2).toUpperCase() : 'T'}
          </div>
          <span className="text-sm font-medium">{course.instructor}</span>
        </div>
        
        {isBlurred ? (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-3 hover:bg-primary hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleLoginRedirect();
            }}
          >
            <Lock className="h-4 w-4 mr-1" />
            Login
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-3 hover:bg-primary hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleCourseClick();
            }}
          >
            Detail
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};