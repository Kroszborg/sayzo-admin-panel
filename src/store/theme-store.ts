import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark"

interface ThemeStore {
  theme:     Theme
  toggleTheme: () => void
  setTheme:    (t: Theme) => void
}

function applyTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t)
  document.documentElement.classList.toggle("dark", t === "dark")
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",

      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light"
        set({ theme: next })
        applyTheme(next)
      },

      setTheme: (t) => {
        set({ theme: t })
        applyTheme(t)
      },
    }),
    {
      name:    "sayzo-theme",
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          applyTheme(state.theme)
        }
      },
    }
  )
)
