"use client"

import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon, AlertDiamondIcon,
  InformationCircleIcon, Cancel01Icon,
} from "@hugeicons/core-free-icons"
import { useAlertStore } from "@/store/alert-store"
import { cn } from "@/lib/utils"

const TYPE_CONFIG = {
  success: { bg:"bg-[#F0FDF4]", border:"border-[#BBF7D0]", text:"text-[#16A34A]", icon:CheckmarkCircle02Icon },
  error:   { bg:"bg-[#FEF2F2]", border:"border-[#FECACA]", text:"text-[#DC2626]", icon:AlertDiamondIcon   },
  warning: { bg:"bg-[#FFFBEB]", border:"border-[#FDE68A]", text:"text-[#D97706]", icon:AlertDiamondIcon   },
  info:    { bg:"bg-[#EFF6FF]", border:"border-[#BFDBFE]", text:"text-[#2563EB]", icon:InformationCircleIcon },
}

export function AlertToast() {
  const { alerts, dismiss } = useAlertStore()

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {alerts.map((alert) => {
          const cfg = TYPE_CONFIG[alert.type]
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity:0, x:40, scale:0.96 }}
              animate={{ opacity:1, x:0,  scale:1    }}
              exit={{    opacity:0, x:40, scale:0.96 }}
              transition={{ duration:0.2, ease:[0.33,1,0.68,1] }}
              className={cn(
                "flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl border shadow-lg pointer-events-auto min-w-[280px] max-w-[360px]",
                cfg.bg, cfg.border
              )}
            >
              <HugeiconsIcon icon={cfg.icon} size={16} strokeWidth={2} className={cn("shrink-0", cfg.text)} />
              <p className={cn("flex-1 text-[12.5px] font-semibold", cfg.text)}>{alert.message}</p>
              <button
                onClick={() => dismiss(alert.id)}
                className={cn("shrink-0 opacity-60 hover:opacity-100 transition-opacity", cfg.text)}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2.5} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
