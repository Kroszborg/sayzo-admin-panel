import { create } from "zustand"

export type DetailTab     = "Overview" | "Activity Log" | "Trust & Risk" | "Tasks"
export type RoleMode      = "Giver" | "Doer"
export type TrustRange    = "30d" | "90d" | "6m" | "1y" | "All"
export type TaskFilter    = "All" | "In Progress" | "Completed" | "Disputed"
export type ActionType    = "warn" | "suspend" | "shadow-ban" | "ban"
export type SuspendPeriod = "24h" | "3d" | "7d" | "30d" | "custom"

interface UserDetailStore {
  activeTab:      DetailTab
  roleMode:       RoleMode
  trustRange:     TrustRange
  taskFilter:     TaskFilter
  activitySearch: string
  activityTypes:  Set<string>
  activityDate:   string
  actionOpen:     boolean
  actionType:     ActionType
  suspendPeriod:  SuspendPeriod
  suspendReason:  string
  actionNote:     string

  setTab:          (t: DetailTab)     => void
  setRoleMode:     (r: RoleMode)      => void
  setTrustRange:   (r: TrustRange)    => void
  setTaskFilter:   (f: TaskFilter)    => void
  setActivitySearch: (v: string)      => void
  toggleActivityType: (t: string)     => void
  setActivityDate: (v: string)        => void
  setActionOpen:   (v: boolean)       => void
  setActionType:   (t: ActionType)    => void
  setSuspendPeriod:(p: SuspendPeriod) => void
  setSuspendReason:(r: string)        => void
  setActionNote:   (n: string)        => void
}

export const useUserDetailStore = create<UserDetailStore>((set) => ({
  activeTab:"Overview", roleMode:"Giver", trustRange:"6m", taskFilter:"All",
  activitySearch:"", activityTypes: new Set(), activityDate:"All time",
  actionOpen:false, actionType:"warn", suspendPeriod:"7d",
  suspendReason:"", actionNote:"",

  setTab:          (t) => set({ activeTab:t }),
  setRoleMode:     (r) => set({ roleMode:r }),
  setTrustRange:   (r) => set({ trustRange:r }),
  setTaskFilter:   (f) => set({ taskFilter:f }),
  setActivitySearch: (v) => set({ activitySearch:v }),
  toggleActivityType: (t) => set((s) => {
    const n = new Set(s.activityTypes)
    n.has(t) ? n.delete(t) : n.add(t)
    return { activityTypes:n }
  }),
  setActivityDate: (v) => set({ activityDate:v }),
  setActionOpen:   (v) => set({ actionOpen:v }),
  setActionType:   (t) => set({ actionType:t }),
  setSuspendPeriod:(p) => set({ suspendPeriod:p }),
  setSuspendReason:(r) => set({ suspendReason:r }),
  setActionNote:   (n) => set({ actionNote:n }),
}))
