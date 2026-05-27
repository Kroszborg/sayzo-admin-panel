"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserMultiple02Icon, SentIcon, CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"
import { useCommsStore } from "@/store/comms-store"
import { cn } from "@/lib/utils"

// ─── Audience segments ─────────────────────────────────────────────────────

const AUDIENCES = [
  { id:"all"      as const, label:"All Users",  count:"8,241 users",  desc:"Every registered user on the platform" },
  { id:"new"      as const, label:"New Users",  count:"812 users",    desc:"Joined in the last 30 days"            },
  { id:"inactive" as const, label:"Inactive",   count:"1,340 users",  desc:"No activity in 14+ days"               },
]

export default function BroadcastPage() {
  const s = useCommsStore()

  // Auto-reset after success
  useEffect(() => {
    if (s.bcastSuccess) {
      const t = setTimeout(() => s.resetBroadcast(), 3000)
      return () => clearTimeout(t)
    }
  }, [s.bcastSuccess])

  const selectedCount = AUDIENCES
    .filter((a) => s.selectedAudiences.has(a.id))
    .reduce((acc, a) => acc + parseInt(a.count.replace(/,/g, "")), 0)

  const canSend = s.selectedAudiences.size > 0 && s.broadcastTitle.trim() && s.broadcastBody.trim() && !s.bcastSending

  return (
    <div>
      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#111827] dark:text-[#E8E8E8]">Broadcast</h1>
          <p className="text-[12px] text-[#8FA3A0] mt-0.5">Compose and send a message to your user segments.</p>
        </div>
        {/* Live Support | Broadcast tab toggle */}
        <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden shrink-0">
          <Link href="/communications/live-support"
            className="flex items-center h-8 px-4 text-[12px] font-medium text-[#374151] hover:bg-[#F5F8F7] transition-colors">
            Live Support
          </Link>
          <Link href="/communications/broadcast"
            className="flex items-center h-8 px-4 text-[12px] font-bold bg-[#111827] text-white">
            Broadcast
          </Link>
        </div>
      </div>

    <div className="max-w-2xl space-y-5">
      {/* Success toast */}
      <AnimatePresence>
        {s.bcastSuccess && (
          <motion.div
            initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
            transition={{ duration:0.22 }}
            className="flex items-center gap-2.5 px-4 py-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} strokeWidth={2} className="text-[#17B890]" />
            <p className="text-[12.5px] font-semibold text-[#16A34A]">
              Broadcast queued — reaching <span className="font-extrabold">{selectedCount.toLocaleString()}</span> users
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audience selector */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <p className="text-[13px] font-bold text-[#111827] mb-1">Select Audience</p>
        <p className="text-[12px] text-[#8FA3A0] mb-4">Choose which user segments receive this message.</p>

        <div className="grid grid-cols-3 gap-3">
          {AUDIENCES.map((seg) => {
            const active = s.selectedAudiences.has(seg.id)
            return (
              <motion.button
                key={seg.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration:0.1 }}
                onClick={() => s.toggleAudience(seg.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 text-center transition-all",
                  active
                    ? "border-[#17B890] bg-[#F0FDF4]"
                    : "border-[#E5E7EB] bg-white hover:border-[#A8DFD0] hover:bg-[#F9FAFB]"
                )}
              >
                <HugeiconsIcon icon={UserMultiple02Icon} size={22} strokeWidth={1.5}
                  className={active ? "text-[#17B890]" : "text-[#8FA3A0]"} />
                <p className={cn("text-[12px] font-bold", active ? "text-[#111827]" : "text-[#374151]")}>{seg.label}</p>
                <p className={cn("text-[11.5px] font-bold", active ? "text-[#17B890]" : "text-[#8FA3A0]")}>{seg.count}</p>
              </motion.button>
            )
          })}
        </div>

        {s.selectedAudiences.size > 0 && (
          <p className="text-[11.5px] text-[#8FA3A0] mt-3 pt-3 border-t border-[#F3F4F6]">
            Estimated reach: <span className="font-bold text-[#374151]">{selectedCount.toLocaleString()} users</span>
          </p>
        )}
      </div>

      {/* Compose */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-[12px] font-bold text-[#374151] mb-1.5">Message Title</label>
          <input
            value={s.broadcastTitle}
            onChange={(e) => s.setBroadcastTitle(e.target.value)}
            placeholder="e.g. 🎉 May Platform Update is Here!"
            maxLength={100}
            className="w-full h-10 px-3 rounded-xl border border-[#E2E8E6] text-[13px] text-[#374151] outline-none focus:border-[#17B890] placeholder:text-[#C8D8D4] transition-colors"
          />
          <p className="text-[10.5px] text-[#8FA3A0] mt-1 text-right">{s.broadcastTitle.length}/100</p>
        </div>

        <div>
          <label className="block text-[12px] font-bold text-[#374151] mb-1.5">Message Body</label>
          <textarea
            value={s.broadcastBody}
            onChange={(e) => s.setBroadcastBody(e.target.value)}
            rows={6}
            placeholder="We've rolled out a major update this May! Enjoy faster performance, new payment features, and improved dispute resolution. Tap to explore what's new."
            className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8E6] text-[13px] text-[#374151] outline-none focus:border-[#17B890] resize-none placeholder:text-[#C8D8D4] transition-colors leading-relaxed"
          />
          <p className="text-[10.5px] text-[#8FA3A0] mt-1 text-right">{s.broadcastBody.length} characters</p>
        </div>

        {/* Send row */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6]">
          <div className="text-[11.5px] text-[#8FA3A0]">
            {s.selectedAudiences.size > 0
              ? <>Sending to <span className="font-bold text-[#374151]">{selectedCount.toLocaleString()}</span> users via push + email</>
              : "Select an audience above to continue"
            }
          </div>
          <motion.button
            whileHover={canSend && !s.bcastSending ? { scale: 1.015 } : {}}
            whileTap={canSend && !s.bcastSending ? { scale: 0.97 } : {}}
            onClick={s.sendBroadcast}
            disabled={!canSend}
            className={cn(
              "flex items-center gap-1.5 h-9 px-5 rounded-xl text-white text-[12.5px] font-bold transition-all",
              canSend
                ? s.bcastSending
                  ? "bg-[#8FA3A0] cursor-wait"
                  : "bg-[#111827] hover:bg-[#1f2937]"
                : "bg-[#D1D5DB] cursor-not-allowed"
            )}
          >
            <HugeiconsIcon icon={SentIcon} size={13} strokeWidth={2} />
            {s.bcastSending ? "Sending…" : "Send Broadcast"}
          </motion.button>
        </div>
      </div>
    </div>
    </div>
  )
}
