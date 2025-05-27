"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EnrolledCourse } from "./interface"
import { CourseCard } from "./components/CourseCard"
import { EnrolledCoursesSkeleton } from "./components/EnrolledCoursesSkeleton"
import { Book, BookOpen, RefreshCcw } from "lucide-react"

export function EnrolledCoursesModule() {
  const router = useRouter()
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const baseUrl = process.env.NEXT_PUBLIC_COURSE_API_URL
      const apiUrl = `${baseUrl}/api/enrollment`
      
      // Get auth token
      const userStr = localStorage.getItem("user")
      let token: string | null = null
      
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr)
          token = userObj.token
        } catch {
          token = null
        }
      }
      
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan")
      }
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized, redirect to login
          router.push("/login?redirect=/dashboard/my-courses")
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setEnrolledCourses(data.courses || [])
    } catch (error) {
      console.error("Error fetching enrolled courses:", error)
      setError(error instanceof Error ? error.message : "Gagal memuat kursus terdaftar")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchEnrolledCourses()
  }, [router])
  
  // Loading state
  if (loading) {
    return <EnrolledCoursesSkeleton />
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4">
        <div className="max-w-lg w-full text-center">
          <div className="bg-red-50 p-6 rounded-lg mb-6">
            <div className="flex justify-center mb-4">
              <BookOpen className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Gagal memuat kursus</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchEnrolledCourses}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Coba lagi
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kursus Saya</h1>
          <p className="text-gray-600 mb-8">Kursus yang telah Anda daftarkan</p>
          
          {enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="flex justify-center mb-4">
                <Book className="h-16 w-16 text-gray-300" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Kursus</h2>
              <p className="text-gray-600 mb-6">
                Anda belum mendaftar ke kursus apapun. Jelajahi katalog kursus kami untuk memulai perjalanan belajar Anda.
              </p>
              <button
                onClick={() => router.push("/course")}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
              >
                Jelajahi Kursus
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id.toString()}
                  title={course.title}
                  instructor={course.instructor}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}