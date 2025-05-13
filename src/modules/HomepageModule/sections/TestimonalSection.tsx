import React from 'react';
import { TESTIMONIALS } from '../constant';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection = () => {
  return (
    <section className="w-full py-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <Badge className="mb-4 font-medium bg-primary/10 text-primary border-0 py-1.5">
            Student Reviews
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Apa yang Mereka Katakan
          </h2>
          <p className="text-gray-500 max-w-2xl">
            Dengar pengalaman dari para siswa kami tentang pengalaman belajar mereka dan bagaimana kursus kami telah mempengaruhi karir mereka
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/20" />
                  <p className="text-gray-600 relative z-10">
                    {testimonial.content}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 flex flex-col items-center">
          <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 max-w-3xl relative">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="h-16 w-16 md:h-24 md:w-24 rounded-full bg-gray-200 flex-shrink-0"></div>
              <div>
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">
                  "Belajar di platform ini sangat membantu saya meningkatkan keterampilan saya. Materi yang diberikan sangat komprehensif dan mudah dipahami. Saya sangat merekomendasikan platform ini kepada teman-teman saya."
                </p>
                <div>
                  <h4 className="font-semibold">Grace Karina</h4>
                  <p className="text-sm text-gray-500">Software Developer at Google</p>
                </div>
              </div>
            </div>
            <Quote className="absolute top-6 left-6 h-12 w-12 text-primary/10 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;