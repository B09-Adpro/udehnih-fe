"use client"

import { useState, useEffect } from "react"
import { CourseDetail, UseCourseDetailResult } from "../interface"

export function useCourseDetail(courseId: string): UseCourseDetailResult {
  const [data, setData] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCourseDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const baseUrl = process.env.NEXT_PUBLIC_COURSE_API_URL
      const apiUrl = `${baseUrl}/api/courses/public/${courseId}`
      
      console.log(`Fetching course detail from: ${apiUrl}`)
      
      // Get token from localStorage
      const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null
      let token: string | null = null
      
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr)
          token = userObj.token
        } catch {
          token = null
        }
      }
      
      const response = await fetch(apiUrl, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("API response:", result)
      
      setData(result)
    } catch (err) {
      console.error("Error fetching course detail:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourseDetail()
  }, [courseId])

  return { data, loading, error, refetch: fetchCourseDetail }
}