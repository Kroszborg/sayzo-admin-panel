import { create } from "zustand"
import { TeamRole, MOCK_TEAM } from "@/lib/mock-data"

type RoleTab = "All members" | TeamRole

export interface PendingInvite {
  id:        string
  email:     string
  role:      TeamRole
  invitedBy: string
  sentAt:    string
  expiresAt: string
  status:    "Pending" | "Expired" | "Accepted"
}

type ColKey = "read" | "standard" | "admin" | "superadmin"

type PermMatrix = Record<string, Record<ColKey, boolean>>

const MODULES = ["Dashboard","Users","Tasks","Disputes","Payments","Support","Notifications","Team","Communications"] as const
const COLS: { key: ColKey; label: string }[] = [
  { key:"read",       label:"Read Only"   },
  { key:"standard",   label:"Standard"    },
  { key:"admin",      label:"Admin"       },
  { key:"superadmin", label:"Super Admin" },
]

// Pre-selected: Admin column = Dashboard,Users,Tasks,Disputes ✓ · Read Only = Payments ✓
const DEFAULT_PERMS: PermMatrix = Object.fromEntries(
  MODULES.map((mod) => [
    mod,
    {
      read:       mod === "Payments",
      standard:   false,
      admin:      ["Dashboard","Users","Tasks","Disputes"].includes(mod),
      superadmin: false,
    }
  ])
)

const SEED_INVITES: PendingInvite[] = [
  { id:"inv-1", email:"ananya.s@sayzo.in",   role:"Support Agent", invitedBy:"Aarav Sharma", sentAt:"Apr 30 · 2 days ago", expiresAt:"Expires May 7",  status:"Pending"  },
  { id:"inv-2", email:"dev.ops@sayzo.in",    role:"Viewer",        invitedBy:"Priya Reddy",  sentAt:"Apr 28 · 4 days ago", expiresAt:"Expires May 5",  status:"Pending"  },
  { id:"inv-3", email:"finance@sayzo.in",    role:"Admin",         invitedBy:"Aarav Sharma", sentAt:"Apr 22 · 10 days ago",expiresAt:"Expired",        status:"Expired"  },
]

interface TeamStore {
  // List
  activeTab:  RoleTab
  search:     string
  sortBy:     string
  invites:    PendingInvite[]

  setActiveTab: (t: RoleTab) => void
  setSearch:    (v: string) => void
  setSortBy:    (v: string) => void
  resendInvite: (id: string) => void
  cancelInvite: (id: string) => void

  // Invite form
  phone:       string
  email:       string
  expiry:      string
  perms:       PermMatrix
  submitting:  boolean
  success:     boolean

  setPhone:    (v: string) => void
  setEmail:    (v: string) => void
  setExpiry:   (v: string) => void
  togglePerm:  (mod: string, col: ColKey) => void
  toggleCol:   (col: ColKey) => void
  submitInvite:() => void
  resetForm:   () => void
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  activeTab:"All members", search:"", sortBy:"Sort: Last active",
  invites:SEED_INVITES,

  setActiveTab: (t) => set({ activeTab:t }),
  setSearch:    (v) => set({ search:v }),
  setSortBy:    (v) => set({ sortBy:v }),

  resendInvite: (id) => set((s) => ({
    invites: s.invites.map((inv) =>
      inv.id === id ? { ...inv, sentAt:"Just now", expiresAt:"Expires in 7 days", status:"Pending" } : inv
    ),
  })),
  cancelInvite: (id) => set((s) => ({
    invites: s.invites.filter((inv) => inv.id !== id),
  })),

  // Invite form
  phone:"", email:"", expiry:"Never",
  perms:DEFAULT_PERMS, submitting:false, success:false,

  setPhone:   (v) => set({ phone:v }),
  setEmail:   (v) => set({ email:v }),
  setExpiry:  (v) => set({ expiry:v }),

  togglePerm: (mod, col) => set((s) => ({
    perms: {
      ...s.perms,
      [mod]: { ...s.perms[mod], [col]: !s.perms[mod]?.[col] },
    }
  })),

  toggleCol: (col) => set((s) => {
    const allOn = MODULES.every((m) => s.perms[m]?.[col])
    return {
      perms: Object.fromEntries(
        MODULES.map((m) => [m, { ...s.perms[m], [col]: !allOn }])
      )
    }
  }),

  submitInvite: () => {
    set({ submitting:true })
    setTimeout(() => {
      const s = get()
      set({
        submitting:false, success:true,
        invites:[
          ...s.invites,
          { id:`inv-${Date.now()}`, email:s.email, role:"Admin",
            invitedBy:"Aarav Sharma", sentAt:"Just now", expiresAt:"Expires in 7 days", status:"Pending" },
        ],
      })
    }, 800)
  },

  resetForm: () => set({ phone:"", email:"", expiry:"Never", perms:DEFAULT_PERMS, success:false }),
}))

export { MODULES, COLS, type ColKey, type RoleTab }
