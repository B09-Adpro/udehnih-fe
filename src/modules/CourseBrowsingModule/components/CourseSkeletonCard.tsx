"use client"

export function CourseSkeletonCard() {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm animate-pulse bg-white">
      <div className="p-5">
        <div className="bg-gray-200 h-4 w-16 rounded mb-4"></div>
        <div className="bg-gray-300 h-6 w-3/4 rounded mb-4"></div>
        <div className="flex items-center mb-4">
          <div className="bg-gray-200 h-4 w-4 rounded-full mr-2"></div>
          <div className="bg-gray-200 h-4 w-28 rounded"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="bg-gray-300 h-6 w-20 rounded"></div>
          <div className="bg-gray-300 h-8 w-28 rounded"></div>
        </div>
      </div>
    </div>
  )
}