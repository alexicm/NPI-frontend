"use client"

import { useMemo } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarRail,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { BookOpen, LayoutDashboard, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { formatCoordinatorName } from "@/lib/utils"
import type { Course } from "@/lib/types"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface CourseCoordinatorSidebarProps {
  groupedCourses: Record<string, Course[]>
  scrollToCoordinator: (coordinator: string) => void
}

export default function CourseCoordinatorSidebar({
  groupedCourses,
  scrollToCoordinator,
}: CourseCoordinatorSidebarProps) {
  const { state, toggleSidebar } = useSidebar()
  const router = useRouter()
  const isCollapsed = state === "collapsed"

  const sortedCoordinators = useMemo(() => {
    return Object.keys(groupedCourses).sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }))
  }, [groupedCourses])

  const totalCourses = useMemo(() => {
    return Object.values(groupedCourses).reduce((total, courses) => total + courses.length, 0)
  }, [groupedCourses])

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r-0">
      <div className="h-full bg-gradient-to-b from-white via-orange-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Enhanced Header */}
        <SidebarHeader className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10" />
          <div className="relative flex items-center justify-between p-4 border-b border-orange-100/50 dark:border-gray-700/50">
            <AnimatePresence mode="wait">
              {!isCollapsed ? (
                <motion.div
                  key="expanded-logo"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex items-center gap-3"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg blur-sm opacity-20" />
                    <div className="relative bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-orange-200/50 dark:border-gray-600">
                      <Image
                        src="/images/uny_logo_dark.png"
                        alt="Unyleya Logo"
                        width={100}
                        height={30}
                        className="h-auto"
                        priority
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed-logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full blur-sm opacity-30" />
                    <div className="relative bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg border-2 border-orange-200/50 dark:border-gray-600">
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">U</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Toggle Button */}
            <motion.button
              onClick={toggleSidebar}
              className={cn(
                "relative w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300", // Circular button
                "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm",
                "border border-orange-200/50 dark:border-gray-600/50",
                "shadow-md hover:shadow-lg",
                "hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50",
                "hover:border-orange-300/70 dark:hover:border-gray-500",
                "hover:scale-110",
                "focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2",
                "active:scale-95",
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isCollapsed ? "Expandir sidebar" : "Minimizar sidebar"}
            >
              <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                {isCollapsed ? (
                  <PanelLeftOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" /> // Slightly larger icon
                ) : (
                  <PanelLeftClose className="w-5 h-5 text-orange-600 dark:text-orange-400" /> // Slightly larger icon
                )}
              </motion.div>
            </motion.button>
          </div>

          {/* Stats Bar */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="px-4 py-3 bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-gray-800/50 dark:to-gray-700/50 border-b border-orange-100/30 dark:border-gray-700/30"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full" />
                    <span className="font-medium">{sortedCoordinators.length} Coordenadores</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full" />
                    <span className="font-medium">{totalCourses} Cursos</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SidebarHeader>

        <SidebarContent className="py-2">
          {/* Dashboard Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div className="w-1 h-4 bg-gradient-to-b from-orange-400 to-pink-500 rounded-full" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Navegação
                  </motion.span>
                )}
              </AnimatePresence>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => router.push("/dashboard")}
                    tooltip="Dashboard"
                    className={cn(
                      "group relative mx-2 mb-1 rounded-xl transition-all duration-300",
                      "hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50",
                      "hover:border-orange-200/50 hover:shadow-md hover:scale-[1.02]",
                      "dark:hover:from-gray-800 dark:hover:to-gray-700",
                      "focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2",
                      "active:scale-[0.98]",
                    )}
                    disabled={isCollapsed}
                  >
                    <div className="flex items-center gap-3 p-1">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                        <div className="relative bg-gradient-to-r from-orange-100 to-pink-100 dark:from-gray-700 dark:to-gray-600 p-2 rounded-lg group-hover:from-orange-200 group-hover:to-pink-200 transition-all duration-300">
                          <LayoutDashboard className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                      </div>
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-300"
                          >
                            Dashboard
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Coordinators Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div className="w-1 h-4 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Coordenadores
                  </motion.span>
                )}
              </AnimatePresence>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <AnimatePresence>
                  {sortedCoordinators.map((coordinator, index) => (
                    <motion.div
                      key={coordinator}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => scrollToCoordinator(coordinator)}
                          tooltip={formatCoordinatorName(coordinator)}
                          className={cn(
                            "group relative mx-2 mb-1 rounded-xl transition-all duration-300",
                            "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50",
                            "hover:border-blue-200/50 hover:shadow-md hover:scale-[1.02]",
                            "dark:hover:from-gray-800 dark:hover:to-gray-700",
                            "focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2",
                            "active:scale-[0.98]",
                          )}
                          disabled={isCollapsed}
                        >
                          <div className="flex items-center gap-3 p-1 w-full">
                            <div className="relative flex-shrink-0">
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                              <div className="relative bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 p-2 rounded-lg group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                            </div>

                            <AnimatePresence>
                              {!isCollapsed && (
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex items-center justify-between w-full min-w-0"
                                >
                                  <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300 truncate">
                                    {formatCoordinatorName(coordinator)}
                                  </span>
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.2, delay: 0.1 }}
                                    className="relative"
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full blur-sm opacity-30" />
                                    <span className="relative bg-gradient-to-r from-orange-100 to-pink-100 dark:from-gray-700 dark:to-gray-600 text-orange-700 dark:text-orange-300 text-xs font-bold px-2 py-1 rounded-full border border-orange-200/50 dark:border-gray-600 group-hover:from-orange-200 group-hover:to-pink-200 transition-all duration-300">
                                      {groupedCourses[coordinator].length}
                                    </span>
                                  </motion.div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Enhanced Rail */}
        <SidebarRail className="bg-gradient-to-b from-orange-200/30 to-pink-200/30 dark:from-gray-700/30 dark:to-gray-600/30 hover:from-orange-300/50 hover:to-pink-300/50 transition-all duration-300" />
      </div>
    </Sidebar>
  )
}
