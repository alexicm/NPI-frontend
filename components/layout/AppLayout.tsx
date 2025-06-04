"use client"

import { type ReactNode, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, LayoutDashboard, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

interface AppLayoutProps {
  children: ReactNode
  title: string
  showBackButton?: boolean
  showHomeButton?: boolean
  showDashboardButton?: boolean
  backUrl?: string
  sidebarTrigger?: ReactNode
}

export default function AppLayout({
  children,
  title,
  showBackButton = false,
  showHomeButton = false,
  showDashboardButton = false,
  backUrl,
  sidebarTrigger,
}: AppLayoutProps) {
  const router = useRouter()

  const handleBack = useCallback(() => {
    if (backUrl) {
      router.push(backUrl)
    } else {
      router.back()
    }
  }, [router, backUrl])

  const handleHome = useCallback(() => {
    router.push("/novos-projetos")
  }, [router])

  const handleDashboard = useCallback(() => {
    router.push("/dashboard")
  }, [router])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <motion.header
        className="bg-gradient-to-r from-orange-500 to-pink-600 shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-[90%] max-w-[1600px] mx-auto py-4 px-4">
          {/* Main Title Section */}
          <div className="flex items-center justify-center mb-2">
            {sidebarTrigger && <div className="mr-3">{sidebarTrigger}</div>}
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 mr-3 shadow-lg">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/uny_logo-pEYx6pRnSznZKeclaZApEzV7ztgHVq.png"
                alt="Unyleya Logo"
                width={32}
                height={32}
                priority
                className="rounded-full"
              />
            </div>
            <h1 className="text-white font-medium text-xl md:text-2xl lg:text-3xl text-center drop-shadow-lg">
              {title}
            </h1>
          </div>

          {/* Navigation Subheader */}
          {(showBackButton || showHomeButton || showDashboardButton) && (
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-lg">
                {showBackButton && (
                  <Button
                    onClick={handleBack}
                    variant="secondary"
                    size="sm"
                    className="bg-white/90 text-orange-600 hover:bg-white hover:scale-105 transition-all duration-300 rounded-full shadow-md"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
                  </Button>
                )}
                {showHomeButton && (
                  <Button
                    onClick={handleHome}
                    variant="secondary"
                    size="sm"
                    className="bg-white/90 text-orange-600 hover:bg-white hover:scale-105 transition-all duration-300 rounded-full shadow-md"
                  >
                    <Home className="mr-1 h-4 w-4" /> Início
                  </Button>
                )}
                {showDashboardButton && (
                  <Button
                    onClick={handleDashboard}
                    variant="secondary"
                    size="sm"
                    className="bg-white/90 text-orange-600 hover:bg-white hover:scale-105 transition-all duration-300 rounded-full shadow-md"
                  >
                    <LayoutDashboard className="mr-1 h-4 w-4" /> Dashboard
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        className="flex-1 w-[90%] max-w-[1600px] mx-auto py-8 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}
      </motion.main>
    </div>
  )
}
