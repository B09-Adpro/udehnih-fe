"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export const QuickActionsSection = () => {
  const actions = [
    {
      title: 'Buat Kursus Baru',
      description: 'Mulai membuat kursus untuk berbagi pengetahuan',
      href: '/tutor/courses/create',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Kelola Kursus',
      description: 'Edit dan kelola kursus yang sudah ada',
      href: '/tutor/courses',
      icon: BookOpen,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Lihat Siswa',
      description: 'Pantau siswa yang terdaftar di kursus Anda',
      href: '/tutor/courses',
      icon: Users,
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Aksi Cepat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start h-auto p-4"
              asChild
            >
              <Link href={action.href}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md ${action.color} text-white`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-sm">{action.title}</h4>
                    <p className="text-xs text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};