"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon, SentIcon, AttachmentIcon, Cancel01Icon,
  CheckmarkCircle02Icon, Sorting01Icon,
} from "@hugeicons/core-free-icons"
import { useCommsStore } from "@/store/comms-store"
import { cn } from "@/lib/utils"

export default function LiveSupportPage() {
  const router     = useRouter()
  const s          = useCommsStore()
  const threadRef  = useRef<HTMLDivElement>(null)

  const activeConv = s.conversations.find((c) => c.id === s.activeConvId)
  const filtered   = s.conversations.filter((c) =>
    !s.convSearch ||
    c.userName.toLowerCase().includes(s.convSearch.toLowerCase()) ||
    c.ticketId.toLowerCase().includes(s.convSearch.toLowerCase())
  )

  // Scroll thread to bottom
  useEffect(() => {
    threadRef.current?.scrollTo({ top:threadRef.current.scrollHeight, behavior:"smooth" })
  }, [activeConv?.messages.length])

  return (
    <div className="flex bg-white border border-[#E5E7EB] rounded-xl overflow-hidden"
      style={{ height:"calc(100vh - 230px)" }}>

      {/* ── Conversation list ── */}
      <div className="w-[300px] shrink-0 border-r border-[#E5E7EB] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#F3F4F6]">
          <p className="text-[13px] font-bold text-[#111827]">Messages</p>
          <button className="flex items-center gap-1 text-[11.5px] font-semibold text-[#8FA3A0] hover:text-[#374151] transition-colors">
            <HugeiconsIcon icon={Sorting01Icon} size={13} strokeWidth={1.5} />
            Filters
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2.5 border-b border-[#F3F4F6]">
          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} size={12} strokeWidth={1.5}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8FA3A0]" />
            <input
              value={s.convSearch}
              onChange={(e) => s.setConvSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full h-8 pl-7 pr-3 rounded-lg border border-[#E2E8E6] text-[12px] outline-none focus:border-[#17B890] placeholder:text-[#C8D8D4] transition-colors"
            />
          </div>
        </div>

        {/* Conversation rows */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filtered.map((conv) => {
              const isActive = s.activeConvId === conv.id
              return (
                <motion.button
                  key={conv.id}
                  onClick={() => s.setActiveConv(conv.id)}
                  whileHover={{ backgroundColor: isActive ? undefined : "#F9FAFB" }}
                  className={cn(
                    "w-full flex items-start gap-2.5 px-3 py-3 border-b border-[#F9FAFB] text-left transition-colors",
                    isActive ? "bg-[#F5F8F7] border-l-2 border-l-[#17B890]" : ""
                  )}
                >
                  {/* Avatar + online dot */}
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-[#E8F7F3] flex items-center justify-center text-[11px] font-bold text-[#17B890]">
                      {conv.userName.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
                      conv.online ? "bg-[#22C55E]" : "bg-[#D1D5DB]"
                    )} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className="text-[12px] font-semibold text-[#111827] truncate">{conv.userName}</p>
                      <span className="text-[10px] text-[#8FA3A0] whitespace-nowrap shrink-0">{conv.time}</span>
                    </div>
                    <p className="text-[10.5px] text-[#17B890] font-semibold mb-0.5">{conv.ticketId}</p>
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[11px] text-[#8FA3A0] truncate">{conv.preview}</p>
                      {conv.unread > 0 && (
                        <span className="min-w-[16px] h-4 rounded-full bg-[#111827] text-white text-[9px] font-black flex items-center justify-center px-1 shrink-0">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Chat panel ── */}
      {activeConv ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-[#E8F7F3] flex items-center justify-center text-[11px] font-bold text-[#17B890]">
                  {activeConv.userName.split(" ").map(n=>n[0]).join("")}
                </div>
                <div className={cn("absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white",
                  activeConv.online ? "bg-[#22C55E]" : "bg-[#D1D5DB]"
                )} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#111827]">{activeConv.userName}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#8FA3A0]">
                  {activeConv.online
                    ? <><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />Online</>
                    : "Offline"
                  }
                  <span>·</span>
                  <button
                    onClick={() => router.push(`/support/${activeConv.ticketId.replace("#","")}`)}
                    className="text-[#17B890] hover:underline font-semibold"
                  >
                    {activeConv.ticketId}
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => router.push(`/tasks/${activeConv.taskRef}`)}
                    className="text-[#8FA3A0] hover:text-[#374151] hover:underline"
                  >
                    {activeConv.taskRef}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => s.markResolved(activeConv.id)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#111827] hover:bg-[#1f2937] text-white text-[11.5px] font-bold transition-colors"
            >
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2} />
              Mark Resolved
            </button>
          </div>

          {/* Messages thread */}
          <div ref={threadRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
            <p className="text-[10px] text-[#8FA3A0] text-center font-medium">Today</p>
            <AnimatePresence initial={false}>
              {activeConv.messages.map((msg) => {
                const isAgent = msg.from === "agent"
                return (
                  <motion.div key={msg.id}
                    initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                    transition={{ duration:0.18 }}
                    className={cn("flex gap-2.5", isAgent ? "justify-end" : "justify-start")}
                  >
                    {/* User avatar */}
                    {!isAgent && (
                      <button
                        onClick={() => router.push(`/users/${activeConv.userId}`)}
                        className="w-8 h-8 rounded-full bg-[#E8F7F3] flex items-center justify-center text-[10px] font-bold text-[#17B890] shrink-0 mt-auto hover:ring-2 hover:ring-[#17B890] transition-all"
                      >
                        {msg.name.split(" ").map(n=>n[0]).join("")}
                      </button>
                    )}
                    <div className={cn("max-w-[68%]", isAgent && "items-end flex flex-col")}>
                      {/* Name + role */}
                      {!isAgent && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[11px] font-semibold text-[#374151]">{msg.name}</span>
                          <span className="text-[9px] bg-[#DBEAFE] text-[#2563EB] rounded px-1.5 py-0.5 font-black">{msg.role}</span>
                          <span className="text-[10px] text-[#8FA3A0]">{msg.time}</span>
                        </div>
                      )}
                      {/* Bubble */}
                      <div className={cn(
                        "rounded-2xl px-4 py-2.5 text-[12.5px] leading-relaxed",
                        isAgent
                          ? "bg-[#111827] text-white rounded-tr-sm"
                          : "bg-[#F5F8F7] text-[#374151] border border-[#E5E7EB] rounded-tl-sm"
                      )}>
                        {msg.body}
                      </div>
                      {/* Image attachment preview */}
                      {msg.isImage && (
                        <div className="mt-2 w-52 h-32 bg-gradient-to-br from-[#E8F7F3] to-[#DBEAFE] rounded-xl border border-[#E5E7EB] flex items-center justify-center">
                          <p className="text-[11px] text-[#8FA3A0]">Image attachment</p>
                        </div>
                      )}
                      {/* File attachment */}
                      {msg.attach && (
                        <div className="flex items-center gap-2 mt-2 p-2.5 bg-white border border-[#E5E7EB] rounded-xl w-fit">
                          <HugeiconsIcon icon={AttachmentIcon} size={13} strokeWidth={1.5} className="text-[#8FA3A0]" />
                          <span className="text-[11.5px] font-medium text-[#374151]">{msg.attach.name}</span>
                          <span className="text-[10px] text-[#8FA3A0]">{msg.attach.size}</span>
                          <button className="text-[11px] font-bold text-[#17B890] hover:underline ml-1">View</button>
                        </div>
                      )}
                      {/* Agent timestamp */}
                      {isAgent && (
                        <div className="flex items-center gap-1.5 mt-1 justify-end">
                          <span className="text-[10px] text-[#8FA3A0]">{msg.time}</span>
                          <span className="text-[9px] font-semibold text-[#8FA3A0]">{msg.name}</span>
                        </div>
                      )}
                    </div>
                    {/* Agent avatar */}
                    {isAgent && (
                      <div className="w-8 h-8 rounded-full bg-[#17B890] flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-auto">
                        {msg.name.split(" ").map(n=>n[0]).join("")}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Composer */}
          <div className="border-t border-[#E5E7EB] px-4 py-3 shrink-0">
            <div className="flex items-center gap-2 border border-[#E2E8E6] rounded-xl px-3 py-2 focus-within:border-[#17B890] transition-colors bg-white">
              <input
                value={s.draftMessage}
                onChange={(e) => s.setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), s.sendMessage())}
                placeholder="Type a message..."
                className="flex-1 text-[12.5px] text-[#374151] outline-none placeholder:text-[#C8D8D4] bg-transparent"
              />
              <button className="text-[#8FA3A0] hover:text-[#374151] transition-colors">
                <HugeiconsIcon icon={AttachmentIcon} size={16} strokeWidth={1.5} />
              </button>
              <button
                onClick={s.sendMessage}
                disabled={!s.draftMessage.trim() || s.sending}
                className="w-8 h-8 rounded-lg bg-[#17B890] hover:opacity-90 flex items-center justify-center disabled:opacity-40 transition-all shrink-0"
              >
                <HugeiconsIcon icon={SentIcon} size={15} strokeWidth={2} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-[#8FA3A0]">
          <p className="text-[13px]">Select a conversation to begin</p>
        </div>
      )}
    </div>
  )
}
