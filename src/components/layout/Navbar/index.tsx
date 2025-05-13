import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, ChevronDown, GraduationCap } from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">Udehnih</span>
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <a href="/" className="px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100">
              Beranda
            </a>
            <div className="relative group">
              <button className="px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100 flex items-center">
                Kursus
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 top-full w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="p-2">
                  <a href="/courses/development" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                    Fisika
                  </a>
                  <a href="/courses/design" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                    Matematika
                  </a>
                  <a href="/courses/business" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                    Bahasa
                  </a>
                  <a href="/courses/marketing" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                    IPS
                  </a>
                  <a href="/courses/data-science" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                    Biologi
                  </a>
                  <a href="/courses/data-science" className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                    Kimia
                  </a>
                </div>
              </div>
            </div>
            <a href="/instructors" className="px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100">
              Pengajar
            </a>
            <a href="/pricing" className="px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100">
              Acara
            </a>
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
            <Button variant="ghost" className="text-sm font-medium">
              Masuk
            </Button>
            <Button className="text-sm font-medium">
              Daftar
            </Button>
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