"use client"

import { useState } from "react"
import { useCourses } from "./hooks/useCourses"
import { CourseHeader } from "./sections/CoursesHeader"
import { CourseGrid } from "./sections/CourseGrid"
import { CourseFooter } from "./sections/CourseFooter"
import { CoursesByCategory } from "./interface"

export function CourseBrowsingModule() {
  const { data, loading, error, refetch } = useCourses()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<string>("default")

  const totalCourses = data 
    ? Object.values(data).reduce((total, courses) => total + courses.length, 0) 
    : 0
  const categories = data ? Object.keys(data) : []

  // Get filtered and sorted courses
  const getFilteredAndSortedCourses = (): CoursesByCategory | null => {
    if (!data) return null

    const filteredCategories = selectedCategory 
      ? { [selectedCategory]: data[selectedCategory] } 
      : data

    // Filter based on search query
    if (searchQuery) {
      const result: CoursesByCategory = {}
      Object.entries(filteredCategories).forEach(([category, courses]) => {
        const filtered = courses.filter(course => 
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
        )
        if (filtered.length > 0) {
          result[category] = filtered
        }
      })
      return result
    }

    // Sort courses in each category
    const sortedResult: CoursesByCategory = {}
    Object.entries(filteredCategories).forEach(([category, courses]) => {
      let sorted = [...courses]
      switch (sortOrder) {
        case "price-asc":
          sorted.sort((a, b) => a.price - b.price)
          break
        case "price-desc":
          sorted.sort((a, b) => b.price - a.price)
          break
        case "title-asc":
          sorted.sort((a, b) => a.title.localeCompare(b.title))
          break
        case "title-desc":
          sorted.sort((a, b) => b.title.localeCompare(a.title))
          break
      }
      sortedResult[category] = sorted
    })

    return sortedResult
  }

  const filteredAndSortedCourses = getFilteredAndSortedCourses()

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <CourseHeader 
        totalCourses={totalCourses}
        categories={categories}
        isLoading={loading}
      />
      
      <CourseGrid 
        courseData={filteredAndSortedCourses}
        isLoading={loading}
        error={error}
        onRetry={refetch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  )
}