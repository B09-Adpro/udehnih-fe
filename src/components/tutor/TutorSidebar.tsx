"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  BookOpen, 
  Plus, 
  Users, 
  BarChart3, 
  Settings, 
  Home,
  FileText,
  CheckCircle
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/tutor',
    icon: Home,
  },
  {
    name: 'Kelola Kursus',
    href: '/tutor/courses',
    icon: BookOpen,
  },
  {
    name: 'Buat Kursus',
    href: '/tutor/courses/create',
    icon: Plus,
  },
  {
    name: 'Status Aplikasi',
    href: '/tutor/status',
    icon: CheckCircle,
  },
];

export const TutorSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <Link href="/tutor" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">Tutor Panel</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/tutor' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
          >
            <Home className="h-5 w-5" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};