"use client"

import { Metadata } from "next"
import { EnrolledCoursesModule } from "@/modules/EnrolledCoursesModule"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EnrolledCoursesPage() {
  const router = useRouter()
  
  // Check authentication
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/login?redirect=/dashboard/my-courses")
    }
  }, [router])

  return <EnrolledCoursesModule />
}