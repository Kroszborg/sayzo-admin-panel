import { AppSidebar } from "@/components/nav/app-sidebar"
import { TopBar } from "@/components/nav/top-bar"
import { AlertToast } from "@/components/shared/alert-toast"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    // h-screen on the root + overflow-hidden = nothing ever overflows the viewport
    <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFB] dark:bg-[#0B0B0F]">
      {/* Sidebar — fixed height, never scrolls the page */}
      <AppSidebar />

      {/* Right panel — fills remaining space, scrolls internally */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <TopBar />
        {/* ONLY the main content scrolls */}
        <main className="flex-1 overflow-y-auto p-6 min-h-0 bg-[#F8FAFB] dark:bg-[#0B0B0F]">
          {children}
        </main>
      </div>
      {/* Global alert toasts — always on top */}
      <AlertToast />
    </div>
  )
}
