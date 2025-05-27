"use client"

import { useState, useEffect } from "react"

interface UserData {
  isAuthenticated: boolean;
  enrolledCourses: string[];
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export function useUserData(): UserData {
  const [userData, setUserData] = useState<UserData>({
    isAuthenticated: false,
    enrolledCourses: [],
    user: null
  })

  useEffect(() => {
    // Check if user is logged in
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null
    
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr)
        
        // Get enrolled courses from API or local storage
        // This is a stub implementation
        const enrolledCourses = localStorage.getItem("enrolledCourses")
          ? JSON.parse(localStorage.getItem("enrolledCourses")!)
          : []
        
        setUserData({
          isAuthenticated: true,
          enrolledCourses,
          user: {
            id: userObj.id || "",
            name: userObj.name || "",
            email: userObj.email || ""
          }
        })
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  return userData
}