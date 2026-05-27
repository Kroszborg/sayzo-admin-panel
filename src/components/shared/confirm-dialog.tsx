"use client"

import { motion } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"

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
  confirmLabel = "Confirm", cancelLabel = "Back",
  destructive = false, onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[380px] rounded-[28px] p-0 gap-0 overflow-hidden bg-white dark:bg-[#1C1C22] border-0 shadow-2xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 14 }}
          transition={{ duration: 0.24, ease: [0.33, 1, 0.68, 1] }}
          className="px-7 pt-8 pb-7 flex flex-col items-center text-center"
        >
          <h2 className="text-[19px] font-extrabold text-[#111827] dark:text-[#E8E8E8] mb-2.5 leading-snug">
            {title}
          </h2>
          <p className="text-[13px] text-[#6B7280] dark:text-[#9BA1A6] leading-relaxed mb-7 max-w-[280px]">
            {description}
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.14 }}
            onClick={() => { onConfirm(); onOpenChange(false) }}
            className={`w-full h-[48px] rounded-2xl text-white text-[13px] font-bold tracking-wide shadow-sm transition-colors ${
              destructive
                ? "bg-[#DC2626] hover:bg-[#B91C1C]"
                : "bg-[#17B890] hover:bg-[#14a37d]"
            }`}
          >
            {confirmLabel}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.14 }}
            onClick={() => onOpenChange(false)}
            className="w-full h-[48px] mt-2.5 rounded-2xl border border-[#E5E7EB] dark:border-[#2C2C34] text-[13px] font-semibold text-[#374151] dark:text-[#9BA1A6] hover:bg-[#F9FAFB] dark:hover:bg-[#26262E] transition-colors"
          >
            {cancelLabel}
          </motion.button>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
