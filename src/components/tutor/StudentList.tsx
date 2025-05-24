"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar } from 'lucide-react';
import { EnrolledStudent } from '@/lib/services/course.service';

interface StudentListProps {
  students: EnrolledStudent[];
  isLoading?: boolean;
}

export const StudentList: React.FC<StudentListProps> = ({ students, isLoading = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Belum Ada Siswa</h3>
          <p className="text-gray-600">
            Belum ada siswa yang terdaftar di kursus ini
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {students.map((student, index) => (
        <Card key={student.studentId} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 bg-primary/10 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {student.studentName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    ID: {student.studentId}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(student.enrolledAt)}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Siswa #{index + 1}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};