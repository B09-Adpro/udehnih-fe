import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Send, Mail } from 'lucide-react';

export const NewsletterSection = () => {
  return (
    <section className="w-full py-16 bg-primary text-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl mb-8 lg:mb-0">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/10 mb-6">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Dapatkan Pembaruan Terbaru
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              Dapatkan pembaruan terbaru tentang kursus baru, workshop, dan penawaran eksklusif. Bergabunglah dengan newsletter kami dan jangan pernah melewatkan kesempatan untuk meningkatkan keterampilan Anda.
            </p>
          </div>
          
          <div className="w-full max-w-md">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-900 font-semibold mb-4">Berlangganan Newsletter Kami</h3>
              <div className="flex flex-col space-y-4">
                <div>
                  <Input 
                    type="text" 
                    placeholder="Nama Lengkap" 
                    className="h-12 border-gray-200 focus:border-primary"
                  />
                </div>
                <div>
                  <Input 
                    type="email" 
                    placeholder="Alamat Email" 
                    className="h-12 border-gray-200 focus:border-primary"
                  />
                </div>
                <div className="flex text-xs text-gray-500 items-start space-x-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>Kami menghormati privasi Anda. Berhenti berlangganan kapan saja.</p>
                </div>
                <Button className="w-full h-12">
                  Berlangganan Sekarang
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;