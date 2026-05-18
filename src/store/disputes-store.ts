import { create } from "zustand"
import { DispStatus, Priority } from "@/lib/mock-data"

interface InternalNote {
  id: string
  author: string
  content: string
  time: string
}

interface DisputesStore {
  // List
  activeTab:      DispStatus | "All"
  search:         string
  priorityFilter: string
  catFilter:      string
  assigneeFilter: string
  cityFilter:     string
  slaSort:        string
  page:           number
  selected:       Set<string>

  setActiveTab:     (t: DispStatus | "All") => void
  setSearch:        (v: string) => void
  setPriorityFilter:(v: string) => void
  setCatFilter:     (v: string) => void
  setAssigneeFilter:(v: string) => void
  setCityFilter:    (v: string) => void
  setSlaSort:       (v: string) => void
  setPage:          (p: number) => void
  toggleSelect:     (id: string) => void
  toggleSelectAll:  (ids: string[]) => void
  clearSelected:    () => void

  // Assign modal
  assignOpen:    boolean
  assignCaseId:  string
  assignSearch:  string
  selectedResolver: string | null

  setAssignOpen:    (v: boolean, caseId?: string) => void
  setAssignSearch:  (v: string) => void
  setResolver:      (id: string | null) => void
  confirmAssign:    () => void

  // Detail — notes
  notes:    InternalNote[]
  newNote:  string
  addNote:  () => void
  setNewNote:(v: string) => void

  // Evidence review
  previewFile: string | null
  setPreviewFile: (f: string | null) => void
}

const INITIAL_NOTES: InternalNote[] = [
  { id:"n1", author:"Aarav Sharma", content:"Reviewed transaction history. Payment was held for 6 days post-completion — escrow auto-hold triggered correctly. Waiting on doer evidence.", time:"2h ago" },
  { id:"n2", author:"Riya Verma",   content:"Called giver. Confirms work was completed but quality was below spec. Requesting deliverables from doer side.",                              time:"45m ago" },
]

export const useDisputesStore = create<DisputesStore>((set, get) => ({
  activeTab:"All", search:"", priorityFilter:"Priority: All", catFilter:"Category: All",
  assigneeFilter:"Assigned to: All", cityFilter:"All Cities", slaSort:"SLA: Most urgent",
  page:1, selected:new Set(),

  setActiveTab:      (t) => set({ activeTab:t, page:1 }),
  setSearch:         (v) => set({ search:v, page:1 }),
  setPriorityFilter: (v) => set({ priorityFilter:v }),
  setCatFilter:      (v) => set({ catFilter:v }),
  setAssigneeFilter: (v) => set({ assigneeFilter:v }),
  setCityFilter:     (v) => set({ cityFilter:v }),
  setSlaSort:        (v) => set({ slaSort:v }),
  setPage:           (p) => set({ page:p }),
  toggleSelect:      (id) => set((s) => {
    const n = new Set(s.selected); n.has(id) ? n.delete(id) : n.add(id); return { selected:n }
  }),
  toggleSelectAll:   (ids) => set((s) => {
    const allOn = ids.every((id) => s.selected.has(id))
    if (allOn) {
      const n = new Set(s.selected); ids.forEach((id) => n.delete(id)); return { selected:n }
    }
    const n = new Set(s.selected); ids.forEach((id) => n.add(id)); return { selected:n }
  }),
  clearSelected:     () => set({ selected:new Set() }),

  assignOpen:false, assignCaseId:"", assignSearch:"", selectedResolver:null,

  setAssignOpen: (v, caseId) => set({ assignOpen:v, assignCaseId:caseId ?? "", assignSearch:"", selectedResolver:null }),
  setAssignSearch: (v) => set({ assignSearch:v }),
  setResolver:     (id) => set({ selectedResolver:id }),
  confirmAssign:   () => set({ assignOpen:false }),

  notes:INITIAL_NOTES, newNote:"",
  addNote: () => {
    const note = get().newNote.trim()
    if (!note) return
    set((s) => ({
      notes:[...s.notes, { id:`n${Date.now()}`, author:"Aarav Sharma", content:note, time:"just now" }],
      newNote:"",
    }))
  },
  setNewNote: (v) => set({ newNote:v }),

  previewFile:null,
  setPreviewFile: (f) => set({ previewFile:f }),
}))
