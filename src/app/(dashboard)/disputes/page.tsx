"use client"

import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { FilterDropdown } from "@/components/shared/filter-dropdown"
import { useDisputesStore } from "@/store/disputes-store"
import { useAlertStore } from "@/store/alert-store"
import { MOCK_DISPUTES, MOCK_TEAM, DispStatus, Priority } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── Status tab config ─────────────────────────────────────────────────────

const TABS: { value: DispStatus | "All"; count: number }[] = [
  { value:"All",              count:24  },
  { value:"Unassigned",       count:7   },
  { value:"In Progress",      count:12  },
  { value:"Evidence Pending", count:3   },
  { value:"Escalated",        count:2   },
  { value:"Resolved",         count:486 },
]

// ─── Colour maps ───────────────────────────────────────────────────────────

const PRIORITY_STYLE: Record<Priority, { text:string; bg:string; dot:string }> = {
  Critical: { text:"#DC2626", bg:"#FEE2E2", dot:"#EF4444" },
  High:     { text:"#D97706", bg:"#FEF3C7", dot:"#F59E0B" },
  Medium:   { text:"#2563EB", bg:"#DBEAFE", dot:"#3B82F6" },
  Low:      { text:"#6B7280", bg:"#F3F4F6", dot:"#9CA3AF" },
}

const STATUS_COLOR: Record<DispStatus, string> = {
  Unassigned:        "#D97706",
  "In Progress":     "#2563EB",
  "Evidence Pending":"#9333EA",
  Escalated:         "#DC2626",
  Resolved:          "#17B890",
}

// ─── Assign Case Modal ─────────────────────────────────────────────────────

function AssignModal() {
  const s      = useDisputesStore()
  const alert  = useAlertStore()
  const agents = MOCK_TEAM
    .filter((m) => m.role !== "Viewer")
    .filter((m) => !s.assignSearch || m.name.toLowerCase().includes(s.assignSearch.toLowerCase()))

  const chosen = MOCK_TEAM.find((m) => m.id === s.selectedResolver)

  return (
    <AnimatePresence>
      {s.assignOpen && (
        <Dialog open={s.assignOpen} onOpenChange={(v) => s.setAssignOpen(v)}>
          <DialogContent showCloseButton={false} className="sm:max-w-sm rounded-2xl p-0 gap-0 overflow-hidden">
            <motion.div
              initial={{ opacity:0, scale:0.97, y:8 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.97, y:8 }}
              transition={{ duration:0.18, ease:[0.33,1,0.68,1] }}
            >
              <div className="px-5 pt-5 pb-3 border-b border-[#F3F4F6]">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#111827]">Assign case</h3>
                    <p className="text-[11px] text-[#8FA3A0] mt-0.5">
                      Acting as Aarav Sharma · Admin on {s.assignCaseId}
                    </p>
                  </div>
                  <button onClick={() => s.setAssignOpen(false)}
                    className="w-6 h-6 rounded flex items-center justify-center text-[#8FA3A0] hover:bg-[#F5F8F7]">
                    <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="px-5 py-4 space-y-3">
                <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase">Choose Resolver</p>
                <div className="relative">
                  <HugeiconsIcon icon={Search01Icon} size={12} strokeWidth={1.5}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8FA3A0]" />
                  <input value={s.assignSearch} onChange={(e) => s.setAssignSearch(e.target.value)}
                    placeholder="Search team member by name or role..."
                    className="w-full h-8 pl-7 pr-3 rounded-lg border border-[#E2E8E6] text-[12px] outline-none focus:border-[#17B890] placeholder:text-[#C8D8D4]" />
                </div>

                <div className="space-y-1.5 max-h-52 overflow-y-auto">
                  {agents.map((m) => {
                    const isSel = s.selectedResolver === m.id
                    return (
                      <button key={m.id} onClick={() => s.setResolver(m.id)}
                        className={cn("w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all",
                          isSel ? "border-[#17B890] bg-[#F0FDF4]" : "border-[#E5E7EB] hover:bg-[#F9FAFB]"
                        )}>
                        <div className={cn("w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                          isSel ? "border-[#17B890]" : "border-[#D1D5DB]"
                        )}>
                          {isSel && <div className="w-2 h-2 rounded-full bg-[#17B890]" />}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#E8F7F3] flex items-center justify-center text-[10px] font-bold text-[#17B890] shrink-0">
                          {m.name.split(" ").map(n=>n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-[#374151]">{m.name}</p>
                          <p className="text-[10px] text-[#8FA3A0]">{m.role}</p>
                        </div>
                        {m.isOnline && <div className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0" />}
                      </button>
                    )
                  })}
                </div>

                {chosen && (
                  <p className="text-[11px] text-[#374151]">
                    Selected: <span className="font-bold">{chosen.name}</span>
                  </p>
                )}
              </div>

              <div className="flex gap-2 px-5 pb-5">
                <button onClick={() => s.setAssignOpen(false)}
                  className="flex-1 h-8 rounded-lg border border-[#E2E8E6] text-[12px] font-semibold text-[#374151] hover:bg-[#F5F8F7]">Cancel</button>
                <button
                  onClick={() => {
                    const resolver = MOCK_TEAM.find((m) => m.id === s.selectedResolver)
                    s.confirmAssign()
                    alert.show("success", `Case ${s.assignCaseId} assigned to ${resolver?.name ?? "resolver"}`)
                  }}
                  disabled={!s.selectedResolver}
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

export default function DisputesPage() {
  const router = useRouter()
  const s = useDisputesStore()

  const filtered = MOCK_DISPUTES.filter((d) => {
    const q = s.search.toLowerCase()
    if (q && !d.id.toLowerCase().includes(q) && !d.title.toLowerCase().includes(q) && !d.giver.toLowerCase().includes(q) && !d.doer.toLowerCase().includes(q)) return false
    if (s.activeTab !== "All" && d.status !== s.activeTab) return false
    if (s.cityFilter !== "All Cities" && d.city !== s.cityFilter) return false
    return true
  })

  const pageData = filtered.slice((s.page-1)*10, s.page*10)
  const allSel   = pageData.length > 0 && pageData.every((d) => s.selected.has(d.id))

  const STATS = [
    { label:"Open Cases",         value:"24",    sub:"5 at SLA risk",      valueColor:"#EF4444" },
    { label:"Unassigned",         value:"7",     sub:"Needs assignment",    valueColor:"#F59E0B" },
    { label:"Avg Resolution Time",value:"4d 3h", sub:"↓18% vs last week",  valueColor:"#111827" },
    { label:"Resolved Today",     value:"3",     sub:"SLA met on all 3",    valueColor:"#17B890" },
  ]

  return (
    <div>
      {/* Metrics strip */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22 }}
        className="flex bg-white border border-[#E5E7EB] rounded-xl overflow-hidden mb-4">
        {STATS.map((s2, i) => (
          <div key={s2.label} className={cn("flex-1 px-6 py-4", i < STATS.length-1 && "border-r border-[#F3F4F6]")}>
            <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-1">{s2.label}</p>
            <p className="text-[22px] font-extrabold leading-tight" style={{ color:s2.valueColor }}>{s2.value}</p>
            <p className={cn("text-[11px] font-semibold mt-0.5", s2.sub.startsWith("↓") ? "text-[#17B890]" : "text-[#8FA3A0]")}>{s2.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Status tabs */}
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
              )}>{t.count}</span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Table card */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.26, delay:0.08 }}
        className="bg-white border-l border-r border-b border-[#E5E7EB] rounded-b-xl overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#F3F4F6] flex-wrap">
          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} size={13} strokeWidth={1.5}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8FA3A0] pointer-events-none" />
            <input value={s.search} onChange={(e) => s.setSearch(e.target.value)}
              placeholder="Search by case ID, task, or user name..."
              className="h-8 w-72 pl-8 pr-3 rounded-lg border border-[#E2E8E6] text-[12px] outline-none focus:border-[#17B890] placeholder:text-[#C8D8D4]" />
          </div>
          <FilterDropdown label="Priority: All"    options={["Priority: All","Critical","High","Medium","Low"]}           value={s.priorityFilter} onChange={s.setPriorityFilter} width={150} />
          <FilterDropdown label="Category: All"    options={["Category: All","Payment","Quality","Abandonment","Fraud"]}  value={s.catFilter}      onChange={s.setCatFilter}      width={158} />
          <FilterDropdown label="Assigned to: All" options={["Assigned to: All","Aarav Sharma","Riya Verma","Unassigned"]} value={s.assigneeFilter} onChange={s.setAssigneeFilter} width={170} />
          <FilterDropdown label="All Cities"       options={["All Cities","Mumbai","Bengaluru","Delhi NCR","Hyderabad","Pune"]} value={s.cityFilter} onChange={s.setCityFilter}   width={155} />
          <div className="ml-auto">
            <FilterDropdown label="SLA: Most urgent" options={["SLA: Most urgent","SLA: Overdue first","Recently filed","Highest value"]} value={s.slaSort} onChange={s.setSlaSort} width={180} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                <th className="pl-4 pr-2 py-2.5 w-8">
                  <input type="checkbox" checked={allSel}
                    onChange={() => s.toggleSelectAll(pageData.map((d) => d.id))}
                    className="rounded border-[#D1D5DB] accent-[#17B890] cursor-pointer" />
                </th>
                {["CASE","PARTIES","AMOUNT","PRIORITY","STATUS","SLA","ASSIGNED TO","FILED","ACTIONS"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-black tracking-wider text-[#8FA3A0] uppercase px-3 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody key={`${s.activeTab}-${s.search}-${s.priorityFilter}`}>
              <AnimatePresence mode="popLayout">
                {pageData.map((d, i) => {
                  const pri  = PRIORITY_STYLE[d.priority]
                  const stCl = STATUS_COLOR[d.status] ?? "#6B7280"
                  const isSel = s.selected.has(d.id)

                  return (
                    <motion.tr key={d.id}
                      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                      transition={{ duration:0.14, delay:i*0.02 }}
                      className={cn("border-b border-[#F9FAFB] transition-colors",
                        isSel ? "bg-[#F0FDF4]" : "hover:bg-[#FAFAFA]"
                      )}>
                      <td className="pl-4 pr-2 py-3">
                        <input type="checkbox" checked={isSel}
                          onChange={(e) => { e.stopPropagation(); s.toggleSelect(d.id) }}
                          className="rounded border-[#D1D5DB] accent-[#17B890] cursor-pointer" />
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-[12px] font-bold text-[#111827] max-w-[175px] leading-snug">{d.title}</p>
                        <p className="text-[10px] text-[#8FA3A0] mt-0.5">{d.id} · {d.taskId}</p>
                      </td>
                      <td className="px-3 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black bg-[#F3E8FF] text-[#9333EA] rounded px-1.5 py-0.5">Giver</span>
                            <span className="text-[11.5px] text-[#374151]">{d.giver}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black bg-[#DBEAFE] text-[#2563EB] rounded px-1.5 py-0.5">Doer</span>
                            <span className="text-[11.5px] text-[#374151]">{d.doer}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-[12.5px] font-bold text-[#111827]">₹{d.amount.toLocaleString("en-IN")}</p>
                        <p className="text-[10px] text-[#8FA3A0]">In escrow</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold rounded px-2 py-0.5"
                          style={{ backgroundColor:pri.bg, color:pri.text }}>
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor:pri.dot }} />
                          {d.priority}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="flex items-center gap-1.5 text-[11.5px] font-semibold" style={{ color:stCl }}>
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor:stCl }} />
                          {d.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <p className={cn("text-[11px] font-bold", d.slaOverdue ? "text-[#DC2626]" : "text-[#D97706]")}>{d.sla.split(" · ")[0]}</p>
                        {d.sla.split(" · ")[1] && <p className="text-[10px] text-[#8FA3A0]">{d.sla.split(" · ")[1]}</p>}
                      </td>
                      <td className="px-3 py-3 text-[12px] text-[#374151]">
                        {(() => {
                          const aid = s.assignments[d.id]
                          const name = aid ? (MOCK_TEAM.find((m) => m.id === aid)?.name ?? d.assignedTo) : d.assignedTo
                          return name ?? <span className="text-[#D1D5DB] italic text-[11px]">Not assigned</span>
                        })()}
                      </td>
                      <td className="px-3 py-3 text-[11.5px] text-[#8FA3A0]">{d.filedAt}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <motion.button
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                            onClick={() => router.push(`/disputes/${d.id}`)}
                            className="h-7 px-2.5 rounded-lg border border-[#E2E8E6] text-[11px] font-semibold text-[#374151] hover:bg-[#F5F8F7] transition-colors">
                            View
                          </motion.button>
                          {!d.assignedTo && !s.assignments[d.id] && (
                            <motion.button
                              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                              onClick={() => s.setAssignOpen(true, d.id)}
                              className="h-7 px-2.5 rounded-lg border border-[#E2E8E6] text-[11px] font-semibold text-[#374151] hover:bg-[#F5F8F7] transition-colors">
                              Assign
                            </motion.button>
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
            <span className="font-semibold text-[#374151]">{filtered.length}</span> cases
          </p>
          <div className="flex items-center gap-1">
            {[1,2,3].map((p) => (
              <button key={p} onClick={() => s.setPage(p)}
                className={cn("w-7 h-7 rounded text-[11px] font-medium",
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
