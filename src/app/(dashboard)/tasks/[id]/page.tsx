"use client"

import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AlertDiamondIcon, Cancel01Icon, CheckmarkCircle02Icon,
  ArrowLeft01Icon, Location01Icon, Clock01Icon, CreditCardIcon,
} from "@hugeicons/core-free-icons"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useTasksStore } from "@/store/tasks-store"
import { useAlertStore } from "@/store/alert-store"
import { MOCK_TASKS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── Timeline data ─────────────────────────────────────────────────────────

const TIMELINE = [
  { key:"posted",    label:"Task posted",               note:"Listed on marketplace",                           time:"13:32 IST · Today",  done:true,  active:false },
  { key:"matched",   label:"Auto-matched to 3 doers",   note:"within 10-min auto-match window",                 time:"13:42 IST · Today",  done:true,  active:false },
  { key:"accepted",  label:"Doer accepted match",        note:"Sneha J. accepted",                              time:"13:55 IST · Today",  done:true,  active:false },
  { key:"escrow",    label:"Escrow held",                note:"₹1,800 locked in platform escrow",              time:"13:55 IST · Today",  done:true,  active:false },
  { key:"progress",  label:"Work in progress",           note:"Active task · Doer checked in",                  time:"14:07 IST · Today",  done:false, active:true  },
  { key:"submission",label:"Submission expected",        note:"Doer to mark complete before deadline",          time:"Sun, 3 May · 12:00", done:false, active:false },
  { key:"release",   label:"Auto-release escrow",        note:"If no dispute in 72h after completion",          time:"Wed, 6 May",          done:false, active:false },
]

// ─── Force Close Modal ─────────────────────────────────────────────────────

function ForceCloseModal({ taskId, title }: { taskId: string; title: string }) {
  const s     = useTasksStore()
  const alert = useAlertStore()

  const OPTIONS = [
    { id:"full-refund",       label:"Full refund to giver",                    desc:"Doer didn't deliver value. Full escrow returned to giver.",          danger:false },
    { id:"partial-payout",    label:"Partial payout to doer · refund remainder",desc:"Split escrow proportionally based on work delivered.",              danger:false },
    { id:"cancellation-fee",  label:"Cancellation fee from giver",             desc:"Giver caused cancellation. Doer keeps all or a portion.",            danger:true  },
  ] as const

  const doerAmt   = s.doerAmount()
  const giverRef  = s.giverRefund()
  const feeAmt    = s.platformFee()

  return (
    <AnimatePresence>
      {s.actionOpen && (
        <Dialog open={s.actionOpen} onOpenChange={s.setActionOpen}>
          <DialogContent showCloseButton={false} className="sm:max-w-[640px] rounded-2xl p-0 gap-0 overflow-hidden">
            <motion.div
              initial={{ opacity:0, scale:0.97, y:8 }}
              animate={{ opacity:1, scale:1,    y:0 }}
              exit={{    opacity:0, scale:0.97, y:8 }}
              transition={{ duration:0.18, ease:[0.33,1,0.68,1] }}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#F3F4F6]">
                <div>
                  <h2 className="text-[17px] font-bold text-[#111827]">Force-close this task</h2>
                  <p className="text-[12px] text-[#8FA3A0] mt-0.5">
                    Acting as Aarav Sharma · Admin on {taskId}. Money in escrow will be redistributed based on your decision below.
                  </p>
                </div>
                <button onClick={() => s.setActionOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-[#F5F8F7] flex items-center justify-center text-[#8FA3A0] mt-0.5">
                  <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Task summary strip */}
                <div className="flex items-center gap-3 p-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-bold text-[#111827] truncate">{title}</p>
                    <p className="text-[11px] text-[#8FA3A0]">{taskId}</p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#8FA3A0] flex-wrap">
                    <span>Sneha J. → Vikram K.</span>
                    <span className="font-bold text-[#111827]">₹{s.totalEscrow.toLocaleString("en-IN")}</span>
                    <span>Mumbai</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#DBEAFE] text-[#2563EB] text-[10px] font-bold">In Progress</span>
                  </div>
                </div>

                {/* Closure options */}
                <div>
                  <p className="text-[12px] font-semibold text-[#374151] mb-3">Closure outcome</p>
                  <div className="space-y-2">
                    {OPTIONS.map((opt) => (
                      <button key={opt.id} onClick={() => s.setClosureType(opt.id)}
                        className={cn("w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all",
                          s.closureType === opt.id
                            ? opt.danger ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#111827] bg-white shadow-sm"
                            : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
                        )}>
                        <div className={cn("w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center",
                          s.closureType === opt.id ? (opt.danger ? "border-[#DC2626]" : "border-[#111827]") : "border-[#D1D5DB]"
                        )}>
                          {s.closureType === opt.id && (
                            <div className={cn("w-2 h-2 rounded-full", opt.danger ? "bg-[#DC2626]" : "bg-[#111827]")} />
                          )}
                        </div>
                        <div>
                          <p className={cn("text-[12.5px] font-semibold", opt.danger ? "text-[#DC2626]" : "text-[#374151]")}>{opt.label}</p>
                          <p className="text-[11.5px] text-[#8FA3A0] mt-0.5">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount distribution — shown for partial payout */}
                {s.closureType === "partial-payout" && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} transition={{ duration:0.2 }}
                    className="space-y-3">
                    <p className="text-[12px] font-semibold text-[#374151]">Amount distribution</p>
                    {/* Split type toggle */}
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] text-[#8FA3A0] mr-1">Split as</p>
                      {(["percentage","fixed"] as const).map((t) => (
                        <button key={t} onClick={() => s.setSplitType(t)}
                          className={cn("h-7 px-3 rounded-full text-[11.5px] font-medium border transition-colors",
                            s.splitType === t ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-[#374151] border-[#E5E7EB]"
                          )}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                      ))}
                    </div>
                    {/* Input */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[11px] text-[#8FA3A0] mb-1.5">{s.splitType === "percentage" ? "Doer receives (%)" : "Doer receives (₹)"}</p>
                        <div className="flex items-center gap-2 h-9 px-3 rounded-xl border border-[#E5E7EB] bg-white">
                          <input
                            type="number"
                            value={s.splitValue}
                            onChange={(e) => s.setSplitValue(Math.max(0, parseInt(e.target.value) || 0))}
                            className="flex-1 text-[13px] font-bold text-[#111827] outline-none bg-transparent"
                            min={0}
                            max={s.splitType === "percentage" ? 100 : s.totalEscrow}
                          />
                          <span className="text-[12px] text-[#8FA3A0]">{s.splitType === "percentage" ? "%" : "₹"}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#8FA3A0] mb-1.5">Calculated payout</p>
                        <div className="flex items-center h-9 px-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]">
                          <span className="text-[13px] font-bold text-[#17B890]">₹{doerAmt.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                    {/* Breakdown */}
                    <div className="p-3.5 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl space-y-2 text-[12px]">
                      <div className="flex justify-between"><span className="text-[#8FA3A0]">Doer payout</span><span className="font-semibold text-[#17B890]">₹{doerAmt.toLocaleString("en-IN")}</span></div>
                      <div className="flex justify-between"><span className="text-[#8FA3A0]">Giver refund</span><span className="font-semibold text-[#374151]">₹{giverRef.toLocaleString("en-IN")}</span></div>
                      <div className="flex justify-between border-t border-[#E5E7EB] pt-2"><span className="text-[#8FA3A0]">Platform fee (12%)</span><span className="text-[#8FA3A0]">₹{feeAmt.toLocaleString("en-IN")}</span></div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#F3F4F6] bg-[#F9FAFB]">
                <button onClick={() => s.setActionOpen(false)}
                  className="h-9 px-4 rounded-xl border border-[#E5E7EB] text-[12.5px] font-semibold text-[#374151] hover:bg-white bg-[#F9FAFB]">Cancel</button>
                <button
                  onClick={() => {
                    s.setActionOpen(false)
                    alert.show("success", `Task ${taskId} force-closed · ₹${s.totalEscrow.toLocaleString("en-IN")} settled`)
                  }}
                  className="h-9 px-5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[12.5px] font-bold flex items-center gap-1.5 transition-colors">
                  Force-close &amp; settle ₹{s.totalEscrow.toLocaleString("en-IN")}
                </button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const s      = useTasksStore()
  const task   = MOCK_TASKS.find((t) => t.id === params.id) ?? MOCK_TASKS[0]

  const STATUS_STYLE: Record<string, string> = {
    "Matching":     "bg-[#FEF3C7] text-[#D97706]",
    "In Progress":  "bg-[#DBEAFE] text-[#2563EB]",
    "Completed":    "bg-[#DCFCE7] text-[#16A34A]",
    "Disputed":     "bg-[#FEE2E2] text-[#DC2626]",
    "Force-Closed": "bg-[#F3F4F6] text-[#6B7280]",
  }

  return (
    <div>
      {/* ── Back nav ── */}
      <button onClick={() => router.push("/tasks")}
        className="flex items-center gap-1.5 text-[12px] font-semibold text-[#8FA3A0] hover:text-[#374151] transition-colors mb-4">
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
        Back to Tasks
      </button>

      {/* ── Task header ── */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22 }}
        className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <h1 className="text-[20px] font-extrabold text-[#111827]">{task.title}</h1>
            <span className={cn("text-[11.5px] font-bold px-2.5 py-0.5 rounded-full", STATUS_STYLE[task.status] ?? "bg-[#F3F4F6] text-[#6B7280]")}>
              {task.status}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11.5px] text-[#8FA3A0] flex-wrap">
            <span>{task.id}</span>
            <span>·</span>
            <span>{task.category}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><HugeiconsIcon icon={Location01Icon} size={11} strokeWidth={1.5} />{task.city}</span>
            <span>·</span>
            <span>Posted {task.postedAt}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><HugeiconsIcon icon={Clock01Icon} size={11} strokeWidth={1.5} />Due Sun, 3 May · 12:00</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button onClick={() => router.push("/disputes")}
            className="flex items-center gap-1.5 h-8 px-3 border border-[#E2E8E6] rounded-lg text-[12px] font-semibold text-[#374151] bg-white hover:bg-[#F5F8F7]">
            <HugeiconsIcon icon={AlertDiamondIcon} size={13} strokeWidth={1.5} />Open dispute
          </button>
          <button onClick={() => s.setActionOpen(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#111827] hover:bg-[#1f2937] text-white text-[12px] font-bold transition-colors">
            Take action
          </button>
        </div>
      </motion.div>

      {/* ── Metrics strip ── */}
      <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.25, delay:0.06 }}
        className="flex bg-white border border-[#E5E7EB] rounded-xl overflow-hidden mb-4">
        {[
          { label:"Budget",            value:"₹1,800",   sub:"₹1,584 to doer · ₹216 fee"   },
          { label:"Time Elapsed",      value:"12m",       sub:"Posted 13:32 IST"              },
          { label:"Active Duration",   value:"38m",       sub:"Started 13:55 IST"             },
          { label:"Payment Release In",value:"3d 22h",    sub:"After 72h review window"       },
        ].map((m, i) => (
          <div key={m.label} className={cn("flex-1 px-5 py-4", i < 3 && "border-r border-[#F3F4F6]")}>
            <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-1">{m.label}</p>
            <p className="text-[20px] font-extrabold text-[#111827] leading-tight">{m.value}</p>
            <p className="text-[11px] text-[#8FA3A0] mt-0.5">{m.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* ── 2-col layout ── */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.28, delay:0.1 }}
        className="grid grid-cols-3 gap-4">

        {/* ─ Left (2/3): overview + timeline ─ */}
        <div className="col-span-2 space-y-4">
          {/* Task overview */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <p className="text-[13px] font-bold text-[#111827] mb-3">Task Overview</p>
            <p className="text-[12.5px] text-[#374151] leading-relaxed mb-4">
              {task.description ?? "Looking for an experienced UI/UX designer to create 5 mobile app screens for an e-commerce platform. Must have experience with Figma, responsive design, and clean modern UI. Deliverables must include source files and developer handoff notes."}
            </p>
            {/* Deliverables */}
            <p className="text-[11px] font-black tracking-widest text-[#8FA3A0] uppercase mb-2">Deliverables</p>
            <ul className="space-y-1.5 mb-4">
              {["5 mobile app screens in Figma","Editable source files included","Responsive layout guidelines","Developer-ready handoff notes"].map((d) => (
                <li key={d} className="flex items-center gap-2 text-[12px] text-[#374151]">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2} className="text-[#17B890] shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
            {/* Skills */}
            <p className="text-[11px] font-black tracking-widest text-[#8FA3A0] uppercase mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {["Figma","UI/UX Design","E-commerce","Mobile Design"].map((sk) => (
                <span key={sk} className="text-[11px] text-[#374151] bg-[#F3F4F6] border border-[#E5E7EB] rounded-md px-2.5 py-0.5 font-medium">{sk}</span>
              ))}
            </div>
            {/* Task window */}
            <div className="flex items-center gap-2 pt-3 border-t border-[#F3F4F6] text-[11.5px] text-[#374151]">
              <HugeiconsIcon icon={Clock01Icon} size={13} strokeWidth={1.5} className="text-[#8FA3A0]" />
              <span className="text-[#8FA3A0]">Task window:</span>
              <span className="font-semibold">Sun, 3 May 2026 · 09:00–12:00 IST</span>
            </div>
          </div>

          {/* Status timeline */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <p className="text-[13px] font-bold text-[#111827] mb-5">Status Timeline</p>
            <div className="relative">
              {/* Vertical connector line */}
              <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-[#E5E7EB]" />
              <div className="space-y-5">
                {TIMELINE.map((step) => (
                  <div key={step.key} className="flex items-start gap-3 relative z-10">
                    {/* State circle */}
                    <div className={cn(
                      "w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 mt-0.5",
                      step.done   ? "bg-[#17B890]"                      :
                      step.active ? "border-2 border-[#17B890] bg-white" :
                      "border-2 border-[#E5E7EB] bg-white"
                    )}>
                      {step.done && <HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} strokeWidth={2.5} className="text-white" />}
                      {step.active && <div className="w-2 h-2 rounded-full bg-[#17B890] animate-pulse" />}
                      {!step.done && !step.active && <div className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB]" />}
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className={cn("text-[12.5px]", (step.done || step.active) ? "font-semibold text-[#374151]" : "text-[#8FA3A0]")}>{step.label}</p>
                        <span className="text-[10.5px] text-[#8FA3A0] whitespace-nowrap shrink-0">{step.time}</span>
                      </div>
                      <p className="text-[11px] text-[#8FA3A0] mt-0.5">{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─ Right (1/3): parties + payment + location ─ */}
        <div className="space-y-4">
          {/* Parties */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <p className="text-[12px] font-bold text-[#111827] mb-3">Parties</p>
            {[
              { role:"Task Giver", name:task.giver, trust:84, tasks:38, bg:"#F3E8FF", color:"#9333EA" },
              { role:"Task Doer",  name:task.doer ?? "Vikram Kumar", trust:71, tasks:22, bg:"#DBEAFE", color:"#2563EB" },
            ].map((p) => (
              <div key={p.role} className="flex items-center gap-2.5 mb-3 last:mb-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0"
                  style={{ backgroundColor:p.bg, color:p.color }}>
                  {p.name?.split(" ").map(n=>n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#374151] truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-black uppercase rounded px-1.5 py-0.5" style={{ backgroundColor:p.bg, color:p.color }}>{p.role.split(" ")[1]}</span>
                    <span className="text-[10.5px] font-bold" style={{ color:p.color }}>{p.trust}</span>
                    <span className="text-[10px] text-[#8FA3A0]">{p.tasks} tasks</span>
                  </div>
                </div>
                <button className="text-[11px] font-bold text-[#17B890] hover:underline shrink-0 flex items-center gap-0.5">
                  View <HugeiconsIcon icon={ArrowLeft01Icon} size={9} strokeWidth={2} className="rotate-180" />
                </button>
              </div>
            ))}
          </div>

          {/* Payment */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-bold text-[#111827]">Payment</p>
              <button className="text-[11px] font-semibold text-[#17B890] hover:underline">View ledger</button>
            </div>
            <div className="space-y-2 text-[12px]">
              {[
                { k:"Total escrowed", v:`₹${task.amount.toLocaleString("en-IN")}`, bold:true },
                { k:"Doer earns",     v:`₹${Math.round(task.amount*0.88).toLocaleString("en-IN")}`, color:"#17B890" },
                { k:"Platform fee",   v:`₹${Math.round(task.amount*0.12).toLocaleString("en-IN")}`, color:"#8FA3A0" },
                { k:"Method",         v:"UPI",   color:"#374151" },
                { k:"Reference",      v:"ESC-2026-" + task.id, mono:true },
              ].map(({ k, v, bold, color, mono }) => (
                <div key={k} className="flex justify-between items-baseline">
                  <span className="text-[#8FA3A0]">{k}</span>
                  <span className={cn(bold ? "font-bold text-[#111827]" : mono ? "font-mono text-[10px] text-[#8FA3A0]" : "font-semibold")}
                    style={color ? { color } : {}}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F3F4F6] text-[11px] text-[#8FA3A0]">
              <HugeiconsIcon icon={CreditCardIcon} size={12} strokeWidth={1.5} />
              Auto-releases 3d 22h after doer marks complete
            </div>
          </div>

          {/* Location */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#F3F4F6]">
              <p className="text-[12px] font-bold text-[#111827]">Location</p>
            </div>
            {/* Map placeholder */}
            <div className="h-28 bg-gradient-to-br from-[#E8F7F3] to-[#DBEAFE] flex items-center justify-center relative">
              <div className="absolute w-3 h-3 rounded-full bg-[#9333EA] border-2 border-white shadow top-8 left-16" />
              <div className="absolute w-3 h-3 rounded-full bg-[#2563EB] border-2 border-white shadow top-12 left-24" />
              <div className="absolute top-8 left-10 right-10 bottom-8 rounded-full border border-dashed border-[#17B890]/40" />
              <p className="text-[11px] font-medium text-[#8FA3A0]">Map preview</p>
            </div>
            <div className="px-4 py-3 space-y-1.5 text-[12px]">
              {[
                { k:"Location",     v:task.city },
                { k:"Distance",     v:"1.8 km apart" },
                { k:"Match radius", v:"3 km" },
              ].map(({ k, v }) => (
                <div key={k} className="flex justify-between">
                  <span className="text-[#8FA3A0]">{k}</span>
                  <span className="font-medium text-[#374151]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <ForceCloseModal taskId={task.id} title={task.title} />
    </div>
  )
}
