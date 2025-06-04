"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useMemo } from "react"
import type { Course } from "@/lib/types"

interface CoursesContextType {
  courses: Record<string, Course>
  isLoading: boolean
  error: string | null
  fetchCourses: () => Promise<void>
  updateCourseStatus: (courseId: string, newStatus: string, observations: string) => Promise<void>
  selectedCourse: string | null
  setSelectedCourse: (courseId: string | null) => void
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined)

export function CoursesProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Record<string, Course>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  const fetchCourses = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("https://fastapi-backend-um76.onrender.com/courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      if (typeof data === "object" && data !== null) {
        setCourses(data)
      } else {
        throw new Error("Invalid data format received from the server")
      }
    } catch (error) {
      console.error("Error loading courses:", error)
      setError("Failed to load courses. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateCourseStatus = useCallback(
    async (courseId: string, newStatus: string, observations = "") => {
      const prevCourse = courses[courseId] // Store current state for potential rollback

      // Optimistically update the local state immediately
      setCourses((prevCourses) => ({
        ...prevCourses,
        [courseId]: {
          ...prevCourses[courseId],
          status: newStatus,
          observacoesComite: observations,
        },
      }))
      setError(null) // Clear any previous errors

      try {
        const response = await fetch("https://fastapi-backend-um76.onrender.com/update-course-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseId, status: newStatus, observations }),
        })

        if (!response.ok) {
          // If API call fails, revert the local state
          setCourses((prevCourses) => ({
            ...prevCourses,
            [courseId]: prevCourse, // Revert to previous state
          }))
          throw new Error("Failed to update course status on the server.")
        }
        // If successful, the optimistic update is already in place.
        // No need to re-fetch unless the server response contains canonical data
        // that differs from the optimistic update, which is not the case here.
      } catch (err) {
        console.error("Error updating course status:", err)
        setError((err as Error).message || "Failed to update course status.")
        // The state has already been reverted in the catch block above.
      }
    },
    [courses],
  ) // Dependency on 'courses' to get the latest 'prevCourse'

  const contextValue = useMemo(
    () => ({
      courses,
      isLoading,
      error,
      fetchCourses,
      updateCourseStatus,
      selectedCourse,
      setSelectedCourse,
    }),
    [courses, isLoading, error, fetchCourses, updateCourseStatus, selectedCourse, setSelectedCourse],
  )

  return <CoursesContext.Provider value={contextValue}>{children}</CoursesContext.Provider>
}

export function useCourses() {
  const context = useContext(CoursesContext)
  if (context === undefined) {
    throw new Error("useCourses must be used within a CoursesProvider")
  }
  return context
}
