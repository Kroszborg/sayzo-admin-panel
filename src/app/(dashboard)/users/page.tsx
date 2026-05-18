"use client"

import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon, Download01Icon, Cancel01Icon, Clock01Icon,
  ArrowUp01Icon, ArrowDown01Icon, CheckmarkCircle02Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { FilterDropdown } from "@/components/shared/filter-dropdown"
import { useUsersStore } from "@/store/users-store"
import { MOCK_USERS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── Types ─────────────────────────────────────────────────────────────────

function TrustBar({ score }: { score: number }) {
  const color = score >= 70 ? "#17B890" : score >= 50 ? "#F59E0B" : "#EF4444"
  return (
    <div className="flex items-center gap-2">
      <span className="text-[13px] font-bold tabular-nums" style={{ color, minWidth:24 }}>{score}</span>
      <div className="w-14 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden shrink-0">
        <motion.div className="h-full rounded-full" style={{ backgroundColor:color }}
          initial={{ width:0 }} animate={{ width:`${score}%` }} transition={{ duration:0.7, ease:[0.33,1,0.68,1] }} />
      </div>
    </div>
  )
}

const ROLE_STYLE: Record<string, string> = {
  "Giver": "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]",
  "Doer":  "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]",
  "Both":  "bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]",
}

const STATUS_STYLE: Record<string, { dot: string; text: string }> = {
  "Active":       { dot:"#22C55E", text:"text-[#16A34A]"  },
  "Suspended":    { dot:"#F59E0B", text:"text-[#D97706]"  },
  "Shadow Banned":{ dot:"#9CA3AF", text:"text-[#6B7280]"  },
  "Banned":       { dot:"#EF4444", text:"text-[#DC2626]"  },
  "Pending KYC":  { dot:"#8FA3A0", text:"text-[#6B7280]"  },
}

// ─── Export Modal ──────────────────────────────────────────────────────────

function ExportModal() {
  const { exportOpen, exportScope, exportRole, exportStatus,
          setExportOpen, setExportScope, setExportRole, setExportStatus } = useUsersStore()

  const ROLES    = ["All","Giver","Doer","Both"]
  const STATUSES = ["All","Active","Suspended","Banned"]

  return (
    <AnimatePresence>
      {exportOpen && (
        <Dialog open={exportOpen} onOpenChange={setExportOpen}>
          <DialogContent showCloseButton={false} className="sm:max-w-[540px] rounded-2xl p-0 overflow-hidden gap-0">
            <motion.div
              initial={{ opacity:0, scale:0.97, y:8 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.97, y:8 }}
              transition={{ duration:0.18, ease:[0.33,1,0.68,1] }}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#F3F4F6]">
                <div>
                  <h2 className="text-[17px] font-bold text-[#111827]">Export users</h2>
                  <p className="text-[12.5px] text-[#8FA3A0] mt-0.5">Download a filtered CSV of user records</p>
                </div>
                <button onClick={() => setExportOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-[#F5F8F7] flex items-center justify-center text-[#8FA3A0] hover:text-[#374151]">
                  <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* Scope */}
                <div>
                  <p className="text-[12px] font-semibold text-[#374151] mb-3">Export scope</p>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { id:"all",      title:"All users",        desc:"Export the complete user database with your column selections below", foot:"24,817 users" },
                      { id:"filtered", title:"Current filters",  desc:"Export only users matching your active role, status, and city filters",   foot:"No filters active" },
                    ] as const).map((opt) => (
                      <button key={opt.id} onClick={() => setExportScope(opt.id)}
                        className={cn("flex flex-col gap-1.5 p-4 rounded-xl border text-left transition-all",
                          exportScope === opt.id
                            ? "border-[#111827] bg-white shadow-sm"
                            : "border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#D1D5DB]"
                        )}>
                        <div className="flex items-center justify-between">
                          <p className="text-[12.5px] font-bold text-[#111827]">{opt.title}</p>
                          <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center",
                            exportScope === opt.id ? "border-[#111827]" : "border-[#D1D5DB]"
                          )}>
                            {exportScope === opt.id && <div className="w-2 h-2 rounded-full bg-[#111827]" />}
                          </div>
                        </div>
                        <p className="text-[11.5px] text-[#8FA3A0] leading-snug">{opt.desc}</p>
                        <p className="text-[11px] font-semibold text-[#374151] pt-1 border-t border-[#F3F4F6]">{opt.foot}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter by */}
                <div>
                  <p className="text-[12px] font-semibold text-[#374151] mb-3">Filter by</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-[#8FA3A0] uppercase tracking-wide mb-2">Role</p>
                      <div className="flex gap-2 flex-wrap">
                        {ROLES.map((r) => (
                          <button key={r} onClick={() => setExportRole(r)}
                            className={cn("h-7 px-3 rounded-full text-[11.5px] font-medium border transition-colors",
                              exportRole === r ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-[#374151] border-[#E5E7EB] hover:border-[#D1D5DB]"
                            )}>{r}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#8FA3A0] uppercase tracking-wide mb-2">Status</p>
                      <div className="flex gap-2 flex-wrap">
                        {STATUSES.map((s) => (
                          <button key={s} onClick={() => setExportStatus(s)}
                            className={cn("h-7 px-3 rounded-full text-[11.5px] font-medium border transition-colors",
                              exportStatus === s ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-[#374151] border-[#E5E7EB] hover:border-[#D1D5DB]"
                            )}>{s}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date range */}
                <div>
                  <p className="text-[12px] font-semibold text-[#374151] mb-2">Joined date</p>
                  <div className="flex items-center gap-3 h-9 px-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[12.5px] text-[#374151] cursor-pointer hover:border-[#D1D5DB]">
                    <HugeiconsIcon icon={Calendar01Icon} size={13} strokeWidth={1.5} className="text-[#8FA3A0]" />
                    <span className="font-semibold flex-1">All time</span>
                    <span className="text-[11px] text-[#8FA3A0]">Click to set range</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#F3F4F6] bg-[#F9FAFB]">
                <div className="flex items-center gap-3 text-[12px] text-[#8FA3A0]">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#17B890]" />~3,420 rows</span>
                  <span>~1.2 MB</span>
                  <span>ready in ~8s</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setExportOpen(false)}
                    className="h-9 px-4 rounded-xl border border-[#E5E7EB] text-[12.5px] font-semibold text-[#374151] hover:bg-white bg-[#F9FAFB]">Cancel</button>
                  <button onClick={() => setExportOpen(false)}
                    className="h-9 px-4 rounded-xl bg-[#111827] hover:bg-[#1f2937] text-white text-[12.5px] font-bold flex items-center gap-1.5">
                    <HugeiconsIcon icon={Download01Icon} size={13} strokeWidth={2} />
                    Generate report
                  </button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

// ─── Sort header ────────────────────────────────────────────────────────────

interface SortThProps {
  col: string; label: string
  sortCol: string; sortDir: "asc" | "desc"
  onSort: (col: string, dir: "asc" | "desc") => void
}
function SortTh({ col, label, sortCol, sortDir, onSort }: SortThProps) {
  const active = sortCol === col
  return (
    <th className="text-left py-2.5 px-4 cursor-pointer select-none"
      onClick={() => onSort(col, active && sortDir === "asc" ? "desc" : "asc")}>
      <div className="flex items-center gap-1 text-[10px] font-black tracking-wider text-[#8FA3A0] uppercase">
        {label}
        {active && (
          <HugeiconsIcon icon={sortDir === "asc" ? ArrowUp01Icon : ArrowDown01Icon}
            size={10} strokeWidth={2} className="text-[#374151]" />
        )}
      </div>
    </th>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const router = useRouter()
  const store  = useUsersStore()

  // Filter + sort
  const filtered = MOCK_USERS.filter((u) => {
    const q = store.search.toLowerCase()
    if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.id.toLowerCase().includes(q) && !u.phone.includes(q)) return false
    if (store.roleFilter !== "All Roles") {
      // "Giver" → "Task Giver", "Doer" → "Task Doer", "Both" → "Both"
      const roleMap: Record<string, string> = { "Giver":"Task Giver", "Doer":"Task Doer", "Both":"Both" }
      const expected = roleMap[store.roleFilter] ?? store.roleFilter
      if (u.role !== expected) return false
    }
    if (store.cityFilter !== "All Cities" && u.city !== store.cityFilter) return false
    return true
  }).sort((a, b) => {
    const dir = store.sortDir === "asc" ? 1 : -1
    if (store.sortCol === "trust") return (a.trustScore - b.trustScore) * dir
    if (store.sortCol === "tasks") return (a.tasks - b.tasks) * dir
    return a.name.localeCompare(b.name) * dir
  })

  const pageData = filtered.slice((store.page - 1) * store.rowsPerPage, store.page * store.rowsPerPage)
  const totalPages = Math.ceil(filtered.length / store.rowsPerPage)
  const allSelected = pageData.length > 0 && pageData.every((u) => store.selected.has(u.id))

  const STATS = [
    { label:"TOTAL USERS",       value:"24,817", sub:"↑ +342 today",    valueColor:"#111827", subColor:"#17B890" },
    { label:"TASK DOERS",        value:"18,204", sub:"73.4% of total",  valueColor:"#111827", subColor:"#8FA3A0" },
    { label:"TASK GIVERS",       value:"6,613",  sub:"26.6% of total",  valueColor:"#17B890", subColor:"#8FA3A0" },
    { label:"SUSPENDED / BANNED",value:"83",     sub:"0.33% of total",  valueColor:"#EF4444", subColor:"#8FA3A0" },
  ]

  return (
    <div>
      {/* ── KPI strip ── */}
      <motion.div
        initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.25 }}
        className="flex bg-white border border-[#E5E7EB] rounded-xl overflow-hidden mb-4"
      >
        {STATS.map((s, i) => (
          <div key={s.label} className={cn("flex-1 px-6 py-4", i < STATS.length - 1 && "border-r border-[#F3F4F6]")}>
            <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-1">{s.label}</p>
            <p className="text-[22px] font-extrabold leading-tight" style={{ color: s.valueColor }}>{s.value}</p>
            <p className="text-[11px] font-semibold mt-0.5" style={{ color: s.subColor }}>{s.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Table card ── */}
      <motion.div
        initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3, delay:0.06 }}
        className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden"
      >
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#F3F4F6] flex-wrap">
          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} size={13} strokeWidth={1.5}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8FA3A0] pointer-events-none" />
            <input
              value={store.search}
              onChange={(e) => store.setSearch(e.target.value)}
              placeholder="Search by name, phone, email, UID..."
              className="h-8 w-72 pl-8 pr-3 rounded-lg border border-[#E2E8E6] text-[12px] text-[#374151] outline-none focus:border-[#17B890] placeholder:text-[#C8D8D4] transition-colors"
            />
          </div>
          <FilterDropdown label="All Roles"  options={["All Roles","Giver","Doer","Both"]}                                            value={store.roleFilter}   onChange={store.setRoleFilter}   width={140} />
          <FilterDropdown label="Availability" options={["Availability","Available","Busy","Offline"]}                               value={store.availFilter}  onChange={store.setAvailFilter}  width={140} />
          <FilterDropdown label="All Cities" options={["All Cities","Mumbai","Bengaluru","Delhi NCR","Hyderabad","Pune","Chennai","Ahmedabad","Kolkata"]} value={store.cityFilter} onChange={store.setCityFilter} width={165} />
          <FilterDropdown label="Joined Time" options={["Joined Time","Last 7 days","Last 30 days","Last 3 months","Last year"]}      value={store.joinedFilter} onChange={store.setJoinedFilter} width={165} />
          <button
            onClick={() => store.setExportOpen(true)}
            className="ml-auto flex items-center gap-1.5 h-8 px-3 border border-[#E2E8E6] rounded-lg text-[12px] font-semibold text-[#374151] hover:bg-[#F5F8F7] transition-colors"
          >
            <HugeiconsIcon icon={Download01Icon} size={13} strokeWidth={1.5} />
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                <th className="pl-4 pr-2 py-2.5 w-8">
                  <input type="checkbox" checked={allSelected}
                    onChange={() => store.toggleSelectAll(pageData.map((u) => u.id))}
                    className="rounded border-[#D1D5DB] accent-[#17B890] cursor-pointer" />
                </th>
                <SortTh col="name"  label="Users"       sortCol={store.sortCol} sortDir={store.sortDir} onSort={store.setSort} />
                <th className="text-left text-[10px] font-black tracking-wider text-[#8FA3A0] uppercase px-4 py-2.5">Role</th>
                <th className="text-left text-[10px] font-black tracking-wider text-[#8FA3A0] uppercase px-4 py-2.5">Status</th>
                <th className="text-left text-[10px] font-black tracking-wider text-[#8FA3A0] uppercase px-4 py-2.5">City</th>
                <SortTh col="trust" label="Trust Score ↑" sortCol={store.sortCol} sortDir={store.sortDir} onSort={store.setSort} />
                <SortTh col="tasks" label="Tasks"        sortCol={store.sortCol} sortDir={store.sortDir} onSort={store.setSort} />
                <th className="text-left text-[10px] font-black tracking-wider text-[#8FA3A0] uppercase px-4 py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {pageData.map((u, i) => {
                  const initials  = u.name.split(" ").map((n) => n[0]).join("").slice(0,2)
                  const roleLabel = u.role === "Task Doer" ? "Doer" : u.role === "Task Giver" ? "Giver" : "Both"
                  const taskWord  = u.role === "Task Doer" ? "completed" : u.role === "Task Giver" ? "posted" : "total"
                  const ss        = STATUS_STYLE[u.status] ?? STATUS_STYLE["Active"]
                  const isSelected = store.selected.has(u.id)

                  return (
                    <motion.tr key={u.id}
                      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                      transition={{ duration:0.15, delay: i * 0.02 }}
                      className={cn("border-b border-[#F9FAFB] transition-colors",
                        isSelected ? "bg-[#F0FDF4]" : "hover:bg-[#FAFAFA]"
                      )}>
                      <td className="pl-4 pr-2 py-3">
                        <input type="checkbox" checked={isSelected}
                          onChange={() => store.toggleSelect(u.id)}
                          className="rounded border-[#D1D5DB] accent-[#17B890] cursor-pointer" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#17B890] to-[#3B82F6] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="text-[12.5px] font-semibold text-[#111827]">{u.name}</p>
                            <p className="text-[10.5px] text-[#8FA3A0]">{u.id} · {u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-block text-[10.5px] font-semibold border rounded-full px-2.5 py-0.5",
                          ROLE_STYLE[roleLabel] ?? "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]"
                        )}>
                          {roleLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor:ss.dot }} />
                          <span className={cn("text-[12px] font-medium", ss.text)}>{u.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#374151]">{u.city}</td>
                      <td className="px-4 py-3"><TrustBar score={u.trustScore} /></td>
                      <td className="px-4 py-3 text-[12px] text-[#374151]">
                        <span className="font-semibold">{u.tasks}</span>
                        <span className="text-[#8FA3A0]"> {taskWord}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => router.push(`/users/${u.id}`)}
                          className="h-7 px-3 rounded-lg border border-[#E2E8E6] text-[11.5px] font-semibold text-[#374151] hover:bg-[#F5F8F7] hover:border-[#D1D5DB] transition-all"
                        >
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
            Showing <span className="font-semibold text-[#374151]">{(store.page - 1) * store.rowsPerPage + 1}–{Math.min(store.page * store.rowsPerPage, filtered.length)}</span> of{" "}
            <span className="font-semibold text-[#374151]">{filtered.length.toLocaleString()}</span> Users
          </p>

          <div className="flex items-center gap-1">
            <button onClick={() => store.setPage(Math.max(1, store.page - 1))}
              disabled={store.page === 1}
              className="w-7 h-7 rounded text-[11px] text-[#374151] hover:bg-[#F5F8F7] disabled:opacity-30 transition-colors">‹</button>
            {Array.from({ length: Math.min(totalPages, 4) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => store.setPage(p)}
                className={cn("w-7 h-7 rounded text-[11px] font-medium transition-colors",
                  store.page === p ? "bg-[#111827] text-white" : "text-[#374151] hover:bg-[#F5F8F7]"
                )}>
                {p}
              </button>
            ))}
            {totalPages > 4 && (
              <>
                <span className="w-7 h-7 flex items-center justify-center text-[11px] text-[#8FA3A0]">…</span>
                <button onClick={() => store.setPage(totalPages)}
                  className={cn("w-7 h-7 rounded text-[11px] font-medium transition-colors",
                    store.page === totalPages ? "bg-[#111827] text-white" : "text-[#374151] hover:bg-[#F5F8F7]"
                  )}>{totalPages}</button>
              </>
            )}
            <button onClick={() => store.setPage(Math.min(totalPages, store.page + 1))}
              disabled={store.page >= totalPages}
              className="w-7 h-7 rounded text-[11px] text-[#374151] hover:bg-[#F5F8F7] disabled:opacity-30 transition-colors">›</button>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-[#8FA3A0]">
            Rows
            <select defaultValue={store.rowsPerPage}
              onChange={(e) => { store.setPage(1) }}
              className="border border-[#E2E8E6] rounded-lg h-7 px-2 text-[11px] text-[#374151] outline-none bg-white appearance-none cursor-pointer">
              <option>10</option><option>25</option><option>50</option>
            </select>
          </div>
        </div>
      </motion.div>

      <ExportModal />
    </div>
  )
}
