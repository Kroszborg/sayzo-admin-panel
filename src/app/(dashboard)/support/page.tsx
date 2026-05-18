"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { FilterDropdown } from "@/components/shared/filter-dropdown"
import { useSupportStore } from "@/store/support-store"
import { MOCK_TICKETS, MOCK_TEAM, TktStatus } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── Tabs ─────────────────────────────────────────────────────────────────

const TABS: { value: TktStatus | "All"; count: number }[] = [
  { value:"All",           count:31 },
  { value:"Open",          count:18 },
  { value:"Pending Reply", count:7  },
  { value:"Unassigned",    count:7  },
  { value:"Resolved",      count:22 },
]

// ─── Category colours ──────────────────────────────────────────────────────

const CAT_STYLE: Record<string, string> = {
  Payment:     "bg-[#FEE2E2] text-[#DC2626]",
  Account:     "bg-[#FEF3C7] text-[#D97706]",
  Dispute:     "bg-[#DBEAFE] text-[#2563EB]",
  Verification:"bg-[#F3E8FF] text-[#9333EA]",
  Technical:   "bg-[#EEF2FF] text-[#6366F1]",
  Refund:      "bg-[#DCFCE7] text-[#16A34A]",
  KYC:         "bg-[#F3E8FF] text-[#9333EA]",
  Trust:       "bg-[#FFF7ED] text-[#EA580C]",
}

// ─── Status style ──────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { dot:string; color:string }> = {
  "Open":          { dot:"#3B82F6", color:"#2563EB" },
  "Pending Reply": { dot:"#F59E0B", color:"#D97706" },
  "Unassigned":    { dot:"#9CA3AF", color:"#6B7280" },
  "Resolved":      { dot:"#22C55E", color:"#16A34A" },
  "Escalated":     { dot:"#EF4444", color:"#DC2626" },
}

// ─── KPI data ──────────────────────────────────────────────────────────────

const KPI = [
  { label:"Open Tickets",      value:"31",    sub:"↑ 4 new in last hour",    valueColor:"#2563EB" },
  { label:"Unassigned",        value:"9",     sub:"Needs agent assignment",  valueColor:"#D97706" },
  { label:"Avg First Response",value:"1h 48m",sub:"↓ 14% faster this week", valueColor:"#111827" },
  { label:"Resolved Today",    value:"22",    sub:"↑ 91% resolution rate",   valueColor:"#17B890" },
]

// ─── Assign Modal ──────────────────────────────────────────────────────────

function AssignModal() {
  const s = useSupportStore()
  const agents = MOCK_TEAM
    .filter((m) => m.role === "Support Agent" || m.role === "Admin")
    .filter((m) => !s.assignSearch || m.name.toLowerCase().includes(s.assignSearch.toLowerCase()))
  const chosen = MOCK_TEAM.find((m) => m.id === s.selectedAgent)

  return (
    <AnimatePresence>
      {s.assignOpen && (
        <Dialog open={s.assignOpen} onOpenChange={(v) => s.setAssignOpen(v)}>
          <DialogContent showCloseButton={false} className="sm:max-w-sm rounded-2xl p-0 gap-0 overflow-hidden">
            <motion.div
              initial={{ opacity:0, scale:0.97, y:8 }} animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.97, y:8 }} transition={{ duration:0.18, ease:[0.33,1,0.68,1] }}
            >
              <div className="px-5 pt-5 pb-3 border-b border-[#F3F4F6]">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#111827]">Assign ticket</h3>
                    <p className="text-[11px] text-[#8FA3A0] mt-0.5">Acting as Aarav Sharma · Admin on {s.assignTicketId}</p>
                  </div>
                  <button onClick={() => s.setAssignOpen(false)}
                    className="w-6 h-6 rounded flex items-center justify-center text-[#8FA3A0] hover:bg-[#F5F8F7]">
                    <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="px-5 py-4 space-y-3">
                <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase">Choose Support Agent</p>
                <div className="relative">
                  <HugeiconsIcon icon={Search01Icon} size={12} strokeWidth={1.5}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8FA3A0]" />
                  <input value={s.assignSearch} onChange={(e) => s.setAssignSearch(e.target.value)}
                    placeholder="Search support agent..."
                    className="w-full h-8 pl-7 pr-3 rounded-lg border border-[#E2E8E6] text-[12px] outline-none focus:border-[#17B890] placeholder:text-[#C8D8D4]" />
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {agents.map((agent) => {
                    const isSel = s.selectedAgent === agent.id
                    return (
                      <button key={agent.id} onClick={() => s.setSelectedAgent(agent.id)}
                        className={cn("w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all",
                          isSel ? "border-[#17B890] bg-[#F0FDF4]" : "border-[#E5E7EB] hover:bg-[#F9FAFB]"
                        )}>
                        <div className={cn("w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                          isSel ? "border-[#17B890]" : "border-[#D1D5DB]"
                        )}>
                          {isSel && <div className="w-2 h-2 rounded-full bg-[#17B890]" />}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#E8F7F3] flex items-center justify-center text-[10px] font-bold text-[#17B890] shrink-0">
                          {agent.name.split(" ").map(n=>n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-[#374151]">{agent.name}</p>
                          <p className="text-[10px] text-[#8FA3A0]">{agent.role} · Last active {agent.lastAction}</p>
                        </div>
                        {agent.isOnline && <div className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0" />}
                      </button>
                    )
                  })}
                </div>

                {chosen && (
                  <p className="text-[11px] text-[#374151]">Selected: <span className="font-bold">{chosen.name}</span></p>
                )}
              </div>

              <div className="flex gap-2 px-5 pb-5">
                <button onClick={() => s.setAssignOpen(false)}
                  className="flex-1 h-8 rounded-lg border border-[#E2E8E6] text-[12px] font-semibold text-[#374151] hover:bg-[#F5F8F7]">Cancel</button>
                <button onClick={s.confirmAssign} disabled={!s.selectedAgent}
                  className="flex-1 h-8 rounded-lg bg-[#111827] hover:bg-[#1f2937] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 transition-colors">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2} />
                  Assign
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

export default function SupportPage() {
  const router = useRouter()
  const s      = useSupportStore()
  const [dateFilter, setDateFilter] = useState("All time")

  const filtered = MOCK_TICKETS.filter((t) => {
    const q = s.search.toLowerCase()
    if (q && !t.id.toLowerCase().includes(q) && !t.title.toLowerCase().includes(q) && !t.requesterName.toLowerCase().includes(q)) return false
    if (s.activeTab !== "All" && t.status !== s.activeTab) return false
    return true
  })

  const pageData  = filtered.slice((s.page-1)*10, s.page*10)
  const allSel    = pageData.length > 0 && pageData.every((t) => s.selected.has(t.id))

  return (
    <div>
      {/* KPI strip */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22 }}
        className="flex bg-white border border-[#E5E7EB] rounded-xl overflow-hidden mb-4">
        {KPI.map((k, i) => (
          <div key={k.label} className={cn("flex-1 px-6 py-4", i < KPI.length-1 && "border-r border-[#F3F4F6]")}>
            <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-1">{k.label}</p>
            <p className="text-[22px] font-extrabold leading-tight" style={{ color:k.valueColor }}>{k.value}</p>
            <p className={cn("text-[11px] font-semibold mt-0.5",
              k.sub.startsWith("↓") || k.sub.startsWith("↑") ? "text-[#17B890]" : "text-[#8FA3A0]"
            )}>{k.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Status tabs */}
      <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22, delay:0.04 }}
        className="flex bg-white border border-[#E5E7EB] rounded-t-xl overflow-x-auto">
        {TABS.map((t) => {
          const active = s.activeTab === t.value
          return (
            <button key={t.value} onClick={() => s.setActiveTab(t.value)}
              className={cn("flex items-center gap-1.5 px-4 py-3 text-[12.5px] font-medium border-b-2 whitespace-nowrap transition-colors",
                active ? "border-[#111827] text-[#111827] font-bold" : "border-transparent text-[#8FA3A0] hover:text-[#374151]"
              )}>
              {t.value}
              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded",
                active ? "bg-[#111827] text-white" : "bg-[#F3F4F6] text-[#8FA3A0]"
              )}>{t.count}</span>
            </button>
          )
        })}
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.26, delay:0.08 }}
        className="bg-white border-l border-r border-b border-[#E5E7EB] rounded-b-xl overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#F3F4F6] flex-wrap">
          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} size={13} strokeWidth={1.5}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8FA3A0] pointer-events-none" />
            <input value={s.search} onChange={(e) => s.setSearch(e.target.value)}
              placeholder="Search tickets by ID, subject, user..."
              className="h-8 w-72 pl-8 pr-3 rounded-lg border border-[#E2E8E6] text-[12px] outline-none focus:border-[#17B890] placeholder:text-[#C8D8D4]" />
          </div>
          <FilterDropdown label="All Cities"  options={["All Cities","Mumbai","Bengaluru","Delhi NCR","Hyderabad","Pune"]} value={s.cityFilter}  onChange={s.setCityFilter}  width={155} />
          <FilterDropdown label="Date Range" options={["All time","Today","Last 7 days","Last 30 days"]} value={dateFilter} onChange={setDateFilter} width={140} />
          <div className="ml-auto">
            <FilterDropdown label="Sort: Newest" options={["Sort: Newest","Sort: Oldest","SLA: Most urgent","Unassigned first"]} value={s.sortFilter} onChange={s.setSortFilter} width={180} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                <th className="pl-4 pr-2 py-2.5 w-8">
                  <input type="checkbox" checked={allSel}
                    onChange={() => s.toggleSelectAll(pageData.map((t) => t.id))}
                    className="rounded border-[#D1D5DB] accent-[#17B890] cursor-pointer" />
                </th>
                {["TICKET","REQUESTER","ASSIGNED TO","STATUS","SLA","CREATED","ACTIONS"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-black tracking-wider text-[#8FA3A0] uppercase px-3 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody key={`${s.activeTab}-${s.search}`}>
              <AnimatePresence mode="popLayout">
                {pageData.map((ticket, i) => {
                  const ss   = STATUS_STYLE[ticket.status] ?? STATUS_STYLE["Open"]
                  const catCls = CAT_STYLE[ticket.category] ?? "bg-[#F3F4F6] text-[#374151]"

                  return (
                    <motion.tr key={ticket.id}
                      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                      transition={{ duration:0.14, delay:i*0.02 }}
                      className={cn("border-b border-[#F9FAFB] transition-colors",
                        s.selected.has(ticket.id) ? "bg-[#F0FDF4]" : "hover:bg-[#FAFAFA]"
                      )}>
                      <td className="pl-4 pr-2 py-3">
                        <input type="checkbox"
                          checked={s.selected.has(ticket.id)}
                          onChange={() => s.toggleSelect(ticket.id)}
                          className="rounded border-[#D1D5DB] accent-[#17B890] cursor-pointer" />
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-[12px] font-bold text-[#111827] max-w-[220px] leading-snug">{ticket.title}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] text-[#8FA3A0]">{ticket.id}</span>
                          <span className={cn("text-[9px] font-black rounded px-1.5 py-0.5", catCls)}>{ticket.category}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={cn("text-[9px] font-black rounded px-1.5 py-0.5",
                            ticket.requesterRole === "Doer" ? "bg-[#DBEAFE] text-[#2563EB]" : "bg-[#F3E8FF] text-[#9333EA]"
                          )}>{ticket.requesterRole}</span>
                          <span className="text-[12px] text-[#374151]">{ticket.requesterName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[12px] text-[#374151]">
                        {ticket.assignedTo ?? <span className="text-[#D1D5DB] italic text-[11px]">Not assigned</span>}
                      </td>
                      <td className="px-3 py-3">
                        <span className="flex items-center gap-1.5 text-[11.5px] font-semibold" style={{ color:ss.color }}>
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor:ss.dot }} />
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {ticket.sla === "Done ✓" ? (
                          <span className="text-[11px] font-bold text-[#17B890]">Done ✓</span>
                        ) : ticket.slaOverdue ? (
                          <span className="text-[11px] font-bold text-[#DC2626]">Overdue</span>
                        ) : (
                          <span className="text-[11px] font-semibold text-[#D97706]">{ticket.sla}</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-[11.5px] text-[#8FA3A0]">{ticket.createdAt}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => router.push(`/support/${ticket.id}`)}
                            className="h-7 px-2.5 rounded-lg border border-[#E2E8E6] text-[11px] font-semibold text-[#374151] hover:bg-[#F5F8F7] transition-colors">View</button>
                          {!ticket.assignedTo && (
                            <button onClick={() => s.setAssignOpen(true, ticket.id)}
                              className="h-7 px-2.5 rounded-lg border border-[#E2E8E6] text-[11px] font-semibold text-[#374151] hover:bg-[#F5F8F7] transition-colors">Assign</button>
                          )}
                        </div>
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
            <span className="font-semibold text-[#374151]">{filtered.length}</span> tickets
          </p>
          <div className="flex items-center gap-1">
            {[1,2,3].map((p) => (
              <button key={p} onClick={() => s.setPage(p)}
                className={cn("w-7 h-7 rounded text-[11px] font-medium transition-colors",
                  s.page===p ? "bg-[#111827] text-white" : "text-[#374151] hover:bg-[#F5F8F7]"
                )}>{p}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#8FA3A0]">
            Rows <select className="border border-[#E2E8E6] rounded-lg h-7 px-2 text-[11px] outline-none bg-white"><option>10</option></select>
          </div>
        </div>
      </motion.div>

      <AssignModal />
    </div>
  )
}
