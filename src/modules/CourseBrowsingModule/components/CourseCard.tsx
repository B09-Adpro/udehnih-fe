"use client"

import { User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CourseCardProps } from "../interface"

export function CourseCard({ course }: CourseCardProps) {
  const formattedPrice = course.price > 0 
    ? `Rp ${course.price.toLocaleString('id-ID')}` 
    : "Gratis"

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="p-5">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
            {course.category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <User className="mr-1 h-4 w-4" />
          <span>{course.instructor}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="font-bold text-lg">
            {formattedPrice}
          </div>
          <Link href={`/course/${course.id}`}>
            <Button size="sm">Detail Kursus</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}