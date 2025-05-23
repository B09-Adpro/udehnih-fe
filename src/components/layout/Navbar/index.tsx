"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Menu, ChevronDown, GraduationCap, LogOut } from 'lucide-react';
import Link from 'next/link';
import useUserData from '@/lib/hooks/useUserData';
import { toast } from 'sonner';

export const Navbar = () => {
  const { userData, isAuthenticated, logout, isLoading } = useUserData();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Berhasil keluar');
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error('Gagal keluar');
    }
  };

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">Udehnih</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100">
              Beranda
            </Link>
            <div className="relative group">
              <button className="px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100 flex items-center">
                Kursus
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 top-full w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="p-2">
                  <Link href="/courses/fisika" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                    Fisika
                  </Link>
                  <Link href="/courses/matematika" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                    Matematika
                  </Link>
                  <Link href="/courses/bahasa" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                    Bahasa
                  </Link>
                  <Link href="/courses/ips" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                    IPS
                  </Link>
                  <Link href="/courses/biologi" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                    Biologi
                  </Link>
                  <Link href="/courses/kimia" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                    Kimia
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/instructors" className="px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100">
              Pengajar
            </Link>
            <Link href="/events" className="px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100">
              Acara
            </Link>
          </nav>

          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari kursus..."
              className="pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-full w-48 focus:w-64 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : isAuthenticated && userData ? (
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
                    <span>Hai, {userData.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 top-full w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-2">
                      <Link href="/profile" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                        Profil
                      </Link>
                      <Link href="/dashboard" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                        Dashboard
                      </Link>
                      <Link href="/reports" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                        Laporan
                      </Link>
                      <hr className="my-1" />
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-red-600"
                      >
                        <LogOut className="inline h-4 w-4 mr-2" />
                        Keluar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Button variant="ghost" className="text-sm font-medium">
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button className="text-sm font-medium">
                  <Link href="/register">Daftar</Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex md:hidden">
            <button className="p-1 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;