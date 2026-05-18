"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon, ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface FilterDropdownProps {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
  width?: number
}

export function FilterDropdown({ label, options, value, onChange, width = 160 }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const displayLabel = value === options[0] ? label : value

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "h-8 px-3 rounded-lg border text-[12px] font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap",
          open || value !== options[0]
            ? "bg-[#111827] text-white border-[#111827]"
            : "bg-white text-[#374151] border-[#E2E8E6] hover:bg-[#F5F8F7]"
        )}
      >
        {displayLabel}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="shrink-0 opacity-70 flex items-center"
        >
          <HugeiconsIcon icon={ArrowDown01Icon} size={11} strokeWidth={2.5} />
        </motion.span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.13, ease: [0.33, 1, 0.68, 1] }}
            className="absolute top-full left-0 mt-1.5 z-50 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1 overflow-hidden"
            style={{ minWidth: width }}
          >
            {options.map((opt) => (
              <motion.button
                key={opt}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.1 }}
                onClick={() => { onChange(opt); setOpen(false) }}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2.5 text-[12px] text-left transition-colors",
                  value === opt
                    ? "bg-[#F0FDF4] text-[#17B890] font-semibold"
                    : "text-[#374151] hover:bg-[#F9FAFB] font-medium"
                )}
              >
                {opt}
                {value === opt && (
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2} className="text-[#17B890] shrink-0" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
