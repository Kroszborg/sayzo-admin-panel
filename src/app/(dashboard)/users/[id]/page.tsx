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

function TakeActionModal({ open, onClose, userName }: { open: boolean; onClose: () => void; userName: string }) {
  const [action, setAction] = useState("warn")
  const [reason, setReason] = useState("")

  const ACTIONS = [
    { id:"warn",      label:"Warn User",        desc:"Send a formal platform warning",          color:"text-[#374151]"  },
    { id:"suspend7",  label:"Suspend (7 days)",  desc:"Temporarily restrict platform access",    color:"text-[#D97706]"  },
    { id:"suspend30", label:"Suspend (30 days)", desc:"Extended temporary restriction",           color:"text-[#D97706]"  },
    { id:"ban",       label:"Ban User",          desc:"Permanently revoke platform access",       color:"text-[#DC2626]"  },
    { id:"force",     label:"Force-close tasks", desc:"Immediately close all active tasks",       color:"text-[#DC2626]"  },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-bold text-[#111827]">Take action on this user</DialogTitle>
          <p className="text-[12px] text-[#8FA3A0]">Select an action and provide a reason for record-keeping.</p>
        </DialogHeader>
        <div className="space-y-2">
          {ACTIONS.map((a) => (
            <button key={a.id} onClick={() => setAction(a.id)}
              className={cn("w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all",
                action === a.id ? "border-[#111827] bg-[#F9FAFB]" : "border-[#E5E7EB] hover:border-[#D1D5DB]"
              )}>
              <div className={cn("w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center",
                action === a.id ? "border-[#111827]" : "border-[#D1D5DB]"
              )}>
                {action === a.id && <div className="w-2 h-2 rounded-full bg-[#111827]" />}
              </div>
              <div>
                <p className={cn("text-[12.5px] font-semibold", a.color)}>{a.label}</p>
                <p className="text-[11px] text-[#8FA3A0]">{a.desc}</p>
              </div>
            </button>
          ))}
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wide mb-1.5">Reason</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
            placeholder="Describe the reason for this action..."
            className="w-full rounded-xl border border-[#E2E8E6] p-3 text-[12px] text-[#374151] outline-none focus:border-[#17B890] resize-none placeholder:text-[#C8D8D4]"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 h-9 rounded-xl border border-[#E2E8E6] text-[12px] font-semibold text-[#374151] hover:bg-[#F5F8F7]">Cancel</button>
          <button onClick={onClose} className={cn("flex-1 h-9 rounded-xl text-white text-[12px] font-bold transition-colors",
            action === "ban" || action === "force" ? "bg-[#DC2626] hover:bg-[#B91C1C]" : "bg-[#111827] hover:bg-[#1f2937]"
          )}>Take action</button>
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

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const [tab,        setTab]        = useState<DetailTab>("Overview")
  const [actionOpen, setActionOpen] = useState(false)

  const user      = MOCK_USERS.find((u) => u.id === params.id) ?? MOCK_USERS[0]
  const userTasks = MOCK_TASKS.slice(0, 6)
  const initials  = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
  const scoreColor = user.trustScore >= 70 ? "#17B890" : user.trustScore >= 50 ? "#F59E0B" : "#EF4444"

  return (
    <div>
      {/* ── User header card ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#17B890] to-[#3B82F6] flex items-center justify-center text-white font-bold text-lg shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h2 className="text-[18px] font-extrabold text-[#111827]">{user.name}</h2>
                <span className="border border-[#D1D5DB] text-[#374151] rounded px-2 py-0.5 text-[10px] font-bold bg-white">
                  {user.role === "Task Doer" ? "Doer" : user.role === "Task Giver" ? "Giver" : "Both"}
                </span>
                <span className={cn("flex items-center gap-1 text-[11px] font-semibold",
                  user.status === "Active" ? "text-[#17B890]" : "text-[#EF4444]"
                )}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{
                    backgroundColor: user.status === "Active" ? "#22C55E" : "#EF4444"
                  }} />
                  {user.status}
                </span>
              </div>
              <p className="text-[11px] text-[#8FA3A0] mb-2.5 font-mono">{user.id}</p>
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

        {/* Trust score summary */}
        <div className="flex items-center gap-5 mt-4 pt-4 border-t border-[#F3F4F6]">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 48 48" className="w-12 h-12 -rotate-90">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#F3F4F6" strokeWidth="5" />
                <circle cx="24" cy="24" r="20" fill="none" strokeWidth="5"
                  stroke={scoreColor}
                  strokeDasharray={`${(user.trustScore / 100) * 125.6} 125.6`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[12px] font-extrabold" style={{ color: scoreColor }}>
                {user.trustScore}
              </span>
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#374151]">Trust Score</p>
              <p className="text-[10px] text-[#8FA3A0]">out of 100</p>
            </div>
          </div>
          <div className="h-8 w-px bg-[#F3F4F6]" />
          <p className="text-[11px] text-[#8FA3A0]">Member since <span className="font-semibold text-[#374151]">{user.joinedAt}</span></p>
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
              {t === "Activity Log" && <span className="text-[10px] text-[#8FA3A0]">32</span>}
              {t === "Tasks" && <span className="text-[10px] text-[#8FA3A0]">{user.tasks}</span>}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* ── OVERVIEW ── */}
          {tab === "Overview" && (
            <div className="grid grid-cols-3 gap-6">
              {/* Col 1: Identity + Contact */}
              <div className="space-y-5">
                <div>
                  <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-3">Identity</p>
                  <div className="space-y-2">
                    {[
                      { label:"Aadhaar", verified:true  },
                      { label:"Phone OTP", verified:true },
                      { label:"Face", verified:false    },
                    ].map((v) => (
                      <div key={v.label} className="flex items-center gap-2">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={1.5}
                          className={v.verified ? "text-[#17B890]" : "text-[#D1D5DB]"} />
                        <span className="text-[12px] text-[#374151] flex-1">{v.label}</span>
                        <span className={cn("text-[10px] font-semibold", v.verified ? "text-[#17B890]" : "text-[#D1D5DB]")}>
                          {v.verified ? "Verified" : "Pending"}
                        </span>
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

              {/* Col 2: Trust breakdown */}
              <div>
                <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-3">Trust Score Breakdown</p>
                <div className="space-y-3">
                  {TRUST_BREAKDOWN.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[12px] text-[#374151]">{item.label}</span>
                        <span className="text-[11px] font-bold text-[#374151]">{item.score}/{item.max}</span>
                      </div>
                      <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{
                          width: `${(item.score / item.max) * 100}%`,
                          backgroundColor: item.color,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[36px] font-extrabold" style={{ color: scoreColor }}>{user.trustScore}</span>
                    <span className="text-[13px] text-[#8FA3A0]">/ 100</span>
                  </div>
                  <p className="text-[11px] font-semibold" style={{ color: scoreColor }}>
                    {user.trustScore >= 80 ? "Excellent standing" : user.trustScore >= 60 ? "Good standing" : "At risk"}
                  </p>
                </div>
              </div>

              {/* Col 3: Recent activity */}
              <div>
                <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-3">Recent Activity</p>
                <div className="space-y-3">
                  {MOCK_ACTIVITY.slice(0, 6).map((item) => (
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
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                  { label:"Total Tasks",  value:user.tasks                        },
                  { label:"Completed",    value:Math.floor(user.tasks * 0.75)     },
                  { label:"In Progress",  value:3                                 },
                  { label:"Disputed",     value:1                                 },
                ].map((s) => (
                  <div key={s.label} className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-3 text-center">
                    <p className="text-[20px] font-extrabold text-[#111827]">{s.value}</p>
                    <p className="text-[10px] text-[#8FA3A0]">{s.label}</p>
                  </div>
                ))}
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F3F4F6]">
                    {["Task","Category","Amount","Status","Date"].map((h) => (
                      <th key={h} className="text-left text-[10px] font-black tracking-wider text-[#8FA3A0] uppercase pb-2.5 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {userTasks.map((task) => (
                    <tr key={task.id} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA]">
                      <td className="py-2.5 pr-4">
                        <p className="text-[12px] font-semibold text-[#111827] max-w-[200px] truncate">{task.title}</p>
                        <p className="text-[10px] text-[#8FA3A0]">{task.id}</p>
                      </td>
                      <td className="py-2.5 pr-4 text-[12px] text-[#374151]">{task.category}</td>
                      <td className="py-2.5 pr-4 text-[12px] font-bold text-[#111827]">₹{task.amount.toLocaleString("en-IN")}</td>
                      <td className="py-2.5 pr-4">
                        <span className={cn("text-[11px] font-semibold",
                          task.status === "Completed" ? "text-[#17B890]" :
                          task.status === "Disputed"  ? "text-[#DC2626]" :
                          task.status === "In Progress" ? "text-[#2563EB]" : "text-[#374151]"
                        )}>
                          {task.status === "Completed" ? "✓ " : task.status === "Disputed" ? "⚠ " : ""}{task.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-[11px] text-[#8FA3A0]">{task.postedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <TakeActionModal open={actionOpen} onClose={() => setActionOpen(false)} userName={user.name} />
    </div>
  )
}
