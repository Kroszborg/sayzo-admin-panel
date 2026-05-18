import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark"

interface ThemeStore {
  theme:     Theme
  toggleTheme: () => void
  setTheme:    (t: Theme) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",

      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light"
        set({ theme: next })
        document.documentElement.setAttribute("data-theme", next)
      },

      setTheme: (t) => {
        set({ theme: t })
        document.documentElement.setAttribute("data-theme", t)
      },
    }),
    {
      name:    "sayzo-theme",
      // On rehydration, apply the stored theme to the DOM
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          document.documentElement.setAttribute("data-theme", state.theme)
        }
      },
    }
  )
)
