"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Add01Icon, ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { FilterDropdown } from "@/components/shared/filter-dropdown"
import { useTeamStore, RoleTab } from "@/store/team-store"
import { useAlertStore } from "@/store/alert-store"
import { MOCK_TEAM, TeamRole } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const ITEMS_PER_PAGE = 12

// ─── Role badge styles ─────────────────────────────────────────────────────

const ROLE_STYLE: Record<TeamRole, { badge:string; bg:string }> = {
  "Super Admin":   { badge:"bg-[#F3E8FF] text-[#9333EA] border border-[#E9D5FF]", bg:"bg-[#F3E8FF]" },
  "Admin":         { badge:"bg-[#E8F7F3] text-[#17B890] border border-[#A8DFD0]", bg:"bg-[#E8F7F3]" },
  "Support Agent": { badge:"bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]", bg:"bg-[#F3F4F6]" },
  "Viewer":        { badge:"bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB]", bg:"bg-[#F9FAFB]" },
}

// ─── KPI strip ─────────────────────────────────────────────────────────────

const KPI = [
  { label:"Total Team",     value:"8",   sub:"Across 4 roles",          valueColor:"#111827" },
  { label:"Online Now",     value:"5",   sub:"0 offline",               valueColor:"#17B890" },
  { label:"Actions Today",  value:"342", sub:"↑ 18% vs yesterday",      valueColor:"#111827" },
  { label:"Pending Invites",value:"3",   sub:"1 expired · needs resend", valueColor:"#D97706" },
]

// ─── Role tabs ─────────────────────────────────────────────────────────────

const ROLE_TABS: RoleTab[] = ["All members","Super Admin","Admin","Support Agent","Viewer"]

const TAB_LABEL: Record<string, string> = {
  "All members":  "All members",
  "Super Admin":  "Super Admins",
  "Admin":        "Admins",
  "Support Agent":"Agents",
  "Viewer":       "Viewers",
}

// ─── Member Card ───────────────────────────────────────────────────────────

function MemberCard({ member }: { member: typeof MOCK_TEAM[0] }) {
  const rs = ROLE_STYLE[member.role as TeamRole] ?? ROLE_STYLE["Viewer"]

  return (
    <motion.div
      layout
      initial={{ opacity:0, y:8 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, y:-4 }}
      transition={{ duration:0.18 }}
      whileHover={{ y:-2, boxShadow:"0 4px 14px rgba(0,0,0,0.06)" }}
      className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3"
    >
      {/* Avatar + name */}
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[13px] font-bold text-[#374151]">
            {member.name.split(" ").map(n => n[0]).join("")}
          </div>
          {/* Online dot */}
          <div className={cn(
            "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
            member.isOnline ? "bg-[#22C55E]" : "bg-[#D1D5DB]"
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-[#111827] truncate">{member.name}</p>
          <p className="text-[11px] text-[#8FA3A0] truncate">{member.email}</p>
          <p className="text-[11px] text-[#8FA3A0] truncate">{member.phone}</p>
        </div>
      </div>

      {/* Role badge */}
      <span className={cn("self-start text-[10px] font-bold rounded-full px-2.5 py-0.5", rs.badge)}>
        {member.role}
      </span>

      {/* Permission chips */}
      <div className="flex flex-wrap gap-1">
        {member.permissions.slice(0, 6).map((p) => (
          <span key={p} className="border border-[#E5E7EB] text-[10px] font-medium text-[#374151] rounded-md px-1.5 py-0.5 bg-white">
            {p}
          </span>
        ))}
        {member.permissions.length > 6 && (
          <span className="text-[10px] text-[#8FA3A0] px-1 py-0.5">+{member.permissions.length - 6}</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-[#F3F4F6] mt-auto">
        <p className="text-[10.5px] text-[#8FA3A0]">Last action: {member.lastAction}</p>
        <button className="text-[11px] font-bold text-[#17B890] hover:underline flex items-center gap-0.5 transition-colors">
          View profile →
        </button>
      </div>
    </motion.div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const router  = useRouter()
  const s       = useTeamStore()
  const alert   = useAlertStore()
  const [page, setPage] = useState(1)

  // Filter members
  const filtered = MOCK_TEAM.filter((m) => {
    const matchTab    = s.activeTab === "All members" || m.role === s.activeTab
    const q           = s.search.toLowerCase()
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    return matchTab && matchSearch
  })

  const totalPages  = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const pageMembers = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [s.activeTab, s.search])

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
              k.sub.startsWith("↑") ? "text-[#17B890]" : k.sub.includes("expired") ? "text-[#D97706]" : "text-[#8FA3A0]"
            )}>{k.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Role tabs + actions bar */}
      <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22, delay:0.04 }}
        className="flex items-center bg-white border border-[#E5E7EB] rounded-t-xl overflow-x-auto">
        {/* Tabs */}
        <div className="flex flex-1">
          {ROLE_TABS.map((t) => (
            <motion.button key={t}
              whileTap={{ scale: 0.97 }}
              onClick={() => s.setActiveTab(t)}
              className={cn("flex items-center gap-1.5 px-4 py-3 text-[12.5px] font-medium border-b-2 whitespace-nowrap transition-colors",
                s.activeTab === t ? "border-[#111827] text-[#111827] font-bold" : "border-transparent text-[#8FA3A0] hover:text-[#374151]"
              )}>
              {TAB_LABEL[t] ?? t}
            </motion.button>
          ))}
        </div>

        {/* New invite */}
        <div className="px-4 py-2 shrink-0 border-l border-[#F3F4F6]">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link href="/team/invite"
              className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#111827] hover:bg-[#1f2937] text-white text-[12px] font-bold transition-colors">
              <HugeiconsIcon icon={Add01Icon} size={13} strokeWidth={2} />
              New invite
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Search + sort */}
      <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22, delay:0.06 }}
        className="flex items-center gap-2 px-4 py-3 bg-white border-l border-r border-[#E5E7EB] border-b border-b-[#F3F4F6]">
        <div className="relative flex-1 max-w-xs">
          <HugeiconsIcon icon={Search01Icon} size={13} strokeWidth={1.5}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8FA3A0] pointer-events-none" />
          <input value={s.search} onChange={(e) => s.setSearch(e.target.value)}
            placeholder="Search team member by name or email..."
            className="w-full h-8 pl-8 pr-3 rounded-lg border border-[#E2E8E6] text-[12px] outline-none focus:border-[#17B890] placeholder:text-[#C8D8D4]" />
        </div>
        <div className="ml-auto">
          <FilterDropdown label="Sort: Last active"
            options={["Sort: Last active","Sort: Name A–Z","Sort: Role","Sort: Online first"]}
            value={s.sortBy} onChange={s.setSortBy} width={190} />
        </div>
      </motion.div>

      {/* Member cards grid */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.26, delay:0.08 }}
        className="bg-[#F8FAFB] border-l border-r border-[#E5E7EB] p-4">
        <AnimatePresence mode="popLayout">
          {pageMembers.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {pageMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[13px] font-semibold text-[#8FA3A0]">No members found</p>
              <p className="text-[12px] text-[#D1D5DB] mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white border-l border-r border-b border-[#E5E7EB] rounded-b-xl px-4 py-3 flex items-center justify-between">
          <p className="text-[12px] text-[#8FA3A0]">
            Showing <span className="font-semibold text-[#374151]">{(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span> of{" "}
            <span className="font-semibold text-[#374151]">{filtered.length}</span> members
          </p>
          <div className="flex items-center gap-1">
            {/* Prev */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 rounded flex items-center justify-center text-[#374151] hover:bg-[#F5F8F7] disabled:opacity-30 transition-colors"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={12} strokeWidth={2.5} />
            </motion.button>

            {/* Page numbers — Google-style */}
            {(() => {
              const pages: (number | "…")[] = []
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i)
              } else {
                pages.push(1)
                if (page > 3) pages.push("…")
                const start = Math.max(2, page - 1)
                const end   = Math.min(totalPages - 1, page + 1)
                for (let i = start; i <= end; i++) pages.push(i)
                if (page < totalPages - 2) pages.push("…")
                pages.push(totalPages)
              }
              return pages.map((p, i) =>
                p === "…" ? (
                  <span key={`e${i}`} className="w-7 h-7 flex items-center justify-center text-[12px] text-[#8FA3A0]">…</span>
                ) : (
                  <motion.button
                    key={p}
                    whileHover={page !== p ? { scale: 1.08 } : {}}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setPage(p as number)}
                    className={cn(
                      "w-7 h-7 rounded text-[12px] font-medium transition-colors",
                      page === p ? "bg-[#111827] text-white" : "text-[#374151] hover:bg-[#F5F8F7]"
                    )}
                  >
                    {p}
                  </motion.button>
                )
              )
            })()}

            {/* Next */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 rounded flex items-center justify-center text-[#374151] hover:bg-[#F5F8F7] disabled:opacity-30 transition-colors"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={2.5} />
            </motion.button>
          </div>
          <div className="w-[140px]" /> {/* spacer for alignment */}
        </div>
      )}
      {totalPages <= 1 && (
        <div className="bg-white border-l border-r border-b border-[#E5E7EB] rounded-b-xl px-4 py-3">
          <p className="text-[12px] text-[#8FA3A0]">
            Showing <span className="font-semibold text-[#374151]">{filtered.length}</span> member{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* ── Pending invitations table ── */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.28, delay:0.12 }}
        className="mt-4 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F3F4F6]">
          <div>
            <p className="text-[13px] font-bold text-[#111827]">Pending invitations</p>
            <p className="text-[11.5px] text-[#8FA3A0] mt-0.5">{s.invites.length} sent, awaiting acceptance</p>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
              {["EMAIL","ROLE INVITED AS","INVITED BY","SENT","EXPIRES","STATUS","ACTIONS"].map((h) => (
                <th key={h} className="text-left text-[10px] font-black tracking-wider text-[#8FA3A0] uppercase px-4 py-2.5 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {s.invites.map((inv) => {
                const isExpired = inv.status === "Expired"
                return (
                  <motion.tr key={inv.id}
                    layout
                    initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                    transition={{ duration:0.18 }}
                    className="border-b border-[#F9FAFB] last:border-0 hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-4 py-3 text-[12.5px] font-semibold text-[#374151]">{inv.email}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[10.5px] font-semibold border rounded-full px-2.5 py-0.5",
                        ROLE_STYLE[inv.role]?.badge ?? "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]"
                      )}>{inv.role}</span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#374151]">{inv.invitedBy}</td>
                    <td className="px-4 py-3 text-[12px] text-[#8FA3A0]">{inv.sentAt}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[12px] font-semibold", isExpired ? "text-[#EF4444]" : "text-[#374151]")}>
                        {inv.expiresAt}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[11.5px] font-semibold",
                        isExpired ? "text-[#EF4444]" : "text-[#17B890]"
                      )}>{inv.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            s.resendInvite(inv.id)
                            alert.show("success", `Invite resent to ${inv.email}`)
                          }}
                          className={cn("h-7 px-2.5 rounded-lg border text-[11px] font-semibold transition-colors",
                            isExpired
                              ? "border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2]"
                              : "border-[#E2E8E6] text-[#374151] hover:bg-[#F5F8F7]"
                          )}>Resend</button>
                        <button
                          onClick={() => {
                            s.cancelInvite(inv.id)
                            alert.show("info", `Invitation to ${inv.email} cancelled`)
                          }}
                          className="h-7 px-2.5 rounded-lg border border-[#E2E8E6] text-[11px] font-semibold text-[#8FA3A0] hover:bg-[#F5F8F7] hover:text-[#374151] transition-colors">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
