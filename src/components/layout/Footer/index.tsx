import React from 'react';
import { GraduationCap, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-white">Udehnih</span>
            </div>
            <p className="text-sm">
               Platform belajar online yang menyediakan kursus dan materi pembelajaran untuk semua tingkat keterampilan.    
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-sm hover:text-primary transition-colors">Facebook</a>
              <a href="#" className="text-sm hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="text-sm hover:text-primary transition-colors">Instagram</a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Jelajahi</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">Beranda</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">Kursus</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">Pengajar</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">Acara</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">Kontak</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Kategori</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">Fisika</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">Matematika</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">Bahasa</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">IPS</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">Biologi</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">Kimia</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-white" />
                <span className="text-sm">Jl. Semoga kita sukses dengan tugas yang banyak ini</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-white" />
                <span className="text-sm">+62 21 7891234</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-white" />
                <span className="text-sm">info@udehnih.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-white text-sm font-medium mb-2">Berlangganan newsletter kami</h4>
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Email Anda" 
                  className="bg-gray-800 border-gray-700 text-sm rounded-l-md rounded-r-none focus:ring-primary" 
                />
                <Button className="rounded-l-none px-3">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © 2025 Udehnih Learning Platform. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-xs hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-xs hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs hover:text-primary transition-colors">Cookie Settings</a>
              <a href="#" className="text-xs hover:text-primary transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;