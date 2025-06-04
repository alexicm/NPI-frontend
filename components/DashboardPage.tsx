"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, TrendingUp, AlertCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useCourses } from "@/hooks/useCourses"
import LoadingAnimation from "@/components/LoadingAnimation"
import AppLayout from "@/components/layout/AppLayout"

export default function DashboardPage() {
  const { courses, isLoading, error, fetchCourses } = useCourses()
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      await fetchCourses()
      setIsInitialLoad(false)
    }
    loadData()
  }, [fetchCourses])

  const summaryStats = useMemo(() => {
    const coursesArray = Object.values(courses || {})
    const total = coursesArray.length
    const approved = coursesArray.filter((course) => course.status?.toLowerCase() === "aprovado").length
    const rejected = coursesArray.filter((course) => course.status?.toLowerCase() === "reprovado").length
    const pending = coursesArray.filter(
      (course) => course.status?.toLowerCase() === "stand by" || !course.status,
    ).length
    const uniqueCoordinators = Array.from(new Set(coursesArray.map((c) => c.coordenadorSolicitante))).filter(
      Boolean,
    ).length

    return { total, approved, rejected, pending, uniqueCoordinators }
  }, [courses])

  const coordinatorCourseData = useMemo(() => {
    const data: { [key: string]: number } = {}
    Object.values(courses || {}).forEach((course) => {
      const coordinatorName = course.coordenadorSolicitante || "Sem Coordenador"
      data[coordinatorName] = (data[coordinatorName] || 0) + 1
    })

    const sortedData = Object.entries(data)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Limit to top 10 for readability

    return sortedData
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
      title="Dashboard de Propostas"
      showBackButton={true}
      showHomeButton={true}
      showDashboardButton={false}
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
              <p className="text-xs text-gray-500 mt-1">Propostas cadastradas</p>
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

        {/* Coordinator Course Count Chart */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Cursos por Coordenador (Top 10)</CardTitle>
            <CardDescription>Número de propostas por coordenador solicitante.</CardDescription>
          </CardHeader>
          <CardContent>
            {coordinatorCourseData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={coordinatorCourseData}
                    layout="vertical"
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      width={120} // Adjust width for longer names
                      tickFormatter={(value) => {
                        // Truncate long names for display on Y-axis
                        return value.length > 15 ? value.substring(0, 15) + "..." : value
                      }}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      formatter={(value: number, name: string) => [`${value} cursos`, name]}
                      labelFormatter={(label: string) => `Coordenador: ${label}`}
                    />
                    <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg mb-2">Nenhum dado de coordenador disponível</p>
                <p className="text-gray-400 text-sm">Aguardando o carregamento dos dados dos cursos.</p>
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
