"use client"

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExpandableSectionProps {
  children: React.ReactNode
  className?: string
  title: string
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ children, className, title }) => {
  const [isModalExpanded, setIsModalExpanded] = useState(false) // For modal view
  const [isContentVisible, setIsContentVisible] = useState(false) // For inline content visibility
  const [fontSize, setFontSize] = useState(16) // Default font size in px for modal
  const modalContentRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const toggleContentVisibility = useCallback(() => {
    setIsContentVisible((prev) => !prev)
  }, [])

  const handleModalOpen = useCallback(() => {
    setIsModalExpanded(true)
  }, [])

  const handleModalClose = useCallback(() => {
    setIsModalExpanded(false)
    setFontSize(16) // Reset font size on modal close
  }, [])

  const handleZoomIn = useCallback(() => {
    setFontSize((prevSize) => Math.min(prevSize + 2, 32)) // Max 32px
  }, [])

  const handleZoomOut = useCallback(() => {
    setFontSize((prevSize) => Math.max(prevSize - 2, 12)) // Min 12px
  }, [])

  const handleClickOutsideModal = useCallback(
    (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleModalClose()
      }
    },
    [handleModalClose],
  )

  const modalStyle = useMemo(() => {
    if (!isModalExpanded) return {}
    return { fontSize: `${fontSize}px` }
  }, [isModalExpanded, fontSize])

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalExpanded) {
        handleModalClose()
      }
    }

    if (isModalExpanded) {
      document.addEventListener("keydown", handleEscKey)
      document.addEventListener("mousedown", handleClickOutsideModal)
      document.body.style.overflow = "hidden"
      if (modalContentRef.current) {
        modalContentRef.current.focus()
      }
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
      document.removeEventListener("mousedown", handleClickOutsideModal)
      document.body.style.overflow = "auto"
    }
  }, [isModalExpanded, handleModalClose, handleClickOutsideModal])

  const contentVariants = {
    collapsed: { opacity: 0, height: 0, marginTop: 0, marginBottom: 0 },
    expanded: { opacity: 1, height: "auto", marginTop: "1rem", marginBottom: "0.5rem" },
  }

  return (
    <div className={cn("expandable-section border-b border-gray-200 dark:border-gray-700 py-3", className)}>
      <div className="flex justify-between items-center">
        <div className="flex items-center cursor-pointer group" onClick={toggleContentVisibility}>
          <button
            aria-label={isContentVisible ? `Recolher ${title}` : `Expandir ${title}`}
            className="p-2 text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg transition-all duration-200 hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <motion.div animate={{ rotate: isContentVisible ? 90 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight size={20} />
            </motion.div>
          </button>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 ml-2 select-none group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {title}
          </h2>
        </div>
        <button
          onClick={handleModalOpen}
          className="text-xs text-gray-500 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400 transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg px-3 py-2 group hover:bg-gray-50 dark:hover:bg-gray-800"
          aria-label={`Abrir ${title} em tela cheia`}
        >
          <Maximize2 size={14} className="mr-1.5" />
          <span className="hidden sm:inline group-hover:underline">Expandir</span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isContentVisible && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={contentVariants}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden pl-10 pr-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for full-screen expansion with zoom */}
      <AnimatePresence>
        {isModalExpanded && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="min-h-screen px-2 sm:px-4 py-4 sm:py-8 flex items-center justify-center">
              <motion.div
                ref={modalRef}
                className={cn(
                  "bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-6xl mx-auto",
                  "modal-zoom-content",
                  "border border-gray-200 dark:border-gray-700",
                )}
                style={modalStyle}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div
                  ref={modalContentRef}
                  tabIndex={-1}
                  className="focus:outline-none"
                  role="dialog"
                  aria-labelledby={`${title}-dialog-title`}
                >
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h2
                      id={`${title}-dialog-title`}
                      className="text-2xl sm:text-3xl font-bold text-orange-500 flex items-center"
                      style={{ fontSize: "1.5em" }}
                    >
                      <span className="w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full mr-3"></span>
                      {title}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                          onClick={handleZoomOut}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                          aria-label="Diminuir fonte"
                          title="Diminuir fonte"
                        >
                          <ZoomOut className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </button>
                        <span className="px-2 text-xs text-gray-500 dark:text-gray-400 font-mono">{fontSize}px</span>
                        <button
                          onClick={handleZoomIn}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                          aria-label="Aumentar fonte"
                          title="Aumentar fonte"
                        >
                          <ZoomIn className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </button>
                      </div>
                      <button
                        onClick={handleModalClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        aria-label={`Fechar ${title}`}
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-y-auto max-h-[calc(100vh-12rem)] sm:max-h-[calc(100vh-14rem)] custom-scrollbar">
                    {children}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default React.memo(ExpandableSection)
