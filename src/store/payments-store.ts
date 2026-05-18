import { create } from "zustand"
import { PayStatus } from "@/lib/mock-data"

interface PaymentsStore {
  // List
  activeTab:   PayStatus | "All"
  search:      string
  cityFilter:  string
  sortFilter:  string
  page:        number
  selected:    Set<string>

  setActiveTab:  (t: PayStatus | "All") => void
  setSearch:     (v: string) => void
  setCityFilter: (v: string) => void
  setSortFilter: (v: string) => void
  setPage:       (p: number) => void
  toggleSelect:    (id: string) => void
  toggleSelectAll: (ids: string[]) => void
  clearSelected:   () => void
}

export const usePaymentsStore = create<PaymentsStore>((set) => ({
  activeTab:"All", search:"", cityFilter:"All Cities", sortFilter:"Sort: Newest",
  page:1, selected:new Set(),

  setActiveTab:  (t) => set({ activeTab:t, page:1 }),
  setSearch:     (v) => set({ search:v, page:1 }),
  setCityFilter: (v) => set({ cityFilter:v }),
  setSortFilter: (v) => set({ sortFilter:v }),
  setPage:       (p) => set({ page:p }),
  toggleSelect: (id) => set((s) => {
    const n = new Set(s.selected); n.has(id) ? n.delete(id) : n.add(id); return { selected:n }
  }),
  toggleSelectAll: (ids) => set((s) => {
    const allOn = ids.every((id) => s.selected.has(id))
    if (allOn) {
      const n = new Set(s.selected); ids.forEach((id) => n.delete(id)); return { selected:n }
    }
    const n = new Set(s.selected); ids.forEach((id) => n.add(id)); return { selected:n }
  }),
  clearSelected: () => set({ selected:new Set() }),
}))
