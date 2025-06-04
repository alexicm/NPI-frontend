"use client"

import { useState, useMemo, useCallback } from "react"
import type { Course } from "@/lib/types"

interface CoordinatorFilterProps {
  courses: Record<string, Course>
  selectedCoordinators: string[]
  onCoordinatorChange: (coordinators: string[]) => void
}

export default function CoordinatorFilter({
  courses,
  selectedCoordinators,
  onCoordinatorChange,
}: CoordinatorFilterProps) {
  const [open, setOpen] = useState(false)

  const uniqueCoordinators = useMemo(() => {
    const allCoordinators = Object.values(courses || {}).map((course) => course.coordenadorSolicitante)
    const unique = Array.from(new Set(allCoordinators)).filter(Boolean) as string[]
    return unique.sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }))
  }, [courses])

  const handleSelect = useCallback(
    (coordinator: string) => {
      const newSelection = selectedCoordinators.includes(coordinator)
        ? selectedCoordinators.filter((c) => c !== coordinator)
        : [...selectedCoordinators, coordinator]
      onCoordinatorChange(newSelection)
    },
    [selectedCoordinators, onCoordinatorChange],
  )

  const handleClearAll = useCallback(() => {
    onCoordinatorChange([])
  }, [onCoordinatorChange])

  const handleSelectAll = useCallback(() => {
    onCoordinatorChange(uniqueCoordinators)
  }, [uniqueCoordinators, onCoordinatorChange])

  return <div className="w-full"></div>
}
