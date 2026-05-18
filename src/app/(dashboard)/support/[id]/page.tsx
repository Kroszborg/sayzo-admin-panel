"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon, CheckmarkCircle02Icon, SentIcon,
  AttachmentIcon, Clock01Icon, ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { useSupportStore } from "@/store/support-store"
import { useAlertStore } from "@/store/alert-store"
import { MOCK_TICKETS, MOCK_USERS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── Similar tickets ───────────────────────────────────────────────────────

const SIMILAR = [
  { id:"TKT-2026-1830", title:"Refund not processed after cancellation",          status:"Resolved" },
  { id:"TKT-2026-1822", title:"Unable to withdraw earnings after task completion", status:"Open"     },
  { id:"TKT-2026-1816", title:"Payment stuck in escrow for 5+ days",              status:"Resolved" },
]

// ─── Category colours ──────────────────────────────────────────────────────

const CAT_STYLE: Record<string, string> = {
  Payment:     "bg-[#FEE2E2] text-[#DC2626]",
  Account:     "bg-[#FEF3C7] text-[#D97706]",
  Dispute:     "bg-[#DBEAFE] text-[#2563EB]",
  Technical:   "bg-[#EEF2FF] text-[#6366F1]",
  KYC:         "bg-[#F3E8FF] text-[#9333EA]",
  Trust:       "bg-[#FFF7ED] text-[#EA580C]",
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function SupportDetailPage({ params }: { params: { id: string } }) {
  const router  = useRouter()
  const s       = useSupportStore()
  const listRef = useRef<HTMLDivElement>(null)

  const ticket    = MOCK_TICKETS.find((t) => t.id === params.id) ?? MOCK_TICKETS[0]
  const alert     = useAlertStore()
  const requester = MOCK_USERS.find((u) => u.name === ticket.requesterName) ?? MOCK_USERS[0]
  const catCls    = CAT_STYLE[ticket.category] ?? "bg-[#F3F4F6] text-[#374151]"

  // Scroll thread to bottom when messages change
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior:"smooth" })
  }, [s.messages])

  const STATUS_STYLE: Record<string, string> = {
    "Open":          "bg-[#DBEAFE] text-[#2563EB]",
    "Pending Reply": "bg-[#FEF3C7] text-[#D97706]",
    "Unassigned":    "bg-[#F3F4F6] text-[#6B7280]",
    "Resolved":      "bg-[#DCFCE7] text-[#16A34A]",
    "Escalated":     "bg-[#FEE2E2] text-[#DC2626]",
  }

  return (
    <div>
      {/* Back */}
      <button onClick={() => router.push("/support")}
        className="flex items-center gap-1.5 text-[12px] font-semibold text-[#8FA3A0] hover:text-[#374151] transition-colors mb-4">
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
        Back to Support
      </button>

      {/* Header */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22 }}
        className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-[18px] font-extrabold text-[#111827] max-w-2xl leading-snug">{ticket.title}</h1>
          <div className="flex items-center gap-2.5 mt-1.5 text-[11.5px] text-[#8FA3A0] flex-wrap">
            <span>{ticket.id}</span>
            <span>·</span>
            <span>Opened {ticket.createdAt}</span>
            <span>·</span>
            <span>Assigned to: <span className="font-semibold text-[#374151]">{ticket.assignedTo ?? "Unassigned"}</span></span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-full", STATUS_STYLE[ticket.status] ?? "bg-[#F3F4F6] text-[#6B7280]")}>
              {ticket.status}
            </span>
            <span className={cn("text-[9px] font-black rounded px-1.5 py-0.5", catCls)}>{ticket.category}</span>
          </div>
        </div>
        <button
          onClick={() => {
            s.markResolved(ticket.id)
            alert.show("success", `Ticket ${ticket.id} marked as resolved`)
          }}
          className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#111827] hover:bg-[#1f2937] text-white text-[12px] font-bold transition-colors mt-1">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2} />
          Mark resolved
        </button>
      </motion.div>

      {/* 2-col layout */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.28, delay:0.08 }}
        className="grid grid-cols-3 gap-4">

        {/* ─ Left 2/3 : Conversation ─ */}
        <div className="col-span-2 bg-white border border-[#E5E7EB] rounded-xl flex flex-col overflow-hidden"
          style={{ maxHeight:"calc(100vh - 260px)" }}>

          {/* Thread header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#F3F4F6]">
            <p className="text-[13px] font-bold text-[#111827]">Conversation</p>
            <span className="text-[11px] text-[#8FA3A0]">{s.messages.length} messages</span>
          </div>

          {/* Thread body */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-5 min-h-0">
            <AnimatePresence initial={false}>
              {s.messages.map((msg, i) => {
                const isAgent = msg.from === "agent"
                const prev    = s.messages[i-1]
                const showGap = prev && prev.from !== msg.from

                return (
                  <motion.div key={msg.id}
                    initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    transition={{ duration:0.2, delay:0.04 }}
                    className={cn("space-y-1", showGap && "pt-3 border-t border-[#F9FAFB]")}
                  >
                    {/* Sender row */}
                    <div className={cn("flex items-center gap-2", isAgent && "flex-row-reverse")}>
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                        isAgent ? "bg-[#17B890] text-white" : "bg-[#E8F7F3] text-[#17B890]"
                      )}>
                        {msg.name.split(" ").map(n=>n[0]).join("")}
                      </div>
                      <div className={cn("flex items-center gap-2", isAgent && "flex-row-reverse")}>
                        <p className="text-[12px] font-semibold text-[#374151]">{isAgent ? msg.name : msg.name}</p>
                        <span className={cn("text-[9px] font-black rounded px-1.5 py-0.5",
                          isAgent ? "bg-[#E8F7F3] text-[#17B890]" : "bg-[#F3F4F6] text-[#6B7280]"
                        )}>{msg.role}</span>
                        <span className="text-[10px] text-[#8FA3A0]">{msg.time}</span>
                      </div>
                    </div>

                    {/* Bubble */}
                    <div className={cn("ml-9 max-w-[85%]", isAgent && "ml-0 mr-9")}>
                      <div className={cn(
                        "rounded-2xl px-4 py-3 text-[12.5px] leading-relaxed",
                        isAgent
                          ? "bg-[#F0FDF4] border border-[#BBF7D0] text-[#374151] rounded-tr-sm"
                          : "bg-[#F9FAFB] border border-[#E5E7EB] text-[#374151] rounded-tl-sm"
                      )}>
                        {msg.body}
                      </div>
                      {/* Attachment */}
                      {msg.attach && (
                        <div className="flex items-center gap-2 mt-2 p-2.5 bg-white border border-[#E5E7EB] rounded-xl w-fit">
                          <HugeiconsIcon icon={AttachmentIcon} size={13} strokeWidth={1.5} className="text-[#8FA3A0]" />
                          <span className="text-[11.5px] font-medium text-[#374151]">{msg.attach}</span>
                          <button className="text-[11px] font-bold text-[#17B890] hover:underline ml-1">View</button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Reply composer */}
          <div className="border-t border-[#E5E7EB] p-4 shrink-0">
            <textarea
              value={s.replyText}
              onChange={(e) => s.setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) s.sendReply()
              }}
              placeholder="Type your reply... (Ctrl+Enter to send)"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8E6] text-[12.5px] text-[#374151] outline-none focus:border-[#17B890] resize-none placeholder:text-[#C8D8D4] transition-colors mb-2"
            />
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-1.5 h-7 px-3 border border-[#E2E8E6] rounded-lg text-[11px] font-semibold text-[#374151] hover:bg-[#F5F8F7]">
                <HugeiconsIcon icon={AttachmentIcon} size={12} strokeWidth={1.5} />
                Attach file
              </button>
              <button
                onClick={s.sendReply}
                disabled={!s.replyText.trim() || s.sending}
                className="flex items-center gap-1.5 h-8 px-4 rounded-xl bg-[#111827] hover:bg-[#1f2937] text-white text-[12px] font-bold disabled:opacity-40 transition-all"
              >
                <HugeiconsIcon icon={SentIcon} size={13} strokeWidth={2} />
                {s.sending ? "Sending…" : "Send reply"}
              </button>
            </div>
          </div>
        </div>

        {/* ─ Right 1/3 ─ */}
        <div className="space-y-4 overflow-y-auto min-h-0" style={{ maxHeight:"calc(100vh - 260px)" }}>
          {/* Requester */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-bold text-[#111827]">Requester</p>
              <button className="text-[11px] font-semibold text-[#17B890] hover:underline flex items-center gap-0.5">
                View profile <HugeiconsIcon icon={ArrowRight01Icon} size={10} strokeWidth={2} />
              </button>
            </div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-[12px] shrink-0",
                ticket.requesterRole === "Doer" ? "bg-[#DBEAFE] text-[#2563EB]" : "bg-[#F3E8FF] text-[#9333EA]"
              )}>
                {ticket.requesterName.split(" ").map(n=>n[0]).join("")}
              </div>
              <div>
                <p className="text-[12.5px] font-bold text-[#374151]">{ticket.requesterName}</p>
                <span className={cn("text-[9px] font-black rounded px-1.5 py-0.5",
                  ticket.requesterRole === "Doer" ? "bg-[#DBEAFE] text-[#2563EB]" : "bg-[#F3E8FF] text-[#9333EA]"
                )}>{ticket.requesterRole}</span>
              </div>
            </div>
            <div className="space-y-2 text-[11.5px]">
              {[
                { k:"User ID",        v:requester.id },
                { k:"City",           v:requester.city },
                { k:"Member since",   v:requester.joinedAt },
                { k:"Trust score",    v:String(requester.trustScore), color: requester.trustScore >= 70 ? "#17B890" : "#F59E0B" },
                { k:"Tasks",          v:`${requester.tasks} ${ticket.requesterRole === "Doer" ? "completed" : "posted"}` },
                { k:"Account status", v:requester.status },
              ].map(({ k, v, color }) => (
                <div key={k} className="flex justify-between">
                  <span className="text-[#8FA3A0]">{k}</span>
                  <span className="font-medium text-[#374151]" style={color ? { color } : {}}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket details */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <p className="text-[12px] font-bold text-[#111827] mb-3">Ticket Details</p>
            <div className="space-y-2.5 text-[11.5px]">
              {[
                { k:"Ticket ID",        v:ticket.id,                                  mono:true  },
                { k:"Category",         v:ticket.category                                        },
                { k:"Channel",          v:"In-app"                                              },
                { k:"Assigned to",      v:ticket.assignedTo ?? "Unassigned"                     },
                { k:"SLA",              v:ticket.sla,   sla:true, overdue:ticket.slaOverdue     },
              ].map(({ k, v, mono, sla, overdue }) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#8FA3A0]">
                    <HugeiconsIcon icon={Clock01Icon} size={11} strokeWidth={1.5} />
                    {k}
                  </span>
                  <span className={cn(
                    "font-medium",
                    mono && "font-mono text-[10px]",
                    sla && overdue ? "text-[#EF4444] font-bold" :
                    sla && v === "Done ✓" ? "text-[#17B890] font-bold" :
                    sla ? "text-[#D97706] font-bold" : "text-[#374151]"
                  )}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Similar tickets */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <p className="text-[12px] font-bold text-[#111827] mb-3">Similar Tickets</p>
            <div className="space-y-2">
              {SIMILAR.map((sim) => (
                <button key={sim.id}
                  onClick={() => router.push(`/support/${sim.id}`)}
                  className="w-full flex items-start justify-between gap-2 p-2.5 rounded-xl border border-[#E5E7EB] text-left hover:bg-[#F9FAFB] transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11.5px] font-medium text-[#374151] line-clamp-2 leading-snug">{sim.title}</p>
                    <p className="text-[10px] text-[#8FA3A0] mt-0.5">{sim.id}</p>
                  </div>
                  <span className={cn("text-[9.5px] font-bold rounded-full px-2 py-0.5 shrink-0 mt-0.5",
                    sim.status === "Resolved" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#DBEAFE] text-[#2563EB]"
                  )}>{sim.status}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
