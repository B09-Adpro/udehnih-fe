import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ArrowRight, Star, Users } from 'lucide-react';

export const LoginCTASection: React.FC = () => {
  const handleRegisterRedirect = () => {
    window.location.href = `/register`;
  };

  const handleLoginRedirect = () => {
    window.location.href = `/login`;
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mt-12">
      <div className="max-w-2xl mx-auto">
        <Eye className="h-16 w-16 mx-auto mb-4 opacity-90" />
        <h3 className="text-2xl font-bold mb-4">
          Lihat Semua Kursus Berkualitas
        </h3>
        <p className="text-blue-100 mb-6 text-lg">
          Daftar sekarang untuk mengakses lebih dari <span className="font-bold">100+ kursus</span> dari tutor terbaik. 
          Mulai belajar dengan materi yang disesuaikan dengan kurikulum sekolah.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <div className="flex items-center text-blue-100">
            <Star className="h-5 w-5 mr-2 text-yellow-300" />
            <span>Rating 4.8/5 dari 1000+ siswa</span>
          </div>
          <div className="flex items-center text-blue-100">
            <Users className="h-5 w-5 mr-2" />
            <span>5000+ siswa aktif</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleRegisterRedirect}
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3"
            size="lg"
          >
            Daftar Gratis
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <Button 
            onClick={handleLoginRedirect}
            className="bg-white text-blue-600 hover:bg-gray-100 border-0 px-8 py-3"
            size="lg"
          >
            Sudah Punya Akun? Login
          </Button>
        </div>
      </div>
    </div>
  );
};