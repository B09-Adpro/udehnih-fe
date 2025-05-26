"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CourseContent, CourseLearnModuleProps, Article } from "./interface"
import { LearnSidebar } from "./components/LearnSidebar"
import { ArticleContent } from "./components/ArticleContent"
import { LearnSkeleton } from "./components/LearnSkeleton"
import { ChevronLeft, AlertTriangle, Lock } from "lucide-react"

export function CourseLearnModule({ courseId }: CourseLearnModuleProps) {
  const router = useRouter()
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeArticleId, setActiveArticleId] = useState<number | null>(null)
  const [activeArticle, setActiveArticle] = useState<Article | null>(null)
  const [accessDenied, setAccessDenied] = useState(false)

  const fetchCourseContent = async () => {
    try {
      setLoading(true)
      setError(null)
      setAccessDenied(false)
      
      const baseUrl = process.env.NEXT_PUBLIC_COURSE_API_URL
      const apiUrl = `${baseUrl}/api/courses/${courseId}/content`
      
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
          router.push(`/login?redirect=/course/${courseId}/learn`)
          return
        }
        
        if (response.status === 403) {
          // Forbidden, user doesn't have access to this course
          setAccessDenied(true)
          return
        }
        
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: CourseContent = await response.json()
      setCourseContent(data)
      
      // Set default active article (first article of first section)
      if (data.sections && data.sections.length > 0) {
        const firstSection = data.sections[0]
        if (firstSection.articles && firstSection.articles.length > 0) {
          const firstArticle = firstSection.articles[0]
          setActiveArticleId(firstArticle.id)
          setActiveArticle(firstArticle)
        }
      }
    } catch (error) {
      console.error("Error fetching course content:", error)
      setError(error instanceof Error ? error.message : "Gagal memuat materi kursus")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchCourseContent()
  }, [courseId])
  
  const handleSelectArticle = (sectionId: number, articleId: number) => {
    setActiveArticleId(articleId)
    
    // Find the article from course content
    if (courseContent) {
      const section = courseContent.sections.find(s => s.id === sectionId)
      if (section) {
        const article = section.articles.find(a => a.id === articleId)
        if (article) {
          setActiveArticle(article)
        }
      }
    }
  }
  
  const handleBackToCourse = () => {
    router.push(`/course/${courseId}`)
  }
  
  // Loading state
  if (loading) {
    return <LearnSkeleton />
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
        <div className="max-w-lg w-full text-center">
          <div className="bg-red-50 p-6 rounded-lg mb-6">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Gagal memuat materi</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={fetchCourseContent}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none"
              >
                Coba lagi
              </button>
              <button
                onClick={handleBackToCourse}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Kembali ke detail kursus
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Access denied state
  if (accessDenied) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
        <div className="max-w-lg w-full text-center">
          <div className="bg-yellow-50 p-6 rounded-lg mb-6">
            <div className="flex justify-center mb-4">
              <Lock className="h-12 w-12 text-yellow-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Akses Dibatasi</h2>
            <p className="text-gray-600 mb-4">
              Anda tidak memiliki akses ke materi kursus ini. 
              Silakan daftar atau beli kursus ini untuk mengakses materinya.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleBackToCourse}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Kembali ke detail kursus
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // No content state
  if (!courseContent || !courseContent.sections || courseContent.sections.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
        <div className="max-w-lg w-full text-center">
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Materi</h2>
            <p className="text-gray-600 mb-4">
              Materi kursus ini sedang dipersiapkan dan akan segera tersedia.
            </p>
            <button
              onClick={handleBackToCourse}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Kembali ke detail kursus
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Course title header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={handleBackToCourse}
              className="mr-3 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{courseContent.title}</h1>
              <p className="text-sm text-gray-600">Oleh: {courseContent.instructor}</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto hidden md:block">
          <LearnSidebar 
            course={courseContent} 
            activeArticleId={activeArticleId}
            onSelectArticle={handleSelectArticle}
          />
        </div>
        
        {/* Article content */}
        <div className="flex-1 overflow-y-auto">
          <ArticleContent 
            article={activeArticle} 
            courseTitle={courseContent.title}
          />
        </div>
      </div>
      
      {/* Mobile navigation for sidebar (fixed at bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3">
        <div className="flex justify-between items-center">
          <button
            onClick={() => document.getElementById('mobile-sidebar')?.classList.toggle('hidden')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Daftar Materi
          </button>
          
          <div className="text-sm font-medium text-gray-700 truncate max-w-[60%]">
            {activeArticle?.title || "Pilih materi"}
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar (hidden by default) */}
      <div id="mobile-sidebar" className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 hidden md:hidden">
        <div className="fixed inset-0 flex">
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-medium text-gray-900">Daftar Materi</h2>
              <button
                onClick={() => document.getElementById('mobile-sidebar')?.classList.add('hidden')}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Tutup menu</span>
                {/* X icon */}
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <LearnSidebar 
                course={courseContent} 
                activeArticleId={activeArticleId}
                onSelectArticle={(sectionId, articleId) => {
                  handleSelectArticle(sectionId, articleId)
                  document.getElementById('mobile-sidebar')?.classList.add('hidden')
                }}
              />
            </div>
          </div>
          <div className="flex-shrink-0 w-14"></div>
        </div>
      </div>
    </div>
  )
}