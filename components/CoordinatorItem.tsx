"use client"

import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, User } from "lucide-react"
import type { Coordinator } from "@/lib/types"
import { formatCoordinatorName } from "@/lib/utils"

interface CoordinatorItemProps {
  coordinator: Coordinator
}

const CoordinatorItem: React.FC<CoordinatorItemProps> = ({ coordinator }) => {
  const [isBiographyVisible, setIsBiographyVisible] = useState(false)

  const toggleBiographyVisibility = useCallback(() => {
    setIsBiographyVisible((prev) => !prev)
  }, [])

  const biographyVariants = {
    collapsed: { opacity: 0, height: 0, marginTop: 0 },
    expanded: { opacity: 1, height: "auto", marginTop: "0.75rem" },
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div
        className="flex justify-between items-center cursor-pointer p-4 group"
        onClick={toggleBiographyVisibility}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            toggleBiographyVisibility()
          }
        }}
        aria-expanded={isBiographyVisible}
        aria-controls={`biography-${coordinator.nome.replace(/\s+/g, "-")}`}
      >
        <div className="flex items-center space-x-3 flex-1">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
              {formatCoordinatorName(coordinator.nome)}
            </h4>
            {coordinator.jaECoordenador && (
              <span className="inline-flex items-center mt-1 text-xs font-medium text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5"></span>
                Coordenador Unyleya
              </span>
            )}
          </div>
        </div>
        <button
          aria-label={isBiographyVisible ? "Recolher biografia" : "Expandir biografia"}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-orange-500 dark:text-gray-500 dark:hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-lg transition-colors"
        >
          <motion.div animate={{ rotate: isBiographyVisible ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight size={20} />
          </motion.div>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isBiographyVisible && (
          <motion.div
            id={`biography-${coordinator.nome.replace(/\s+/g, "-")}`}
            key="biography"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={biographyVariants}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                  {coordinator.minibiografia || "Minibiografia não disponível."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default React.memo(CoordinatorItem)
