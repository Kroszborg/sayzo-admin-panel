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
} from "@hugeicons/core-free-icons"
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

// No badges in sidebar — badges only appear on the Module Home cards
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
    <nav className="flex flex-col w-[220px] shrink-0 bg-white border-r border-[#E5E7EB] h-screen overflow-hidden">
      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5 px-4 h-[53px] border-b border-[#E5E7EB] shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center shrink-0">
          <AsteriskIcon className="w-[15px] h-[15px] text-white" />
        </div>
        <div>
          <p className="text-[13px] font-extrabold text-[#111827] leading-tight">SAYZO</p>
          <p className="text-[9.5px] font-bold text-[#8FA3A0] leading-tight tracking-widest uppercase">Admin Panel</p>
        </div>
      </div>

      {/* ── Nav items ── */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {/* WORKSPACE */}
        <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase px-2 mb-2">Workspace</p>
        <ul className="space-y-0.5 mb-4">
          {WORKSPACE.map((item) => {
            const on = active(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[12.5px] font-medium transition-colors",
                    on ? "bg-[#E8F7F3] text-[#17B890] font-semibold" : "text-[#374151] hover:bg-[#F5F8F7] hover:text-[#111827]"
                  )}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={16}
                    strokeWidth={on ? 2 : 1.5}
                    className={on ? "text-[#17B890] shrink-0" : "text-[#6B7280] shrink-0"}
                  />
                  <span className="flex-1 leading-tight">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* PLATFORM */}
        <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase px-2 mb-2">Platform</p>
        <ul className="space-y-0.5">
          {PLATFORM.map((item) => {
            const on = active(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[12.5px] font-medium transition-colors",
                    on ? "bg-[#E8F7F3] text-[#17B890] font-semibold" : "text-[#374151] hover:bg-[#F5F8F7] hover:text-[#111827]"
                  )}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={16}
                    strokeWidth={on ? 2 : 1.5}
                    className={on ? "text-[#17B890] shrink-0" : "text-[#6B7280] shrink-0"}
                  />
                  <span className="leading-tight">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* ── Theme toggle + User profile ── */}
      <div className="border-t border-[#E5E7EB] px-3 pt-2.5 pb-3 shrink-0 space-y-1">
        {/* Dark / Light toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-2.5 py-2 rounded-lg hover:bg-[#F5F8F7] dark:hover:bg-[#1C1C22] transition-colors group"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[15px] leading-none">{theme === "dark" ? "☀️" : "🌙"}</span>
            <span className="text-[12px] font-medium text-[#374151]">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </span>
          </div>
          {/* Toggle pill */}
          <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${theme === "dark" ? "bg-[#17B890]" : "bg-[#D1D5DB]"}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${theme === "dark" ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>
        </button>

        {/* User dropdown */}
        <UserDropdown direction="up" />
      </div>
    </nav>
  )
}
