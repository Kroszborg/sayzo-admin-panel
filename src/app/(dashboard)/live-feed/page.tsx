"use client"

import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Download01Icon, Cancel01Icon, Clock01Icon, TaskDone01Icon,
  LegalIcon, CreditCardIcon, UserMultiple02Icon, ShieldIcon, ChartIcon,
} from "@hugeicons/core-free-icons"
import { ExportFeedModal } from "@/components/shared/export-modal"
import { useLiveFeedStore, FeedFilter, Severity } from "@/store/live-feed-store"
import { cn } from "@/lib/utils"

// ─── Filter tabs ───────────────────────────────────────────────────────────

const FILTER_TABS: { id: FeedFilter; count: number }[] = [
  { id:"All Events", count:1247 }, { id:"Tasks",    count:421 },
  { id:"Disputes",   count:23   }, { id:"Payments", count:386 },
  { id:"Users",      count:312  }, { id:"Trust",    count:67  },
  { id:"System",     count:38   },
]

// ─── Event data ────────────────────────────────────────────────────────────

export type LiveEvent = {
  id: string
  category: FeedFilter
  type: string
  typeColor: string
  typeBg: string
  sev?: string
  sevColor?: string
  sevBg?: string
  severity: Severity | "info"
  iconBg: string
  iconColor: string
  Icon: typeof TaskDone01Icon
  title: string
  desc: string
  chips: string[]
  actions: { label: string; dark: boolean }[]
  time: string
  // detail panel
  detail: {
    caseId: string; amount: string; category: string; city: string
    filedBy: string; linkedTask: string
    parties: { name: string; role: string; score: number; scoreColor: string }[]
    sla: { label: string; value: string; red?: boolean }[]
  }
}

const EVENTS: LiveEvent[] = [
  {
    id:"ev-1", category:"Disputes",
    type:"DISPUTE",  typeColor:"#DC2626", typeBg:"#FEE2E2",
    sev:"CRITICAL",  sevColor:"#DC2626",  sevBg:"#FEE2E2",
    severity:"critical",
    iconBg:"#FEE2E2", iconColor:"#DC2626", Icon:LegalIcon,
    title:"New high-value dispute filed",
    desc:"Vikram Kumar (Doer) filed a dispute against Priya Mehta (Giver) — claims work was completed but payment was not released after task acceptance.",
    chips:["DSP-2026-0847","₹22,000","Programming & Tech","Bengaluru"],
    actions:[{ label:"Assign to me", dark:true },{ label:"Open case →", dark:false }],
    time:"Just now",
    detail:{ caseId:"DSP-2026-0847", amount:"₹22,000", category:"Programming", city:"Bengaluru", filedBy:"Task Doer", linkedTask:"TSK-19248",
      parties:[{ name:"Vikram Kumar", role:"Doer · Reporter", score:78, scoreColor:"#17B890" },{ name:"Priya Mehta", role:"Giver · Reported", score:65, scoreColor:"#F59E0B" }],
      sla:[{ label:"First response due", value:"23h 47m" },{ label:"Resolution due", value:"6d 23h" },{ label:"Status", value:"Unassigned", red:true }] }
  },
  {
    id:"ev-2", category:"Payments",
    type:"PAYMENT",  typeColor:"#D97706", typeBg:"#FEF3C7",
    sev:"HIGH",      sevColor:"#D97706",  sevBg:"#FEF3C7",
    severity:"high",
    iconBg:"#DCFCE7", iconColor:"#16A34A", Icon:CreditCardIcon,
    title:"Payout failed — Invalid UPI VPA",
    desc:"Payout to Anjali Singh failed after 2 retries. Error code: UPI_INVALID_VPA. Doer notified to update UPI handle.",
    chips:["PAY-87234","₹3,250","2 retries"],
    actions:[{ label:"Retry payout", dark:false },{ label:"Contact doer", dark:false }],
    time:"14s ago",
    detail:{ caseId:"PAY-87234", amount:"₹3,250", category:"Payment", city:"Mumbai", filedBy:"System", linkedTask:"TSK-19101",
      parties:[{ name:"Anjali Singh", role:"Doer · Payee", score:81, scoreColor:"#17B890" }],
      sla:[{ label:"Retry window", value:"2h 14m" },{ label:"Auto-cancel at", value:"11h 46m" },{ label:"Status", value:"Failed", red:true }] }
  },
  {
    id:"ev-3", category:"Users",
    type:"USER", typeColor:"#2563EB", typeBg:"#DBEAFE",
    sev:"INFO",  sevColor:"#2563EB", sevBg:"#DBEAFE",
    severity:"all",
    iconBg:"#DBEAFE", iconColor:"#2563EB", Icon:UserMultiple02Icon,
    title:"New user signed up — Rohan Desai",
    desc:"Joined as Task Doer. Mobile + Email verified via OTP. Aadhaar verification pending — auto-routed to KYC queue.",
    chips:["Doer","Mumbai"],
    actions:[{ label:"View profile", dark:false }],
    time:"47s ago",
    detail:{ caseId:"USR-0291", amount:"—", category:"Signup", city:"Mumbai", filedBy:"Self", linkedTask:"—",
      parties:[{ name:"Rohan Desai", role:"Doer · New user", score:0, scoreColor:"#8FA3A0" }],
      sla:[{ label:"KYC due", value:"72h" },{ label:"Onboarding", value:"Pending" },{ label:"Status", value:"Active" }] }
  },
  {
    id:"ev-4", category:"Trust",
    type:"TRUST",    typeColor:"#D97706", typeBg:"#FEF3C7",
    sev:"CRITICAL",  sevColor:"#DC2626",  sevBg:"#FEE2E2",
    severity:"critical",
    iconBg:"#FEF3C7", iconColor:"#D97706", Icon:ShieldIcon,
    title:"Circular payment pattern detected",
    desc:"Accounts flagged for suspicious payment loops over the past 72 hours. Manually-flagged for fraud review.",
    chips:["₹1.2L Total"],
    actions:[{ label:"Investigate", dark:true }],
    time:"2m ago",
    detail:{ caseId:"TRU-00481", amount:"₹1,20,000", category:"Fraud signal", city:"Delhi NCR", filedBy:"System", linkedTask:"Multiple",
      parties:[{ name:"System Flag", role:"Auto-detected", score:0, scoreColor:"#8FA3A0" }],
      sla:[{ label:"Review due", value:"4h 00m" },{ label:"Escalation at", value:"8h 00m" },{ label:"Status", value:"Unassigned", red:true }] }
  },
  {
    id:"ev-5", category:"Payments",
    type:"PAYMENT",  typeColor:"#16A34A", typeBg:"#DCFCE7",
    sev:"INFO",      sevColor:"#2563EB",  sevBg:"#DBEAFE",
    severity:"all",
    iconBg:"#DCFCE7", iconColor:"#16A34A", Icon:CreditCardIcon,
    title:"Escrow released to doer",
    desc:"Payment released to Karan Patel for completed UI Design task. Auto-released after 72h hold window with no dispute filed.",
    chips:["TSK-19102","₹15,000","Auto-release"],
    actions:[],
    time:"4m ago",
    detail:{ caseId:"PAY-87199", amount:"₹15,000", category:"Escrow release", city:"Bengaluru", filedBy:"System", linkedTask:"TSK-19102",
      parties:[{ name:"Karan Patel", role:"Doer · Payee", score:88, scoreColor:"#17B890" }],
      sla:[{ label:"Released at", value:"4m ago" },{ label:"Hold window", value:"72h (done)" },{ label:"Status", value:"Released" }] }
  },
  {
    id:"ev-6", category:"Tasks",
    type:"TASK",  typeColor:"#4F46E5", typeBg:"#E0E7FF",
    sev:"INFO",   sevColor:"#2563EB",  sevBg:"#DBEAFE",
    severity:"all",
    iconBg:"#E0E7FF", iconColor:"#4F46E5", Icon:TaskDone01Icon,
    title:"Task force-closed by admin",
    desc:"Admin Priyanka Reddy force-closed task due to inappropriate content flagged by 3 doer reports. Giver notified, full refund issued.",
    chips:["TSK-19150","Programming","Refund issued"],
    actions:[],
    time:"8m ago",
    detail:{ caseId:"TSK-19150", amount:"₹8,500", category:"Force close", city:"Hyderabad", filedBy:"Admin", linkedTask:"TSK-19150",
      parties:[{ name:"Priyanka Reddy", role:"Admin · Executor", score:0, scoreColor:"#8FA3A0" }],
      sla:[{ label:"Closed at", value:"8m ago" },{ label:"Refund status", value:"Initiated" },{ label:"Status", value:"Closed" }] }
  },
]

// ─── Category → matches EVENTS ─────────────────────────────────────────────

function matchesFilter(ev: LiveEvent, filter: FeedFilter, sev: Severity): boolean {
  if (filter !== "All Events" && ev.category !== filter) return false
  if (sev === "all") return true
  if (sev === "critical") return ev.severity === "critical"
  if (sev === "high")     return ev.severity === "high"
  if (sev === "medium")   return ev.severity === "all"
  return true
}

// ─── FeedCard ─────────────────────────────────────────────────────────────

function FeedCard({ ev, selected, onSelect }: { ev: LiveEvent; selected: boolean; onSelect: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity:0, y:10 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, y:-4 }}
      transition={{ duration:0.18 }}
      onClick={onSelect}
      whileHover={{ y:-1 }}
      className={cn(
        "bg-white border rounded-xl mb-3 cursor-pointer transition-colors overflow-hidden",
        selected
          ? "border-[#17B890] shadow-sm ring-1 ring-[#17B890]/15"
          : "border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-sm"
      )}
      style={{ borderLeftWidth:3, borderLeftColor: ev.iconColor }}
    >
      <div className="flex gap-3.5 p-4">
        {/* Icon node */}
        <div className="flex flex-col items-center shrink-0 pt-0.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-black"
            style={{ backgroundColor: ev.iconBg, color: ev.iconColor }}>
            <HugeiconsIcon icon={ev.Icon} size={15} strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded"
              style={{ backgroundColor: ev.typeBg, color: ev.typeColor }}>{ev.type}</span>
            {ev.sev && (
              <span className="text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded"
                style={{ backgroundColor: ev.sevBg, color: ev.sevColor }}>{ev.sev}</span>
            )}
            <span className="ml-auto text-[11px] text-[#8FA3A0] whitespace-nowrap shrink-0">{ev.time}</span>
          </div>

          <p className="text-[13px] font-bold text-[#111827] mb-1 leading-snug">{ev.title}</p>
          <p className="text-[12px] text-[#6B7280] leading-relaxed mb-3">{ev.desc}</p>

          {ev.chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {ev.chips.map((c) => (
                <span key={c} className="text-[11px] text-[#374151] bg-[#F9FAFB] border border-[#E5E7EB] rounded-md px-2 py-0.5 font-medium">{c}</span>
              ))}
            </div>
          )}

          {ev.actions.length > 0 && (
            <div className="flex items-center gap-2">
              {ev.actions.map((a) => (
                <button key={a.label} onClick={(e) => e.stopPropagation()}
                  className={cn("h-7 px-3 rounded-lg text-[11px] font-semibold transition-colors",
                    a.dark ? "bg-[#111827] text-white hover:bg-[#1f2937]" : "border border-[#E5E7EB] text-[#374151] hover:bg-[#F5F8F7]"
                  )}>{a.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Detail panel ──────────────────────────────────────────────────────────

function DetailPanel({ ev }: { ev: LiveEvent }) {
  const router = useRouter()
  return (
    <motion.div
      key={ev.id}
      initial={{ opacity:0, x:8 }}
      animate={{ opacity:1, x:0 }}
      transition={{ duration:0.18 }}
      className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col"
      style={{ maxHeight:"calc(100vh - 280px)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded"
            style={{ backgroundColor: ev.typeBg, color: ev.typeColor }}>{ev.type}</span>
          {ev.sev && (
            <span className="text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded"
              style={{ backgroundColor: ev.sevBg, color: ev.sevColor }}>{ev.sev}</span>
          )}
        </div>
        <div className="w-5 h-5 rounded flex items-center justify-center text-[#8FA3A0] hover:bg-[#F5F8F7] cursor-pointer">
          <HugeiconsIcon icon={Cancel01Icon} size={11} strokeWidth={2} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Title + time */}
        <div className="px-4 py-3 border-b border-[#F3F4F6]">
          <p className="text-[13px] font-bold text-[#111827] leading-snug mb-1">{ev.title}</p>
          <p className="text-[11px] text-[#8FA3A0] flex items-center gap-1">
            <HugeiconsIcon icon={Clock01Icon} size={11} strokeWidth={1.5} />
            {ev.time} · 2 May 2026, 14:32 IST
          </p>
        </div>

        {/* Event data */}
        <div className="px-4 py-3 border-b border-[#F3F4F6]">
          <p className="text-[9px] font-black tracking-[0.15em] text-[#8FA3A0] uppercase mb-3">Event Data</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {[
              { k:"Case ID",    v:ev.detail.caseId     },
              { k:"Amount",     v:ev.detail.amount     },
              { k:"Category",   v:ev.detail.category   },
              { k:"City",       v:ev.detail.city       },
              { k:"Filed by",   v:ev.detail.filedBy    },
              { k:"Linked task",v:ev.detail.linkedTask },
            ].map(({ k, v }) => (
              <div key={k}>
                <p className="text-[10px] text-[#8FA3A0]">{k}</p>
                <p className="text-[11.5px] font-semibold text-[#374151]">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Parties */}
        <div className="px-4 py-3 border-b border-[#F3F4F6]">
          <p className="text-[9px] font-black tracking-[0.15em] text-[#8FA3A0] uppercase mb-3">Parties Involved</p>
          {ev.detail.parties.map((p) => (
            <div key={p.name} className="flex items-center gap-2.5 mb-2 p-2.5 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6]">
              <div className="w-8 h-8 rounded-full bg-[#E8F7F3] flex items-center justify-center text-[10px] font-bold text-[#17B890] shrink-0">
                {p.name.split(" ").map(n=>n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-[#374151] truncate">{p.name}</p>
                <p className="text-[10px] text-[#8FA3A0]">{p.role}</p>
              </div>
              {p.score > 0 && (
                <span className="text-[13px] font-extrabold shrink-0" style={{ color: p.scoreColor }}>{p.score}</span>
              )}
            </div>
          ))}
        </div>

        {/* SLA */}
        <div className="px-4 py-3">
          <p className="text-[9px] font-black tracking-[0.15em] text-[#8FA3A0] uppercase mb-3">SLA Status</p>
          {ev.detail.sla.map(({ label, value, red }) => (
            <div key={label} className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-[11px] text-[#8FA3A0]">
                <HugeiconsIcon icon={Clock01Icon} size={11} strokeWidth={1.5} />
                {label}
              </span>
              <span className={cn("text-[11px] font-bold", red ? "text-[#EF4444]" : "text-[#374151]")}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 border-t border-[#F3F4F6] shrink-0">
        <button
          onClick={() => router.push("/disputes")}
          className="w-full h-10 rounded-xl bg-[#111827] hover:bg-[#1f2937] text-white text-[12.5px] font-bold flex items-center justify-center gap-2 transition-colors"
        >
          Open full case →
        </button>
      </div>
    </motion.div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function LiveFeedPage() {
  const {
    selectedEventId, activeFilter, severity,
    exportOpen, setSelectedEvent, setFilter, setSeverity, setExportOpen,
  } = useLiveFeedStore()

  const visible = EVENTS.filter((ev) => matchesFilter(ev, activeFilter, severity))
  const selectedEv = visible.find((e) => e.id === selectedEventId) ?? EVENTS[0]

  return (
    <div>
      {/* Page heading */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#111827]">Live Feed</h1>
          <p className="text-[12px] text-[#8FA3A0] mt-0.5">Real-time platform activity across all modules</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-[#E8F7F3] text-[#17B890] text-[11px] font-bold border border-[#A8DFD0]">
            <span className="w-2 h-2 rounded-full bg-[#17B890] animate-pulse" />LIVE
          </span>
          <button
            onClick={() => setExportOpen(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#111827] hover:bg-[#1f2937] text-white text-[11px] font-bold transition-colors"
          >
            <HugeiconsIcon icon={Download01Icon} size={12} strokeWidth={2} />
            Export log
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {FILTER_TABS.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={cn(
              "flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[12px] font-medium border transition-colors whitespace-nowrap",
              activeFilter === f.id
                ? "bg-[#111827] text-white border-[#111827]"
                : "bg-white text-[#374151] border-[#E2E8E6] hover:bg-[#F5F8F7]"
            )}>
            {f.id}
            <span className={cn("text-[10px] font-bold", activeFilter === f.id ? "text-white/60" : "text-[#8FA3A0]")}>
              {f.count.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      {/* 2-col layout */}
      <div className="flex gap-4" style={{ minHeight:"calc(100vh - 280px)" }}>
        {/* Feed */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {visible.map((ev) => (
              <FeedCard key={ev.id} ev={ev} selected={selectedEventId === ev.id} onSelect={() => setSelectedEvent(ev.id)} />
            ))}
          </AnimatePresence>
          {visible.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-[#8FA3A0]">
              <p className="text-[14px] font-semibold">No events match the current filter</p>
              <button onClick={() => { setFilter("All Events"); setSeverity("all") }}
                className="mt-3 text-[12px] text-[#17B890] hover:underline font-semibold">
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Right detail */}
        <div className="w-[280px] shrink-0">
          {selectedEv && <DetailPanel ev={selectedEv} />}
        </div>
      </div>

      <ExportFeedModal open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  )
}
