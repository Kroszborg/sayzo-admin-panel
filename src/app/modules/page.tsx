"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  UserMultiple02Icon,
  TaskDone01Icon,
  LegalIcon,
  CreditCardIcon,
  CustomerServiceIcon,
  BellDotIcon,
  Key01Icon,
  WirelessIcon,
} from "@hugeicons/core-free-icons"
import { UserDropdown } from "@/components/shared/user-dropdown"

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month:   "long",
    day:     "numeric",
    year:    "numeric",
    timeZone: "Asia/Kolkata",
  })
}

function AsteriskIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11 2h2v7.5l5.3-5.3 1.4 1.4L14.5 11H22v2h-7.5l5.2 5.3-1.4 1.4L13 14.5V22h-2v-7.5l-5.3 5.2-1.4-1.4L9.5 13H2v-2h7.5L4.3 5.7l1.4-1.4L11 9.5V2z" />
    </svg>
  )
}

// ─── Module definitions ────────────────────────────────────────────────────
// Row 1: 5 cards (operational core)
// Row 2: 4 cards (platform tools)

const ROW_1 = [
  {
    href:  "/dashboard",
    icon:  DashboardSquare01Icon,
    label: "Dashboard",
    desc:  "Platform overview, KPIs, and live activity",
    badge: null,
  },
  {
    href:  "/users",
    icon:  UserMultiple02Icon,
    label: "Users",
    desc:  "Profiles, KYC, trust scores, and actions",
    badge: 47,
  },
  {
    href:  "/tasks",
    icon:  TaskDone01Icon,
    label: "Tasks",
    desc:  "Moderate, force-close, and feature tasks",
    badge: 12,
  },
  {
    href:  "/disputes",
    icon:  LegalIcon,
    label: "Disputes",
    desc:  "Resolve cases, evidence, and SLA",
    badge: 8,
  },
  {
    href:  "/payments",
    icon:  CreditCardIcon,
    label: "Payments",
    desc:  "Escrow, payouts, refunds, and wallets",
    badge: 3,
  },
]

const ROW_2 = [
  {
    href:  "/support",
    icon:  CustomerServiceIcon,
    label: "Support",
    desc:  "Tickets, live chat, and FAQ content",
    badge: 31,
  },
  {
    href:  "/notifications",
    icon:  BellDotIcon,
    label: "Notifications",
    desc:  "Broadcasts, alerts, and templates",
    badge: null,
  },
  {
    href:  "/team",
    icon:  Key01Icon,
    label: "Team",
    desc:  "Accounts, roles, and platform audit",
    badge: null,
  },
  {
    href:  "/communications/live-support",
    icon:  WirelessIcon,
    label: "Communications",
    desc:  "Live support, System notifications",
    badge: null,
  },
]

// ─── Module Card ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ModuleCard({ href, icon, label, desc, badge }: {
  href: string
  icon: any
  label: string
  desc: string
  badge: number | null
}) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] }}
    >
    <Link
      href={href}
      style={{
        width: "240px",
        height: "200px",
        borderRadius: "14px",
        borderWidth: "1px",
      }}
      className="relative bg-white border border-[#E5E7EB] hover:border-[#A8DFD0] transition-all group cursor-pointer flex flex-col p-5 overflow-hidden"
    >
      {/* Badge — inside top-right corner */}
      {badge !== null && (
        <div className="absolute top-3 right-3 min-w-[22px] h-[22px] rounded-full bg-[#EF4444] text-white text-[10px] font-black flex items-center justify-center px-1.5 shadow-sm z-10">
          {badge}
        </div>
      )}

      {/* Icon block */}
      <div className="w-[52px] h-[52px] rounded-xl bg-[#111827] flex items-center justify-center mb-4 group-hover:bg-[#1f2937] transition-colors shrink-0">
        <HugeiconsIcon icon={icon} size={24} strokeWidth={1.5} className="text-white" />
      </div>

      {/* Text */}
      <p className="text-[14px] font-bold text-[#111827] mb-1.5">{label}</p>
      <p className="text-[12px] text-[#8FA3A0] leading-relaxed line-clamp-2">{desc}</p>
    </Link>
    </motion.div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function ModulesPage() {
  const [dateStr, setDateStr] = useState("")

  useEffect(() => {
    setDateStr(formatDate(new Date()))
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Sky background */}
      <Image
        src="/light_cloud_bg.png"
        alt="Sky background"
        fill
        className="object-cover object-top"
        priority
        quality={90}
      />

      {/* Top bar — white, fixed height, matches sidebar logo row */}
      <header className="relative z-10 flex items-center justify-between px-8 h-[53px] bg-white border-b border-[#E5E7EB] shrink-0">
        {/* Left: logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center shrink-0">
            <AsteriskIcon className="w-[15px] h-[15px] text-white" />
          </div>
          <div>
            <p className="text-[13px] font-extrabold text-[#111827] leading-tight">SAYZO</p>
            <p className="text-[9.5px] font-bold text-[#8FA3A0] leading-tight tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>

        {/* Right: date + avatar dropdown */}
        <div className="flex items-center gap-4">
          {dateStr && (
            <span className="text-[12px] font-medium text-[#374151]">{dateStr}</span>
          )}
          {/* Avatar dropdown — opens downward in top bar */}
          <div className="w-[200px]">
            <UserDropdown direction="down" />
          </div>
        </div>
      </header>

      {/* Content — vertically centered, cards horizontally centered */}
      <div className="relative z-10 flex flex-col items-center pt-12 pb-20 px-8">
        {/* Inner wrapper — same width as the 5-card row (5×240 + 4×16 gaps = 1264px) */}
        <div className="w-full" style={{ maxWidth: "1264px" }}>
          {/* Heading — left-aligned to card grid */}
          <div className="mb-8">
            <h1 className="text-[34px] font-extrabold text-white leading-tight mb-1.5 drop-shadow-sm">
              Welcome back, Aarav 👋
            </h1>
            <p className="text-[15px] text-white/75 font-medium">Pick a module to get started</p>
          </div>

          {/* Row 1 — 5 operational modules */}
          <div className="flex gap-4 mb-4">
            {ROW_1.map((m) => (
              <ModuleCard key={m.href} {...m} />
            ))}
          </div>

          {/* Row 2 — 4 platform modules (5th slot intentionally empty) */}
          <div className="flex gap-4">
            {ROW_2.map((m) => (
              <ModuleCard key={m.href} {...m} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
