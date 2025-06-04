"use client"

import { useState, useMemo, useCallback } from "react"
import { Check, ChevronsUpDown, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import type { Course } from "@/lib/types"

interface CoordinatorFilterProps {
  courses: Record<string, Course>
  selectedCoordinators: string[]
  onCoordinatorChange: (coordinators: string[]) => void
}

export default function CoordinatorFilter({
  courses,
  selectedCoordinators,
  onCoordinatorChange,
}: CoordinatorFilterProps) {
  const [open, setOpen] = useState(false)

  const uniqueCoordinators = useMemo(() => {
    const allCoordinators = Object.values(courses || {}).map((course) => course.coordenadorSolicitante)
    const unique = Array.from(new Set(allCoordinators)).filter(Boolean) as string[]
    return unique.sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }))
  }, [courses])

  const handleSelect = useCallback(
    (coordinator: string) => {
      const newSelection = selectedCoordinators.includes(coordinator)
        ? selectedCoordinators.filter((c) => c !== coordinator)
        : [...selectedCoordinators, coordinator]
      onCoordinatorChange(newSelection)
    },
    [selectedCoordinators, onCoordinatorChange],
  )

  const handleClearAll = useCallback(() => {
    onCoordinatorChange([])
  }, [onCoordinatorChange])

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-left font-normal"
          >
            {selectedCoordinators.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedCoordinators.map((coordinator) => (
                  <Badge key={coordinator} variant="secondary" className="flex items-center gap-1">
                    {coordinator}
                    <XCircle
                      className="h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelect(coordinator)
                      }}
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              "Filtrar por coordenador..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Buscar coordenador..." />
            <CommandList>
              <CommandEmpty>Nenhum coordenador encontrado.</CommandEmpty>
              <CommandGroup>
                {uniqueCoordinators.map((coordinator) => (
                  <CommandItem
                    key={coordinator}
                    value={coordinator}
                    onSelect={() => handleSelect(coordinator)}
                    className="flex items-center justify-between"
                  >
                    {coordinator}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedCoordinators.includes(coordinator) ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          {selectedCoordinators.length > 0 && (
            <div className="p-2 border-t">
              <Button variant="ghost" size="sm" className="w-full" onClick={handleClearAll}>
                Limpar todos os filtros
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
