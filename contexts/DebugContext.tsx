"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface DebugContextValue {
  isDebugMode: boolean
  toggleDebugMode: () => void
  debugData: Record<string, unknown>
  addDebugData: (key: string, value: unknown) => void
  clearDebugData: () => void
}

const DebugContext = createContext<DebugContextValue | undefined>(undefined)

export function DebugProvider({ children }: { children: ReactNode }) {
  const [isDebugMode, setIsDebugMode] = useState(false)
  const [debugData, setDebugData] = useState<Record<string, unknown>>({})

  const toggleDebugMode = () => setIsDebugMode((prev) => !prev)
  const addDebugData = (key: string, value: unknown) => setDebugData((prev) => ({ ...prev, [key]: value }))
  const clearDebugData = () => setDebugData({})

  return (
    <DebugContext.Provider value={{ isDebugMode, toggleDebugMode, debugData, addDebugData, clearDebugData }}>
      {children}
    </DebugContext.Provider>
  )
}

export function useDebug() {
  const context = useContext(DebugContext)
  if (!context) {
    throw new Error("useDebug must be used within a DebugProvider")
  }
  return context
}
