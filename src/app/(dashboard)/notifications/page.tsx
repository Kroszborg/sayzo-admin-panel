"use client"

import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon, AlertDiamondIcon, InformationCircleIcon,
  TaskDone01Icon, UserMultiple02Icon, CreditCardIcon,
  CustomerServiceIcon, Settings01Icon,
} from "@hugeicons/core-free-icons"
import {
  useNotificationsStore,
  NotifCategory, NotifSeverity, Notification, SEV_DOT,
} from "@/store/notifications-store"
import { cn } from "@/lib/utils"

// ─── Tab config ────────────────────────────────────────────────────────────

const TABS: NotifCategory[] = ["All","Users","Task Updates","Payments","Support","System"]

const TAB_ICONS: Record<NotifCategory, typeof CheckmarkCircle02Icon> = {
  "All":          CheckmarkCircle02Icon,
  "Users":        UserMultiple02Icon,
  "Task Updates": TaskDone01Icon,
  "Payments":     CreditCardIcon,
  "Support":      CustomerServiceIcon,
  "System":       Settings01Icon,
}

// ─── Severity icon ─────────────────────────────────────────────────────────

function SevIcon({ sev, size = 14 }: { sev: NotifSeverity; size?: number }) {
  const map = {
    critical: { Icon:AlertDiamondIcon,      cls:"text-[#EF4444]" },
    warning:  { Icon:AlertDiamondIcon,      cls:"text-[#F59E0B]" },
    info:     { Icon:InformationCircleIcon, cls:"text-[#3B82F6]" },
    success:  { Icon:CheckmarkCircle02Icon, cls:"text-[#17B890]" },
  }
  const { Icon, cls } = map[sev]
  return <HugeiconsIcon icon={Icon} size={size} strokeWidth={1.5} className={cls} />
}

// ─── Category icon + dot colour ────────────────────────────────────────────

const CAT_BG: Record<string, string> = {
  "Users":        "bg-[#DBEAFE]",
  "Task Updates": "bg-[#EEF2FF]",
  "Payments":     "bg-[#DCFCE7]",
  "Support":      "bg-[#FEF3C7]",
  "System":       "bg-[#F3F4F6]",
}
const CAT_COLOR: Record<string, string> = {
  "Users":        "text-[#2563EB]",
  "Task Updates": "text-[#6366F1]",
  "Payments":     "text-[#17B890]",
  "Support":      "text-[#D97706]",
  "System":       "text-[#6B7280]",
}

// ─── Single notification row ───────────────────────────────────────────────

function NotifRow({ n, onRead }: { n: Notification; onRead: (id: string) => void }) {
  const router  = useRouter()

  const handleClick = () => {
    onRead(n.id)
    router.push(n.redirectUrl)
  }

  const handleCta = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRead(n.id)
    router.push(n.redirectUrl)
  }

  return (
    <motion.div
      layout
      initial={{ opacity:0, y:4 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, y:-2 }}
      transition={{ duration:0.18 }}
      onClick={handleClick}
      className={cn(
        "flex items-start gap-3 px-5 py-3.5 border-b border-[#F9FAFB] cursor-pointer transition-colors last:border-0",
        !n.isRead ? "bg-[#FAFFF9]" : "hover:bg-[#FAFAFA]"
      )}
    >
      {/* Category icon */}
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
        CAT_BG[n.category] ?? "bg-[#F3F4F6]"
      )}>
        <HugeiconsIcon icon={TAB_ICONS[n.category]} size={15} strokeWidth={1.5}
          className={CAT_COLOR[n.category] ?? "text-[#6B7280]"} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <p className={cn("text-[12.5px] leading-snug", !n.isRead ? "font-bold text-[#111827]" : "font-semibold text-[#374151]")}>
            {n.title}
          </p>
          <SevIcon sev={n.severity} size={12} />
          {!n.isRead && (
            <span className="text-[9px] font-black uppercase tracking-wide text-[#17B890] bg-[#E8F7F3] rounded px-1.5 py-0.5">
              NEW
            </span>
          )}
        </div>
        <p className="text-[11.5px] text-[#8FA3A0] leading-snug">{n.description}</p>
      </div>

      {/* CTA + timestamp + dot */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <button
          onClick={handleCta}
          className="h-6 px-2.5 rounded-lg bg-[#17B890] hover:opacity-90 text-white text-[10.5px] font-bold transition-opacity whitespace-nowrap"
        >
          {n.cta}
        </button>
        <div className="flex items-center gap-1.5">
          <span className="text-[10.5px] text-[#8FA3A0] whitespace-nowrap">{n.createdAt}</span>
          <AnimatePresence>
            {!n.isRead && (
              <motion.div
                initial={{ scale:0, opacity:0 }}
                animate={{ scale:1, opacity:1 }}
                exit={{ scale:0, opacity:0 }}
                transition={{ duration:0.2 }}
                className="w-2 h-2 rounded-full bg-[#17B890] shrink-0"
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const s = useNotificationsStore()

  // Filter by active tab
  const visible = s.notifications.filter((n) =>
    s.activeTab === "All" ? true : n.category === s.activeTab
  )

  // Group
  const groups: { label: string; items: Notification[] }[] = [
    { label:"Today",     items: visible.filter((n) => n.group === "Today")     },
    { label:"Yesterday", items: visible.filter((n) => n.group === "Yesterday") },
    { label:"Older",     items: visible.filter((n) => n.group === "Older")     },
  ].filter((g) => g.items.length > 0)

  const totalUnread  = s.unreadCount("All")
  const tabUnread    = s.activeTab === "All" ? totalUnread : s.unreadCount(s.activeTab)

  return (
    <div>
      {/* ── Page header ── */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22 }}
        className="flex items-center justify-between mb-5">
        <h1 className="text-[20px] font-extrabold text-[#111827]">Notifications</h1>
        {totalUnread > 0 && (
          <button onClick={s.markAllRead}
            className="flex items-center gap-1.5 h-8 px-3 border border-[#E2E8E6] rounded-lg text-[12px] font-semibold text-[#374151] bg-white hover:bg-[#F5F8F7] transition-colors">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={1.5} className="text-[#17B890]" />
            Mark all read
          </button>
        )}
      </motion.div>

      {/* ── Category tabs ── */}
      <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22, delay:0.04 }}
        className="flex bg-white border border-[#E5E7EB] rounded-t-xl overflow-x-auto">
        {TABS.map((tab) => {
          const active  = s.activeTab === tab
          const unread  = s.unreadCount(tab === "All" ? undefined : tab as any)
          return (
            <button key={tab} onClick={() => s.setTab(tab)}
              className={cn("flex items-center gap-1.5 px-4 py-3 text-[12.5px] font-medium border-b-2 whitespace-nowrap transition-colors",
                active ? "border-[#17B890] text-[#17B890] font-bold" : "border-transparent text-[#8FA3A0] hover:text-[#374151]"
              )}>
              <HugeiconsIcon icon={TAB_ICONS[tab]} size={14} strokeWidth={active ? 2 : 1.5}
                className={active ? "text-[#17B890]" : "text-[#8FA3A0]"} />
              {tab}
              {unread > 0 && (
                <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-full",
                  active ? "bg-[#17B890] text-white" : "bg-[#F3F4F6] text-[#8FA3A0]"
                )}>{unread}</span>
              )}
            </button>
          )
        })}
      </motion.div>

      {/* ── Main card ── */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.26, delay:0.08 }}
        className="bg-white border-l border-r border-b border-[#E5E7EB] rounded-b-xl overflow-hidden">

        {/* Unread header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#F3F4F6] bg-[#F9FAFB]">
          <p className="text-[12px] font-semibold text-[#374151]">
            {tabUnread > 0
              ? <><span className="font-extrabold text-[#17B890]">{tabUnread}</span> unread notification{tabUnread !== 1 ? "s" : ""}</>
              : <span className="text-[#8FA3A0]">You're all caught up ✓</span>
            }
          </p>
          {tabUnread > 0 && (
            <button onClick={s.markAllRead}
              className="text-[11.5px] font-semibold text-[#8FA3A0] hover:text-[#17B890] transition-colors">
              Mark all read
            </button>
          )}
        </div>

        {/* Grouped notifications */}
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={28} strokeWidth={1} className="text-[#D1D5DB] mb-3" />
            <p className="text-[13.5px] font-semibold text-[#8FA3A0]">No notifications</p>
            <p className="text-[12px] text-[#D1D5DB] mt-1">Nothing to show for this category</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {groups.map((group) => (
              <div key={group.label}>
                {/* Group label */}
                <div className="px-5 py-2 bg-[#F9FAFB] border-b border-[#F3F4F6]">
                  <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase">{group.label}</p>
                </div>
                {/* Rows */}
                {group.items.map((n) => (
                  <NotifRow key={n.id} n={n} onRead={s.markRead} />
                ))}
              </div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  )
}
