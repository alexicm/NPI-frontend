"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CourseSearch from "@/components/CourseSearch"
import LoadingAnimation from "@/components/LoadingAnimation"
import AppLayout from "@/components/layout/AppLayout"
import CourseCoordinatorSidebar from "@/components/CourseCoordinatorSidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useCourses } from "@/contexts/CoursesContext"
import { formatCoordinatorName } from "@/lib/utils"
import { BookOpen, TrendingUp, AlertCircle, Search, Users, GraduationCap } from "lucide-react"
import type { Course } from "@/lib/types"
import ScrollToTopButton from "@/components/ScrollToTopButton"

export default function CourseProposalPage() {
  const { courses, isLoading, error, fetchCourses } = useCourses()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCoordinators, setSelectedCoordinators] = useState<string[]>([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      await fetchCourses()
      setIsInitialLoad(false)
    }
    loadData()
  }, [fetchCourses])

  const filteredCourses = useMemo(() => {
    const coursesArray = Object.values(courses || {})
    return coursesArray.filter((course) => {
      const matchesSearch =
        course.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.coordenadorSolicitante.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCoordinator =
        selectedCoordinators.length === 0 || selectedCoordinators.includes(course.coordenadorSolicitante)
      return matchesSearch && matchesCoordinator
    })
  }, [courses, searchTerm, selectedCoordinators])

  const groupedAndSortedCourses = useMemo(() => {
    const grouped: Record<string, Course[]> = {}

    filteredCourses.forEach((course) => {
      const coordinator = course.coordenadorSolicitante || "Sem Coordenador"
      if (!grouped[coordinator]) {
        grouped[coordinator] = []
      }
      grouped[coordinator].push(course)
    })

    const sortedCoordinators = Object.keys(grouped).sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }))

    const result: Record<string, Course[]> = {}
    sortedCoordinators.forEach((coordinator) => {
      result[coordinator] = grouped[coordinator].sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }),
      )
    })

    return result
  }, [filteredCourses])

  const summaryStats = useMemo(() => {
    const total = filteredCourses.length
    const approved = filteredCourses.filter((course) => course.status?.toLowerCase() === "aprovado").length
    const rejected = filteredCourses.filter((course) => course.status?.toLowerCase() === "reprovado").length
    const pending = filteredCourses.filter(
      (course) => course.status?.toLowerCase() === "stand by" || !course.status,
    ).length
    const uniqueCoordinators = Array.from(
      new Set(Object.values(courses || {}).map((c) => c.coordenadorSolicitante)),
    ).filter(Boolean).length

    return { total, approved, rejected, pending, uniqueCoordinators }
  }, [filteredCourses, courses])

  const handleCourseSelect = (courseId: string) => {
    const course = courses[courseId]
    if (course) {
      router.push(`/course-proposal/${courseId}`)
    }
  }

  const scrollToCoordinator = (coordinator: string) => {
    const element = document.getElementById(`coordinator-${coordinator}`)
    if (element) {
      requestAnimationFrame(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      })
    }
  }

  if (isInitialLoad && isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-orange-500 bg-opacity-50 z-50">
        <LoadingAnimation />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <CourseCoordinatorSidebar groupedCourses={groupedAndSortedCourses} scrollToCoordinator={scrollToCoordinator} />
      <SidebarInset className="bg-gradient-to-br from-orange-50/30 via-white to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <AppLayout
          title="Propostas de Cursos"
          showBackButton={true}
          showHomeButton={true}
          showDashboardButton={false}
          backUrl="/"
        >
          <div className="space-y-8">
            {/* Enhanced Summary Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/50 to-orange-100/30 shadow-lg hover:shadow-2xl transition-all duration-500 border-0 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 to-pink-400/0 group-hover:from-orange-400/5 group-hover:to-pink-400/5 transition-all duration-500" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Propostas</CardTitle>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                      <div className="relative bg-gradient-to-r from-orange-100 to-pink-100 p-3 rounded-full group-hover:from-orange-200 group-hover:to-pink-200 transition-all duration-300">
                        <BookOpen className="h-5 w-5 text-orange-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                      {summaryStats.total}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Propostas encontradas</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50/50 to-purple-100/30 shadow-lg hover:shadow-2xl transition-all duration-500 border-0 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 to-blue-400/0 group-hover:from-purple-400/5 group-hover:to-blue-400/5 transition-all duration-500" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-gray-600">Coordenadores Ativos</CardTitle>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                      <div className="relative bg-gradient-to-r from-purple-100 to-blue-100 p-3 rounded-full group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {summaryStats.uniqueCoordinators}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Coordenadores com propostas</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-white via-green-50/50 to-green-100/30 shadow-lg hover:shadow-2xl transition-all duration-500 border-0 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 to-emerald-400/0 group-hover:from-green-400/5 group-hover:to-emerald-400/5 transition-all duration-500" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-gray-600">Aprovados</CardTitle>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                      <div className="relative bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-full group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {summaryStats.approved}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Cursos aprovados</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-white via-amber-50/50 to-amber-100/30 shadow-lg hover:shadow-2xl transition-all duration-500 border-0 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 to-yellow-400/0 group-hover:from-amber-400/5 group-hover:to-yellow-400/5 transition-all duration-500" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-gray-600">Pendentes</CardTitle>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                      <div className="relative bg-gradient-to-r from-amber-100 to-yellow-100 p-3 rounded-full group-hover:from-amber-200 group-hover:to-yellow-200 transition-all duration-300">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                      {summaryStats.pending}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Aguardando análise</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Search className="w-5 h-5 text-orange-600" />
                    </div>
                    Buscar e Filtrar Propostas
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Use os filtros abaixo para encontrar propostas específicas
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <CourseSearch
                    courses={courses}
                    onSelectCourse={handleCourseSelect}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    selectedCoordinators={selectedCoordinators}
                    onCoordinatorChange={setSelectedCoordinators}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="bg-white shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                  <CardTitle className="text-xl">Lista de Propostas por Coordenador</CardTitle>
                  <CardDescription className="text-gray-600">
                    {filteredCourses.length} proposta(s) encontrada(s)
                    {(searchTerm || selectedCoordinators.length > 0) && " com os filtros aplicados"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {Object.keys(groupedAndSortedCourses).length === 0 ? (
                    <div className="text-center py-16">
                      <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-xl mb-2">Nenhuma proposta encontrada</p>
                      <p className="text-gray-400 text-sm">
                        {searchTerm || selectedCoordinators.length > 0
                          ? "Tente ajustar os filtros de busca"
                          : "Não há propostas cadastradas no momento"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(groupedAndSortedCourses).map(([coordinator, courses], groupIndex) => (
                        <motion.div
                          key={coordinator}
                          id={`coordinator-${coordinator}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: groupIndex * 0.05 }}
                          className="space-y-3"
                        >
                          <div className="flex items-center gap-3 py-2">
                            <div className="bg-purple-100 p-2 rounded-full">
                              <GraduationCap className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {formatCoordinatorName(coordinator)}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {courses.length} curso{courses.length !== 1 ? "s" : ""} • {coordinator}
                              </p>
                            </div>
                          </div>

                          <div className="grid gap-3">
                            {courses.map((course, courseIndex) => (
                              <motion.div
                                key={course.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: groupIndex * 0.05 + courseIndex * 0.03 }}
                              >
                                <Card
                                  className="cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 border-l-purple-400 hover:scale-[1.01] bg-white"
                                  onClick={() => handleCourseSelect(course.id)}
                                >
                                  <CardContent className="p-4 flex items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-base text-gray-800 truncate">
                                        {course.nome} ({course.cargaHoraria}h)
                                      </h4>
                                    </div>
                                    <Badge
                                      variant="secondary"
                                      className={`px-2.5 py-1 text-xs font-medium flex-shrink-0 ${
                                        course.status?.toLowerCase() === "aprovado"
                                          ? "bg-green-100 text-green-800 border-green-200"
                                          : course.status?.toLowerCase() === "reprovado"
                                            ? "bg-red-100 text-red-800 border-red-200"
                                            : course.status?.toLowerCase() === "stand by"
                                              ? "bg-amber-100 text-amber-800 border-amber-200"
                                              : "bg-gray-100 text-gray-800 border-gray-200"
                                      }`}
                                    >
                                      {course.status || "Pendente"}
                                    </Badge>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {error && (
            <motion.div
              className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-lg shadow-xl z-50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm font-medium">Erro: {error}</p>
            </motion.div>
          )}
        </AppLayout>
        <ScrollToTopButton />
      </SidebarInset>
    </SidebarProvider>
  )
}
