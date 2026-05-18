import { create } from "zustand"
import { TaskStatus } from "@/lib/mock-data"

type SortDir = "asc" | "desc"
type ClosureType = "full-refund" | "partial-payout" | "cancellation-fee"
type SplitType  = "percentage" | "fixed"

interface TasksStore {
  // List page
  activeTab:     TaskStatus | "All"
  search:        string
  roleFilter:    string
  cityFilter:    string
  sortDir:       SortDir
  page:          number
  rowsPerPage:   number
  selected:      Set<string>
  exportOpen:    boolean
  exportScope:   "all" | "filtered"
  exportRole:    string
  exportStatus:  string

  setActiveTab:    (t: TaskStatus | "All") => void
  setSearch:       (v: string) => void
  setRoleFilter:   (v: string) => void
  setCityFilter:   (v: string) => void
  setSortDir:      (d: SortDir) => void
  setPage:         (p: number) => void
  toggleSelect:    (id: string) => void
  toggleSelectAll: (ids: string[]) => void
  setExportOpen:   (v: boolean) => void
  setExportScope:  (v: "all" | "filtered") => void
  setExportRole:   (v: string) => void
  setExportStatus: (v: string) => void

  // Detail page
  actionOpen:     boolean
  closureType:    ClosureType
  splitType:      SplitType
  splitValue:     number
  totalEscrow:    number

  setActionOpen:  (v: boolean) => void
  setClosureType: (t: ClosureType) => void
  setSplitType:   (t: SplitType) => void
  setSplitValue:  (v: number) => void
  setTotalEscrow: (v: number) => void

  // Computed
  doerAmount:    () => number
  giverRefund:   () => number
  platformFee:   () => number
}

export const useTasksStore = create<TasksStore>((set, get) => ({
  activeTab:"All", search:"", roleFilter:"All Roles", cityFilter:"All Cities",
  sortDir:"desc", page:1, rowsPerPage:10, selected:new Set(),
  exportOpen:false, exportScope:"all", exportRole:"All", exportStatus:"All",

  setActiveTab:    (t) => set({ activeTab:t, page:1 }),
  setSearch:       (v) => set({ search:v, page:1 }),
  setRoleFilter:   (v) => set({ roleFilter:v, page:1 }),
  setCityFilter:   (v) => set({ cityFilter:v, page:1 }),
  setSortDir:      (d) => set({ sortDir:d }),
  setPage:         (p) => set({ page:p }),
  toggleSelect:    (id) => set((s) => {
    const n = new Set(s.selected); n.has(id) ? n.delete(id) : n.add(id); return { selected:n }
  }),
  toggleSelectAll: (ids) => set((s) => {
    const allOn = ids.every((id) => s.selected.has(id))
    if (allOn) {
      const n = new Set(s.selected); ids.forEach((id) => n.delete(id)); return { selected:n }
    }
    const n = new Set(s.selected); ids.forEach((id) => n.add(id)); return { selected:n }
  }),
  setExportOpen:   (v) => set({ exportOpen:v }),
  setExportScope:  (v) => set({ exportScope:v }),
  setExportRole:   (v) => set({ exportRole:v }),
  setExportStatus: (v) => set({ exportStatus:v }),

  actionOpen:false, closureType:"partial-payout",
  splitType:"percentage", splitValue:15, totalEscrow:1800,

  setActionOpen:  (v) => set({ actionOpen:v }),
  setClosureType: (t) => set({ closureType:t }),
  setSplitType:   (t) => set({ splitType:t }),
  setSplitValue:  (v) => set({ splitValue:v }),
  setTotalEscrow: (v) => set({ totalEscrow:v }),

  doerAmount: () => {
    const s = get()
    if (s.closureType === "full-refund")        return 0
    if (s.closureType === "cancellation-fee")   return s.totalEscrow
    const raw = s.splitType === "percentage"
      ? Math.round(s.totalEscrow * (s.splitValue / 100))
      : Math.min(s.splitValue, s.totalEscrow)
    return Math.round(raw * 0.88) // 12% platform fee on doer share
  },
  giverRefund: () => {
    const s = get()
    if (s.closureType === "full-refund") return s.totalEscrow
    if (s.closureType === "cancellation-fee") return 0
    return s.totalEscrow - get().doerAmount()
  },
  platformFee: () => Math.round(get().totalEscrow * 0.12),
}))
