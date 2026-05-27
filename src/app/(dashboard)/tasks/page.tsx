"use client"

import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon, Download01Icon, Cancel01Icon, Clock01Icon,
  Calendar01Icon, ArrowRight01Icon, CheckmarkCircle02Icon,
  AlertDiamondIcon, ArrowDataTransferHorizontalIcon, MinusSignCircleIcon,
} from "@hugeicons/core-free-icons"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { FilterDropdown } from "@/components/shared/filter-dropdown"
import { useTasksStore } from "@/store/tasks-store"
import { MOCK_TASKS, TaskStatus } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── Status tab config ─────────────────────────────────────────────────────

const TABS: { value: TaskStatus | "All"; label: string; count: number }[] = [
  { value:"All",          label:"All",          count:3420 },
  { value:"Matching",     label:"Matching",     count:18   },
  { value:"In Progress",  label:"In Progress",  count:156  },
  { value:"Completed",    label:"Completed",    count:2891 },
  { value:"Disputed",     label:"Disputed",     count:24   },
  { value:"Force-Closed", label:"Force-Closed", count:11   },
]

const TAB_BADGE: Partial<Record<TaskStatus | "All", string>> = {
  Matching:"bg-[#FEF3C7] text-[#D97706]",
  Disputed:"bg-[#FEE2E2] text-[#DC2626]",
}

// ─── Status cell ───────────────────────────────────────────────────────────

function StatusCell({ status, nearbyDoers }: { status: TaskStatus; nearbyDoers?: number }) {
  if (status === "Matching") return (
    <div>
      <span className="flex items-center gap-1 text-[11.5px] font-semibold text-[#D97706]">
        <HugeiconsIcon icon={Clock01Icon} size={12} strokeWidth={2} />
        Matching · 4m left
      </span>
      {nearbyDoers && (
        <p className="flex items-center gap-1 text-[10px] text-[#8FA3A0] mt-0.5">
          <HugeiconsIcon icon={Clock01Icon} size={10} strokeWidth={1.5} />
          {nearbyDoers} doers nearby
        </p>
      )}
    </div>
  )
  if (status === "In Progress") return (
    <span className="flex items-center gap-1 text-[11.5px] font-semibold text-[#2563EB]">
      <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={12} strokeWidth={2} />
      In Progress
    </span>
  )
  if (status === "Completed") return (
    <span className="flex items-center gap-1 text-[11.5px] font-semibold text-[#17B890]">
      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} strokeWidth={2} />
      Completed
    </span>
  )
  if (status === "Disputed") return (
    <span className="flex items-center gap-1 text-[11.5px] font-semibold text-[#DC2626]">
      <HugeiconsIcon icon={AlertDiamondIcon} size={12} strokeWidth={2} />
      Disputed
    </span>
  )
  if (status === "Force-Closed") return (
    <span className="flex items-center gap-1 text-[11.5px] font-semibold text-[#6B7280]">
      <HugeiconsIcon icon={MinusSignCircleIcon} size={12} strokeWidth={2} />
      Force-Closed
    </span>
  )
  return <span className="text-[11.5px] text-[#374151]">{status}</span>
}

// ─── Export modal ──────────────────────────────────────────────────────────

function ExportModal() {
  const s = useTasksStore()
  const ROLES    = ["All Roles","Giver","Doer"]
  const STATUSES = ["All","Matching","In Progress","Completed","Disputed","Force Closed"]

  return (
    <AnimatePresence>
      {s.exportOpen && (
        <Dialog open={s.exportOpen} onOpenChange={s.setExportOpen}>
          <DialogContent showCloseButton={false} className="sm:max-w-[580px] rounded-2xl p-0 gap-0 overflow-hidden bg-white dark:bg-[#1C1C22] border dark:border-[#26262E]">
            <motion.div
              initial={{ opacity:0, scale:0.97, y:8 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.97, y:8 }}
              transition={{ duration:0.18, ease:[0.33,1,0.68,1] }}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#F3F4F6] dark:border-[#26262E]">
                <div>
                  <h2 className="text-[17px] font-bold text-[#111827] dark:text-[#E8E8E8]">Export tasks</h2>
                  <p className="text-[12.5px] text-[#8FA3A0] mt-0.5">Download a filtered snapshot of task records</p>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => s.setExportOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-[#F5F8F7] dark:hover:bg-[#26262E] flex items-center justify-center text-[#8FA3A0] transition-colors">
                  <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
                </motion.button>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* Scope */}
                <div>
                  <p className="text-[12px] font-semibold text-[#374151] mb-3">Export scope</p>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { id:"all",      title:"All tasks",       desc:"Export complete tasks with your status and column selections below",      foot:"4,817 tasks" },
                      { id:"filtered", title:"Current filters", desc:"Export only tasks matching your active role, city, and status filters",    foot:"No filters active" },
                    ] as const).map((opt) => (
                      <motion.button key={opt.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => s.setExportScope(opt.id)}
                        className={cn("flex flex-col gap-1.5 p-4 rounded-xl border text-left transition-all",
                          s.exportScope === opt.id ? "border-[#111827] bg-white shadow-sm" : "border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#D1D5DB]"
                        )}>
                        <div className="flex items-center justify-between">
                          <p className="text-[12.5px] font-bold text-[#111827]">{opt.title}</p>
                          <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center",
                            s.exportScope === opt.id ? "border-[#111827]" : "border-[#D1D5DB]"
                          )}>
                            {s.exportScope === opt.id && <div className="w-2 h-2 rounded-full bg-[#111827]" />}
                          </div>
                        </div>
                        <p className="text-[11.5px] text-[#8FA3A0] leading-snug">{opt.desc}</p>
                        <p className="text-[11px] font-semibold text-[#374151] pt-1 border-t border-[#F3F4F6]">{opt.foot}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Filters */}
                <div>
                  <p className="text-[12px] font-semibold text-[#374151] mb-3">Filter by</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-[#8FA3A0] uppercase tracking-wide mb-2">Role</p>
                      <div className="flex gap-2">{ROLES.map((r) => (
                        <motion.button key={r} whileTap={{ scale: 0.95 }}
                          onClick={() => s.setExportRole(r)}
                          className={cn("h-7 px-3 rounded-full text-[11.5px] font-medium border transition-colors",
                            s.exportRole === r ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-[#374151] border-[#E5E7EB] hover:border-[#D1D5DB]"
                          )}>{r}</motion.button>
                      ))}</div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#8FA3A0] uppercase tracking-wide mb-2">Task status</p>
                      <div className="flex gap-2 flex-wrap">{STATUSES.map((st) => (
                        <motion.button key={st} whileTap={{ scale: 0.95 }}
                          onClick={() => s.setExportStatus(st)}
                          className={cn("h-7 px-3 rounded-full text-[11.5px] font-medium border transition-colors",
                            s.exportStatus === st ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-[#374151] border-[#E5E7EB] hover:border-[#D1D5DB]"
                          )}>{st}</motion.button>
                      ))}</div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#8FA3A0] uppercase tracking-wide mb-2">Posted date</p>
                      <div className="flex items-center gap-3 h-9 px-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[12.5px] cursor-pointer hover:border-[#D1D5DB]">
                        <HugeiconsIcon icon={Calendar01Icon} size={13} strokeWidth={1.5} className="text-[#8FA3A0]" />
                        <span className="font-semibold text-[#374151] flex-1">All time</span>
                        <span className="text-[11px] text-[#8FA3A0]">Click to set range</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#F3F4F6] dark:border-[#26262E] bg-[#F9FAFB] dark:bg-[#141418]">
                <div className="flex items-center gap-3 text-[12px] text-[#8FA3A0]">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#17B890]" />~3,420 rows</span>
                  <span>~1.2 MB</span><span>ready in ~8s</span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={() => s.setExportOpen(false)}
                    className="h-9 px-4 rounded-xl border border-[#E5E7EB] dark:border-[#26262E] text-[12.5px] font-semibold text-[#374151] dark:text-[#9BA1A6] hover:bg-white dark:hover:bg-[#26262E] bg-[#F9FAFB] dark:bg-[#141418] transition-colors">Cancel</motion.button>
                  <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
                    onClick={() => s.setExportOpen(false)}
                    className="h-9 px-4 rounded-xl bg-[#111827] hover:bg-[#1f2937] dark:bg-[#17B890] dark:hover:bg-[#15a47d] text-white text-[12.5px] font-bold flex items-center gap-1.5 transition-colors">
                    <HugeiconsIcon icon={Download01Icon} size={13} strokeWidth={2} />Generate report
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

// ─── Page ───────────────────────────────────────────────────────────────────

export default function TasksPage() {
  const router = useRouter()
  const s = useTasksStore()

  const filtered = MOCK_TASKS.filter((t) => {
    const q = s.search.toLowerCase()
    if (q && !t.title.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q) && !(t.giver ?? "").toLowerCase().includes(q)) return false
    if (s.activeTab !== "All" && t.status !== s.activeTab) return false
    if (s.cityFilter !== "All Cities" && t.city !== s.cityFilter) return false
    if (s.roleFilter !== "All Roles") {
      // "Giver" matches tasks where giver is the one; "Doer" = tasks with a doer assigned
      if (s.roleFilter === "Doer" && !t.doer) return false
      if (s.roleFilter === "Giver" && !t.giver) return false
    }
    return true
  }).sort((a, b) => s.sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount)

  const pageData  = filtered.slice((s.page - 1) * s.rowsPerPage, s.page * s.rowsPerPage)
  const totalPages = Math.ceil(filtered.length / s.rowsPerPage)
  const allSel     = pageData.length > 0 && pageData.every((t) => s.selected.has(t.id))

  return (
    <div>
      {/* ── Page header ── */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22 }}
        className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#111827] dark:text-[#E8E8E8]">Tasks</h1>
          <p className="text-[12px] text-[#8FA3A0] mt-0.5">All tasks across the platform · monitor matching, intervene on disputes, force-close when needed</p>
        </div>
        <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
          onClick={() => s.setExportOpen(true)}
          className="flex items-center gap-1.5 h-8 px-3 border border-[#E2E8E6] dark:border-[#26262E] rounded-lg text-[12px] font-semibold text-[#374151] dark:text-[#9BA1A6] bg-white dark:bg-[#1C1C22] hover:bg-[#F5F8F7] dark:hover:bg-[#26262E] transition-colors mt-1">
          <HugeiconsIcon icon={Download01Icon} size={13} strokeWidth={1.5} />Export
        </motion.button>
      </motion.div>

      {/* ── Status tabs ── */}
      <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22, delay:0.04 }}
        className="flex bg-white dark:bg-[#141418] border border-[#E5E7EB] dark:border-[#26262E] rounded-t-xl overflow-x-auto">
        {TABS.map((t) => {
          const active = s.activeTab === t.value
          const badgeCls = TAB_BADGE[t.value] ?? (active ? "bg-[#111827] text-white" : "bg-[#F3F4F6] text-[#8FA3A0]")
          return (
            <motion.button key={t.value} whileTap={{ scale: 0.97 }}
              onClick={() => s.setActiveTab(t.value)}
              className={cn("flex items-center gap-1.5 px-4 py-3 text-[12.5px] font-medium border-b-2 whitespace-nowrap transition-colors",
                active ? "border-[#111827] dark:border-[#E8E8E8] text-[#111827] dark:text-[#E8E8E8] font-bold" : "border-transparent text-[#8FA3A0] hover:text-[#374151] dark:hover:text-[#9BA1A6]"
              )}>
              {t.label}
              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", active ? "bg-[#111827] text-white" : badgeCls)}>
                {t.count.toLocaleString()}
              </span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* ── Table card ── */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.28, delay:0.08 }}
        className="bg-white dark:bg-[#141418] border-l border-r border-b border-[#E5E7EB] dark:border-[#26262E] rounded-b-xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#F3F4F6] dark:border-[#26262E] flex-wrap">
          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} size={13} strokeWidth={1.5}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8FA3A0] pointer-events-none" />
            <input value={s.search} onChange={(e) => s.setSearch(e.target.value)}
              placeholder="Search by title, ID or name..."
              className="h-8 w-72 pl-8 pr-3 rounded-lg border border-[#E2E8E6] text-[12px] text-[#374151] outline-none focus:border-[#17B890] placeholder:text-[#C8D8D4]" />
          </div>
          <FilterDropdown label="All Roles"  options={["All Roles","Giver","Doer"]}                                          value={s.roleFilter}  onChange={s.setRoleFilter}  width={140} />
          <FilterDropdown label="All Cities" options={["All Cities","Mumbai","Bengaluru","Delhi NCR","Hyderabad","Pune","Chennai"]} value={s.cityFilter} onChange={s.setCityFilter} width={155} />
          <div className="ml-auto">
            <FilterDropdown label="Newest first" options={["Newest first","Oldest first","Highest value","Lowest value"]}  value={s.sortDir === "desc" ? "Newest first" : "Oldest first"} onChange={(v) => s.setSortDir(v === "Newest first" ? "desc" : "asc")} width={155} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F3F4F6] dark:border-[#26262E] bg-[#F9FAFB] dark:bg-[#1C1C22]">
                <th className="pl-4 pr-2 py-2.5 w-8">
                  <input type="checkbox" checked={allSel}
                    onChange={() => s.toggleSelectAll(pageData.map((t) => t.id))}
                    className="rounded border-[#D1D5DB] accent-[#17B890] cursor-pointer" />
                </th>
                {["TASK","CATEGORY","GIVER","DOER","AMOUNT","STATUS","POSTED"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-black tracking-wider text-[#8FA3A0] uppercase px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody key={`${s.activeTab}-${s.search}-${s.cityFilter}`}>
              <AnimatePresence mode="popLayout">
                {pageData.map((task, i) => {
                  const isSel = s.selected.has(task.id)
                  return (
                    <motion.tr key={task.id}
                      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                      transition={{ duration:0.14, delay:i * 0.02 }}
                      className={cn("border-b border-[#F9FAFB] dark:border-[#26262E] transition-colors cursor-pointer",
                        isSel ? "bg-[#F0FDF4] dark:bg-[#0A2A22]" : "hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C22]"
                      )}
                      onClick={() => router.push(`/tasks/${task.id}`)}
                    >
                      <td className="pl-4 pr-2 py-3" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={isSel}
                          onChange={() => s.toggleSelect(task.id)}
                          className="rounded border-[#D1D5DB] accent-[#17B890] cursor-pointer" />
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[12.5px] font-semibold text-[#111827] dark:text-[#E8E8E8] max-w-[200px] truncate">{task.title}</p>
                        <p className="text-[10.5px] text-[#8FA3A0]">{task.id}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#374151]">
                          🏷 {task.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#374151]">{task.giver}</td>
                      <td className="px-4 py-3 text-[12px] text-[#8FA3A0]">
                        {task.doer ?? <span className="italic text-[#D1D5DB]">None assigned</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12.5px] font-bold text-[#111827]">₹{task.amount.toLocaleString("en-IN")}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusCell status={task.status} nearbyDoers={task.nearbyDoers} />
                      </td>
                      <td className="px-4 py-3 text-[11.5px] text-[#8FA3A0]">{task.postedAt}</td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#F3F4F6] dark:border-[#26262E]">
          <p className="text-[12px] text-[#8FA3A0]">
            Showing <span className="font-semibold text-[#374151] dark:text-[#9BA1A6]">{(s.page-1)*s.rowsPerPage+1}–{Math.min(s.page*s.rowsPerPage,filtered.length)}</span> of{" "}
            <span className="font-semibold text-[#374151]">{filtered.length.toLocaleString()}</span> tasks
          </p>
          <div className="flex items-center gap-1">
            <motion.button whileTap={{ scale: 0.94 }}
              onClick={() => s.page>1 && s.setPage(s.page-1)} disabled={s.page===1}
              className="w-7 h-7 rounded text-[11px] text-[#374151] hover:bg-[#F5F8F7] disabled:opacity-30">‹</motion.button>
            {[1,2,3,4].map((p) => (
              <motion.button key={p} whileTap={{ scale: 0.92 }}
                whileHover={s.page !== p ? { scale: 1.08 } : {}}
                onClick={() => s.setPage(p)}
                className={cn("w-7 h-7 rounded text-[11px] font-medium transition-colors",
                  s.page===p ? "bg-[#111827] text-white" : "text-[#374151] hover:bg-[#F5F8F7]"
                )}>{p}</motion.button>
            ))}
            <span className="w-7 h-7 flex items-center justify-center text-[11px] text-[#8FA3A0]">…</span>
            <motion.button whileTap={{ scale: 0.92 }}
              onClick={() => s.setPage(342)}
              className={cn("w-7 h-7 rounded text-[11px] font-medium", s.page===342?"bg-[#111827] text-white":"text-[#374151] hover:bg-[#F5F8F7]")}>342</motion.button>
            <motion.button whileTap={{ scale: 0.94 }}
              onClick={() => s.page<totalPages && s.setPage(s.page+1)} disabled={s.page>=totalPages}
              className="w-7 h-7 rounded text-[11px] text-[#374151] hover:bg-[#F5F8F7] disabled:opacity-30">›</motion.button>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#8FA3A0]">
            Rows
            <select className="border border-[#E2E8E6] rounded-lg h-7 px-2 text-[11px] text-[#374151] outline-none bg-white">
              <option>10</option><option>25</option><option>50</option>
            </select>
          </div>
        </div>
      </motion.div>

      <ExportModal />
    </div>
  )
}
