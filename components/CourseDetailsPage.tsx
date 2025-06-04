"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useCourses } from "@/contexts/CoursesContext"
import CourseDetails from "@/components/CourseDetails"
import LoadingAnimation from "@/components/LoadingAnimation"
import AppLayout from "@/components/layout/AppLayout"
import { AlertCircle } from "lucide-react"
import type { Course } from "@/lib/types"

interface CourseDetailsPageProps {
  courseId: string
}

export default function CourseDetailsPage({ courseId }: CourseDetailsPageProps) {
  const { courses, isLoading, error, fetchCourses, updateCourseStatus } = useCourses()
  const [course, setCourse] = useState<Course | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      await fetchCourses()
      setIsInitialLoad(false)
    }
    loadData()
  }, [fetchCourses])

  useEffect(() => {
    if (courses && courseId) {
      const foundCourse = courses[courseId]
      if (foundCourse) {
        setCourse(foundCourse)
      } else if (!isLoading && !isInitialLoad) {
        setCourse(null)
      }
    }
  }, [courses, courseId, isLoading, isInitialLoad])

  const handleUpdateCourseStatus = useCallback(
    async (courseId: string, newStatus: string, observations: string) => {
      try {
        await updateCourseStatus(courseId, newStatus, observations)
      } catch (error) {
        console.error("Failed to update course status:", error)
        // Error is already handled by the context, but re-throw if needed for local error display
        throw error
      }
    },
    [updateCourseStatus],
  )

  if (isInitialLoad && isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-orange-500 bg-opacity-50 z-50">
        <LoadingAnimation />
      </div>
    )
  }

  if (!course && !isLoading) {
    return (
      <AppLayout
        title="Propostas de Cursos"
        showBackButton={true}
        showHomeButton={true}
        showDashboardButton={false}
        backUrl="/course-proposal"
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 text-center mb-2">
              Curso não encontrado
            </h2>
            <p className="text-red-600 dark:text-red-300 text-center">
              O curso com ID "{courseId}" não foi encontrado ou não existe.
            </p>
          </div>
          <button
            onClick={() => router.push("/course-proposal")}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Voltar para Propostas
          </button>
        </div>
      </AppLayout>
    )
  }

  if (!course) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-orange-500 bg-opacity-50 z-50">
        <LoadingAnimation />
      </div>
    )
  }

  return (
    <AppLayout
      title="Propostas de Cursos"
      showBackButton={true}
      showHomeButton={true}
      showDashboardButton={false}
      backUrl="/course-proposal"
    >
      <div className="max-w-6xl mx-auto">
        <CourseDetails course={course} onUpdateCourseStatus={handleUpdateCourseStatus} />
      </div>
    </AppLayout>
  )
}
