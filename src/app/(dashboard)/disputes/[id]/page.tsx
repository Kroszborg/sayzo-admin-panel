"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon, CheckmarkCircle02Icon, AlertDiamondIcon,
  Clock01Icon, Download01Icon, ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { useDisputesStore } from "@/store/disputes-store"
import { MOCK_DISPUTES, MOCK_TASKS, MOCK_TEAM } from "@/lib/mock-data"
import { useAlertStore } from "@/store/alert-store"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { cn } from "@/lib/utils"

// ─── Timeline data ─────────────────────────────────────────────────────────

const TIMELINE = [
  { key:"filed",     label:"Dispute filed",             note:"Reporter submitted dispute claim",                 time:"Apr 9, 09:18", done:true,  active:false },
  { key:"classified",label:"Auto-classified",           note:"AI: payment dispute · confidence 94%",            time:"Apr 9, 09:18", done:true,  active:false },
  { key:"assigned",  label:"Assigned to resolver",      note:"Aarav Sharma picked up the case",                 time:"Apr 9, 10:02", done:true,  active:false },
  { key:"evidence",  label:"Evidence review",           note:"Reviewing uploaded files from both parties",       time:"In progress",  done:false, active:true  },
  { key:"resolution",label:"Resolution",                note:"Pending admin decision on escrow",                 time:"Pending",      done:false, active:false },
]

const EVIDENCE_FILES_GIVER = [
  { name:"chat_screenshot.png",   type:"PNG",  size:"2.4 MB", time:"Apr 9, 10:22" },
  { name:"payment_receipt.pdf",   type:"PDF",  size:"0.8 MB", time:"Apr 9, 10:24" },
]
const EVIDENCE_FILES_DOER = [
  { name:"deliverables.zip",      type:"ZIP",  size:"18.2 MB",time:"Apr 8, 15:14" },
  { name:"client_approval.png",   type:"PNG",  size:"1.1 MB", time:"Apr 8, 15:16" },
]

export default function DisputeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const s      = useDisputesStore()
  const alert  = useAlertStore()
  const [resolveOpen, setResolveOpen] = useState(false)

  const dispute = MOCK_DISPUTES.find((d) => d.id === params.id) ?? MOCK_DISPUTES[0]
  const task    = MOCK_TASKS.find((t) => t.id === dispute.taskId) ?? MOCK_TASKS[0]

  const isResolved  = s.resolvedCases.has(dispute.id)
  const assignedId  = s.assignments[dispute.id]
  const assignedName = assignedId
    ? (MOCK_TEAM.find((m) => m.id === assignedId)?.name ?? dispute.assignedTo)
    : dispute.assignedTo

  const STATUS_STYLE: Record<string, string> = {
    "Unassigned":        "bg-[#FEF3C7] text-[#D97706]",
    "In Progress":       "bg-[#DBEAFE] text-[#2563EB]",
    "Evidence Pending":  "bg-[#F3E8FF] text-[#9333EA]",
    "Escalated":         "bg-[#FEE2E2] text-[#DC2626]",
    "Resolved":          "bg-[#DCFCE7] text-[#16A34A]",
  }
  const PRI_STYLE: Record<string, string> = {
    Critical:"bg-[#FEE2E2] text-[#DC2626]",
    High:    "bg-[#FEF3C7] text-[#D97706]",
    Medium:  "bg-[#DBEAFE] text-[#2563EB]",
  }

  return (
    <div>
      {/* Back nav */}
      <motion.button
        whileHover={{ opacity: 0.7 }} whileTap={{ scale: 0.97 }}
        onClick={() => router.push("/disputes")}
        className="flex items-center gap-1.5 text-[12px] font-semibold text-[#8FA3A0] hover:text-[#374151] transition-all mb-4">
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
        Back to Disputes
      </motion.button>

      {/* Header */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22 }}
        className="bg-white border border-[#E5E7EB] rounded-xl p-5 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <h1 className="text-[18px] font-extrabold text-[#111827]">{dispute.title}</h1>
              <span className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-full", STATUS_STYLE[isResolved ? "Resolved" : dispute.status] ?? "bg-[#F3F4F6] text-[#6B7280]")}>
                {isResolved ? "Resolved" : dispute.status}
              </span>
              <span className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-full", PRI_STYLE[dispute.priority] ?? "bg-[#F3F4F6] text-[#6B7280]")}>
                {dispute.priority}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11.5px] text-[#8FA3A0] flex-wrap">
              <span>{dispute.id}</span><span>·</span>
              <span>Filed {dispute.filedAt}</span><span>·</span>
              <span>Task: {dispute.taskId}</span><span>·</span>
              <span>{dispute.city}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right mr-2">
              <p className="text-[20px] font-extrabold text-[#DC2626]">₹{dispute.amount.toLocaleString("en-IN")}</p>
              <p className="text-[10.5px] text-[#8FA3A0]">in escrow</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/disputes/${dispute.id}/evidence`)}
              className="flex items-center gap-1.5 h-8 px-3 border border-[#E2E8E6] rounded-lg text-[12px] font-semibold text-[#374151] bg-white hover:bg-[#F5F8F7] transition-colors">
              <HugeiconsIcon icon={AlertDiamondIcon} size={13} strokeWidth={1.5} />
              View evidence
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 2-col layout */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.28, delay:0.08 }}
        className="grid grid-cols-3 gap-4">

        {/* ─ Left 2/3 ─ */}
        <div className="col-span-2 space-y-4">
          {/* Summary */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <p className="text-[13px] font-bold text-[#111827] mb-3">Dispute Summary</p>
            <p className="text-[12.5px] text-[#374151] leading-relaxed mb-4">
              The task was marked complete by the doer on {dispute.filedAt.replace("ago","before filing")}. The giver confirmed the work quality was satisfactory in chat but subsequently refused to release the escrowed amount of ₹{dispute.amount.toLocaleString("en-IN")} citing unmet deliverables. Doer alleges the giver is acting in bad faith and has provided evidence of completion.
            </p>

            {/* Party statements */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { role:"Giver · Reporter", name:dispute.giver, color:"#9333EA", bg:"#F3E8FF",
                  quote:"The deliverables did not meet the agreed specifications. I cannot release the payment until the items are revised per our original brief." },
                { role:"Doer · Respondent", name:dispute.doer, color:"#2563EB", bg:"#DBEAFE",
                  quote:"All deliverables were submitted on schedule. The giver approved the work in chat on Apr 6 but is now refusing to release escrow without valid reason." },
              ].map((p) => (
                <div key={p.role} className="border border-[#E5E7EB] rounded-xl p-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0"
                      style={{ backgroundColor:p.bg, color:p.color }}>
                      {p.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-[#374151]">{p.name}</p>
                      <span className="text-[9px] font-black uppercase rounded px-1.5 py-0.5" style={{ backgroundColor:p.bg, color:p.color }}>{p.role}</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-[#374151] italic leading-relaxed">"{p.quote}"</p>
                  <button className="text-[11px] font-semibold text-[#17B890] hover:underline mt-2">View profile →</button>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <p className="text-[13px] font-bold text-[#111827] mb-5">Case Timeline</p>
            <div className="relative">
              <div className="absolute left-[10px] top-3 bottom-3 w-0.5 bg-[#E5E7EB]" />
              <div className="space-y-5">
                {TIMELINE.map((step) => (
                  <div key={step.key} className="flex items-start gap-3 relative z-10">
                    <div className={cn("w-[21px] h-[21px] rounded-full flex items-center justify-center shrink-0 mt-0.5",
                      step.done   ? "bg-[#17B890]" :
                      step.active ? "border-2 border-[#17B890] bg-white" :
                      "border-2 border-[#E5E7EB] bg-white"
                    )}>
                      {step.done && <HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} strokeWidth={2.5} className="text-white" />}
                      {step.active && <div className="w-2 h-2 rounded-full bg-[#17B890] animate-pulse" />}
                      {!step.done && !step.active && <div className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB]" />}
                    </div>
                    <div className="flex-1 pb-0.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className={cn("text-[12.5px]", (step.done||step.active) ? "font-semibold text-[#374151]" : "text-[#8FA3A0]")}>{step.label}</p>
                        <span className="text-[10.5px] text-[#8FA3A0] whitespace-nowrap shrink-0">{step.time}</span>
                      </div>
                      <p className="text-[11px] text-[#8FA3A0] mt-0.5">{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Internal notes */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <p className="text-[13px] font-bold text-[#111827] mb-4">Internal Notes</p>
            <div className="space-y-3 mb-4">
              {s.notes.map((note) => (
                <div key={note.id} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#E8F7F3] flex items-center justify-center text-[9px] font-bold text-[#17B890] shrink-0">
                    {note.author.split(" ").map(n=>n[0]).join("")}
                  </div>
                  <div className="flex-1 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl px-3 py-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[11.5px] font-semibold text-[#374151]">{note.author}</p>
                      <span className="text-[10px] text-[#8FA3A0]">{note.time}</span>
                    </div>
                    <p className="text-[12px] text-[#374151] leading-relaxed">{note.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <textarea value={s.newNote} onChange={(e) => s.setNewNote(e.target.value)}
                placeholder="Add an internal note..." rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8E6] text-[12px] text-[#374151] outline-none focus:border-[#17B890] resize-none placeholder:text-[#C8D8D4]"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] text-[#8FA3A0]">{s.newNote.length} / 500</span>
                <button
                  onClick={() => {
                    if (!s.newNote.trim()) return
                    s.addNote()
                    alert.show("success", "Internal note added")
                  }}
                  disabled={!s.newNote.trim()}
                  className="h-7 px-4 rounded-lg bg-[#111827] hover:bg-[#1f2937] text-white text-[11.5px] font-bold disabled:opacity-40 transition-colors">
                  Add note
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─ Right 1/3 ─ */}
        <div className="space-y-4">
          {/* SLA status */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <p className="text-[12px] font-bold text-[#111827] mb-3">SLA Status</p>
            <div className="space-y-2.5 text-[12px]">
              {[
                { k:"First response due",  v:"23h 47m",        red:false },
                { k:"Resolution due",       v:"6d 23h",         red:false },
                { k:"Assigned to",          v:assignedName ?? "Unassigned", red:!assignedName },
                { k:"Filed",               v:dispute.filedAt,   red:false },
              ].map(({ k, v, red }) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#8FA3A0]">
                    <HugeiconsIcon icon={Clock01Icon} size={11} strokeWidth={1.5} />
                    {k}
                  </span>
                  <span className={cn("font-semibold", red ? "text-[#EF4444]" : "text-[#374151]")}>{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              {isResolved ? (
                <div className="flex-1 h-8 rounded-lg bg-[#DCFCE7] flex items-center justify-center gap-1.5 text-[11.5px] font-bold text-[#16A34A]">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2.5} />
                  Resolved
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setResolveOpen(true)}
                  className="flex-1 h-8 rounded-lg bg-[#111827] hover:bg-[#1f2937] text-white text-[11.5px] font-bold transition-colors">
                  Resolve case
                </motion.button>
              )}
            </div>
            <ConfirmDialog
              open={resolveOpen}
              onOpenChange={setResolveOpen}
              title="Resolve this case?"
              description={`Case ${dispute.id} will be marked as resolved. This will close the escrow decision and notify both parties.`}
              confirmLabel="Yes, resolve case"
              onConfirm={() => {
                s.resolveCase(dispute.id)
                alert.show("success", `Case ${dispute.id} marked as resolved`)
                setResolveOpen(false)
              }}
            />
          </div>

          {/* Evidence submitted */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-bold text-[#111827]">Evidence Submitted</p>
              <motion.button
                whileHover={{ opacity: 0.75 }} whileTap={{ scale: 0.96 }}
                onClick={() => router.push(`/disputes/${dispute.id}/evidence`)}
                className="text-[11px] font-semibold text-[#17B890] hover:underline flex items-center gap-0.5 transition-all">
                Review all <HugeiconsIcon icon={ArrowRight01Icon} size={10} strokeWidth={2} />
              </motion.button>
            </div>
            {[
              { label:"From Giver", files:EVIDENCE_FILES_GIVER, color:"#9333EA" },
              { label:"From Doer",  files:EVIDENCE_FILES_DOER,  color:"#2563EB" },
            ].map((group) => (
              <div key={group.label} className="mb-3 last:mb-0">
                <p className="text-[9.5px] font-black text-[#8FA3A0] uppercase tracking-wide mb-1.5">{group.label}</p>
                {group.files.map((f) => (
                  <div key={f.name} className="flex items-center gap-2 py-1.5 border-b border-[#F9FAFB] last:border-0">
                    <span className="text-[9px] font-black rounded px-1.5 py-0.5 shrink-0" style={{ backgroundColor: group.color+"20", color:group.color }}>{f.type}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-[#374151] truncate">{f.name}</p>
                      <p className="text-[10px] text-[#8FA3A0]">{f.size} · {f.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Linked task */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <p className="text-[12px] font-bold text-[#111827] mb-3">Linked Task</p>
            <p className="text-[12.5px] font-semibold text-[#374151] mb-1">{task.title}</p>
            <div className="space-y-1.5 text-[11.5px]">
              {[
                { k:"Task ID",       v:task.id },
                { k:"Category",      v:task.category },
                { k:"City",          v:task.city },
                { k:"Budget",        v:`₹${task.amount.toLocaleString("en-IN")}` },
                { k:"Escrowed",      v:`₹${task.amount.toLocaleString("en-IN")}` },
                { k:"Doer payout",   v:`₹${Math.round(task.amount*0.88).toLocaleString("en-IN")}` },
                { k:"Platform fee",  v:`₹${Math.round(task.amount*0.12).toLocaleString("en-IN")}` },
              ].map(({ k, v }) => (
                <div key={k} className="flex justify-between">
                  <span className="text-[#8FA3A0]">{k}</span>
                  <span className="font-medium text-[#374151]">{v}</span>
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/tasks/${task.id}`)}
              className="w-full mt-3 h-7 rounded-lg border border-[#E2E8E6] text-[11.5px] font-semibold text-[#374151] hover:bg-[#F5F8F7] transition-colors">
              View task →
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
