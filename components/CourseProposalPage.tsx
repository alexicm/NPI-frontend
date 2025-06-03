"use client"

import { useEffect, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import LoadingAnimation from "@/components/LoadingAnimation"
import CourseSearch from "@/components/CourseSearch"
import CourseDetails from "@/components/CourseDetails"
import CourseStatusDropdown from "@/components/CourseStatusDropdown"
import { useCourses } from "@/hooks/useCourses"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function CourseProposalPage() {
  const router = useRouter()
  const { courses, selectedCourse, isLoading, error, fetchCourses, updateCourseStatus, setSelectedCourse } =
    useCourses()
  const [isButtonLoading, setIsButtonLoading] = useState(false)

  const handleUpdateCourses = useCallback(async () => {
    setIsButtonLoading(true)
    await fetchCourses()
    setIsButtonLoading(false)
  }, [fetchCourses])

  const handleStatusChange = useCallback(
    async (courseId: string, newStatus: string, observations = "") => {
      await updateCourseStatus(courseId, newStatus, observations)
    },
    [updateCourseStatus],
  )

  const handleBackToHome = useCallback(() => {
    router.push("/novos-projetos")
  }, [router])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 max-w-[1920px] mx-auto"
    >
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-orange-500 bg-opacity-50 z-50"
          >
            <LoadingAnimation />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="lg:col-span-12 mb-4">
        <header className="bg-gradient-to-r from-orange-500 to-pink-600 shadow-lg p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleUpdateCourses}
                className="px-2 sm:px-4 py-1 sm:py-2 bg-white text-orange-500 rounded-full text-xs sm:text-sm font-semibold hover:bg-orange-100 transition duration-300 flex items-center justify-center whitespace-nowrap"
                disabled={isButtonLoading}
              >
                {isButtonLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isButtonLoading ? "Atualizando..." : "Atualizar cursos"}
              </Button>
              {error && <div className="text-red-500 text-sm max-w-md truncate">Erro: {error}</div>}
            </div>
            <span className="text-white font-medium text-lg sm:text-xl">Proposta de Cursos Comitê 2025</span>
            <div className="flex items-center gap-4">
              <div onClick={handleBackToHome} className="cursor-pointer bg-white rounded-full p-1">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/uny_logo-pEYx6pRnSznZKeclaZApEzV7ztgHVq.png"
                  alt="Unyleya Logo"
                  width={32}
                  height={32}
                  priority
                  className="rounded-full"
                />
              </div>
              <Button
                onClick={handleBackToHome}
                className="px-2 sm:px-4 py-1 sm:py-2 bg-white text-orange-500 rounded-full text-xs sm:text-sm font-semibold hover:bg-orange-100 transition duration-300 whitespace-nowrap"
              >
                Voltar
              </Button>
            </div>
          </div>
        </header>
      </div>

      {/* Course Search */}
      <div className="lg:col-span-12 mb-4">
        <CourseSearch courses={courses} onSelectCourse={setSelectedCourse} />
      </div>

      {/* Course Name and Status Dropdown */}
      {selectedCourse && courses[selectedCourse] && (
        <div className="lg:col-span-12 mb-4 flex justify-between items-center">
          <h1 className="text-4xl font-bold p-4 bg-gray-100 rounded-lg shadow-sm text-orange-500 flex-grow">
            {courses[selectedCourse].nome}
          </h1>
          <div className="ml-4">
            <CourseStatusDropdown
              courseId={selectedCourse}
              initialStatus={courses[selectedCourse].status || ""}
              initialObservations={courses[selectedCourse].observacoesComite || ""}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      )}

      {/* Course Details */}
      {selectedCourse && courses[selectedCourse] && (
        <div className="lg:col-span-12">
          <CourseDetails
            course={courses[selectedCourse]}
            onStatusChange={(newStatus) => handleStatusChange(selectedCourse, newStatus)}
          />
        </div>
      )}
    </motion.div>
  )
}
