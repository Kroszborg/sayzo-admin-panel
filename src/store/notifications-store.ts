import { create } from "zustand"

export type NotifCategory = "All" | "Users" | "Task Updates" | "Payments" | "Support" | "System"
export type NotifSeverity = "info" | "warning" | "critical" | "success"

export interface Notification {
  id:          string
  category:    Exclude<NotifCategory, "All">
  title:       string
  description: string
  cta:         string
  redirectUrl: string
  createdAt:   string
  group:       "Today" | "Yesterday" | "Older"
  severity:    NotifSeverity
  isRead:      boolean
}

interface NotificationsStore {
  activeTab:   NotifCategory
  notifications: Notification[]

  setTab:     (t: NotifCategory) => void
  markRead:   (id: string) => void
  markAllRead:() => void
  unreadCount:(cat?: NotifCategory) => number
}

const SEED: Notification[] = [
  // ─ Today ─
  { id:"n01", category:"Support",       severity:"critical", isRead:false, group:"Today",
    title:"SLA breach on TKT-2026-1841",
    description:"Ticket has been unassigned for 6h+ and breached first-response SLA.",
    cta:"Open →",        redirectUrl:"/support/TKT-2026-1841",      createdAt:"2 min ago"   },

  { id:"n02", category:"Payments",      severity:"critical", isRead:false, group:"Today",
    title:"Payout failed — PAY-87234",
    description:"UPI transfer to vikram.k@oksbi failed after 3 retries. ₹3,250 stuck.",
    cta:"Inspect →",     redirectUrl:"/payments/PAY-87234",           createdAt:"14 min ago"  },

  { id:"n03", category:"Users",         severity:"critical", isRead:false, group:"Today",
    title:"Suspicious signup cluster detected",
    description:"8 accounts created in 12 min from the same device fingerprint in Delhi NCR.",
    cta:"Review →",      redirectUrl:"/users",                        createdAt:"29 min ago"  },

  { id:"n04", category:"Task Updates",  severity:"warning",  isRead:false, group:"Today",
    title:"Auto-match failed — TSK-19239",
    description:"No doers within 3 km radius for 'HR Policy Document' in Pune. Re-queued.",
    cta:"View →",        redirectUrl:"/tasks/TSK-19239",              createdAt:"47 min ago"  },

  { id:"n05", category:"Payments",      severity:"warning",  isRead:false, group:"Today",
    title:"High-value escrow — ₹18,000 held",
    description:"ML model fraud detection task funded by Raj P. 72h release window active.",
    cta:"Inspect →",     redirectUrl:"/payments/PAY-87214",           createdAt:"1h ago"      },

  { id:"n06", category:"Users",         severity:"info",     isRead:true,  group:"Today",
    title:"5 new users onboarded",
    description:"3 Task Doers and 2 Task Givers in the last hour. KYC pending for 2 accounts.",
    cta:"Review →",      redirectUrl:"/users",                        createdAt:"1h 20m ago"  },

  { id:"n07", category:"Support",       severity:"warning",  isRead:true,  group:"Today",
    title:"Unresolved ticket cluster — Payments",
    description:"9 open payment-related tickets with no assigned agent. Avg wait: 3h 12m.",
    cta:"Open →",        redirectUrl:"/support",                      createdAt:"2h ago"      },

  { id:"n08", category:"Task Updates",  severity:"info",     isRead:true,  group:"Today",
    title:"High-value task posted — ₹18,000",
    description:"ML fraud detection project posted by Raj P. in Ahmedabad. 1 doer nearby.",
    cta:"View →",        redirectUrl:"/tasks/TSK-19232",              createdAt:"2h 30m ago"  },

  { id:"n09", category:"System",        severity:"success",  isRead:true,  group:"Today",
    title:"Daily backup completed",
    description:"All 47 database shards backed up successfully. Encrypted offsite at 04:00 IST.",
    cta:"Review →",      redirectUrl:"/notifications",                createdAt:"5h ago"      },

  // ─ Yesterday ─
  { id:"n10", category:"Payments",      severity:"success",  isRead:true,  group:"Yesterday",
    title:"Auto-release completed — 34 payouts",
    description:"₹1,12,600 released to doers across 34 tasks. All within 72h review window.",
    cta:"Inspect →",     redirectUrl:"/payments",                     createdAt:"Yesterday, 10:44 AM" },

  { id:"n11", category:"Users",         severity:"warning",  isRead:true,  group:"Yesterday",
    title:"Trust score dropped — USR-0022",
    description:"Amit Sharma's trust score fell from 45 to 28 after 3rd dispute in 30 days.",
    cta:"Review →",      redirectUrl:"/users/USR-0022",               createdAt:"Yesterday, 2:18 PM" },

  { id:"n12", category:"Task Updates",  severity:"info",     isRead:true,  group:"Yesterday",
    title:"Mobile UI/UX task force-closed",
    description:"TSK-19287 force-closed by Admin Priyanka R. Full refund issued to giver.",
    cta:"View →",        redirectUrl:"/tasks/TSK-19287",              createdAt:"Yesterday, 4:51 PM" },

  { id:"n13", category:"Support",       severity:"info",     isRead:true,  group:"Yesterday",
    title:"Ticket resolved — TKT-2026-1832",
    description:"Email notification issue resolved by Aarav S. User confirmed fix. SLA met.",
    cta:"Open →",        redirectUrl:"/support/TKT-2026-1832",        createdAt:"Yesterday, 6:03 PM" },

  { id:"n14", category:"System",        severity:"warning",  isRead:true,  group:"Yesterday",
    title:"AI moderation queue delay — 18 min",
    description:"Worker backlog caused 18-min delay processing flagged messages. Resolved.",
    cta:"Review →",      redirectUrl:"/notifications",                createdAt:"Yesterday, 11:22 PM" },

  // ─ Older ─
  { id:"n15", category:"Payments",      severity:"critical", isRead:true,  group:"Older",
    title:"Escrow stuck — PAY-87228 (₹4,200)",
    description:"Android app testing dispute payment stuck for 5 days. Manual intervention needed.",
    cta:"Inspect →",     redirectUrl:"/payments/PAY-87228",           createdAt:"Apr 10, 9:14 AM"    },

  { id:"n16", category:"Users",         severity:"info",     isRead:true,  group:"Older",
    title:"KYC verification spike — 24 in 2h",
    description:"Aadhaar OCR processed 24 verifications. 22 auto-approved, 2 manual review.",
    cta:"Review →",      redirectUrl:"/users",                        createdAt:"Apr 9, 3:45 PM"     },

  { id:"n17", category:"System",        severity:"info",     isRead:true,  group:"Older",
    title:"API latency increased — gateway",
    description:"P99 latency spiked to 840ms for 6 minutes. Root cause: DB pool exhaustion.",
    cta:"Review →",      redirectUrl:"/notifications",                createdAt:"Apr 8, 1:30 AM"     },
]

const SEV_DOT: Record<NotifSeverity, string> = {
  critical:"#EF4444", warning:"#F59E0B", info:"#3B82F6", success:"#17B890",
}

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  activeTab:     "All",
  notifications: SEED,

  setTab:   (t) => set({ activeTab:t }),

  markRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => n.id === id ? { ...n, isRead:true } : n)
  })),

  markAllRead: () => set((s) => ({
    notifications: s.notifications.map((n) => ({ ...n, isRead:true }))
  })),

  unreadCount: (cat) => {
    const all = get().notifications
    if (!cat || cat === "All") return all.filter((n) => !n.isRead).length
    return all.filter((n) => n.category === cat && !n.isRead).length
  },
}))

export { SEV_DOT }
