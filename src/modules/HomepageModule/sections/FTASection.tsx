import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ArrowRight } from 'lucide-react';

export const FTASection = () => {
  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Mulai Perjalanan Belajar Anda Hari Ini
          </h2>
          <p className="text-gray-500 max-w-2xl">
            Baru di platform kami? Ikuti langkah-langkah sederhana untuk memulai belajar keterampilan baru
            dan meningkatkan karir Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <span className="font-bold text-primary">01</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Buat Akun</h3>
              <p className="text-gray-500 mb-4">
                Daftar dalam waktu kurang dari satu menit dan dapatkan akses langsung ke kursus gratis.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-primary h-5 w-5 mr-2 mt-0.5" />
                  <span className="text-sm">Dashboard personalisasi</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-primary h-5 w-5 mr-2 mt-0.5" />
                  <span className="text-sm">Pelacakan kemajuan</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-primary h-5 w-5 mr-2 mt-0.5" />
                  <span className="text-sm">Sertifikat setelah penyelesaian</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <span className="font-bold text-primary">02</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Jelajahi Kursus</h3>
              <p className="text-gray-500 mb-4">
                Jelajahi katalog kursus dari pengajar profesional di berbagai disiplin.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-primary h-5 w-5 mr-2 mt-0.5" />
                  <span className="text-sm">Filter berdasarkan tingkat keterampilan</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-primary h-5 w-5 mr-2 mt-0.5" />
                  <span className="text-sm">Baca silabus rinci</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-primary h-5 w-5 mr-2 mt-0.5" />
                  <span className="text-sm">Pratinjau materi kursus</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <span className="font-bold text-primary">03</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Mulai Belajar</h3>
              <p className="text-gray-500 mb-4">
                Daftar dalam kursus pilihan Anda dan mulai belajar pada kecepatan Anda sendiri.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-primary h-5 w-5 mr-2 mt-0.5" />
                  <span className="text-sm">Pelajaran interaktif</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-primary h-5 w-5 mr-2 mt-0.5" />
                  <span className="text-sm">Proyek praktik</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-primary h-5 w-5 mr-2 mt-0.5" />
                  <span className="text-sm">Dukungan komunitas</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mt-12">
          <Button className="group">
            Mulai Sekarang
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FTASection;