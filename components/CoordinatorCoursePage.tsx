"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useCourses } from "@/contexts/CoursesContext"
import LoadingAnimation from "@/components/LoadingAnimation"
import AppLayout from "@/components/layout/AppLayout"
import { BookOpen, Users, GraduationCap } from "lucide-react"
import { formatCoordinatorName } from "@/lib/utils"

export default function CoordinatorCoursePage() {
  const { courses, isLoading, error, fetchCourses } = useCourses()
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      await fetchCourses()
      setIsInitialLoad(false)
    }
    loadData()
  }, [fetchCourses])

  const groupedCourses = useMemo(() => {
    const groups: {
      [key: string]: {
        coordinator: { nome: string; minibiografia: string; jaECoordenador: boolean }
        courses: { id: string; nome: string; status?: string }[]
      }
    } = {}

    Object.values(courses || {}).forEach((course) => {
      const solicitante = course.coordenadorSolicitante || "Sem Coordenador"
      if (!groups[solicitante]) {
        groups[solicitante] = {
          coordinator: {
            nome: solicitante,
            minibiografia: course.coordenadores?.[0]?.minibiografia || "N/A",
            jaECoordenador: course.coordenadores?.[0]?.jaECoordenador || false,
          },
          courses: [],
        }
      }
      groups[solicitante].courses.push({
        id: course.id,
        nome: course.nome,
        status: course.status,
      })
    })

    return Object.values(groups).sort((a, b) => a.coordinator.nome.localeCompare(b.coordinator.nome))
  }, [courses])

  const handleCourseClick = (courseId: string) => {
    router.push(`/course-proposal/${courseId}`)
  }

  if (isInitialLoad && isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-orange-500 bg-opacity-50 z-50">
        <LoadingAnimation />
      </div>
    )
  }

  return (
    <AppLayout title="Coordenadores" showBackButton={true} showHomeButton={true} showDashboardButton={true} backUrl="/">
      <div className="space-y-8">
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-xl border-0 overflow-hidden">
            <CardHeader className="text-center py-8">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-full w-fit mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">Visão Geral dos Coordenadores</CardTitle>
              <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore os cursos propostos por cada coordenador e acompanhe suas contribuições para o programa
                acadêmico.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Coordinators Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
          {groupedCourses.length === 0 ? (
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-xl mb-2">Nenhum coordenador encontrado</p>
                <p className="text-gray-400 text-sm">Não há cursos associados a coordenadores no momento.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedCourses.map((group, index) => (
                <motion.div
                  key={group.coordinator.nome}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="h-full flex flex-col bg-gradient-to-br from-white to-gray-50 shadow-xl hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                            <AvatarImage
                              src={`/placeholder-user.jpg?name=${group.coordinator.nome}`}
                              alt={group.coordinator.nome}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-orange-500 to-pink-600 text-white text-lg font-bold">
                              {group.coordinator.nome
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {group.coordinator.jaECoordenador && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                              <GraduationCap className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold text-gray-800 mb-1">
                            {formatCoordinatorName(group.coordinator.nome)}
                          </CardTitle>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              group.coordinator.jaECoordenador
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-blue-100 text-blue-800 border-blue-200"
                            }`}
                          >
                            {group.coordinator.jaECoordenador ? "Coordenador Ativo" : "Proponente"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {group.courses.length} curso{group.courses.length !== 1 ? "s" : ""} • {group.coordinator.nome}
                      </p>
                    </CardHeader>

                    <CardContent className="flex-1 pt-0">
                      <div className="mb-6">
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          {group.coordinator.minibiografia !== "N/A"
                            ? group.coordinator.minibiografia
                            : "Nenhuma biografia disponível para este coordenador."}
                        </p>
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <div className="bg-orange-100 p-1 rounded">
                            <BookOpen className="h-4 w-4 text-orange-600" />
                          </div>
                          Cursos ({group.courses.length})
                        </h4>

                        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                          {group.courses.map((course) => (
                            <div
                              key={course.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => handleCourseClick(course.id)}
                            >
                              <span className="text-sm text-gray-700 font-medium truncate flex-1 mr-2">
                                {course.nome}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-xs shrink-0 ${
                                  course.status?.toLowerCase() === "aprovado"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : course.status?.toLowerCase() === "reprovado"
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : course.status?.toLowerCase() === "stand by"
                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                        : "bg-gray-50 text-gray-700 border-gray-200"
                                }`}
                              >
                                {course.status || "Pendente"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
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
  )
}
