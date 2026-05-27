"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { usePageStore } from "@/store/page-store"
import { cn } from "@/lib/utils"

// Human-readable labels for route segments
const SEG_LABELS: Record<string, string> = {
  dashboard:      "Dashboard",
  users:          "Users",
  tasks:          "Tasks",
  disputes:       "Disputes",
  payments:       "Payments",
  support:        "Support",
  communications: "Communications",
  "live-support": "Live Support",
  broadcast:      "Broadcast",
  team:           "Team",
  invite:         "New Invite",
  notifications:  "Notifications",
  "live-feed":    "Live Feed",
  modules:        "Home",
}

// Base hrefs for each segment (for breadcrumb links)
const SEG_HREF: Record<string, string> = {
  users:          "/users",
  tasks:          "/tasks",
  disputes:       "/disputes",
  payments:       "/payments",
  support:        "/support",
  communications: "/communications/live-support",
  team:           "/team",
  notifications:  "/notifications",
  "live-feed":    "/live-feed",
}

function formatIST(d: Date) {
  return d.toLocaleString("en-IN", {
    weekday: "short",
    month:   "short",
    day:     "numeric",
    hour:    "2-digit",
    minute:  "2-digit",
    hour12:  true,
    timeZone: "Asia/Kolkata",
  }) + " IST"
}

// Build breadcrumb entries from pathname
function buildCrumbs(pathname: string): { label: string; href?: string }[] {
  const segs = pathname.split("/").filter(Boolean)
  const crumbs: { label: string; href?: string }[] = []

  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i]
    // Skip dynamic segments like [id]
    if (seg.startsWith("[")) continue
    // Skip Next.js route groups like (dashboard)
    if (seg.startsWith("(")) continue

    const label = SEG_LABELS[seg]
    if (!label) continue

    // Is this the last meaningful segment?
    const isLast = i === segs.length - 1 || segs.slice(i + 1).every((s) => s.startsWith("[") || s.startsWith("(") || !SEG_LABELS[s])
    const href = !isLast ? SEG_HREF[seg] : undefined
    crumbs.push({ label, href })
  }

  return crumbs
}

export function TopBar() {
  const pathname        = usePathname()
  const { pageActions } = usePageStore()
  const [now, setNow]   = useState("")

  useEffect(() => {
    setNow(formatIST(new Date()))
    const id = setInterval(() => setNow(formatIST(new Date())), 60_000)
    return () => clearInterval(id)
  }, [])

  const crumbs = buildCrumbs(pathname)

  return (
    <header className="shrink-0 flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#26262E] bg-white dark:bg-[#141418] px-5 h-[53px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5" aria-label="Breadcrumb">
        <Link href="/modules" className="text-[11.5px] text-[#8FA3A0] dark:text-[#6B7280] hover:text-[#374151] dark:hover:text-[#9BA1A6] transition-colors">
          Modules
        </Link>
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <HugeiconsIcon icon={ArrowRight01Icon} size={10} strokeWidth={2} className="text-[#D1D5DB] dark:text-[#26262E]" />
            {c.href ? (
              <Link href={c.href} className="text-[11.5px] text-[#8FA3A0] dark:text-[#6B7280] hover:text-[#374151] dark:hover:text-[#9BA1A6] transition-colors">
                {c.label}
              </Link>
            ) : (
              <span className={cn(
                "text-[11.5px]",
                i === crumbs.length - 1 ? "font-semibold text-[#1A2421] dark:text-[#E8E8E8]" : "text-[#8FA3A0] dark:text-[#6B7280]"
              )}>
                {c.label}
              </span>
            )}
          </span>
        ))}
      </nav>

      {/* Right: page-level actions + date pill */}
      <div className="flex items-center gap-3">
        {pageActions}
        {now && (
          <span className="flex items-center gap-1.5 border border-[#E2E8E6] dark:border-[#26262E] rounded-lg px-3 py-1.5 text-[11px] text-[#8FA3A0] dark:text-[#6B7280] bg-white dark:bg-[#1C1C22] whitespace-nowrap">
            <HugeiconsIcon icon={Calendar01Icon} size={12} strokeWidth={1.5} />
            {now}
          </span>
        )}
      </div>
    </header>
  )
}
