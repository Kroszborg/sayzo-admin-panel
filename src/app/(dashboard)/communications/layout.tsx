"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function CommunicationsLayout({ children }: { children: React.ReactNode }) {
  const pathname      = usePathname()
  const isLiveSupport = pathname.includes("live-support")
  const isBroadcast   = pathname.includes("broadcast")

  return (
    <div className="flex flex-col h-full">
      {/* Page header + tab switcher */}
      <div className="flex items-start justify-between mb-5 shrink-0">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#111827]">
            {isLiveSupport ? "Live Support" : "Broadcast"}
          </h1>
          <p className="text-[12px] text-[#8FA3A0] mt-0.5">
            {isLiveSupport
              ? "Manage real-time user conversations and resolve support requests"
              : "Compose and send targeted messages across your user segments"}
          </p>
        </div>

        {/* Tab switcher pill */}
        <div className="flex rounded-xl overflow-hidden border border-[#E2E8E6] shrink-0 mt-0.5">
          <Link href="/communications/live-support"
            className={cn(
              "flex items-center gap-1.5 h-8 px-4 text-[12px] font-semibold transition-colors",
              isLiveSupport ? "bg-[#17B890] text-white" : "bg-white text-[#374151] hover:bg-[#F5F8F7]"
            )}>
            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", isLiveSupport ? "bg-white" : "bg-[#22C55E]")} />
            Live Support
          </Link>
          <Link href="/communications/broadcast"
            className={cn(
              "flex items-center gap-1.5 h-8 px-4 text-[12px] font-semibold border-l border-[#E2E8E6] transition-colors",
              isBroadcast ? "bg-[#17B890] text-white" : "bg-white text-[#374151] hover:bg-[#F5F8F7]"
            )}>
            Broadcast
          </Link>
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  )
}
