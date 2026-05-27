"use client"

import { useState } from "react"
import { MOCK_USERS, MOCK_TASKS, MOCK_ACTIVITY } from "@/lib/mock-data"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SmartPhone01Icon, Mail01Icon, Location01Icon, AlertDiamondIcon,
  CheckmarkCircle02Icon, ShieldIcon,
} from "@hugeicons/core-free-icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// ─── Take Action Modal ─────────────────────────────────────────────────────

function TakeActionModal({ open, onClose, userName, userId }: { open: boolean; onClose: () => void; userName: string; userId: string }) {
  const [action,   setAction]   = useState("warn")
  const [reason,   setReason]   = useState("")
  const [category, setCategory] = useState("Policy violation")
  const [duration, setDuration] = useState("7")

  const ACTIONS = [
    { id:"warn",    label:"Send warning",         desc:"Send a formal platform warning to user",          color:"text-[#374151]",  danger:false },
    { id:"suspend", label:"Suspend account",       desc:"Block platform access for selected duration",      color:"text-[#D97706]",  danger:false },
    { id:"shadow",  label:"Shadow ban",            desc:"User activity hidden from others without notice",  color:"text-[#6B7280]",  danger:false },
    { id:"ban",     label:"Ban user",              desc:"Permanently revoke platform access",               color:"text-[#DC2626]",  danger:true  },
    { id:"force",   label:"Force-close tasks",     desc:"Immediately close all of this user's active tasks",color:"text-[#DC2626]",  danger:true  },
  ]

  const CATEGORIES = ["Policy violation","Trust & Safety","Payment dispute","Fraud suspicion","Content violation","Other"]
  const isDestructive = action === "ban" || action === "force"

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-[#F3F4F6]">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-bold text-[#111827]">Take action on this user</DialogTitle>
          </DialogHeader>
          <p className="text-[11.5px] text-[#8FA3A0] mt-0.5">Acting as Aarav Sharma · Admin on {userName} {userId}</p>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Action choices */}
          <div>
            <p className="text-[10px] font-black tracking-[0.16em] text-[#8FA3A0] uppercase mb-2">Choose action</p>
            <div className="space-y-1.5">
              {ACTIONS.map((a) => (
                <button key={a.id} onClick={() => setAction(a.id)}
                  className={cn("w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all",
                    action === a.id
                      ? (a.danger ? "border-[#EF4444] bg-[#FEF2F2]" : "border-[#111827] bg-[#F9FAFB]")
                      : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                  )}>
                  <div className={cn("w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center",
                    action === a.id ? (a.danger ? "border-[#EF4444]" : "border-[#111827]") : "border-[#D1D5DB]"
                  )}>
                    {action === a.id && <div className={cn("w-2 h-2 rounded-full", a.danger ? "bg-[#EF4444]" : "bg-[#111827]")} />}
                  </div>
                  <div>
                    <p className={cn("text-[12.5px] font-semibold", a.color)}>{a.label}</p>
                    <p className="text-[11px] text-[#8FA3A0]">{a.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reason + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#374151] uppercase tracking-wide mb-1.5">Reason</label>
              <input value={reason} onChange={(e) => setReason(e.target.value)}
                placeholder="Brief reason..."
                className="w-full h-8 px-3 rounded-lg border border-[#E2E8E6] text-[12px] text-[#374151] outline-none focus:border-[#17B890] placeholder:text-[#C8D8D4]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#374151] uppercase tracking-wide mb-1.5">Reason category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg border border-[#E2E8E6] text-[12px] text-[#374151] outline-none focus:border-[#17B890] bg-white appearance-none cursor-pointer">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Duration — only for suspend */}
          {action === "suspend" && (
            <div>
              <label className="block text-[10px] font-bold text-[#374151] uppercase tracking-wide mb-1.5">Duration (days)</label>
              <div className="flex gap-2">
                {["7","14","30","60","90"].map((d) => (
                  <button key={d} onClick={() => setDuration(d)}
                    className={cn("h-8 px-3 rounded-lg border text-[12px] font-semibold transition-colors",
                      duration === d ? "bg-[#111827] text-white border-[#111827]" : "border-[#E5E7EB] text-[#374151] hover:bg-[#F5F8F7]"
                    )}>{d}d</button>
                ))}
              </div>
            </div>
          )}

          {/* Additional notes */}
          <div>
            <label className="block text-[10px] font-bold text-[#374151] uppercase tracking-wide mb-1.5">Additional notes</label>
            <textarea rows={2}
              placeholder="Optional details for record-keeping..."
              className="w-full rounded-xl border border-[#E2E8E6] p-3 text-[12px] text-[#374151] outline-none focus:border-[#17B890] resize-none placeholder:text-[#C8D8D4]"
            />
          </div>
        </div>

        <div className="flex gap-2 px-6 pb-5">
          <button onClick={onClose} className="flex-1 h-9 rounded-xl border border-[#E2E8E6] text-[12px] font-semibold text-[#374151] hover:bg-[#F5F8F7]">Cancel</button>
          <button onClick={onClose} className={cn("flex-1 h-9 rounded-xl text-white text-[12px] font-bold transition-colors",
            isDestructive ? "bg-[#DC2626] hover:bg-[#B91C1C]" : "bg-[#111827] hover:bg-[#1f2937]"
          )}>
            {ACTIONS.find(a => a.id === action)?.label ?? "Take action"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Trust breakdown data ──────────────────────────────────────────────────

const TRUST_BREAKDOWN = [
  { label:"Completion",    score:26.5, max:30, color:"#17B890" },
  { label:"Reviews",       score:22.5, max:25, color:"#17B890" },
  { label:"Disputes",      score:15.5, max:20, color:"#F59E0B" },
  { label:"Fraud signals", score:10.5, max:15, color:"#F59E0B" },
  { label:"Activity",      score:7.5,  max:10, color:"#17B890" },
]

type DetailTab = "Overview" | "Activity Log" | "Trust & Risk" | "Tasks"
type TaskFilter = "All" | "In Progress" | "Completed" | "Disputed"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const [tab,        setTab]        = useState<DetailTab>("Overview")
  const [actionOpen, setActionOpen] = useState(false)
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("All")

  const user      = MOCK_USERS.find((u) => u.id === params.id) ?? MOCK_USERS[0]
  const allTasks  = MOCK_TASKS.slice(0, 10)
  const initials  = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
  const scoreColor = user.trustScore >= 70 ? "#17B890" : user.trustScore >= 50 ? "#F59E0B" : "#EF4444"

  const taskCounts = {
    All:         allTasks.length,
    "In Progress": allTasks.filter(t => t.status === "In Progress").length || 4,
    Completed:   allTasks.filter(t => t.status === "Completed").length || 6,
    Disputed:    allTasks.filter(t => t.status === "Disputed").length || 2,
  }
  const filteredTasks = taskFilter === "All" ? allTasks : allTasks.filter(t => t.status === taskFilter)

  return (
    <div>
      {/* ── User header card ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#374151] font-bold text-lg shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-0.5">
                <h2 className="text-[18px] font-extrabold text-[#111827]">{user.name}</h2>
                <span className={cn("flex items-center gap-1 text-[11px] font-semibold",
                  user.status === "Active" ? "text-[#17B890]" : "text-[#EF4444]"
                )}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{
                    backgroundColor: user.status === "Active" ? "#22C55E" : "#EF4444"
                  }} />
                  {user.status}
                </span>
              </div>
              <p className="text-[10.5px] text-[#8FA3A0] mb-2 font-mono">{user.id}</p>
              <div className="flex items-center gap-5 text-[11px] text-[#8FA3A0]">
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={SmartPhone01Icon} size={12} strokeWidth={1.5} />
                  {user.phone}
                </span>
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={Mail01Icon} size={12} strokeWidth={1.5} />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={Location01Icon} size={12} strokeWidth={1.5} />
                  {user.city}
                </span>
              </div>
            </div>
          </div>
          <button onClick={() => setActionOpen(true)}
            className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#111827] hover:bg-[#1f2937] text-white text-[12px] font-bold transition-colors">
            <HugeiconsIcon icon={AlertDiamondIcon} size={13} strokeWidth={2} />
            Take action
          </button>
        </div>

        {/* Trust score + meta */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#F3F4F6]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black tracking-[0.14em] text-[#8FA3A0] uppercase">Trust Score</span>
            <span className="text-[18px] font-extrabold" style={{ color: scoreColor }}>{user.trustScore}</span>
          </div>
          <div className="h-4 w-px bg-[#E5E7EB]" />
          {(user.role === "Task Giver" || user.role === "Both") && (
            <span className="border border-[#16A34A] text-[#16A34A] rounded-md px-2 py-0.5 text-[10px] font-bold bg-[#F0FDF4]">Giver</span>
          )}
          {(user.role === "Task Doer" || user.role === "Both") && (
            <span className="border border-[#374151] text-[#374151] rounded-md px-2 py-0.5 text-[10px] font-bold bg-white">Doer</span>
          )}
          <div className="h-4 w-px bg-[#E5E7EB]" />
          <p className="text-[11px] text-[#8FA3A0]">Joined <span className="font-semibold text-[#374151]">{user.joinedAt}</span></p>
          <p className="text-[11px] text-[#8FA3A0]">{user.tasks} tasks {user.role === "Task Doer" ? "completed" : "posted"}</p>
          {user.isVerified && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#17B890]">
              <HugeiconsIcon icon={ShieldIcon} size={13} strokeWidth={1.5} />
              ID Verified
            </span>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="flex border-b border-[#F3F4F6]">
          {(["Overview","Activity Log","Trust & Risk","Tasks"] as DetailTab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("flex items-center gap-1.5 px-5 py-3 text-[12.5px] font-medium border-b-2 transition-colors",
                tab === t ? "border-[#111827] text-[#111827] font-bold" : "border-transparent text-[#8FA3A0] hover:text-[#374151]"
              )}>
              {t}
              {t === "Activity Log" && <span className="text-[10px] text-[#8FA3A0]">324</span>}
              {t === "Tasks" && <span className="text-[10px] text-[#8FA3A0]">{user.tasks}</span>}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* ── OVERVIEW ── */}
          {tab === "Overview" && (
            <>
            {/* Top KPI strip */}
            <div className="grid grid-cols-4 gap-0 mb-5 border border-[#F3F4F6] rounded-xl overflow-hidden">
              {[
                { label:"Tasks completed", value:user.tasks,  sub:"↑ 6 this month",     icon:"✓", iconColor:"#17B890", iconBg:"#E8F7F3" },
                { label:"Total spent",     value:"₹2.4L",     sub:"↑ ₹38k this month",  icon:"₹", iconColor:"#2563EB", iconBg:"#DBEAFE" },
                { label:"Disputes filed",  value:2,           sub:"1.2% of tasks",       icon:"⚠", iconColor:"#EF4444", iconBg:"#FEE2E2" },
                { label:"Avg response",    value:"3m",        sub:"↑ Faster than 92%",  icon:"⏱", iconColor:"#8FA3A0", iconBg:"#F3F4F6" },
              ].map((k, i, arr) => (
                <div key={k.label} className={cn("px-5 py-4", i < arr.length - 1 && "border-r border-[#F3F4F6]")}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] w-5 h-5 rounded flex items-center justify-center shrink-0"
                      style={{ backgroundColor: k.iconBg, color: k.iconColor }}>{k.icon}</span>
                    <p className="text-[10px] font-black tracking-[0.15em] text-[#8FA3A0] uppercase">{k.label}</p>
                  </div>
                  <p className="text-[22px] font-extrabold text-[#111827] leading-tight">{k.value}</p>
                  <p className="text-[10.5px] font-semibold text-[#17B890] mt-0.5">{k.sub}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-6">
              {/* Col 1: Identity + Contact */}
              <div className="space-y-5">
                <div>
                  <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-3">Identity (Aadhaar via verified)</p>
                  <div className="space-y-2">
                    {[
                      { label:"Full Name",   value: user.name },
                      { label:"Aadhaar",     value:"XXXX XXXX 4471" },
                      { label:"DOB",         value:"12 May 1992" },
                      { label:"Verified on", value:"5 Aug 2024" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-start gap-2">
                        <span className="text-[11px] text-[#8FA3A0] w-20 shrink-0 mt-0.5">{row.label}</span>
                        <span className="text-[12px] text-[#374151] font-medium">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-3">Contact</p>
                  <div className="space-y-1.5">
                    <p className="text-[12px] text-[#374151]">{user.phone}</p>
                    <p className="text-[12px] text-[#374151]">{user.email}</p>
                    {user.upiId && <p className="text-[12px] text-[#8FA3A0] font-mono text-[11px]">{user.upiId}</p>}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-3">Location</p>
                  <p className="text-[12px] text-[#374151]">{user.city}, India</p>
                </div>
                <div>
                  <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-3">Account</p>
                  <div className="space-y-1">
                    <p className="text-[12px] text-[#374151]">Joined: <span className="font-semibold">{user.joinedAt}</span></p>
                    <p className="text-[12px] text-[#374151]">Last login: <span className="font-semibold">Just now</span></p>
                  </div>
                </div>
              </div>

              {/* Col 2: Trust breakdown + Recent activity */}
              <div className="space-y-5">
                <div>
                  <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-3">Trust Score Breakdown</p>
                  {/* Reference layout: big score left, bars right */}
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 text-center">
                      <div className="text-[42px] font-extrabold leading-none" style={{ color: scoreColor }}>{user.trustScore}</div>
                      <p className="text-[10px] text-[#8FA3A0] mt-0.5">/ 100</p>
                      <p className="text-[10px] font-semibold mt-0.5" style={{ color: scoreColor }}>
                        {user.trustScore >= 80 ? "Excellent" : user.trustScore >= 60 ? "Good" : "At risk"}
                      </p>
                    </div>
                    <div className="flex-1 space-y-2.5 pt-1">
                      {TRUST_BREAKDOWN.map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between mb-0.5">
                            <span className="text-[11px] text-[#374151]">{item.label}</span>
                            <span className="text-[10.5px] font-bold text-[#374151]">{item.score}/{item.max}</span>
                          </div>
                          <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{
                              width: `${(item.score / item.max) * 100}%`,
                              backgroundColor: item.color,
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Recent activity below trust breakdown in col 2 */}
                <div>
                  <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-3">Recent Activity</p>
                  <div className="space-y-1">
                    {MOCK_ACTIVITY.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-start gap-2.5 py-1.5 border-b border-[#F9FAFB] last:border-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#17B890] mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11.5px] text-[#374151] leading-tight">{item.description}</p>
                          <p className="text-[10px] text-[#8FA3A0] mt-0.5">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Col 3: Recent transactions only */}
              <div>
                <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-3">Recent Transactions</p>
                <div className="space-y-2">
                  {[
                    { label:"Payment disputed", id:"PAY-87233", task:"Mobile task",  amount:"₹15,000", time:"14m ago",   color:"#EF4444", bg:"#FEE2E2" },
                    { label:"Held in escrow",   id:"PAY-87189", task:"Logo design",  amount:"₹8,500",  time:"3h ago",    color:"#F59E0B", bg:"#FEF3C7" },
                    { label:"Released to doer", id:"PAY-87102", task:"Kiran Patel",  amount:"₹6,800",  time:"Yesterday", color:"#17B890", bg:"#E8F7F3" },
                    { label:"Released to doer", id:"PAY-87102", task:"Kiran Patel",  amount:"₹6,800",  time:"5 days ago",color:"#17B890", bg:"#E8F7F3" },
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6]">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black"
                        style={{ backgroundColor: tx.bg, color: tx.color }}>₹</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11.5px] font-semibold text-[#374151]">{tx.label}</p>
                        <p className="text-[10px] text-[#8FA3A0]">{tx.id} · {tx.task}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[12px] font-bold" style={{ color: tx.color }}>{tx.amount}</p>
                        <p className="text-[10px] text-[#8FA3A0]">{tx.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </>
          )}

          {/* ── ACTIVITY LOG ── */}
          {tab === "Activity Log" && (
            <div className="space-y-1">
              {MOCK_ACTIVITY.map((item, i) => (
                <div key={item.id} className={cn("flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-[#F9FAFB] transition-colors",
                  i % 2 === 0 ? "" : "bg-[#FAFAFA]"
                )}>
                  <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[10px] font-bold text-[#374151] shrink-0">
                    {item.user.split(" ")[0][0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-[12.5px] text-[#374151]">{item.description}</p>
                    <p className="text-[10px] text-[#8FA3A0] mt-0.5">{item.time}</p>
                  </div>
                  <span className={cn("text-[9px] font-black uppercase tracking-wide rounded px-1.5 py-0.5 shrink-0",
                    item.type === "dispute_opened" ? "bg-[#FEE2E2] text-[#DC2626]" :
                    item.type === "payout" || item.type === "payment_released" ? "bg-[#DCFCE7] text-[#16A34A]" :
                    item.type === "task_posted" || item.type === "task_completed" ? "bg-[#E0E7FF] text-[#4F46E5]" :
                    "bg-[#F3F4F6] text-[#6B7280]"
                  )}>
                    {item.type.replace("_"," ")}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ── TRUST & RISK ── */}
          {tab === "Trust & Risk" && (
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-5 mb-6">
                  <div className="text-[64px] font-extrabold leading-none" style={{ color: scoreColor }}>{user.trustScore}</div>
                  <div>
                    <p className="text-[14px] font-bold text-[#374151]">Trust Score</p>
                    <p className={cn("text-[12px] font-semibold", scoreColor === "#17B890" ? "text-[#17B890]" : "text-[#F59E0B]")}>
                      {user.trustScore >= 80 ? "● Excellent" : user.trustScore >= 60 ? "● Good" : "● At risk"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {TRUST_BREAKDOWN.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[12.5px] font-medium text-[#374151]">{item.label}</span>
                        <span className="text-[12px] font-bold text-[#374151]">{item.score}/{item.max}</span>
                      </div>
                      <div className="h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${(item.score / item.max) * 100}%`,
                          backgroundColor: item.color,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-4">Risk Signals</p>
                <div className="space-y-2.5">
                  {[
                    { text:"Task completion rate: " + Math.round(user.tasks * 0.75) + " / " + user.tasks,  ok:true },
                    { text:"No fraud flags detected",                    ok:true  },
                    { text:"KYC identity verified",                       ok:true  },
                    { text:`Account age: ${user.joinedAt}`,              ok:true  },
                    { text:"Average rating: 4.2 / 5",                   ok:true  },
                    { text:user.tasks < 5 ? "Low task history — new user" : "Active transaction history", ok:user.tasks >= 5 },
                  ].map((sig, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} strokeWidth={1.5}
                        className={sig.ok ? "text-[#17B890] mt-0.5 shrink-0" : "text-[#F59E0B] mt-0.5 shrink-0"} />
                      <p className="text-[12px] text-[#374151]">{sig.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TASKS ── */}
          {tab === "Tasks" && (
            <div>
              {/* 5 KPI boxes */}
              <div className="grid grid-cols-5 gap-3 mb-5">
                {[
                  { label:"Total Tasks",    value:user.tasks,                       sub:"As task doer",      valueColor:"#111827" },
                  { label:"Completed",      value:Math.floor(user.tasks * 0.76),    sub:`${76.3}% completion`, valueColor:"#17B890" },
                  { label:"In Progress",    value:4,                                sub:"Active right now",  valueColor:"#2563EB" },
                  { label:"Disputed",       value:2,                                sub:"1.2% of tasks",     valueColor:"#EF4444" },
                  { label:"Total Earned",   value:"₹2.4L",                          sub:"↑ ₹38k this month", valueColor:"#111827" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-3">
                    <p className="text-[20px] font-extrabold leading-tight mb-0.5" style={{ color: s.valueColor }}>{s.value}</p>
                    <p className="text-[10.5px] font-semibold text-[#374151]">{s.label}</p>
                    <p className="text-[10px] text-[#8FA3A0] mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Filter tabs */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  {(["All","In Progress","Completed","Disputed"] as TaskFilter[]).map((f) => (
                    <button key={f} onClick={() => setTaskFilter(f)}
                      className={cn("h-7 px-3 rounded-full text-[11.5px] font-medium border transition-colors",
                        taskFilter === f
                          ? "bg-[#111827] text-white border-[#111827]"
                          : "bg-white text-[#374151] border-[#E2E8E6] hover:bg-[#F5F8F7]"
                      )}>
                      {f} <span className={cn("ml-1 text-[10px]", taskFilter === f ? "text-white/60" : "text-[#8FA3A0]")}>
                        {taskCounts[f]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F3F4F6]">
                    {["Task","Category","Giver","Amount","Status","Accepted"].map((h) => (
                      <th key={h} className="text-left text-[10px] font-black tracking-wider text-[#8FA3A0] uppercase pb-2.5 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA]">
                      <td className="py-2.5 pr-4">
                        <p className="text-[12px] font-semibold text-[#111827] max-w-[180px] truncate">{task.title}</p>
                        <p className="text-[10px] text-[#8FA3A0]">{task.id}</p>
                      </td>
                      <td className="py-2.5 pr-4 text-[12px] text-[#374151]">{task.category}</td>
                      <td className="py-2.5 pr-4 text-[12px] text-[#374151]">Sneha Joshi</td>
                      <td className="py-2.5 pr-4 text-[12px] font-bold text-[#111827]">₹{task.amount.toLocaleString("en-IN")}</td>
                      <td className="py-2.5 pr-4">
                        <span className={cn("text-[11px] font-semibold flex items-center gap-1",
                          task.status === "Completed"   ? "text-[#17B890]" :
                          task.status === "Disputed"    ? "text-[#DC2626]" :
                          task.status === "In Progress" ? "text-[#2563EB]" :
                          task.status === "Force-Closed"? "text-[#6B7280]" : "text-[#374151]"
                        )}>
                          {task.status === "Completed" ? "✓" : task.status === "Disputed" ? "⚠" :
                           task.status === "In Progress" ? "↻" : task.status === "Force-Closed" ? "—" : ""}
                          {" "}{task.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-[11px] text-[#8FA3A0]">{task.postedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F3F4F6]">
                <p className="text-[11.5px] text-[#8FA3A0]">Showing 1–{filteredTasks.length} of {filteredTasks.length} tasks</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <TakeActionModal open={actionOpen} onClose={() => setActionOpen(false)} userName={user.name} userId={user.id} />
    </div>
  )
}
