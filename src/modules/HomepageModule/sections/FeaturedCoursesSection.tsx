import React from 'react';
import { FEATURED_COURSES, CATEGORIES } from '../constant';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, BarChart } from 'lucide-react';

export const FeaturedCoursesSection = () => {
  return (
    <section className="w-full py-20">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Kursus Populer
            </h2>
            <p className="text-gray-500 max-w-2xl">
              Jelajahi kursus unggulan kami yang dirancang untuk membantu siswa menguasai pelajaran SMA
            </p>
          </div>
          <Button variant="link" className="mt-4 md:mt-0 p-0 font-medium">
            Lihat Semua Kursus
          </Button>
        </div>

        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="mb-8">
            <TabsTrigger value="all" className="rounded-full">Semua</TabsTrigger>
            <TabsTrigger value="sains" className="rounded-full">Sains</TabsTrigger>
            <TabsTrigger value="matematika" className="rounded-full">Matematika</TabsTrigger>
            <TabsTrigger value="bahasa" className="rounded-full">Bahasa</TabsTrigger>
            <TabsTrigger value="ips" className="rounded-full">IPS</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_COURSES.map((course) => (
              <Card key={course.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all">
                <div className="relative h-48 bg-gray-100">
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="font-medium bg-primary/10 text-primary border-0">
                      {course.category}
                    </Badge>
                    <span className="font-bold text-primary">{course.price}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{course.description}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <BarChart className="h-4 w-4 mr-1 text-gray-400" />
                      {course.level}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 mr-2"></div>
                    <span className="text-sm font-medium">{course.instructor}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    Detail
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="sains">
            <div className="text-center py-12">
              <p className="text-gray-500">Konten kategori Sains akan muncul di sini</p>
            </div>
          </TabsContent>

          <TabsContent value="matematika">
            <div className="text-center py-12">
              <p className="text-gray-500">Konten kategori Matematika akan muncul di sini</p>
            </div>
          </TabsContent>

          <TabsContent value="bahasa">
            <div className="text-center py-12">
              <p className="text-gray-500">Konten kategori Bahasa akan muncul di sini</p>
            </div>
          </TabsContent>

          <TabsContent value="ips">
            <div className="text-center py-12">
              <p className="text-gray-500">Konten kategori IPS akan muncul di sini</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((category) => (
            <Card key={category.id} className="border-0 shadow-sm hover:shadow transition-all cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                  {category.icon === 'Calculator' && <span>🧮</span>}
                  {category.icon === 'Flask' && <span>🧪</span>}
                  {category.icon === 'Book' && <span>📚</span>}
                  {category.icon === 'Globe' && <span>🌏</span>}
                  {category.icon === 'Monitor' && <span>💻</span>}
                  {category.icon === 'GraduationCap' && <span>🎓</span>}
                </div>
                <h3 className="font-medium text-sm">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.count} kursus</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
