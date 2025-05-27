"use client"

import { CourseCheckoutModule } from "@/modules/CourseCheckoutModule"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
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