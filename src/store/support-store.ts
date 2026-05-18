import { create } from "zustand"
import { TktStatus } from "@/lib/mock-data"

export interface SupportMessage {
  id:     string
  from:   "user" | "agent"
  name:   string
  role:   string
  time:   string
  body:   string
  attach?: string
}

interface SupportStore {
  // List
  activeTab:   TktStatus | "All"
  search:      string
  cityFilter:  string
  sortFilter:  string
  page:        number
  selected:    Set<string>

  setActiveTab:    (t: TktStatus | "All") => void
  setSearch:       (v: string) => void
  setCityFilter:   (v: string) => void
  setSortFilter:   (v: string) => void
  setPage:         (p: number) => void
  toggleSelect:    (id: string) => void
  toggleSelectAll: (ids: string[]) => void
  clearSelected:   () => void

  // Assign modal
  assignOpen:       boolean
  assignTicketId:   string
  assignSearch:     string
  selectedAgent:    string | null

  setAssignOpen:    (v: boolean, id?: string) => void
  setAssignSearch:  (v: string) => void
  setSelectedAgent: (id: string | null) => void
  confirmAssign:    () => void

  // Detail — thread
  messages:   SupportMessage[]
  replyText:  string
  sending:    boolean

  setReplyText: (v: string) => void
  sendReply:    () => void
  markResolved: (id: string) => void
}

const SEED_MESSAGES: SupportMessage[] = [
  { id:"m1", from:"user",  name:"Vikram Kumar",   role:"Doer",  time:"5h ago",     body:"Hi, I completed the task 3 days ago. The giver confirmed it was done and I can see it's marked complete on the app. But my payment hasn't been released yet. It's been stuck for 3 days now." },
  { id:"m2", from:"agent", name:"Aarav Sharma",   role:"Admin", time:"4h 30m ago", body:"Hi Vikram, thanks for reaching out. I can see your task TSK-19250 is marked complete. The payment is currently in the 72-hour review window. I'm checking with our payments team right now.", attach:"task_history.png" },
  { id:"m3", from:"user",  name:"Vikram Kumar",   role:"Doer",  time:"3h ago",     body:"The 72-hour window ended yesterday. I checked with the giver and she says she released it but I still haven't received anything in my UPI account. Can you please help?" },
  { id:"m4", from:"agent", name:"Riya Verma",     role:"Agent", time:"2h ago",     body:"I've escalated this to our payments reconciliation team. The payout reference is NEFT20240417001. There may be a 24-hour bank processing delay. I'll update you as soon as it's confirmed on our end." },
]

export const useSupportStore = create<SupportStore>((set, get) => ({
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

  assignOpen:false, assignTicketId:"", assignSearch:"", selectedAgent:null,

  setAssignOpen:    (v, id) => set({ assignOpen:v, assignTicketId:id ?? "", assignSearch:"", selectedAgent:null }),
  setAssignSearch:  (v) => set({ assignSearch:v }),
  setSelectedAgent: (id) => set({ selectedAgent:id }),
  confirmAssign:    () => set({ assignOpen:false }),

  messages:SEED_MESSAGES, replyText:"", sending:false,

  setReplyText: (v) => set({ replyText:v }),
  sendReply: () => {
    const body = get().replyText.trim()
    if (!body || get().sending) return
    set({ sending:true })
    setTimeout(() => {
      set((s) => ({
        messages:[
          ...s.messages,
          {
            id:`m${Date.now()}`, from:"agent", name:"Aarav Sharma", role:"Admin",
            time:"Just now",
            body,
          },
        ],
        replyText:"",
        sending:false,
      }))
    }, 400)
  },
  markResolved: (id) => { /* would update ticket status in real app */ },
}))
