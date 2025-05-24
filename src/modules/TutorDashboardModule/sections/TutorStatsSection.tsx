"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, DollarSign, Eye } from 'lucide-react';
import { CourseService, TutorCourse } from '@/lib/services/course.service';

export const TutorStatsSection = () => {
  const [courses, setCourses] = useState<TutorCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await CourseService.getTutorCourses();
      setCourses(data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const stats = [
    {
      title: 'Total Kursus',
      value: courses.length,
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      title: 'Kursus Diterbitkan',
      value: courses.filter(c => c.status === 'PUBLISHED').length,
      icon: Eye,
      color: 'text-green-600'
    },
    {
      title: 'Total Siswa',
      value: courses.reduce((sum, course) => sum + course.enrollmentCount, 0),
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Pendapatan',
      value: formatPrice(courses.reduce((sum, course) => 
        sum + (course.price * course.enrollmentCount), 0
      )),
      icon: DollarSign,
      color: 'text-yellow-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold">
                  {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};