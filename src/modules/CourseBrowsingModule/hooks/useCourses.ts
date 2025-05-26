"use client"

import { useState, useEffect } from "react"
import { CourseListDTO, CoursesByCategory, UseCourseResult } from "../interface"

export function useCourses(keyword?: string): UseCourseResult {
  const [data, setData] = useState<CoursesByCategory | null>(null)
  const [rawData, setRawData] = useState<CourseListDTO[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const baseUrl = process.env.NEXT_PUBLIC_COURSE_API_URL;
      
      const apiUrl = keyword 
        ? `${baseUrl}/api/courses/search?keyword=${encodeURIComponent(keyword)}` 
        : `${baseUrl}/api/courses`;
      
      console.log(`Fetching courses from: ${apiUrl}`);
      
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

      // Parse response
      const result = await response.json()
      console.log("API response:", result)
      
      // Format dari backend: { courses: [...] }
      if (result.courses && Array.isArray(result.courses)) {
        // Set raw course data
        setRawData(result.courses)
        
        // Group courses by category
        const coursesByCategory = result.courses.reduce((acc: CoursesByCategory, course: CourseListDTO) => {
          if (!acc[course.category]) {
            acc[course.category] = []
          }
          acc[course.category].push(course)
          return acc
        }, {} as CoursesByCategory)
        
        setData(coursesByCategory)
      } else {
        throw new Error("Unexpected response format")
      }
    } catch (err) {
      console.error("Error fetching courses:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [keyword]) // Re-fetch when keyword changes

  return { data, rawData, loading, error, refetch: fetchCourses }
}