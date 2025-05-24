"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Calendar, 
  ArrowLeft,
  Mail,
  User
} from 'lucide-react';
import { CourseService, EnrolledStudent } from '@/lib/services/course.service';
import { toast } from 'sonner';
import Link from 'next/link';

interface EnrolledStudentsSectionProps {
  courseId: number;
}

export const EnrolledStudentsSection: React.FC<EnrolledStudentsSectionProps> = ({ courseId }) => {
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<EnrolledStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [courseId]);

  useEffect(() => {
    // Filter students based on search term
    const filtered = students.filter(student =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [students, searchTerm]);

  const fetchStudents = async () => {
    try {
      const data = await CourseService.getEnrolledStudents(courseId);
      setStudents(data);
      setFilteredStudents(data);
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat data siswa');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <section className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/tutor/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Kursus
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Siswa Terdaftar
              </h1>
              <p className="text-gray-600">
                Kelola dan pantau siswa yang terdaftar di kursus Anda
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Badge variant="outline" className="text-lg px-3 py-1">
                {students.length} Siswa
              </Badge>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Daftar Siswa
              </div>
            </CardTitle>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari siswa berdasarkan nama atau ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                {students.length === 0 ? (
                  <>
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Belum Ada Siswa</h3>
                    <p className="text-gray-600">
                      Belum ada siswa yang terdaftar di kursus ini
                    </p>
                  </>
                ) : (
                  <>
                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Tidak Ada Hasil</h3>
                    <p className="text-gray-600">
                      Tidak ditemukan siswa dengan kata kunci "{searchTerm}"
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStudents.map((student, index) => (
                  <div
                    key={student.studentId}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
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
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Calendar className="h-4 w-4" />
                        <span>Bergabung: {formatDate(student.enrolledAt)}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Siswa #{index + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};