"use client"

import { CourseHeaderProps } from "../interface"

export function CourseHeader({ totalCourses, categories, isLoading }: CourseHeaderProps) {
  return (
    <section className="py-16 border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Jelajahi Kursus</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
          Temukan berbagai kursus terbaik yang dirancang untuk membantu Anda berkembang, 
          memperluas wawasan, dan meningkatkan keterampilan sesuai minat.
        </p>
        {!isLoading && (
          <div className="flex items-center justify-center gap-4 text-lg text-gray-500">
            <span>{totalCourses} kursus tersedia</span>
            <span>•</span>
            <span>{categories.length} kategori</span>
          </div>
        )}
      </div>
    </section>
  )
}