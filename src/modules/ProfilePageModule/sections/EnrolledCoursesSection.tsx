import React from 'react';
import { FEATURED_COURSES } from '../constant';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, BarChart } from 'lucide-react';

export const EnrolledCoursesSection = () => {
  return (
    <section className="w-full pb-20">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Kursus Terdaftar
            </h2>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="mb-4">
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

      </div>
    </section>
  );
};
