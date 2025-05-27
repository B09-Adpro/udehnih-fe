"use client"

import { useEffect } from "react"
import { CourseLearnModule } from "@/modules/CourseLearnModule"
import { useRouter } from "next/navigation"

interface CourseLearnPageProps {
  params: {
    id: string
  }
}

export default function CourseLearnPage({ params }: CourseLearnPageProps) {
  const { id } = params
  const router = useRouter()
  
  // Check authentication
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push(`/login?redirect=/course/${id}/learn`)
    }
  }, [id, router])

  return <CourseLearnModule courseId={id} />
}