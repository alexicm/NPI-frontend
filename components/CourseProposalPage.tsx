"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import CourseSearch from "@/components/CourseSearch"
import CourseDetails from "@/components/CourseDetails"
import LoadingAnimation from "@/components/LoadingAnimation"
import AppLayout from "@/components/layout/AppLayout"
import { useCourses } from "@/hooks/useCourses"
import { BookOpen, TrendingUp, AlertCircle, Search, Users } from "lucide-react"
import type { Course } from "@/lib/types"

export default function CourseProposalPage() {
  const { courses, isLoading, error, fetchCourses } = useCourses()
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCoordinators, setSelectedCoordinators] = useState<string[]>([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)

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
        course.coordenadorSolicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.disciplinasIA.some((disciplina) =>
          (typeof disciplina === "object" ? disciplina.nome : disciplina)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
        )

      const matchesCoordinator =
        selectedCoordinators.length === 0 || selectedCoordinators.includes(course.coordenadorSolicitante)
      return matchesSearch && matchesCoordinator
    })
  }, [courses, searchTerm, selectedCoordinators])

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

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course)
  }

  const handleBackToList = () => {
    setSelectedCourse(null)
  }

  if (isInitialLoad && isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-orange-500 bg-opacity-50 z-50">
        <LoadingAnimation />
      </div>
    )
  }

  if (selectedCourse) {
    return (
      <AppLayout
        title={`Proposta: ${selectedCourse.nome}`}
        showBackButton={true}
        showHomeButton={true}
        showDashboardButton={true}
        backUrl="/course-proposal"
      >
        <div className="max-w-4xl mx-auto">
          <Button onClick={handleBackToList} variant="outline" className="mb-6">
            ← Voltar para a lista
          </Button>
          <CourseDetails course={selectedCourse} onBack={handleBackToList} />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout
      title="Propostas de Cursos"
      showBackButton={true}
      showHomeButton={true}
      showDashboardButton={true}
      backUrl="/"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Propostas</CardTitle>
              <BookOpen className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{summaryStats.total}</div>
              <p className="text-xs text-gray-500 mt-1">Propostas encontradas</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Coordenadores Ativos</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{summaryStats.uniqueCoordinators}</div>
              <p className="text-xs text-gray-500 mt-1">Coordenadores com propostas</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Aprovados</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summaryStats.approved}</div>
              <p className="text-xs text-gray-500 mt-1">Cursos aprovados</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pendentes</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{summaryStats.pending}</div>
              <p className="text-xs text-gray-500 mt-1">Aguardando análise</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-orange-500" />
              Buscar e Filtrar Propostas
            </CardTitle>
            <CardDescription>Use os filtros abaixo para encontrar propostas específicas</CardDescription>
          </CardHeader>
          <CardContent>
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

        {/* Course List */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Lista de Propostas</CardTitle>
            <CardDescription>
              {filteredCourses.length} proposta(s) encontrada(s)
              {(searchTerm || selectedCoordinators.length > 0) && " com os filtros aplicados"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg mb-2">Nenhuma proposta encontrada</p>
                <p className="text-gray-400 text-sm">
                  {searchTerm || selectedCoordinators.length > 0
                    ? "Tente ajustar os filtros de busca"
                    : "Não há propostas cadastradas no momento"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-orange-500"
                      onClick={() => handleCourseSelect(course)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg text-gray-800 hover:text-orange-600 transition-colors">
                            {course.nome}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={`ml-2 ${
                              course.status?.toLowerCase() === "aprovado"
                                ? "bg-green-100 text-green-800"
                                : course.status?.toLowerCase() === "reprovado"
                                  ? "bg-red-100 text-red-800"
                                  : course.status?.toLowerCase() === "stand by"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {course.status || "Pendente"}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">Coordenador:</span> {course.coordenadorSolicitante}
                          </p>
                          <p>
                            <span className="font-medium">Carga Horária:</span> {course.cargaHoraria}h
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <p className="text-sm">Erro: {error}</p>
        </div>
      )}
    </AppLayout>
  )
}
