import { create } from "zustand"

type AlertType = "success" | "error" | "warning" | "info"

interface Alert {
  id:      string
  type:    AlertType
  message: string
}

interface AlertStore {
  alerts: Alert[]
  show:   (type: AlertType, message: string) => void
  dismiss:(id: string) => void
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],

  show: (type, message) => {
    const id = `a${Date.now()}`
    set((s) => ({ alerts: [...s.alerts, { id, type, message }] }))
    // Auto-dismiss after 3.5s
    setTimeout(() => {
      set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) }))
    }, 3500)
  },

  dismiss: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
}))
