"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Calendar, ChevronLeft, Clock, RefreshCcw, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCourseDetail } from "./hooks/useCourseDetail"
import { Header } from "./sections/Header"
import { Description } from "./sections/Description"
import { Enrollment } from "./sections/Enrollment"
import { CourseDetailSkeleton } from "./components/CourseDetailSkeleton"
import ReviewRatingModule from "../ReviewRatingModule"

interface CourseDetailModuleProps {
  courseId: string
}

export function CourseDetailModule({ courseId }: CourseDetailModuleProps) {
  const router = useRouter()
  const { data: course, loading, error, refetch } = useCourseDetail(courseId)
  const [enrolling, setEnrolling] = useState(false)

  // Redirect to course content if user has already purchased
  const handleViewContent = () => {
    router.push(`/course/${courseId}/content`)
  }

  // Enroll/Purchase course
  const handleEnroll = async () => {
    try {
      setEnrolling(true)
      // Call API to enroll/purchase course
      // ...

      // Redirect to payment page or show success
      router.push(`/checkout?courseId=${courseId}`)
    } catch (error) {
      console.error("Failed to enroll:", error)
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return <CourseDetailSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="mr-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </div>
          
          <div className="bg-red-50 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="mr-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </div>
          
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Kursus Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-6">
              Kursus yang Anda cari mungkin telah dihapus atau tidak tersedia.
            </p>
            <Button onClick={() => router.push('/course')}>
              Lihat Semua Kursus
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        title={course.title}
        category={course.category}
        instructor={course.instructor}
        onBack={() => router.back()}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <Description 
                description={course.description || "Tidak ada deskripsi tersedia untuk kursus ini."}
              />
              
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Informasi Kursus</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Terakhir Diperbarui</p>
                      <p className="font-medium">{new Date(course.updated_at).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Instruktur</p>
                      <p className="font-medium">{course.instructor}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Dibuat Pada</p>
                      <p className="font-medium">{new Date(course.created_at).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Kategori</p>
                      <p className="font-medium">{course.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <Enrollment 
                courseId={course.id.toString()}
                price={course.price}
                title={course.title}
                isFree={course._free}
                onEnroll={handleEnroll}
                onViewContent={handleViewContent}
                enrolling={enrolling}
              />
            </div>
          </div>

          {/* Reviews Section */}
          <div className="max-w-4xl mx-auto">
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-6">Ulasan & Rating</h2>
              <ReviewRatingModule courseId={courseId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}