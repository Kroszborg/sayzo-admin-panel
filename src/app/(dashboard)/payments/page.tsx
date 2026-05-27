"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { FilterDropdown } from "@/components/shared/filter-dropdown"
import { usePaymentsStore } from "@/store/payments-store"
import { MOCK_PAYMENTS, PayStatus } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── Tab config ────────────────────────────────────────────────────────────

const TABS: { value: PayStatus | "All"; count: number }[] = [
  { value:"All",       count:2428 },
  { value:"In Escrow", count:247  },
  { value:"Released",  count:2104 },
  { value:"Refunded",  count:74   },
  { value:"Disputed",  count:3    },
]

// ─── Status style ──────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { dot: string; color: string }> = {
  "In Escrow": { dot:"#F59E0B", color:"#D97706"  },
  "Released":  { dot:"#22C55E", color:"#16A34A"  },
  "Disputed":  { dot:"#EF4444", color:"#DC2626"  },
  "Refunded":  { dot:"#9CA3AF", color:"#6B7280"  },
  "Failed":    { dot:"#EF4444", color:"#DC2626"  },
}

// ─── KPI strip data ─────────────────────────────────────────────────────────

const KPI: { label:string; value:string; sub:string; valueColor:string; subAlert?:boolean }[] = [
  { label:"Total in Escrow",  value:"₹4,28,400", sub:"247 active tasks",             valueColor:"#D97706" },
  { label:"Released Today",   value:"₹1,12,600", sub:"↑ 34 payouts · auto-released", valueColor:"#17B890" },
  { label:"Disputed",         value:"₹2,38,200", sub:"8 active disputes",             valueColor:"#DC2626" },
  { label:"Failed / Stuck",   value:"₹14,200",   sub:"3 need attention",              valueColor:"#111827", subAlert:true },
]

// ─── Page ───────────────────────────────────────────────────────────────────

export default function PaymentsPage() {
  const router            = useRouter()
  const s                 = usePaymentsStore()
  const [dateFilter, setDateFilter]     = useState("All time")
  const [customFrom, setCustomFrom]     = useState("")
  const [customTo, setCustomTo]         = useState("")
  const showCustomDate = dateFilter === "Custom"

  const filtered = MOCK_PAYMENTS.filter((p) => {
    const q = s.search.toLowerCase()
    if (q && !p.id.toLowerCase().includes(q) && !p.taskTitle.toLowerCase().includes(q) && !p.giver.toLowerCase().includes(q) && !p.doer.toLowerCase().includes(q)) return false
    if (s.activeTab !== "All" && p.status !== s.activeTab) return false
    return true
  }).sort((a, b) => s.sortFilter === "Sort: Newest" ? b.amount - a.amount : a.amount - b.amount)

  const pageData = filtered.slice((s.page-1)*10, s.page*10)
  const allSel   = pageData.length > 0 && pageData.every((p) => s.selected.has(p.id))

  return (
    <div>
      {/* ── KPI strip ── */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22 }}
        className="flex bg-white border border-[#E5E7EB] rounded-xl overflow-hidden mb-4">
        {KPI.map((k, i) => (
          <div key={k.label} className={cn("flex-1 px-6 py-4", i < KPI.length-1 && "border-r border-[#F3F4F6]")}>
            <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-1">{k.label}</p>
            <p className="text-[22px] font-extrabold leading-tight" style={{ color:k.valueColor }}>{k.value}</p>
            <p className={cn("text-[11px] font-semibold mt-0.5",
              k.subAlert ? "text-[#EF4444]" : k.sub.startsWith("↑") ? "text-[#17B890]" : "text-[#8FA3A0]"
            )}>{k.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Status tabs ── */}
      <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22, delay:0.04 }}
        className="flex bg-white border border-[#E5E7EB] rounded-t-xl overflow-x-auto">
        {TABS.map((t) => {
          const active = s.activeTab === t.value
          return (
            <motion.button key={t.value}
              whileTap={{ scale: 0.97 }}
              onClick={() => s.setActiveTab(t.value)}
              className={cn("flex items-center gap-1.5 px-4 py-3 text-[12.5px] font-medium border-b-2 whitespace-nowrap transition-colors",
                active ? "border-[#111827] text-[#111827] font-bold" : "border-transparent text-[#8FA3A0] hover:text-[#374151]"
              )}>
              {t.value}
              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded",
                active ? "bg-[#111827] text-white" : "bg-[#F3F4F6] text-[#8FA3A0]"
              )}>{t.count.toLocaleString()}</span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* ── Table ── */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.26, delay:0.08 }}
        className="bg-white border-l border-r border-b border-[#E5E7EB] rounded-b-xl overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#F3F4F6] flex-wrap">
          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} size={13} strokeWidth={1.5}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8FA3A0] pointer-events-none" />
            <input value={s.search} onChange={(e) => s.setSearch(e.target.value)}
              placeholder="Search by PAY ID, task, user, or UPI..."
              className="h-8 w-72 pl-8 pr-3 rounded-lg border border-[#E2E8E6] text-[12px] outline-none focus:border-[#17B890] placeholder:text-[#C8D8D4]" />
          </div>
          <FilterDropdown label="All Cities"   options={["All Cities","Mumbai","Bengaluru","Delhi NCR","Hyderabad","Pune"]} value={s.cityFilter}  onChange={s.setCityFilter}  width={155} />
          <FilterDropdown label="Date Range" options={["All time","Today","Last 7 days","Last 30 days","Custom"]} value={dateFilter} onChange={setDateFilter} width={145} />
          <div className="ml-auto">
            <FilterDropdown label="Sort: Newest" options={["Sort: Newest","Sort: Oldest","Highest amount","Lowest amount"]}  value={s.sortFilter}  onChange={s.setSortFilter}  width={165} />
          </div>
        </div>

        {/* Custom date range inputs */}
        <AnimatePresence>
          {showCustomDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#F3F4F6] bg-[#F9FAFB]">
                <span className="text-[11.5px] font-semibold text-[#374151]">From</span>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="h-8 px-3 rounded-lg border border-[#E2E8E6] text-[12px] text-[#374151] outline-none focus:border-[#17B890] bg-white transition-colors"
                />
                <span className="text-[11.5px] font-semibold text-[#374151]">To</span>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  min={customFrom}
                  className="h-8 px-3 rounded-lg border border-[#E2E8E6] text-[12px] text-[#374151] outline-none focus:border-[#17B890] bg-white transition-colors"
                />
                {(customFrom || customTo) && (
                  <button
                    onClick={() => { setCustomFrom(""); setCustomTo("") }}
                    className="text-[11px] font-semibold text-[#8FA3A0] hover:text-[#EF4444] transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                <th className="pl-4 pr-2 py-2.5 w-8">
                  <input type="checkbox" checked={allSel}
                    onChange={() => s.toggleSelectAll(pageData.map((p) => p.id))}
                    className="rounded border-[#D1D5DB] accent-[#17B890] cursor-pointer" />
                </th>
                {["PAYMENT ID","TASK","PARTIES","AMOUNT","STATUS","RELEASE / DUE","CREATED","ACTIONS"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-black tracking-wider text-[#8FA3A0] uppercase px-3 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody key={`${s.activeTab}-${s.search}`}>
              <AnimatePresence mode="popLayout">
                {pageData.map((p, i) => {
                  const ss   = STATUS_STYLE[p.status] ?? STATUS_STYLE["In Escrow"]
                  const isSel = s.selected.has(p.id)
                  const rd    = p.releaseWindow?.split(" · ")

                  return (
                    <motion.tr key={p.id}
                      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                      transition={{ duration:0.14, delay:i*0.02 }}
                      className={cn("border-b border-[#F9FAFB] transition-colors",
                        isSel ? "bg-[#F0FDF4]" : "hover:bg-[#FAFAFA]"
                      )}>
                      <td className="pl-4 pr-2 py-3">
                        <input type="checkbox" checked={isSel} onChange={() => s.toggleSelect(p.id)}
                          className="rounded border-[#D1D5DB] accent-[#17B890] cursor-pointer" />
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-mono text-[12px] font-bold text-[#374151]">{p.id}</p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-[12px] font-semibold text-[#111827] max-w-[160px] truncate">{p.taskTitle}</p>
                        <p className="text-[10.5px] text-[#8FA3A0]">{p.taskId} · {p.category}</p>
                      </td>
                      <td className="px-3 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black bg-[#F3E8FF] text-[#9333EA] rounded px-1.5 py-0.5">Giver</span>
                            <span className="text-[11.5px] text-[#374151]">{p.giver}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black bg-[#DBEAFE] text-[#2563EB] rounded px-1.5 py-0.5">Doer</span>
                            <span className="text-[11.5px] text-[#374151]">{p.doer}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-[13px] font-bold text-[#111827]">₹{p.amount.toLocaleString("en-IN")}</p>
                        <p className="text-[10.5px] text-[#8FA3A0]">Doer earns ₹{p.doerEarns.toLocaleString("en-IN")}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className="flex items-center gap-1.5 text-[11.5px] font-semibold" style={{ color:ss.color }}>
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor:ss.dot }} />
                          {p.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {rd ? (
                          <>
                            <p className={cn("text-[11px] font-semibold", rd[0]?.startsWith("Over") || rd[0]?.startsWith("Fail") ? "text-[#DC2626]" : "text-[#374151]")}>{rd[0]}</p>
                            {rd[1] && <p className="text-[10px] text-[#8FA3A0]">{rd[1]}</p>}
                          </>
                        ) : <span className="text-[#8FA3A0] text-[11px]">—</span>}
                      </td>
                      <td className="px-3 py-3 text-[11.5px] text-[#8FA3A0]">{p.createdAt}</td>
                      <td className="px-3 py-3">
                        <button onClick={() => router.push(`/payments/${p.id}`)}
                          className="h-7 px-2.5 rounded-lg border border-[#E2E8E6] text-[11px] font-semibold text-[#374151] hover:bg-[#F5F8F7] transition-colors">
                          View
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#F3F4F6]">
          <p className="text-[12px] text-[#8FA3A0]">
            Showing <span className="font-semibold text-[#374151]">1–{Math.min(10,filtered.length)}</span> of{" "}
            <span className="font-semibold text-[#374151]">{filtered.length.toLocaleString()}</span> payments
          </p>
          <div className="flex items-center gap-1">
            {[1,2,3,4].map((p2) => (
              <button key={p2} onClick={() => s.setPage(p2)}
                className={cn("w-7 h-7 rounded text-[11px] font-medium transition-colors",
                  s.page===p2 ? "bg-[#111827] text-white" : "text-[#374151] hover:bg-[#F5F8F7]"
                )}>{p2}</button>
            ))}
            <span className="w-7 h-7 flex items-center justify-center text-[#8FA3A0] text-[11px]">…</span>
            <button className="w-7 h-7 rounded text-[11px] text-[#374151] hover:bg-[#F5F8F7]">243</button>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#8FA3A0]">
            Rows <select className="border border-[#E2E8E6] rounded-lg h-7 px-2 text-[11px] outline-none bg-white"><option>10</option><option>25</option></select>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
