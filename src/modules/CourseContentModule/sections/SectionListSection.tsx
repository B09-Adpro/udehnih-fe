"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  BookOpen, 
  FileText, 
  ArrowLeft,
  Settings,
  Edit,
  Trash2
} from 'lucide-react';
import { Section } from '../interface';
import Link from 'next/link';

interface SectionListSectionProps {
  courseId: number;
}

export const SectionListSection: React.FC<SectionListSectionProps> = ({ courseId }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch sections from API when content service is ready
    setIsLoading(false);
  }, [courseId]);

  if (isLoading) {
    return (
      <section className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
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
                Kelola Konten Kursus
              </h1>
              <p className="text-gray-600">
                Buat dan kelola section serta artikel untuk kursus Anda
              </p>
            </div>
            <Button className="mt-4 md:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Section
            </Button>
          </div>
        </div>

        {/* Placeholder Content - Will be implemented when content API is ready */}
        <Card className="text-center py-12">
          <CardContent>
            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Fitur Dalam Pengembangan</h3>
            <p className="text-gray-600 mb-6">
              Fitur pengelolaan konten kursus (section & artikel) sedang dalam tahap pengembangan.
              API backend untuk content management belum ready.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href={`/tutor/courses/${courseId}`}>
                  Edit Info Kursus
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/tutor/courses">
                  Kembali ke Daftar
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};