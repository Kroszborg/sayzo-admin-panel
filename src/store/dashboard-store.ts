import { create } from "zustand"

export type DatePreset = "Today" | "Yesterday" | "Last 7 days" | "Last 30 days" | "This month" | "Custom"
export type ReportType = "platform" | "users" | "tasks" | "financial" | "disputes"

interface DashboardStore {
  exportOpen:     boolean
  reportType:     ReportType
  datePreset:     DatePreset
  setExportOpen:  (v: boolean) => void
  setReportType:  (t: ReportType) => void
  setDatePreset:  (p: DatePreset) => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  exportOpen:    false,
  reportType:    "tasks",
  datePreset:    "Last 30 days",
  setExportOpen: (v) => set({ exportOpen: v }),
  setReportType: (t) => set({ reportType: t }),
  setDatePreset: (p) => set({ datePreset: p }),
}))
