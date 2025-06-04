"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCourses } from "@/hooks/useCourses"
import LoadingAnimation from "@/components/LoadingAnimation"
import AppLayout from "@/components/layout/AppLayout"
import { BookOpen, Users } from "lucide-react"

export default function CoordinatorCoursePage() {
  const { courses, isLoading, error, fetchCourses } = useCourses()
  const [isInitialLoad, setIsInitialLoad] = useState(true)

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

  if (isInitialLoad && isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-orange-500 bg-opacity-50 z-50">
        <LoadingAnimation />
      </div>
    )
  }

  return (
    <AppLayout
      title="Cursos por Coordenador"
      showBackButton={true}
      showHomeButton={true}
      showDashboardButton={true}
      backUrl="/"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Visão Geral dos Coordenadores</CardTitle>
            <CardDescription>Explore os cursos propostos por cada coordenador.</CardDescription>
          </CardHeader>
          <CardContent>
            {groupedCourses.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg mb-2">Nenhum coordenador encontrado</p>
                <p className="text-gray-400 text-sm">Não há cursos associados a coordenadores no momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedCourses.map((group) => (
                  <motion.div
                    key={group.coordinator.nome}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full flex flex-col">
                      <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={`/placeholder-user.jpg?name=${group.coordinator.nome}`}
                            alt={group.coordinator.nome}
                          />
                          <AvatarFallback>
                            {group.coordinator.nome
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl font-semibold text-gray-800">
                            {group.coordinator.nome}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            {group.coordinator.jaECoordenador ? "Coordenador Ativo" : "Proponente"}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 pt-4">
                        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                          {group.coordinator.minibiografia || "Nenhuma biografia disponível."}
                        </p>
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-orange-500" />
                          Cursos ({group.courses.length})
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          {group.courses.map((course) => (
                            <li key={course.id} className="flex items-center justify-between">
                              <span>{course.nome}</span>
                              <span
                                className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
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
                              </span>
                            </li>
                          ))}
                        </ul>
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
