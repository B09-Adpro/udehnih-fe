"use client"

import { BookOpen, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CourseCard } from "../components/CourseCard"
import { CourseSkeletonCard } from "../components/CourseSkeletonCard"
import { CourseGridProps } from "../interface"

export function CourseGrid({ 
  courseData, 
  isLoading, 
  error, 
  onRetry, 
  searchQuery,
  setSearchQuery 
}: CourseGridProps) {
  // Loading State
  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, index) => (
            <CourseSkeletonCard key={index} />
          ))}
        </div>
      </main>
    )
  }

  // Error State
  if (error) {
    return (
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="text-center py-12">
          <div className="bg-red-50 rounded-lg p-6 max-w-lg mx-auto">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={onRetry} variant="outline">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Coba Lagi
            </Button>
          </div>
        </div>
      </main>
    )
  }

  // Empty State
  if (!courseData || Object.keys(courseData).length === 0) {
    return (
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery ? "Tidak ada kursus yang sesuai dengan pencarian" : "Belum Ada Kursus"}
          </h3>
          <p className="text-gray-600">
            {searchQuery ? `Coba kata kunci lain atau reset filter Anda` : `Kursus akan segera tersedia. Silakan cek kembali nanti.`}
          </p>
          {searchQuery && (
            <Button onClick={() => setSearchQuery("")} className="mt-4">
              Reset Pencarian
            </Button>
          )}
        </div>
      </main>
    )
  }

  // Course List
  return (
    <main className="container mx-auto px-4 py-12 flex-1">
      <div className="space-y-12">
        {Object.entries(courseData).map(([category, courses]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}