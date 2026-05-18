"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon, CheckmarkCircle02Icon, Download01Icon,
  ArrowRight01Icon, Clock01Icon, CreditCardIcon,
} from "@hugeicons/core-free-icons"
import { MOCK_PAYMENTS, MOCK_TASKS } from "@/lib/mock-data"
import { useAlertStore } from "@/store/alert-store"
import { cn } from "@/lib/utils"

// ─── Timeline ──────────────────────────────────────────────────────────────

const TIMELINE = [
  { label:"Escrow initiated by giver",     desc:"Priya Mehta initiated payment · Razorpay order created",                time:"Apr 12, 13:32 IST", done:true  },
  { label:"Payment confirmed by gateway",  desc:"₹22,000 received · Razorpay TXN #RZP20240412001",                     time:"Apr 12, 13:32 IST", done:true  },
  { label:"Task in progress · escrow held",desc:"Vikram Kumar started work · funds locked",                             time:"Apr 12, 14:07 IST", done:true  },
  { label:"Doer marked task complete",     desc:"Vikram Kumar submitted deliverables",                                  time:"Apr 14, 09:44 IST", done:true  },
  { label:"72h review window closed",      desc:"No dispute filed · auto-release triggered",                           time:"Apr 17, 09:44 IST", done:true  },
  { label:"Payout released to doer",       desc:"₹19,360 transferred to vikram.k@oksbi · settlement T+1",              time:"Apr 17, 10:01 IST", done:true  },
]

// ─── Page ───────────────────────────────────────────────────────────────────

export default function PaymentDetailPage({ params }: { params: { id: string } }) {
  const router  = useRouter()
  const alert   = useAlertStore()
  const payment = MOCK_PAYMENTS.find((p) => p.id === params.id) ?? MOCK_PAYMENTS[0]
  const task    = MOCK_TASKS.find((t) => t.id === payment.taskId) ?? MOCK_TASKS[0]

  const doerPct  = 88
  const feePct   = 12
  const isReleased = payment.status === "Released"

  const STATUS_STYLE: Record<string, string> = {
    "Released":  "bg-[#DCFCE7] text-[#16A34A]",
    "In Escrow": "bg-[#FEF3C7] text-[#D97706]",
    "Disputed":  "bg-[#FEE2E2] text-[#DC2626]",
    "Refunded":  "bg-[#F3F4F6] text-[#6B7280]",
    "Failed":    "bg-[#FEE2E2] text-[#DC2626]",
  }

  return (
    <div>
      {/* Back */}
      <button onClick={() => router.push("/payments")}
        className="flex items-center gap-1.5 text-[12px] font-semibold text-[#8FA3A0] hover:text-[#374151] transition-colors mb-4">
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
        Back to Payments
      </button>

      {/* Header */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22 }}
        className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-baseline gap-3 mb-1.5">
            <h1 className="text-[28px] font-extrabold text-[#111827]">₹{payment.amount.toLocaleString("en-IN")}</h1>
            <span className={cn("text-[12px] font-bold px-2.5 py-0.5 rounded-full", STATUS_STYLE[payment.status] ?? "bg-[#F3F4F6] text-[#6B7280]")}>
              {payment.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11.5px] text-[#8FA3A0] flex-wrap">
            <span className="font-mono font-bold text-[#374151]">{payment.id}</span>
            <span>·</span>
            <span>{payment.taskTitle}</span>
            <span>·</span>
            <span className="font-mono text-[10.5px]">{payment.taskId}</span>
            <span>·</span>
            <span>{payment.giver} → {payment.doer}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={CreditCardIcon} size={11} strokeWidth={1.5} />
              UPI · Auto-released · 72h window
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button className="flex items-center gap-1.5 h-8 px-3 border border-[#E2E8E6] rounded-lg text-[12px] font-semibold text-[#374151] bg-white hover:bg-[#F5F8F7]">
            <HugeiconsIcon icon={Download01Icon} size={13} strokeWidth={1.5} />
            Export receipt
          </button>
          <button onClick={() => router.push(`/tasks/${task.id}`)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#111827] hover:bg-[#1f2937] text-white text-[12px] font-bold transition-colors">
            View linked task
            <HugeiconsIcon icon={ArrowRight01Icon} size={13} strokeWidth={2} />
          </button>
        </div>
      </motion.div>

      {/* Metrics strip */}
      <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.25, delay:0.06 }}
        className="flex bg-white border border-[#E5E7EB] rounded-xl overflow-hidden mb-4">
        {[
          { label:"Escrowed Amount", value:`₹${payment.amount.toLocaleString("en-IN")}`,        color:"#111827" },
          { label:"Doer Received",   value:`₹${payment.doerEarns.toLocaleString("en-IN")}`,     color:"#17B890" },
          { label:"Platform Fee",    value:`₹${Math.round(payment.amount*0.12).toLocaleString("en-IN")}`, color:"#8FA3A0", sub:"(12%)" },
          { label:"Time in Escrow",  value:"3d 14h 22m",                                          color:"#111827" },
        ].map((m, i) => (
          <div key={m.label} className={cn("flex-1 px-5 py-4", i < 3 && "border-r border-[#F3F4F6]")}>
            <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-1">{m.label}</p>
            <p className="text-[20px] font-extrabold leading-tight" style={{ color:m.color }}>
              {m.value}
              {m.sub && <span className="text-[12px] font-medium text-[#8FA3A0] ml-1">{m.sub}</span>}
            </p>
          </div>
        ))}
      </motion.div>

      {/* 2-col layout */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.28, delay:0.1 }}
        className="grid grid-cols-3 gap-4">

        {/* ─ Left 2/3 ─ */}
        <div className="col-span-2 space-y-4">
          {/* Payment lifecycle */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[13px] font-bold text-[#111827]">Payment Lifecycle</p>
              <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#17B890]">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2} />
                Fully settled
              </span>
            </div>
            <div className="relative">
              <div className="absolute left-[10px] top-3 bottom-3 w-0.5 bg-[#E5E7EB]" />
              <div className="space-y-5">
                {TIMELINE.map((step) => (
                  <div key={step.label} className="flex items-start gap-3 relative z-10">
                    <div className="w-[21px] h-[21px] rounded-full bg-[#17B890] flex items-center justify-center shrink-0 mt-0.5">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} strokeWidth={2.5} className="text-white" />
                    </div>
                    <div className="flex-1 pb-0.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-[12.5px] font-semibold text-[#374151]">{step.label}</p>
                        <span className="text-[10.5px] text-[#8FA3A0] whitespace-nowrap shrink-0">{step.time}</span>
                      </div>
                      <p className="text-[11px] text-[#8FA3A0] mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fund breakdown */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <p className="text-[13px] font-bold text-[#111827] mb-4">Fund Breakdown</p>
            {/* Visual bar */}
            <div className="flex h-4 rounded-full overflow-hidden mb-3">
              <motion.div className="bg-[#17B890] h-full" style={{ width:`${doerPct}%` }}
                initial={{ width:0 }} animate={{ width:`${doerPct}%` }} transition={{ duration:0.8, delay:0.3, ease:[0.33,1,0.68,1] }} />
              <motion.div className="bg-[#F59E0B] h-full flex-1"
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.5, delay:0.8 }} />
            </div>
            <div className="flex items-center gap-5 mb-4">
              <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#17B890]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#17B890]" />
                Doer payout ({doerPct}%)
              </span>
              <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#D97706]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" />
                Platform fee ({feePct}%)
              </span>
            </div>
            <div className="space-y-2.5 text-[12px]">
              {[
                { k:"Total escrowed",  v:`₹${payment.amount.toLocaleString("en-IN")}`,      bold:true },
                { k:"Doer payout",     v:`₹${payment.doerEarns.toLocaleString("en-IN")}`,   color:"#17B890" },
                { k:"Platform fee",    v:`₹${Math.round(payment.amount*0.12).toLocaleString("en-IN")}`, color:"#D97706" },
                { k:"Giver refund",    v:"₹0 · no dispute",                                 color:"#8FA3A0" },
              ].map(({ k, v, bold, color }) => (
                <div key={k} className="flex justify-between items-baseline border-b border-[#F9FAFB] pb-2 last:border-0 last:pb-0">
                  <span className="text-[#8FA3A0]">{k}</span>
                  <span className={cn("font-semibold", bold ? "text-[#111827] font-extrabold text-[13px]" : "")}
                    style={color && !bold ? { color } : {}}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Parties */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <p className="text-[13px] font-bold text-[#111827] mb-4">Parties</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { role:"Giver · Payer", name:payment.giver, uid:"USR-0002", trust:76, bg:"#F3E8FF", color:"#9333EA", roleShort:"GIVER" },
                { role:"Doer · Recipient", name:payment.doer, uid:"USR-0004", trust:71, bg:"#DBEAFE", color:"#2563EB", roleShort:"DOER" },
              ].map((p2) => (
                <div key={p2.role} className="border border-[#E5E7EB] rounded-xl p-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[12px] shrink-0"
                      style={{ backgroundColor:p2.bg, color:p2.color }}>
                      {p2.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-[12.5px] font-bold text-[#374151]">{p2.name}</p>
                      <span className="text-[9px] font-black uppercase rounded px-1.5 py-0.5" style={{ backgroundColor:p2.bg, color:p2.color }}>{p2.role}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-[11.5px]">
                    <div className="flex justify-between"><span className="text-[#8FA3A0]">User ID</span><span className="font-mono text-[10.5px] text-[#374151]">{p2.uid}</span></div>
                    <div className="flex justify-between"><span className="text-[#8FA3A0]">Trust score</span><span className="font-bold" style={{ color:p2.trust >= 70 ? "#17B890" : "#F59E0B" }}>{p2.trust}</span></div>
                  </div>
                  <button className="w-full mt-3 h-7 rounded-lg border border-[#E2E8E6] text-[11px] font-semibold text-[#374151] hover:bg-[#F5F8F7] transition-colors">
                    View profile →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─ Right 1/3 ─ */}
        <div className="space-y-4">
          {/* Linked task */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-bold text-[#111827]">Linked Task</p>
              <button onClick={() => router.push(`/tasks/${task.id}`)}
                className="text-[11px] font-semibold text-[#17B890] hover:underline flex items-center gap-0.5">
                View task <HugeiconsIcon icon={ArrowRight01Icon} size={10} strokeWidth={2} />
              </button>
            </div>
            <p className="text-[12.5px] font-semibold text-[#374151] mb-3">{task.title}</p>
            <div className="space-y-2 text-[11.5px]">
              {[
                { k:"Task ID",       v:task.id,                                              mono:true  },
                { k:"Category",      v:task.category                                                    },
                { k:"City",          v:task.city                                                        },
                { k:"Status",        v:task.status                                                      },
                { k:"Budget",        v:`₹${task.amount.toLocaleString("en-IN")}`                        },
                { k:"Task window",   v:"Sun, 3 May · 09:00–12:00"                                       },
                { k:"Disputes",      v:"None"                                                           },
              ].map(({ k, v, mono }) => (
                <div key={k} className="flex justify-between">
                  <span className="text-[#8FA3A0]">{k}</span>
                  <span className={cn("font-medium text-[#374151]", mono && "font-mono text-[10px]")}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction metadata */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <p className="text-[12px] font-bold text-[#111827] mb-3">Transaction Metadata</p>
            <div className="space-y-2.5 text-[11.5px]">
              {[
                { k:"Payment ID",    v:payment.id,                         mono:true  },
                { k:"Gateway ref",   v:"RZP20240412001",                   mono:true  },
                { k:"Payout ref",    v:"NEFT20240417001",                  mono:true  },
                { k:"Gateway",       v:"Razorpay"                                     },
                { k:"Method",        v:"UPI"                                          },
                { k:"UPI VPA",       v:`${payment.doer.split(" ")[0].toLowerCase()}@oksbi`, mono:true },
                { k:"Bank",          v:"OBC (OKSBI)"                                  },
                { k:"Settlement",    v:"T+1 working day"                              },
              ].map(({ k, v, mono }) => (
                <div key={k} className="flex justify-between items-baseline border-b border-[#F9FAFB] pb-2 last:border-0 last:pb-0">
                  <span className="text-[#8FA3A0]">{k}</span>
                  <span className={cn("font-medium text-[#374151]", mono && "font-mono text-[10px]")}>{v}</span>
                </div>
              ))}
            </div>
            {payment.status === "In Escrow" && (
              <button
                onClick={() => alert.show("success", `₹${payment.doerEarns.toLocaleString("en-IN")} release initiated to ${payment.doer}`)}
                className="w-full mt-4 h-8 rounded-lg bg-[#17B890] hover:opacity-90 text-white text-[12px] font-bold flex items-center justify-center gap-1.5 transition-opacity">
                <HugeiconsIcon icon={CreditCardIcon} size={13} strokeWidth={2} />
                Release funds manually
              </button>
            )}
            {isReleased && (
              <div className="mt-3 flex items-center gap-1.5 text-[11.5px] text-[#17B890] font-semibold">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2} />
                Auto-released · 72h review window
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
