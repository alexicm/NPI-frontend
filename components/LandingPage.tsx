"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users } from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"

export default function LandingPage() {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <AppLayout
      title="Bem-vindo ao NPI Frontend"
      showHomeButton={false}
      showBackButton={false}
      showDashboardButton={true}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8 leading-tight">
          Sistema de Gestão de Propostas de Cursos
        </h1>
        <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl">
          Gerencie e acompanhe o ciclo de vida das propostas de novos cursos e a performance dos coordenadores.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full flex flex-col justify-between p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold text-orange-600 flex items-center gap-3">
                  <BookOpen className="w-7 h-7" />
                  Propostas de Cursos
                </CardTitle>
                <CardDescription className="mt-2 text-gray-600">
                  Visualize e gerencie todas as propostas de cursos, acompanhe seus status e detalhes.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Button
                  onClick={() => handleNavigation("/course-proposal")}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg text-lg font-semibold transition-colors duration-300"
                >
                  Ver Propostas
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-full flex flex-col justify-between p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold text-pink-600 flex items-center gap-3">
                  <Users className="w-7 h-7" />
                  Cursos por Coordenador
                </CardTitle>
                <CardDescription className="mt-2 text-gray-600">
                  Explore os cursos associados a cada coordenador e suas informações detalhadas.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Button
                  onClick={() => handleNavigation("/coordinator-courses")}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg text-lg font-semibold transition-colors duration-300"
                >
                  Ver Coordenadores
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  )
}
