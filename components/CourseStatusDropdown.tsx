"use client"

import { useState, useEffect } from "react"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { AnimatePresence } from "framer-motion"
import AnalysisPopup from "./AnalysisPopup"

interface CourseStatusDropdownProps {
  courseId: string
  initialStatus: string
  initialObservations: string
  onStatusChange: (courseId: string, newStatus: string, observations: string) => Promise<void>
}

export default function CourseStatusDropdown({
  courseId,
  initialStatus,
  initialObservations,
  onStatusChange,
}: CourseStatusDropdownProps) {
  const [status, setStatus] = useState(initialStatus || "")
  const [isUpdating, setIsUpdating] = useState(false)
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false)

  useEffect(() => {
    setStatus(initialStatus)
  }, [initialStatus])

  useEffect(() => {
    // This ensures the component stays in sync with external updates
  }, [initialObservations])

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case "Aprovado":
        return "bg-green-500"
      case "Reprovado":
        return "bg-red-500"
      case "Stand By":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleAnalysisSubmit = async (courseId: string, newStatus: string, observations: string) => {
    setIsUpdating(true)

    // Immediately update local state for instant UI feedback
    setStatus(newStatus)

    try {
      await onStatusChange(courseId, newStatus, observations)
      // Status is already updated locally, no need to set it again
    } catch (error) {
      // Revert local state if API call fails
      setStatus(initialStatus)
      console.error("Error updating status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="relative inline-block text-left w-full sm:w-auto">
      <button
        type="button"
        className={`inline-flex justify-center w-full sm:w-auto rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
          isUpdating ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => setShowAnalysisPopup(true)}
        disabled={isUpdating}
      >
        <span className="flex items-center">
          {status && <span className={`h-3 w-3 rounded-full ${getStatusColor(status)} mr-2`} aria-hidden="true"></span>}
          Analisar a proposta
        </span>
        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {showAnalysisPopup && (
          <AnalysisPopup
            courseId={courseId}
            initialStatus={status}
            initialObservations={initialObservations}
            onClose={() => setShowAnalysisPopup(false)}
            onSubmit={handleAnalysisSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
