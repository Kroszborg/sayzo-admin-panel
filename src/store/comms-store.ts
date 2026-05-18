import { create } from "zustand"

export interface ChatMessage {
  id:       string
  from:     "user" | "agent"
  name:     string
  role:     string
  body:     string
  time:     string
  attach?:  { name:string; type:string; size:string }
  isImage?: boolean
}

export interface Conversation {
  id:       string
  userId:   string
  userName: string
  taskRef:  string
  ticketId: string
  preview:  string
  time:     string
  unread:   number
  online:   boolean
  messages: ChatMessage[]
}

const SEED_CONVS: Conversation[] = [
  {
    id:"c1", userId:"USR-0004", userName:"Sneha R.",
    taskRef:"TSK-19250", ticketId:"#TKT-4821",
    preview:"My payment still hasn't been released...",
    time:"2m ago", unread:2, online:true,
    messages:[
      { id:"m1", from:"user", name:"Sneha R.",     role:"Doer",  time:"10:24 AM",
        body:"Hi, I completed the task TSK-19250 three days ago and the giver confirmed it. But my payment ₹22,000 still hasn't been released. Can you help?" },
      { id:"m2", from:"agent",name:"Aarav Sharma",  role:"Admin", time:"10:26 AM",
        body:"Hey Sneha! Thanks for reaching out. I can see your task is marked complete. Let me check the escrow status right now.",
        attach:{ name:"payment_status.pdf", type:"PDF", size:"0.4 MB" } },
      { id:"m3", from:"user", name:"Sneha R.",     role:"Doer",  time:"10:28 AM",
        body:"Sure! The giver even sent a message saying the work was great. But the payment is still not released and it's been 3 days now." },
      { id:"m4", from:"agent",name:"Riya Verma",    role:"Agent", time:"10:29 AM",
        body:"I can see the 72-hour review window closed yesterday. The payout reference is NEFT20240417001 — I've escalated to our payments team. You should receive it within 4 hours.",
        isImage:true },
    ]
  },
  {
    id:"c2", userId:"USR-0005", userName:"Arjun K.",
    taskRef:"TSK-19284", ticketId:"#TKT-4821",
    preview:"Lorem Ipsum Lorem Ipsum",
    time:"1h ago", unread:1, online:true,
    messages:[
      { id:"m1", from:"user", name:"Arjun K.", role:"Giver", time:"9:00 AM",
        body:"I have an issue with the task deliverables. The doer submitted work that doesn't match the brief." },
      { id:"m2", from:"agent",name:"Aarav Sharma", role:"Admin", time:"9:15 AM",
        body:"Hi Arjun, I understand. Can you describe specifically what's missing? I can help mediate or open a formal dispute if needed." },
    ]
  },
  {
    id:"c3", userId:"USR-0006", userName:"Priya S.",
    taskRef:"TSK-19244", ticketId:"#TKT-4821",
    preview:"Lorem Ipsum Lorem Ipsum...",
    time:"2d ago", unread:0, online:false,
    messages:[
      { id:"m1", from:"user", name:"Priya S.", role:"Giver", time:"2 days ago",
        body:"Can you check my account status? I can't view my task history." },
    ]
  },
  {
    id:"c4", userId:"USR-0007", userName:"Vikram N.",
    taskRef:"TSK-19251", ticketId:"#TKT-4821",
    preview:"Lorem Ipsum Lorem Ipsum...",
    time:"6d ago", unread:0, online:false,
    messages:[
      { id:"m1", from:"user", name:"Vikram N.", role:"Doer", time:"6 days ago",
        body:"My dispute case DSP-2026-0844 hasn't been updated in 3 days." },
    ]
  },
]

type AudienceId = "all" | "new" | "inactive" | "doers" | "givers"

interface CommsStore {
  // Live support
  activeConvId:  string
  convSearch:    string
  convFilter:    "all" | "online" | "unread"
  sending:       boolean
  draftMessage:  string
  conversations: Conversation[]

  setActiveConv:   (id: string) => void
  setConvSearch:   (v: string) => void
  setConvFilter:   (f: "all" | "online" | "unread") => void
  setDraft:        (v: string) => void
  sendMessage:     () => void
  markResolved:    (convId: string) => void

  // Broadcast
  selectedAudiences: Set<AudienceId>
  broadcastTitle:    string
  broadcastBody:     string
  bcastSending:      boolean
  bcastSuccess:      boolean

  toggleAudience:    (id: AudienceId) => void
  setBroadcastTitle: (v: string) => void
  setBroadcastBody:  (v: string) => void
  sendBroadcast:     () => void
  resetBroadcast:    () => void
}

export const useCommsStore = create<CommsStore>((set, get) => ({
  activeConvId:  "c1",
  convSearch:    "",
  convFilter:    "all",
  sending:       false,
  draftMessage:  "",
  conversations: SEED_CONVS,

  setActiveConv:  (id) => set({ activeConvId:id }),
  setConvSearch:  (v)  => set({ convSearch:v }),
  setConvFilter:  (f)  => set({ convFilter:f }),
  setDraft:       (v)  => set({ draftMessage:v }),

  sendMessage: () => {
    const { draftMessage, activeConvId } = get()
    const body = draftMessage.trim()
    if (!body) return
    set({ sending:true })
    setTimeout(() => {
      set((s) => ({
        sending:false,
        draftMessage:"",
        conversations: s.conversations.map((c) =>
          c.id !== activeConvId ? c : {
            ...c,
            preview: body,
            time:    "just now",
            messages: [...c.messages, {
              id:   `m${Date.now()}`,
              from: "agent",
              name: "Aarav Sharma",
              role: "Admin",
              body,
              time: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
            }],
          }
        ),
      }))
    }, 350)
  },

  markResolved: (convId) => set((s) => ({
    conversations: s.conversations.filter((c) => c.id !== convId),
    activeConvId: s.conversations.find((c) => c.id !== convId)?.id ?? "",
  })),

  // Broadcast
  selectedAudiences: new Set<AudienceId>(["all"]),
  broadcastTitle:    "",
  broadcastBody:     "",
  bcastSending:      false,
  bcastSuccess:      false,

  toggleAudience: (id) => set((s) => {
    const n = new Set(s.selectedAudiences)
    n.has(id) ? n.delete(id) : n.add(id)
    return { selectedAudiences:n }
  }),
  setBroadcastTitle: (v) => set({ broadcastTitle:v }),
  setBroadcastBody:  (v) => set({ broadcastBody:v }),

  sendBroadcast: () => {
    set({ bcastSending:true })
    setTimeout(() => set({ bcastSending:false, bcastSuccess:true }), 900)
  },
  resetBroadcast: () => set({
    broadcastTitle:"", broadcastBody:"",
    selectedAudiences:new Set<AudienceId>(["all"]),
    bcastSuccess:false,
  }),
}))
