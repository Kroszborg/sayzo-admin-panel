import { create } from "zustand"

export type FeedFilter = "All Events" | "Tasks" | "Disputes" | "Payments" | "Users" | "Trust" | "System"
export type Severity   = "all" | "critical" | "high" | "medium"

interface LiveFeedStore {
  selectedEventId: string | null
  activeFilter: FeedFilter
  severity: Severity
  exportOpen: boolean
  setSelectedEvent: (id: string | null) => void
  setFilter: (f: FeedFilter) => void
  setSeverity: (s: Severity) => void
  setExportOpen: (v: boolean) => void
}

export const useLiveFeedStore = create<LiveFeedStore>((set) => ({
  selectedEventId: "ev-1",
  activeFilter:    "All Events",
  severity:        "all",
  exportOpen:      false,
  setSelectedEvent: (id) => set({ selectedEventId: id }),
  setFilter:        (f)  => set({ activeFilter: f }),
  setSeverity:      (s)  => set({ severity: s }),
  setExportOpen:    (v)  => set({ exportOpen: v }),
}))
