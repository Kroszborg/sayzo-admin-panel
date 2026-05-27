"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  UserMultiple02Icon,
  TaskDone01Icon,
  AlertDiamondIcon,
  CreditCardIcon,
  CustomerServiceIcon,
  BellDotIcon,
  UserGroup02Icon,
  BubbleChatIcon,
  Sun01Icon,
  Moon02Icon,
} from "@hugeicons/core-free-icons"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { UserDropdown } from "@/components/shared/user-dropdown"
import { useThemeStore } from "@/store/theme-store"

// ─── Asterisk (8-pointed star) SVG ────────────────────────────────────────

function AsteriskIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11 2h2v7.5l5.3-5.3 1.4 1.4L14.5 11H22v2h-7.5l5.2 5.3-1.4 1.4L13 14.5V22h-2v-7.5l-5.3 5.2-1.4-1.4L9.5 13H2v-2h7.5L4.3 5.7l1.4-1.4L11 9.5V2z" />
    </svg>
  )
}

// ─── Nav data ──────────────────────────────────────────────────────────────

// Badge counts — "alert" badges get red circles, "count" badges get gray text
const NAV_BADGES: Record<string, { count: number; alert: boolean }> = {
  "/users":         { count: 47, alert: true  },
  "/tasks":         { count: 12, alert: false },
  "/disputes":      { count: 8,  alert: true  },
  "/payments":      { count: 3,  alert: true  },
  "/support":       { count: 31, alert: false },
}

const WORKSPACE = [
  { label:"Dashboard",    href:"/dashboard",      icon:DashboardSquare01Icon },
  { label:"Users",        href:"/users",           icon:UserMultiple02Icon    },
  { label:"Tasks",        href:"/tasks",           icon:TaskDone01Icon        },
  { label:"Disputes",     href:"/disputes",        icon:AlertDiamondIcon      },
  { label:"Payments",     href:"/payments",        icon:CreditCardIcon        },
  { label:"Support",      href:"/support",         icon:CustomerServiceIcon   },
]

const PLATFORM = [
  { label:"Notifications", href:"/notifications", icon:BellDotIcon    },
  { label:"Team",          href:"/team",           icon:UserGroup02Icon },
  { label:"Communications",href:"/communications/live-support", icon:BubbleChatIcon  },
]

// ─── Component ─────────────────────────────────────────────────────────────

export function AppSidebar() {
  const pathname     = usePathname()
  const router       = useRouter()
  const { theme, toggleTheme } = useThemeStore()

  const active = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    // Communications — highlight for both /live-support and /broadcast
    if (href === "/communications/live-support") return pathname.startsWith("/communications")
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <nav className="flex flex-col w-[220px] shrink-0 bg-white dark:bg-[#141418] border-r border-[#E5E7EB] dark:border-[#26262E] h-screen overflow-hidden">
      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5 px-4 h-[53px] border-b border-[#E5E7EB] dark:border-[#26262E] shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#111827] dark:bg-[#E8E8E8] flex items-center justify-center shrink-0">
          <AsteriskIcon className="w-[15px] h-[15px] text-white dark:text-[#111827]" />
        </div>
        <div>
          <p className="text-[13px] font-extrabold text-[#111827] dark:text-[#E8E8E8] leading-tight">SAYZO</p>
          <p className="text-[9.5px] font-bold text-[#8FA3A0] dark:text-[#6B7280] leading-tight tracking-widest uppercase">Admin Panel</p>
        </div>
      </div>

      {/* ── Nav items ── */}
      <div className="flex-1 overflow-y-auto pr-3 py-3">
        {/* WORKSPACE */}
        <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] dark:text-[#6B7280] uppercase pl-5 pr-2 mb-2">Workspace</p>
        <ul className="space-y-0.5 mb-4">
          {WORKSPACE.map((item) => {
            const on    = active(item.href)
            const badge = NAV_BADGES[item.href]
            return (
              <motion.li key={item.href}
                whileHover={!on ? { x: 2 } : {}}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.14 }}
                className="relative pl-3">
                {on && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#17B890] rounded-r-full" />
                )}
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[12.5px] transition-all duration-150",
                    on
                      ? "bg-[#E8F7F3] dark:bg-[#0A2A22] text-[#111827] dark:text-[#E8E8E8] font-bold"
                      : "font-medium text-[#374151] dark:text-[#9BA1A6] hover:bg-[#F5F8F7] dark:hover:bg-[#1C1C22] hover:text-[#111827] dark:hover:text-[#E8E8E8]"
                  )}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={16}
                    strokeWidth={on ? 2 : 1.5}
                    className={cn("shrink-0", on ? "text-[#17B890]" : "text-[#6B7280] dark:text-[#6B7280]")}
                  />
                  <span className="flex-1 leading-tight">{item.label}</span>
                  {badge && (
                    badge.alert ? (
                      <span className="min-w-[20px] h-[20px] rounded-full bg-[#FEE2E2] text-[#DC2626] text-[9.5px] font-black flex items-center justify-center px-[3px] shrink-0 leading-none tabular-nums">
                        {badge.count}
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-[#9CA3AF] dark:text-[#6B7280] shrink-0">
                        {badge.count}
                      </span>
                    )
                  )}
                </Link>
              </motion.li>
            )
          })}
        </ul>

        {/* PLATFORM */}
        <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] dark:text-[#6B7280] uppercase pl-5 pr-2 mb-2">Platform</p>
        <ul className="space-y-0.5">
          {PLATFORM.map((item) => {
            const on    = active(item.href)
            const badge = NAV_BADGES[item.href]
            return (
              <motion.li key={item.href}
                whileHover={!on ? { x: 2 } : {}}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.14 }}
                className="relative pl-3">
                {on && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#17B890] rounded-r-full" />
                )}
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[12.5px] transition-all duration-150",
                    on
                      ? "bg-[#E8F7F3] dark:bg-[#0A2A22] text-[#111827] dark:text-[#E8E8E8] font-bold"
                      : "font-medium text-[#374151] dark:text-[#9BA1A6] hover:bg-[#F5F8F7] dark:hover:bg-[#1C1C22] hover:text-[#111827] dark:hover:text-[#E8E8E8]"
                  )}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={16}
                    strokeWidth={on ? 2 : 1.5}
                    className={cn("shrink-0", on ? "text-[#17B890]" : "text-[#6B7280] dark:text-[#6B7280]")}
                  />
                  <span className="flex-1 leading-tight">{item.label}</span>
                  {badge && (
                    badge.alert ? (
                      <span className="min-w-[20px] h-[20px] rounded-full bg-[#FEE2E2] text-[#DC2626] text-[9.5px] font-black flex items-center justify-center px-[3px] shrink-0 leading-none tabular-nums">
                        {badge.count}
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-[#9CA3AF] dark:text-[#6B7280] shrink-0">
                        {badge.count}
                      </span>
                    )
                  )}
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </div>

      {/* ── Theme toggle + User profile ── */}
      <div className="border-t border-[#E5E7EB] dark:border-[#26262E] px-3 pt-2.5 pb-3 shrink-0 space-y-1">
        {/* Dark / Light toggle */}
        <motion.button
          whileHover={{ backgroundColor: theme === "dark" ? "#1C1C22" : "#F5F8F7" }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-2.5 py-2 rounded-lg transition-colors"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-[22px] h-[22px] flex items-center justify-center overflow-hidden shrink-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -45, scale: 0.4, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 45, scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] }}
                  className="flex items-center justify-center"
                >
                  <HugeiconsIcon
                    icon={theme === "dark" ? Sun01Icon : Moon02Icon}
                    size={16}
                    strokeWidth={1.8}
                    className={theme === "dark" ? "text-[#F59E0B]" : "text-[#6366F1]"}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <span className="text-[12px] font-medium text-[#374151] dark:text-[#9BA1A6]">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </span>
          </div>
          {/* Toggle pill */}
          <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${theme === "dark" ? "bg-[#17B890] shadow-[0_0_8px_#17B89044]" : "bg-[#D1D5DB]"}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${theme === "dark" ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>
        </motion.button>

        {/* User dropdown */}
        <UserDropdown direction="up" />
      </div>
    </nav>
  )
}
