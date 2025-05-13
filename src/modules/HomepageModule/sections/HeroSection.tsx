import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, ChevronRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const HeroSection = () => {
  return (
    <section className="w-full py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 font-medium bg-primary/10 text-primary border-0 py-1.5">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Unlock your potential
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Stream shoot by no na
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Tingkatkan prestasimu dengan pembelajaran yang dirancang oleh pengajar profesional. Belajar kapan saja, 
              di mana saja dengan akses permanen di perangkat mobile dan desktop.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button className="h-12 px-6 font-medium">
                Jelajahi Kursus
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-12 px-6 font-medium">
                <Play className="mr-2 h-4 w-4" />
                Tonton Demo
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(id => (
                  <div 
                    key={id}
                    className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white"
                  />
                ))}
              </div>
              <div className="text-sm">
                <p className="font-semibold">4.500+ siswa</p>
                <p className="text-gray-500">Bergabunglah dengan komunitas belajar kami</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden aspect-video shadow-2xl">
              <div className="absolute inset-0 bg-gray-800/20 backdrop-blur-sm flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg cursor-pointer">
                  <Play className="h-6 w-6 ml-1 text-primary" />
                </div>
              </div>
              <div className="w-full h-full bg-gray-100"></div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 bg-white rounded-lg shadow-lg p-4 max-w-xs">
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  %
                </div>
                <div>
                  <p className="font-semibold">Penawaran Spesial</p>
                  <p className="text-xs text-gray-500">Dapatkan diskon 25% untuk semua kursus minggu ini</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;