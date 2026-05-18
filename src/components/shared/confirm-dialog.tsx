"use client"

import { motion } from "framer-motion"
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
}

export function ConfirmDialog({
  open, onOpenChange, title, description,
  confirmLabel = "Confirm", cancelLabel = "Cancel",
  destructive = false, onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="p-0 gap-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] }}
        >
          <div className="px-6 pt-6 pb-5">
            <AlertDialogHeader className="space-y-2 text-left">
              <AlertDialogTitle className="text-[15px] font-bold text-[#111827] leading-snug">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[12.5px] text-[#6B7280] leading-relaxed">
                {description}
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <div className="h-px bg-[#F3F4F6]" />
          <AlertDialogFooter className="flex gap-2 px-6 py-4 flex-row justify-end bg-[#F9FAFB]">
            <AlertDialogCancel asChild>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                className="h-8 px-4 rounded-lg border border-[#E2E8E6] text-[12px] font-semibold text-[#374151] bg-white hover:bg-[#F5F8F7] transition-colors"
              >
                {cancelLabel}
              </motion.button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                className={`h-8 px-4 rounded-lg text-[12px] font-bold text-white transition-colors ${
                  destructive
                    ? "bg-[#DC2626] hover:bg-[#B91C1C]"
                    : "bg-[#111827] hover:bg-[#1f2937]"
                }`}
              >
                {confirmLabel}
              </motion.button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
