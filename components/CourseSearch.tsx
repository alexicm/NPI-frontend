"use client"

import { useEffect } from "react"
import type React from "react"
import { useState, useRef, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Course } from "@/lib/types"
import CoordinatorFilter from "@/components/CoordinatorFilter"

interface CourseSearchProps {
  courses: Record<string, Course>
  onSelectCourse: (courseId: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCoordinators: string[]
  onCoordinatorChange: (coordinators: string[]) => void
}

export default function CourseSearch({
  courses,
  onSelectCourse,
  searchTerm,
  onSearchChange,
  selectedCoordinators,
  onCoordinatorChange,
}: CourseSearchProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      onSearchChange(value)
      setIsDropdownOpen(true)
    },
    [onSearchChange],
  )

  const handleSelectCourse = useCallback(
    (courseKey: string) => {
      onSelectCourse(courseKey)
      onSearchChange("")
      setIsDropdownOpen(false)
    },
    [onSelectCourse, onSearchChange],
  )

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [handleClickOutside])

  const filteredCourses = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase()
    return Object.entries(courses || {}).filter(([_, course]) => {
      const matchesSearch =
        course.nome.toLowerCase().includes(searchTermLower) ||
        course.coordenadorSolicitante.toLowerCase().includes(searchTermLower) ||
        course.status?.toLowerCase().includes(searchTermLower) ||
        course.disciplinasIA.some((disciplina) =>
          (typeof disciplina === "object" ? disciplina.nome : disciplina).toLowerCase().includes(searchTermLower),
        )

      const matchesCoordinator =
        selectedCoordinators.length === 0 || selectedCoordinators.includes(course.coordenadorSolicitante)

      return matchesSearch && matchesCoordinator
    })
  }, [courses, searchTerm, selectedCoordinators])

  const groupCoursesBySolicitante = useMemo(() => {
    const grouped: Record<string, { key: string; nome: string; status: string }[]> = {}

    filteredCourses.forEach(([key, course]) => {
      const solicitante = course.coordenadorSolicitante || "Sem coordenador"

      if (!grouped[solicitante]) {
        grouped[solicitante] = []
      }

      if (!grouped[solicitante].some((existingCourse) => existingCourse.key === key)) {
        grouped[solicitante].push({
          key,
          nome: course.nome,
          status: course.status || "",
        })
      }
    })

    for (const solicitante in grouped) {
      grouped[solicitante].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }))
    }

    const sortedGroupedEntries = Object.entries(grouped).sort(([solicitanteA], [solicitanteB]) =>
      solicitanteA.localeCompare(solicitanteB, "pt-BR", { sensitivity: "base" }),
    )

    return Object.fromEntries(sortedGroupedEntries)
  }, [filteredCourses])

  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case "aprovado":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
      case "reprovado":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
      case "stand by":
        return "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }, [])

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Pesquisar cursos por nome, coordenador, status ou disciplina..."
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsDropdownOpen(true)}
          className={cn(
            "w-full pl-12 pr-4 py-3 text-sm sm:text-base",
            "border border-gray-300 dark:border-gray-600",
            "rounded-xl shadow-sm",
            "bg-white dark:bg-gray-800",
            "text-gray-900 dark:text-gray-100",
            "placeholder-gray-500 dark:placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
            "transition-all duration-200",
            "hover:shadow-md",
          )}
          aria-label="Pesquisar cursos"
          role="searchbox"
        />
      </div>

      {/* Coordinator Filter */}
      <div className="mt-3">
        <CoordinatorFilter
          courses={courses}
          selectedCoordinators={selectedCoordinators}
          onCoordinatorChange={onCoordinatorChange}
        />
      </div>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute left-0 right-0 mt-2",
              "bg-white dark:bg-gray-800",
              "border border-gray-200 dark:border-gray-700",
              "rounded-xl shadow-xl",
              "max-h-[70vh] overflow-y-auto",
              "z-50",
            )}
          >
            {Object.entries(groupCoursesBySolicitante).length > 0 ? (
              Object.entries(groupCoursesBySolicitante).map(([solicitante, courses], groupIndex) => (
                <div
                  key={solicitante}
                  className={cn(
                    "border-b last:border-b-0 border-gray-200 dark:border-gray-700",
                    groupIndex === 0 ? "rounded-t-xl" : "",
                    groupIndex === Object.entries(groupCoursesBySolicitante).length - 1 ? "rounded-b-xl" : "",
                  )}
                >
                  <div
                    className={cn(
                      "px-4 py-3",
                      "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
                      "font-semibold text-sm sm:text-base",
                      "text-gray-800 dark:text-gray-200",
                      "flex items-center space-x-2",
                      groupIndex === 0 ? "rounded-t-xl" : "",
                    )}
                  >
                    <Users className="w-4 h-4 text-orange-500" />
                    <span>{solicitante}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-2 py-0.5 rounded-full">
                      {courses.length} {courses.length === 1 ? "curso" : "cursos"}
                    </span>
                  </div>
                  <ul>
                    {courses.map((course, courseIndex) => (
                      <li key={course.key}>
                        <button
                          onClick={() => handleSelectCourse(course.key)}
                          className={cn(
                            "w-full px-4 py-3",
                            "flex items-center justify-between",
                            "text-sm sm:text-base",
                            "text-gray-700 dark:text-gray-300",
                            "hover:bg-orange-50 dark:hover:bg-orange-900/20",
                            "focus:outline-none focus:bg-orange-50 dark:focus:bg-orange-900/20",
                            "transition-colors duration-200",
                            "group",
                            courseIndex === courses.length - 1 &&
                              groupIndex === Object.entries(groupCoursesBySolicitante).length - 1
                              ? "rounded-b-xl"
                              : "",
                          )}
                        >
                          <span className="flex-1 text-left group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">
                            {course.nome}
                          </span>
                          {course.status && (
                            <span
                              className={cn(
                                "ml-3 px-2.5 py-1",
                                "text-xs font-medium",
                                "rounded-full",
                                "flex-shrink-0",
                                getStatusColor(course.status),
                              )}
                            >
                              {course.status}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum curso encontrado</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Tente ajustar os termos de pesquisa</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
