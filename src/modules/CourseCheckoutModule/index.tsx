"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCourseDetail } from "@/modules/CourseDetailModule/hooks/useCourseDetail"
import { PaymentMethodSelector } from "./components/PaymentMethodSelector"
import { CheckoutSummary } from "./components/CheckoutSummary"
import { EnrollmentResponse } from "./interface"
import { CheckCircle, AlertTriangle } from "lucide-react"
import { formatPriceIDR } from "../CourseDetailModule/utils"

interface CourseCheckoutModuleProps {
  courseId: string
}

export type PaymentMethod = "Bank Transfer" | "Credit Card"

export function CourseCheckoutModule({ courseId }: CourseCheckoutModuleProps) {
  const router = useRouter()
  const { data: course, loading: loadingCourse, error: courseError } = useCourseDetail(courseId)
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [enrollmentResult, setEnrollmentResult] = useState<EnrollmentResponse | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  
  // Check if user is authenticated on mount
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        if (userData.token) {
          setIsAuthenticated(true)
        } else {
          // Redirect to login if no token
          router.push(`/login?redirect=/checkout?courseId=${courseId}`)
        }
      } catch (error) {
        // Redirect to login on parse error
        router.push(`/login?redirect=/checkout?courseId=${courseId}`)
      }
    } else {
      // Redirect to login if no user data
      router.push(`/login?redirect=/checkout?courseId=${courseId}`)
    }
  }, [courseId, router])

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method)
    setFormError(null)
  }

  const handleSubmitEnrollment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPaymentMethod) {
      setFormError("Silakan pilih metode pembayaran")
      return
    }

    try {
      setIsSubmitting(true)
      setFormError(null)
      
      const baseUrl = process.env.NEXT_PUBLIC_COURSE_API_URL
      const apiUrl = `${baseUrl}/api/enrollment`
      
      // Get auth token
      const userStr = localStorage.getItem("user")
      let token: string | null = null
      let userId: string | null = null
      
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr)
          token = userObj.token
          userId = userObj.id || null
        } catch {
          token = null
        }
      }
      
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan")
      }

      // Prepare form data
      const formData = new FormData()
      if (userId) {
        formData.append('studentId', userId)
      }
      formData.append('courseId', courseId)
      formData.append('payment_method', selectedPaymentMethod)
      
      // Kirim permintaan ke API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Gagal mendaftar kursus")
      }
      
      const result = await response.json()
      setEnrollmentResult(result)
      
    } catch (error) {
      console.error("Enrollment error:", error)
      setFormError(error instanceof Error ? error.message : "Terjadi kesalahan saat mendaftar kursus")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated && !loadingCourse) {
    return null // Will redirect in useEffect
  }

  if (loadingCourse) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
              <div className="md:col-span-1">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (courseError || !course) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Kursus Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">
            {courseError || "Kursus yang Anda pilih tidak tersedia saat ini."}
          </p>
          <button 
            onClick={() => router.push('/course')}
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            Jelajahi Kursus Lainnya
          </button>
        </div>
      </div>
    )
  }

  // Show success message if enrollment is successful
  if (enrollmentResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h1>
            <p className="text-gray-600 mb-6">{enrollmentResult.message}</p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="text-sm text-gray-500">ID Pendaftaran:</div>
                <div className="text-sm font-medium">{enrollmentResult.enrollmentId}</div>
                
                <div className="text-sm text-gray-500">Kursus:</div>
                <div className="text-sm font-medium">{enrollmentResult.courseTitle}</div>
                
                <div className="text-sm text-gray-500">Status:</div>
                <div className="text-sm font-medium">
                  <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded">
                    {enrollmentResult.status}
                  </span>
                </div>
                
                <div className="text-sm text-gray-500">Tanggal Pendaftaran:</div>
                <div className="text-sm font-medium">
                  {new Date(enrollmentResult.enrolledAt).toLocaleString('id-ID')}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {enrollmentResult.status === "PENDING" && (
                <p className="text-sm text-gray-600 mb-4">
                  Pendaftaran kursus Anda sedang menunggu verifikasi pembayaran. 
                  Silakan selesaikan pembayaran sesuai instruksi yang dikirim ke email Anda.
                </p>
              )}
              
              <button 
                onClick={() => router.push('/dashboard/my-courses')}
                className="w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
              >
                Lihat Kursus Saya
              </button>
              
              <button 
                onClick={() => router.push('/course')}
                className="w-full inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Jelajahi Kursus Lainnya
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600 mb-8">Selesaikan pendaftaran untuk kursus ini</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-6">Pilih Metode Pembayaran</h2>
                
                <form onSubmit={handleSubmitEnrollment}>
                  <PaymentMethodSelector
                    selectedMethod={selectedPaymentMethod}
                    onChange={handlePaymentMethodChange}
                  />
                  
                  {formError && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {formError}
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 disabled:opacity-50"
                      disabled={isSubmitting || !selectedPaymentMethod}
                    >
                      {isSubmitting ? "Memproses..." : "Daftar Sekarang"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <CheckoutSummary 
                title={course.title}
                instructor={course.instructor}
                price={course.price}
                category={course.category}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}