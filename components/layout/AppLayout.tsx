"use client"

import { type ReactNode, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, LayoutDashboard, ArrowLeft } from "lucide-react"

interface AppLayoutProps {
  children: ReactNode
  title: string
  showBackButton?: boolean
  showHomeButton?: boolean
  showDashboardButton?: boolean
  backUrl?: string
}

export default function AppLayout({
  children,
  title,
  showBackButton = false,
  showHomeButton = false,
  showDashboardButton = false,
  backUrl,
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-pink-600 shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                onClick={handleBack}
                className="px-2 sm:px-4 py-1 sm:py-2 bg-white text-orange-500 rounded-full text-xs sm:text-sm font-semibold hover:bg-orange-100 transition duration-300 flex items-center justify-center whitespace-nowrap"
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
              </Button>
            )}
            {showHomeButton && (
              <Button
                onClick={handleHome}
                className="px-2 sm:px-4 py-1 sm:py-2 bg-white text-orange-500 rounded-full text-xs sm:text-sm font-semibold hover:bg-orange-100 transition duration-300 flex items-center justify-center whitespace-nowrap"
              >
                <Home className="mr-1 h-4 w-4" /> Início
              </Button>
            )}
            {showDashboardButton && (
              <Button
                onClick={handleDashboard}
                className="px-2 sm:px-4 py-1 sm:py-2 bg-white text-orange-500 rounded-full text-xs sm:text-sm font-semibold hover:bg-orange-100 transition duration-300 flex items-center justify-center whitespace-nowrap"
              >
                <LayoutDashboard className="mr-1 h-4 w-4" /> Dashboard
              </Button>
            )}
          </div>
          <span className="text-white font-medium text-lg sm:text-xl text-center flex-grow">{title}</span>
          <div className="flex items-center gap-4">
            <div className="cursor-pointer bg-white rounded-full p-1">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/uny_logo-pEYx6pRnSznZKeclaZApEzV7ztgHVq.png"
                alt="Unyleya Logo"
                width={32}
                height={32}
                priority
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  )
}
