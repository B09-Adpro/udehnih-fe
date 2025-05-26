"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useCourses } from "./hooks/useCourses"
import { CoursesByCategory } from "./interface"
import { CourseFooter } from "./sections/CourseFooter"
import { CourseGrid } from "./sections/CourseGrid"
import { CourseHeader } from "./sections/CoursesHeader"

export function CourseBrowsingModule() {
  const searchParams = useSearchParams();
  const keywordFromURL = searchParams.get("keyword") || "";
  
  const [searchQuery, setSearchQuery] = useState(keywordFromURL)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<string>("default")
  
  const { data, loading, error, refetch } = useCourses(keywordFromURL)

  useEffect(() => {
    setSearchQuery(keywordFromURL);
    if (keywordFromURL) {
      console.log("Searching from URL parameter:", keywordFromURL);
    }
  }, [keywordFromURL]);

  const totalCourses = data 
    ? Object.values(data).reduce((total, courses) => total + courses.length, 0) 
    : 0
  const categories = data ? Object.keys(data) : []

  const getFilteredAndSortedCourses = (): CoursesByCategory | null => {
    if (!data) return null

    const filteredCategories = selectedCategory 
      ? { [selectedCategory]: data[selectedCategory] } 
      : data

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
        searchQuery={searchQuery}
      />
      
      <CourseGrid 
        courseData={filteredAndSortedCourses}
        isLoading={loading}
        error={error}
        onRetry={refetch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        keywordFromURL={keywordFromURL}
      />
      <CourseFooter categories={categories} />
    </div>
  )
}