"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Check, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalysisPopupProps {
  courseId: string
  initialStatus: string
  initialObservations: string
  onClose: () => void
  onSubmit: (courseId: string, status: string, observations: string) => Promise<void>
}

export default function AnalysisPopup({
  courseId,
  initialStatus,
  initialObservations,
  onClose,
  onSubmit,
}: AnalysisPopupProps) {
  const [selectedStatus, setSelectedStatus] = useState(initialStatus || "")
  const [observations, setObservations] = useState(initialObservations || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedStatus) {
      setError("Por favor, selecione um status para a proposta.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(courseId, selectedStatus, observations)
      setIsSuccess(true)

      // Close the popup after a brief success indication
      setTimeout(() => {
        onClose()
      }, 500)
    } catch (err) {
      setError("Ocorreu um erro ao salvar as alterações. Por favor, tente novamente.")
      console.error("Error submitting analysis:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const statusOptions = [
    { value: "Aprovado", label: "Aprovado", color: "bg-green-500" },
    { value: "Reprovado", label: "Reprovado", color: "bg-red-500" },
    { value: "Stand By", label: "Stand By", color: "bg-yellow-500" },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Analisar Proposta</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status da Proposta
            </label>
            <div className="grid grid-cols-3 gap-3">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    "flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all",
                    selectedStatus === option.value
                      ? "border-gray-800 dark:border-gray-200 bg-gray-100 dark:bg-gray-700"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
                  )}
                  onClick={() => setSelectedStatus(option.value)}
                >
                  <span className={cn("w-3 h-3 rounded-full mr-2", option.color)} aria-hidden="true"></span>
                  <span className="font-medium">{option.label}</span>
                  {selectedStatus === option.value && (
                    <Check size={16} className="ml-2 text-green-500" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="observations" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observações do Comitê
            </label>
            <textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className={cn(
                "w-full px-3 py-2 border rounded-lg",
                "text-gray-900 dark:text-gray-100",
                "bg-white dark:bg-gray-800",
                "border-gray-300 dark:border-gray-600",
                "focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-500 dark:focus:border-orange-500",
                "placeholder-gray-400 dark:placeholder-gray-500",
                "transition-colors",
              )}
              rows={5}
              placeholder="Insira as observações do comitê sobre esta proposta..."
            ></textarea>
          </div>

          {isSuccess && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-600 dark:text-green-400">Análise salva com sucesso!</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={cn(
                "px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800",
                "flex items-center justify-center",
                isSubmitting ? "opacity-70 cursor-not-allowed" : "",
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                "Salvar Análise"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
