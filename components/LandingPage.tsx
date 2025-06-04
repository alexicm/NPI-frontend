"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Sparkles, TrendingUp } from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"

export default function LandingPage() {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const features = [
    {
      icon: BookOpen,
      title: "Propostas de Cursos",
      description: "Visualize e gerencie todas as propostas de cursos, acompanhe seus status e detalhes.",
      action: () => handleNavigation("/course-proposal"),
      gradient: "from-orange-500 to-pink-600",
      bgGradient: "from-orange-50 to-pink-50",
    },
    {
      icon: Users,
      title: "Cursos por Coordenador",
      description: "Explore os cursos associados a cada coordenador e suas informações detalhadas.",
      action: () => handleNavigation("/coordinator-courses"),
      gradient: "from-pink-500 to-purple-600",
      bgGradient: "from-pink-50 to-purple-50",
    },
  ]

  return (
    <AppLayout title="Gestão de Propostas" showHomeButton={false} showBackButton={false} showDashboardButton={true}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-4 rounded-full shadow-xl">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-6 leading-tight">
            Sistema de Gestão de
            <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              {" "}
              Propostas de Cursos
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Gerencie e acompanhe o ciclo de vida das propostas de novos cursos e a performance dos coordenadores com uma
            interface moderna e intuitiva.
          </p>

          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Analytics em tempo real</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Gestão colaborativa</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Interface intuitiva</span>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Card
                className={`h-full flex flex-col justify-between bg-gradient-to-br ${feature.bgGradient} shadow-xl hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden relative cursor-pointer`}
                onClick={feature.action}
              >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

                <CardHeader className="pb-6 relative z-10">
                  <div
                    className={`bg-gradient-to-r ${feature.gradient} p-4 rounded-2xl w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 relative z-10">
                  <Button
                    className={`w-full bg-gradient-to-r ${feature.gradient} hover:shadow-lg text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105`}
                  >
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AppLayout>
  )
}
