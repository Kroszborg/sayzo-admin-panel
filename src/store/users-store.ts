import { create } from "zustand"

type SortDir = "asc" | "desc"

interface UsersStore {
  search:       string
  roleFilter:   string
  availFilter:  string
  cityFilter:   string
  joinedFilter: string
  sortCol:      string
  sortDir:      SortDir
  page:         number
  rowsPerPage:  number
  selected:     Set<string>
  exportOpen:   boolean
  exportScope:  "all" | "filtered"
  exportRole:   string
  exportStatus: string

  setSearch:       (v: string)    => void
  setRoleFilter:   (v: string)    => void
  setAvailFilter:  (v: string)    => void
  setCityFilter:   (v: string)    => void
  setJoinedFilter: (v: string)    => void
  setSort:         (col: string, dir: SortDir) => void
  setPage:         (p: number)    => void
  toggleSelect:    (id: string)   => void
  toggleSelectAll: (ids: string[])=> void
  clearSelected:   ()             => void
  setExportOpen:   (v: boolean)   => void
  setExportScope:  (v: "all" | "filtered") => void
  setExportRole:   (v: string)    => void
  setExportStatus: (v: string)    => void
}

export const useUsersStore = create<UsersStore>((set, get) => ({
  search:"", roleFilter:"All Roles", availFilter:"Availability",
  cityFilter:"All Cities", joinedFilter:"Joined Time",
  sortCol:"name", sortDir:"asc", page:1, rowsPerPage:10,
  selected: new Set(), exportOpen:false, exportScope:"all",
  exportRole:"All", exportStatus:"All",

  setSearch:       (v)  => set({ search:v, page:1 }),
  setRoleFilter:   (v)  => set({ roleFilter:v, page:1 }),
  setAvailFilter:  (v)  => set({ availFilter:v }),
  setCityFilter:   (v)  => set({ cityFilter:v, page:1 }),
  setJoinedFilter: (v)  => set({ joinedFilter:v }),
  setSort: (col, dir)   => set({ sortCol:col, sortDir:dir }),
  setPage:         (p)  => set({ page:p }),

  toggleSelect: (id) => set((s) => {
    const n = new Set(s.selected)
    n.has(id) ? n.delete(id) : n.add(id)
    return { selected: n }
  }),
  toggleSelectAll: (ids) => set((s) => {
    const allOn = ids.every((id) => s.selected.has(id))
    if (allOn) {
      const n = new Set(s.selected); ids.forEach((id) => n.delete(id)); return { selected:n }
    }
    const n = new Set(s.selected); ids.forEach((id) => n.add(id)); return { selected:n }
  }),
  clearSelected: () => set({ selected: new Set() }),

  setExportOpen:   (v) => set({ exportOpen:v }),
  setExportScope:  (v) => set({ exportScope:v }),
  setExportRole:   (v) => set({ exportRole:v }),
  setExportStatus: (v) => set({ exportStatus:v }),
}))
