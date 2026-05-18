"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Logout01Icon,
  Settings01Icon,
  UserCircle02Icon,
  HelpCircleIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface UserDropdownProps {
  /** Which direction the popup opens */
  direction?: "up" | "down"
  /** Extra classes on the trigger wrapper */
  className?: string
}

export function UserDropdown({ direction = "up", className }: UserDropdownProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref  = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const MENU = [
    { icon:UserCircle02Icon,  label:"View Profile",  action:() => {},                                  },
    { icon:Settings01Icon,    label:"Settings",       action:() => {},                                  },
    { icon:HelpCircleIcon,    label:"Help & Support", action:() => {},                                  },
  ]

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* ── Trigger ── */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2.5 w-full px-2 py-2 rounded-xl hover:bg-[#F5F8F7] transition-colors group"
      >
        <Avatar size={32} />
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[12px] font-semibold text-[#111827] truncate leading-tight">Aarav Sharma</p>
          <p className="text-[10px] text-[#8FA3A0] leading-tight">Super Admin</p>
        </div>
        {/* Chevron */}
        <HugeiconsIcon
          icon={open ? ArrowUp01Icon : ArrowDown01Icon}
          size={12}
          strokeWidth={2}
          className="text-[#8FA3A0] shrink-0 transition-transform duration-150"
        />
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className={cn(
          "absolute left-0 right-0 z-50 bg-white rounded-xl border border-[#E5E7EB] shadow-lg overflow-hidden",
          direction === "up"
            ? "bottom-full mb-2"
            : "top-full mt-2"
        )}>
          {/* User info header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#F3F4F6] bg-[#F9FAFB]">
            <Avatar size={36} />
            <div>
              <p className="text-[12.5px] font-bold text-[#111827]">Aarav Sharma</p>
              <p className="text-[10px] text-[#8FA3A0]">aarav@sayzo.in</p>
              <span className="inline-block mt-0.5 text-[9px] font-black uppercase tracking-wide bg-[#F3E8FF] text-[#9333EA] rounded px-1.5 py-0.5">
                Super Admin
              </span>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {MENU.map(({ icon, label, action }) => (
              <button
                key={label}
                onClick={() => { action(); setOpen(false) }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left text-[12.5px] font-medium text-[#374151] hover:bg-[#F5F8F7] transition-colors"
              >
                <HugeiconsIcon icon={icon} size={14} strokeWidth={1.5} className="text-[#6B7280] shrink-0" />
                {label}
              </button>
            ))}
          </div>

          {/* Divider + Logout */}
          <div className="border-t border-[#F3F4F6] py-1">
            <button
              onClick={() => { setOpen(false); router.push("/login") }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left text-[12.5px] font-medium text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
            >
              <HugeiconsIcon icon={Logout01Icon} size={14} strokeWidth={1.5} className="shrink-0" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Standardized Avatar ──────────────────────────────────────────────────

export function Avatar({ size = 32 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-[#17B890] flex items-center justify-center text-white font-bold shrink-0 select-none"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      AS
    </div>
  )
}
