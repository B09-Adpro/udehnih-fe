"use client"

import { Suspense } from 'react';
import { CourseCheckoutModule } from "@/modules/CourseCheckoutModule"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

function CheckoutLoading() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

function CheckoutContent() {
  "use client"
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const courseId = searchParams.get("courseId")

  if (!courseId) {
    if (typeof window !== "undefined") {
      router.push("/course")
    }
    
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Halaman Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">
            Maaf, halaman pembayaran membutuhkan ID kursus yang valid.
          </p>
        </div>
      </div>
    )
  }

  return <CourseCheckoutModule courseId={courseId} />
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}