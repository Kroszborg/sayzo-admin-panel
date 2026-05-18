"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface FilterDropdownProps {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
  width?: number
}

export function FilterDropdown({ label, options, value, onChange, width = 160 }: FilterDropdownProps) {
  const [open, setOpen]           = useState(false)
  const [alignRight, setAlignRight] = useState(false)
  const [openUp, setOpenUp]       = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef      = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Detect overflow direction each time menu opens
  useEffect(() => {
    if (!open || !containerRef.current) return
    const rect     = containerRef.current.getBoundingClientRect()
    const vpWidth  = window.innerWidth
    const vpHeight = window.innerHeight
    const menuH    = options.length * 42 + 8   // approximate menu height
    const menuW    = Math.max(width, rect.width)

    // Flip horizontally if not enough room on the right
    setAlignRight(rect.left + menuW > vpWidth - 8)
    // Flip vertically if not enough room below
    setOpenUp(rect.bottom + menuH > vpHeight - 8)
  }, [open, options.length, width])

  const displayLabel = value === options[0] ? label : value
  const isActive = value !== options[0]

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "h-8 px-3 rounded-lg border text-[12px] font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap select-none",
          open || isActive
            ? "bg-[#111827] text-white border-[#111827]"
            : "bg-white text-[#374151] border-[#E2E8E6] hover:bg-[#F5F8F7] hover:border-[#D1D5DB]"
        )}
      >
        {displayLabel}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="shrink-0 opacity-70 flex items-center"
        >
          <HugeiconsIcon icon={ArrowDown01Icon} size={11} strokeWidth={2.5} />
        </motion.span>
      </motion.button>

      {/* Dropdown — rendered inside a portal-like fixed layer via z-[9999] */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: openUp ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12, ease: [0.33, 1, 0.68, 1] }}
            className={cn(
              "absolute z-[9999] bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1 overflow-hidden",
              openUp   ? "bottom-full mb-1.5" : "top-full mt-1.5",
              alignRight ? "right-0" : "left-0"
            )}
            style={{ minWidth: Math.max(width, 140) }}
          >
            {options.map((opt) => (
              <motion.button
                key={opt}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.08 }}
                onClick={() => { onChange(opt); setOpen(false) }}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2.5 text-[12px] text-left transition-colors",
                  value === opt
                    ? "bg-[#F0FDF4] text-[#17B890] font-semibold"
                    : "text-[#374151] hover:bg-[#F5F8F7] font-medium"
                )}
              >
                {opt}
                {value === opt && (
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2} className="text-[#17B890] shrink-0 ml-2" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
