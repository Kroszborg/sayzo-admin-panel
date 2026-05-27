"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { AreaChart, Area, ResponsiveContainer } from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Download01Icon, ArrowRight01Icon, Cancel01Icon, Clock01Icon,
  ChartIcon, UserMultiple02Icon, TaskDone01Icon, CreditCardIcon, LegalIcon,
  AlertDiamondIcon, ShieldCheck as ShieldCheckIcon, UserCircleIcon,
} from "@hugeicons/core-free-icons"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useDashboardStore, ReportType, DatePreset } from "@/store/dashboard-store"
import { cn } from "@/lib/utils"

// ─── Sparkline data ────────────────────────────────────────────────────────

const GMV_DATA   = [820,950,880,1020,1150,1080,1280].map((v) => ({ v }))
const USERS_DATA = [210,240,220,260,280,270,320].map((v) => ({ v }))

// ─── Live feed events ──────────────────────────────────────────────────────

const FEED = [
  { id:"f1", iconBg:"#EEF2FF", iconColor:"#6366F1", Icon: TaskDone01Icon,
    text: <>Task <strong>TG-4582</strong> posted by <strong>Arjun K.</strong></>,
    meta:"Cleaning · ₹1,500 · Mumbai", time:"just now" },
  { id:"f2", iconBg:"#FEF2F2", iconColor:"#EF4444", Icon: AlertDiamondIcon,
    text: <>Dispute <strong>CASE-2892</strong> opened by <strong>Vikram S.</strong></>,
    meta:"₹2,400 · Mumbai", time:"2m ago" },
  { id:"f3", iconBg:"#ECFDF5", iconColor:"#10B981", Icon: CreditCardIcon,
    text: <>Payout <strong>₹1,760</strong> to <strong>Diya M.</strong></>,
    meta:"UPI success · diya@oksbi", time:"4m ago" },
  { id:"f4", iconBg:"#EFF6FF", iconColor:"#3B82F6", Icon: UserCircleIcon,
    text: <>User signup <strong>Rohan G.</strong></>,
    meta:"Doer · Pune · referred by code AVN24", time:"5m ago" },
  { id:"f5", iconBg:"#FFF7ED", iconColor:"#F97316", Icon: UserMultiple02Icon,
    text: <>Trust signal</>,
    meta:"Device cluster detected (3 accounts) · auto-flagged for review", time:"9m ago" },
  { id:"f6", iconBg:"#E8F7F3", iconColor:"#17B890", Icon: ShieldCheckIcon,
    text: <>KYC verified <strong>Tanvi P.</strong></>,
    meta:"Aadhaar OCR 94% confidence · auto-approved", time:"11m ago" },
]

// ─── Top cities ────────────────────────────────────────────────────────────

const CITIES = [
  { city:"Mumbai",    amount:"₹3,28,420", tasks:"100 Tasks", pct:100 },
  { city:"Bengaluru", amount:"₹2,84,160", tasks:"100 Tasks", pct:87  },
  { city:"Delhi NCR", amount:"₹2,12,380", tasks:"100 Tasks", pct:65  },
  { city:"Hyderabad", amount:"₹1,42,890", tasks:"100 Tasks", pct:44  },
  { city:"Pune",      amount:"₹98,710",   tasks:"100 Tasks", pct:30  },
]

// ─── Report types ──────────────────────────────────────────────────────────

const REPORTS: { id: ReportType; Icon: typeof ChartIcon; label: string; desc: string }[] = [
  { id:"platform",  Icon:ChartIcon,         label:"Platform activity summary",  desc:"High-level KPIs, totals, and trends across all modules."                     },
  { id:"users",     Icon:UserMultiple02Icon, label:"User activity report",       desc:"Signups, KYC outcomes, trust score changes, and user actions."                },
  { id:"tasks",     Icon:TaskDone01Icon,     label:"Task activity report",       desc:"Tasks created, completed, force-closed, with category and city breakdowns."   },
  { id:"financial", Icon:CreditCardIcon,    label:"Financial report",            desc:"Escrow holds, payouts, refunds, platform fee, and net revenue."               },
  { id:"disputes",  Icon:LegalIcon,         label:"Disputes report",             desc:"All cases with outcomes, SLA performance, and resolver workload."             },
]

const DATE_PRESETS: DatePreset[] = ["Today","Yesterday","Last 7 days","Last 30 days","This month","Custom"]

// ─── Export modal ──────────────────────────────────────────────────────────

function ExportModal() {
  const { exportOpen, setExportOpen, reportType, setReportType, datePreset, setDatePreset } = useDashboardStore()

  return (
    <AnimatePresence>
      {exportOpen && (
        <Dialog open={exportOpen} onOpenChange={setExportOpen}>
          <DialogContent showCloseButton={false} className="sm:max-w-[580px] rounded-2xl p-0 overflow-hidden gap-0 bg-white dark:bg-[#1C1C22] border dark:border-[#26262E]">
            <motion.div
              initial={{ opacity:0, scale:0.97, y:8 }}
              animate={{ opacity:1, scale:1,    y:0 }}
              exit={{    opacity:0, scale:0.97, y:8 }}
              transition={{ duration:0.18, ease:[0.33,1,0.68,1] }}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-[#F3F4F6] dark:border-[#26262E]">
                <div>
                  <h2 className="text-[17px] font-bold text-[#111827] dark:text-[#E8E8E8]">Export report</h2>
                  <p className="text-[12.5px] text-[#8FA3A0] mt-0.5">Generate a custom data export with the selections below.</p>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setExportOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-[#F5F8F7] dark:hover:bg-[#26262E] flex items-center justify-center text-[#8FA3A0] transition-colors mt-0.5">
                  <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
                </motion.button>
              </div>

              <div className="px-6 py-5 space-y-6 max-h-[65vh] overflow-y-auto">
                {/* ── Date range ── */}
                <div>
                  <p className="text-[13px] font-semibold text-[#111827] dark:text-[#E8E8E8] mb-3">Date range</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {DATE_PRESETS.map((p) => (
                      <motion.button key={p} whileTap={{ scale: 0.94 }} transition={{ duration: 0.1 }}
                        onClick={() => setDatePreset(p)}
                        className={cn("h-8 px-3.5 rounded-full text-[12.5px] font-medium border transition-all",
                          datePreset === p
                            ? "bg-[#111827] dark:bg-[#17B890] text-white border-[#111827] dark:border-[#17B890]"
                            : "bg-white dark:bg-[#141418] text-[#374151] dark:text-[#9BA1A6] border-[#E5E7EB] dark:border-[#26262E] hover:border-[#D1D5DB]"
                        )}>
                        {p}
                      </motion.button>
                    ))}
                  </div>
                  {/* Date display */}
                  <div className="flex items-center gap-3 h-10 px-4 rounded-xl bg-[#F9FAFB] dark:bg-[#141418] border border-[#E5E7EB] dark:border-[#26262E] text-[12.5px]">
                    <HugeiconsIcon icon={Clock01Icon} size={14} strokeWidth={1.5} className="text-[#8FA3A0]" />
                    <span className="font-semibold text-[#374151] dark:text-[#9BA1A6]">Apr 3, 2026</span>
                    <span className="text-[#8FA3A0]">→</span>
                    <span className="font-semibold text-[#374151] dark:text-[#9BA1A6]">May 2, 2026</span>
                    <span className="text-[#D1D5DB] dark:text-[#26262E] mx-1">|</span>
                    <span className="text-[#8FA3A0]">30 days · IST</span>
                  </div>
                </div>

                {/* ── Report type ── */}
                <div>
                  <p className="text-[13px] font-semibold text-[#111827] dark:text-[#E8E8E8] mb-3">Report type</p>
                  <div className="space-y-2">
                    {REPORTS.map(({ id, Icon, label, desc }) => {
                      const active = reportType === id
                      return (
                        <motion.button
                          key={id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration:0.1 }}
                          onClick={() => setReportType(id)}
                          className={cn(
                            "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border text-left transition-all",
                            active
                              ? "border-[#111827] dark:border-[#17B890] bg-white dark:bg-[#0A2A22] shadow-sm"
                              : "border-[#E5E7EB] dark:border-[#26262E] bg-white dark:bg-[#141418] hover:border-[#D1D5DB] dark:hover:border-[#404048] hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C22]"
                          )}>
                          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                            active ? "bg-[#111827] dark:bg-[#17B890]" : "bg-[#F3F4F6] dark:bg-[#26262E]"
                          )}>
                            <HugeiconsIcon icon={Icon} size={16} strokeWidth={1.5} className={active ? "text-white" : "text-[#6B7280]"} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-[13px] font-semibold", active ? "text-[#111827] dark:text-[#E8E8E8]" : "text-[#374151] dark:text-[#9BA1A6]")}>{label}</p>
                            <p className="text-[11.5px] text-[#8FA3A0] leading-snug mt-0.5">{desc}</p>
                          </div>
                          <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                            active ? "border-[#111827] dark:border-[#17B890]" : "border-[#D1D5DB] dark:border-[#404048]"
                          )}>
                            {active && <div className="w-2 h-2 rounded-full bg-[#111827] dark:bg-[#17B890]" />}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#F3F4F6] dark:border-[#26262E] bg-[#F9FAFB] dark:bg-[#141418]">
                <div className="flex items-center gap-3 text-[12px] text-[#8FA3A0]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#17B890]" />
                    ~3,420 rows
                  </span>
                  <span>~1.2 MB</span>
                  <span>ready in ~8s</span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => setExportOpen(false)}
                    className="h-9 px-4 rounded-xl border border-[#E5E7EB] dark:border-[#26262E] text-[12.5px] font-semibold text-[#374151] dark:text-[#9BA1A6] hover:bg-white dark:hover:bg-[#26262E] transition-colors bg-[#F9FAFB] dark:bg-[#141418]">
                    Cancel
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setExportOpen(false)}
                    className="h-9 px-4 rounded-xl bg-[#111827] hover:bg-[#1f2937] dark:bg-[#17B890] dark:hover:bg-[#15a47d] text-white text-[12.5px] font-bold flex items-center gap-1.5 transition-colors">
                    <HugeiconsIcon icon={Download01Icon} size={13} strokeWidth={2} />
                    Generate report
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

// ─── KPI Card ──────────────────────────────────────────────────────────────

function KpiCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y:-1, boxShadow:"0 4px 12px rgba(0,0,0,0.06)" }}
      transition={{ duration:0.15 }}
      className={cn("flex-1 bg-white dark:bg-[#141418] border border-[#E5E7EB] dark:border-[#26262E] rounded-xl p-5 flex flex-col min-w-0", className)}
    >
      {children}
    </motion.div>
  )
}

// ─── Animated progress bar ─────────────────────────────────────────────────

function AnimatedBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  return (
    <motion.div
      className="h-full rounded-full"
      style={{ backgroundColor: color }}
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ duration: 0.8, delay, ease: [0.33,1,0.68,1] }}
    />
  )
}

// ─── Dashboard Page ────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { setExportOpen } = useDashboardStore()

  return (
    <div>
      {/* ── Greeting row — left: greeting, right: action buttons (same row) ── */}
      <motion.div
        initial={{ opacity:0, y:6 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.25 }}
        className="flex items-start justify-between mb-6"
      >
        <div>
          <h1 className="text-[22px] font-extrabold text-[#111827] dark:text-[#E8E8E8]">Good morning, Aarav 👋</h1>
          <p className="text-[12px] text-[#8FA3A0] mt-0.5">Friday, May 1 · 9:42 AM IST</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <motion.button
            whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
            onClick={() => setExportOpen(true)}
            className="flex items-center gap-1.5 h-8 px-3 border border-[#E2E8E6] dark:border-[#26262E] rounded-lg text-[12px] font-semibold text-[#374151] dark:text-[#9BA1A6] bg-white dark:bg-[#1C1C22] hover:bg-[#F5F8F7] dark:hover:bg-[#26262E] transition-colors"
          >
            <HugeiconsIcon icon={Download01Icon} size={13} strokeWidth={1.5} />
            Export Report
          </motion.button>
          <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/live-feed"
              className="flex items-center gap-1.5 h-8 px-3 border border-[#E2E8E6] dark:border-[#26262E] rounded-lg text-[12px] font-semibold text-[#374151] dark:text-[#9BA1A6] bg-white dark:bg-[#1C1C22] hover:bg-[#F5F8F7] dark:hover:bg-[#26262E] transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[#17B890] animate-pulse" />
              Live Feed
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* ── KPI cards ── */}
      <motion.div
        initial={{ opacity:0, y:8 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.3, delay:0.05 }}
        className="flex gap-4 mb-6"
      >
        {/* GMV TODAY */}
        <KpiCard>
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-black tracking-[0.15em] text-[#8FA3A0] uppercase">GMV Today</p>
            <ResponsiveContainer width={80} height={30}>
              <AreaChart data={GMV_DATA}>
                <Area type="monotone" dataKey="v" stroke="#17B890" strokeWidth={1.5} fill="#E8F7F3" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[26px] font-extrabold text-[#111827] leading-tight mb-2">₹12,84,560</p>
          <span className="w-fit text-[11px] font-bold bg-[#E8F7F3] text-[#17B890] rounded-full px-2.5 py-0.5 mb-2">
            ↑ 14.2% vs yesterday
          </span>
          <p className="text-[11px] text-[#8FA3A0] mt-auto pt-1">Online ₹4,28,400 · Offline ₹8,56,160</p>
        </KpiCard>

        {/* TOTAL USERS */}
        <KpiCard>
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-black tracking-[0.15em] text-[#8FA3A0] uppercase">Total Users</p>
            <ResponsiveContainer width={80} height={30}>
              <AreaChart data={USERS_DATA}>
                <Area type="monotone" dataKey="v" stroke="#17B890" strokeWidth={1.5} fill="#E8F7F3" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[26px] font-extrabold text-[#111827] leading-tight mb-2">24,891</p>
          <span className="w-fit text-[11px] font-bold bg-[#E8F7F3] text-[#17B890] rounded-full px-2.5 py-0.5 mb-2">
            ↑ +182 today
          </span>
          <p className="text-[11px] text-[#8FA3A0] mt-auto pt-1">Doers 14,221 · Givers 10,670</p>
        </KpiCard>

        {/* ACTIVE TASKS */}
        <KpiCard>
          <p className="text-[10px] font-black tracking-[0.15em] text-[#8FA3A0] uppercase mb-2">Active Tasks</p>
          <p className="text-[26px] font-extrabold text-[#111827] leading-tight flex-1">1,247</p>
          {/* Progress bar at bottom */}
          <div className="mt-4">
            <div className="flex h-2 rounded-full overflow-hidden mb-2 bg-[#F3F4F6]">
              <AnimatedBar pct={6.7} color="#3B82F6" delay={0.3} />
              <AnimatedBar pct={93.3} color="#17B890" delay={0.3} />
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[11px] text-[#374151]">
                <span className="w-2 h-2 rounded-full bg-[#3B82F6] shrink-0" />
                In matching 84
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-[#374151]">
                <span className="w-2 h-2 rounded-full bg-[#17B890] shrink-0" />
                In progress 1,163
              </span>
            </div>
          </div>
        </KpiCard>

        {/* OPEN DISPUTES */}
        <KpiCard>
          <p className="text-[10px] font-black tracking-[0.15em] text-[#8FA3A0] uppercase mb-2">Open Disputes</p>
          <p className="text-[26px] font-extrabold text-[#111827] leading-tight flex-1">8</p>
          <div className="mt-4">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
              <span className="text-[11px] font-bold text-[#EF4444]">5 at SLA risk</span>
            </div>
            <p className="text-[11px] text-[#8FA3A0]">Avg value ₹4,200 · This week +2</p>
          </div>
        </KpiCard>
      </motion.div>

      {/* ── Bottom widgets ── */}
      <motion.div
        initial={{ opacity:0, y:10 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.3, delay:0.12 }}
        className="grid grid-cols-5 gap-4"
      >
        {/* Live Feed — 3 cols */}
        <div className="col-span-3 bg-white dark:bg-[#141418] border border-[#E5E7EB] dark:border-[#26262E] rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F3F4F6] dark:border-[#26262E]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#17B890]" />
              <span className="text-[13px] font-bold text-[#111827] dark:text-[#E8E8E8]">Live Feed</span>
            </div>
            <motion.div whileHover={{ opacity: 0.75 }} transition={{ duration: 0.12 }}>
              <Link href="/live-feed"
                className="flex items-center gap-1 text-[11.5px] font-semibold text-[#8FA3A0] hover:text-[#17B890] transition-colors">
                View all
                <HugeiconsIcon icon={ArrowRight01Icon} size={11} strokeWidth={2} />
              </Link>
            </motion.div>
          </div>

          {/* Feed rows */}
          <div>
            {FEED.map((ev, i) => (
              <motion.div
                key={ev.id}
                initial={{ opacity:0, x:-4 }}
                animate={{ opacity:1, x:0 }}
                transition={{ duration:0.18, delay: i * 0.04 }}
                whileHover={{ x: 2 }}
                className="flex items-center gap-3 px-5 py-3 border-b border-[#F9FAFB] dark:border-[#1C1C22] last:border-0 cursor-default hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C22] transition-colors"
              >
                {/* Icon */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: ev.iconBg, color: ev.iconColor }}
                >
                  <HugeiconsIcon icon={ev.Icon} size={14} strokeWidth={1.5} />
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#374151] dark:text-[#C8C8D0] leading-snug">{ev.text}</p>
                  <p className="text-[11px] text-[#8FA3A0] dark:text-[#6B7280] mt-0.5">{ev.meta}</p>
                </div>
                {/* Timestamp */}
                <span className="text-[11px] text-[#8FA3A0] dark:text-[#6B7280] shrink-0 whitespace-nowrap">{ev.time}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Cities — 2 cols */}
        <div className="col-span-2 bg-white dark:bg-[#141418] border border-[#E5E7EB] dark:border-[#26262E] rounded-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F3F4F6] dark:border-[#26262E]">
            <span className="text-[13px] font-bold text-[#111827] dark:text-[#E8E8E8]">Top Cities · Today</span>
            <button className="text-[11.5px] font-semibold text-[#8FA3A0] hover:text-[#17B890] transition-colors flex items-center gap-0.5">
              Drill in <HugeiconsIcon icon={ArrowRight01Icon} size={11} strokeWidth={2} />
            </button>
          </div>

          {/* City rows */}
          <div className="px-5 py-4 flex-1 space-y-3.5">
            {CITIES.map((c, i) => (
              <motion.div
                key={c.city}
                initial={{ opacity:0, x:4 }}
                animate={{ opacity:1, x:0 }}
                transition={{ duration:0.2, delay: 0.1 + i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] font-semibold text-[#374151] dark:text-[#C8C8D0]">{c.city}</span>
                  <span className="text-[11px] font-bold text-[#111827] dark:text-[#E8E8E8] whitespace-nowrap">
                    {c.amount} | {c.tasks}
                  </span>
                </div>
                <div className="h-1.5 bg-[#F3F4F6] dark:bg-[#26262E] rounded-full overflow-hidden">
                  <AnimatedBar pct={c.pct} color="#17B890" delay={0.2 + i * 0.06} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom metrics 2×2 */}
          <div className="border-t border-[#F3F4F6] dark:border-[#26262E] px-5 py-4 grid grid-cols-2 gap-x-4 gap-y-3">
            {[
              { label:"COMPLETION RATE", value:"87.3%" },
              { label:"AVG TASK VALUE",  value:"₹2,140" },
              { label:"TAKE RATE",       value:"12%"    },
              { label:"AVG MATCH TIME",  value:"4m 12s" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[9px] font-black tracking-widest text-[#8FA3A0] uppercase mb-0.5">{s.label}</p>
                <p className="text-[15px] font-extrabold text-[#111827] dark:text-[#E8E8E8]">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Export modal */}
      <ExportModal />
    </div>
  )
}
