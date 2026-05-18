"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Download01Icon, Cancel01Icon, ChartIcon, UserMultiple02Icon,
  TaskDone01Icon, CreditCardIcon, LegalIcon, Clock01Icon, CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface ExportModalProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
}

const DATE_PRESETS = ["Today","Yesterday","Last 7 days","Last 30 days","This month","Custom"]

const REPORT_TYPES = [
  { id:"platform", icon:ChartIcon,         label:"Platform activity summary",   desc:"High-level KPIs, totals, and trends across all modules."                       },
  { id:"users",    icon:UserMultiple02Icon, label:"User activity report",        desc:"Signups, KYC outcomes, trust score changes, and user actions."                  },
  { id:"tasks",    icon:TaskDone01Icon,     label:"Task activity report",        desc:"Tasks created, completed, force-closed, with category and city breakdowns."     },
  { id:"financial",icon:CreditCardIcon,    label:"Financial report",             desc:"Escrow holds, payouts, refunds, platform fee, and net revenue."                  },
  { id:"disputes", icon:LegalIcon,         label:"Disputes report",              desc:"All cases with outcomes, SLA performance, and resolver workload."               },
]

export function ExportModal({ open, onClose, title = "Export report", subtitle = "Generate a custom data export with the selections below." }: ExportModalProps) {
  const [preset,   setPreset]   = useState("Last 30 days")
  const [selected, setSelected] = useState("tasks")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="sm:max-w-[580px] rounded-2xl p-0 overflow-hidden gap-0">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-[17px] font-bold text-[#111827]">{title}</h2>
            <p className="text-[12.5px] text-[#8FA3A0] mt-0.5">{subtitle}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-[#F5F8F7] flex items-center justify-center text-[#8FA3A0] hover:text-[#374151] transition-colors">
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
          </button>
        </div>

        <div className="px-6 pb-5 space-y-5">
          {/* ── Date range ── */}
          <div>
            <p className="text-[13px] font-semibold text-[#111827] mb-3">Date range</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {DATE_PRESETS.map((p) => (
                <button key={p} onClick={() => setPreset(p)}
                  className={cn("h-8 px-3.5 rounded-full text-[12.5px] font-medium border transition-colors",
                    preset === p
                      ? "bg-[#111827] text-white border-[#111827]"
                      : "bg-white text-[#374151] border-[#E5E7EB] hover:border-[#D1D5DB]"
                  )}>
                  {p}
                </button>
              ))}
            </div>
            {/* Date display row */}
            <div className="flex items-center gap-3 h-10 px-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-[12.5px] text-[#374151]">
              <HugeiconsIcon icon={Clock01Icon} size={14} strokeWidth={1.5} className="text-[#8FA3A0] shrink-0" />
              <span className="font-semibold">Apr 3, 2026</span>
              <span className="text-[#8FA3A0]">→</span>
              <span className="font-semibold">May 2, 2026</span>
              <span className="text-[#D1D5DB]">|</span>
              <span className="text-[#8FA3A0]">30 days · IST</span>
            </div>
          </div>

          {/* ── Report type ── */}
          <div>
            <p className="text-[13px] font-semibold text-[#111827] mb-3">Report type</p>
            <div className="space-y-2">
              {REPORT_TYPES.map((rt) => {
                const isSelected = selected === rt.id
                return (
                  <button key={rt.id} onClick={() => setSelected(rt.id)}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border text-left transition-all",
                      isSelected ? "border-[#111827] bg-white" : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB] hover:bg-[#F9FAFB]"
                    )}>
                    {/* Icon */}
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      isSelected ? "bg-[#111827]" : "bg-[#F3F4F6]"
                    )}>
                      <HugeiconsIcon icon={rt.icon} size={16} strokeWidth={1.5} className={isSelected ? "text-white" : "text-[#6B7280]"} />
                    </div>
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[13px] font-semibold", isSelected ? "text-[#111827]" : "text-[#374151]")}>{rt.label}</p>
                      <p className="text-[11.5px] text-[#8FA3A0] leading-snug mt-0.5">{rt.desc}</p>
                    </div>
                    {/* Radio */}
                    <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                      isSelected ? "border-[#111827]" : "border-[#D1D5DB]"
                    )}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-[#111827]" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F3F4F6] bg-[#F9FAFB]">
          <div className="flex items-center gap-3 text-[12px] text-[#8FA3A0]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#17B890] shrink-0" />
              ~3,420 rows
            </span>
            <span>~1.2 MB</span>
            <span>ready in ~8s</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose}
              className="h-9 px-4 rounded-xl border border-[#E5E7EB] text-[12.5px] font-semibold text-[#374151] hover:bg-white transition-colors">
              Cancel
            </button>
            <button onClick={onClose}
              className="h-9 px-4 rounded-xl bg-[#111827] hover:bg-[#1f2937] text-white text-[12.5px] font-bold flex items-center gap-1.5 transition-colors">
              <HugeiconsIcon icon={Download01Icon} size={13} strokeWidth={2} />
              Generate report
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Export Live Feed Log modal ────────────────────────────────────────────

const FEED_PRESETS = ["Last 1h","Last 6h","Today","Last 7 days","Last 30 days","Custom"]
const EVENT_TYPES = [
  { id:"tasks",    icon:TaskDone01Icon,     label:"Tasks",    count:"2,941 events" },
  { id:"disputes", icon:LegalIcon,          label:"Disputes", count:"161 events"   },
  { id:"payments", icon:CreditCardIcon,     label:"Payments", count:"2,702 events" },
  { id:"users",    icon:UserMultiple02Icon, label:"Users",    count:"2,184 events" },
  { id:"trust",    icon:Clock01Icon,        label:"Trust",    count:"469 events"   },
  { id:"system",   icon:ChartIcon,          label:"System",   count:"266 events"   },
]
const SEVERITIES = [
  { id:"all",      label:"All",      dot:null           },
  { id:"critical", label:"Critical", dot:"#EF4444"      },
  { id:"high",     label:"High",     dot:"#F59E0B"      },
  { id:"medium",   label:"Medium",   dot:"#3B82F6"      },
]

interface ExportFeedModalProps {
  open: boolean
  onClose: () => void
}

export function ExportFeedModal({ open, onClose }: ExportFeedModalProps) {
  const [preset,    setPreset]    = useState("Last 7 days")
  const [checked,   setChecked]   = useState<Set<string>>(new Set(["tasks","disputes","payments","users"]))
  const [severity,  setSeverity]  = useState("all")
  const [fromTime,  setFromTime]  = useState("00:00")
  const [toTime,    setToTime]    = useState("23:59")

  const toggle = (id: string) =>
    setChecked((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="sm:max-w-[580px] rounded-2xl p-0 overflow-hidden gap-0">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-[17px] font-bold text-[#111827]">Export live feed log</h2>
            <p className="text-[12.5px] text-[#8FA3A0] mt-0.5">Configure filters and download a structured log file</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-[#F5F8F7] flex items-center justify-center text-[#8FA3A0] hover:text-[#374151]">
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
          </button>
        </div>

        <div className="px-6 pb-5 space-y-5">
          {/* Date range */}
          <div>
            <p className="text-[13px] font-semibold text-[#111827] mb-3">Date range</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {FEED_PRESETS.map((p) => (
                <button key={p} onClick={() => setPreset(p)}
                  className={cn("h-8 px-3.5 rounded-full text-[12.5px] font-medium border transition-colors",
                    preset === p ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-[#374151] border-[#E5E7EB] hover:border-[#D1D5DB]"
                  )}>
                  {p}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 h-10 px-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-[12.5px] text-[#374151] mb-3">
              <HugeiconsIcon icon={Clock01Icon} size={14} strokeWidth={1.5} className="text-[#8FA3A0]" />
              <span className="font-semibold">Apr 3, 2026</span>
              <span className="text-[#8FA3A0]">→</span>
              <span className="font-semibold">May 2, 2026</span>
              <span className="text-[#D1D5DB]">|</span>
              <span className="text-[#8FA3A0]">30 days · IST</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{label:"From time", val:fromTime, set:setFromTime},{label:"To time", val:toTime, set:setToTime}].map(f=>(
                <div key={f.label}>
                  <p className="text-[11px] text-[#8FA3A0] mb-1.5 font-medium">{f.label}</p>
                  <input type="time" value={f.val} onChange={e=>f.set(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-[#E5E7EB] text-[13px] text-[#374151] outline-none focus:border-[#17B890]" />
                </div>
              ))}
            </div>
          </div>

          {/* Event types */}
          <div>
            <p className="text-[11px] font-black tracking-[0.15em] text-[#8FA3A0] uppercase mb-3">Event Types</p>
            <div className="grid grid-cols-2 gap-2">
              {EVENT_TYPES.map((et) => {
                const on = checked.has(et.id)
                return (
                  <button key={et.id} onClick={() => toggle(et.id)}
                    className={cn("flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left transition-all",
                      on ? "border-[#111827] bg-[#F9FAFB]" : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
                    )}>
                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", on ? "bg-[#111827]" : "bg-[#F3F4F6]")}>
                      <HugeiconsIcon icon={et.icon} size={15} strokeWidth={1.5} className={on ? "text-white" : "text-[#6B7280]"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-semibold text-[#374151]">{et.label}</p>
                      <p className="text-[10.5px] text-[#8FA3A0]">{et.count}</p>
                    </div>
                    <div className={cn("w-4 h-4 rounded border-2 flex items-center justify-center shrink-0",
                      on ? "bg-[#111827] border-[#111827]" : "border-[#D1D5DB]"
                    )}>
                      {on && <HugeiconsIcon icon={CheckmarkCircle02Icon} size={10} strokeWidth={3} className="text-white" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Severity */}
          <div>
            <p className="text-[11px] font-black tracking-[0.15em] text-[#8FA3A0] uppercase mb-3">Severity</p>
            <div className="flex items-center gap-2">
              {SEVERITIES.map((sv) => (
                <button key={sv.id} onClick={() => setSeverity(sv.id)}
                  className={cn("h-8 px-3.5 rounded-full text-[12.5px] font-medium border flex items-center gap-1.5 transition-colors",
                    severity === sv.id ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-[#374151] border-[#E5E7EB] hover:border-[#D1D5DB]"
                  )}>
                  {sv.dot && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sv.dot }} />}
                  {sv.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F3F4F6] bg-[#F9FAFB]">
          <div className="flex items-center gap-3 text-[12px] text-[#8FA3A0]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#17B890]" />~3,420 rows</span>
            <span>~1.2 MB</span>
            <span>ready in ~8s</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="h-9 px-4 rounded-xl border border-[#E5E7EB] text-[12.5px] font-semibold text-[#374151] hover:bg-white">Cancel</button>
            <button onClick={onClose} className="h-9 px-4 rounded-xl bg-[#111827] hover:bg-[#1f2937] text-white text-[12.5px] font-bold flex items-center gap-1.5">
              <HugeiconsIcon icon={Download01Icon} size={13} strokeWidth={2} />
              Generate report
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
