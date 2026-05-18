import { create } from "zustand"

interface PageStore {
  pageActions: React.ReactNode | null
  setPageActions: (actions: React.ReactNode | null) => void
}

export const usePageStore = create<PageStore>((set) => ({
  pageActions: null,
  setPageActions: (actions) => set({ pageActions: actions }),
}))
