"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon, Cancel01Icon, ArrowRight01Icon,
  SmartPhone01Icon, Mail01Icon,
} from "@hugeicons/core-free-icons"
import { useTeamStore, MODULES, COLS, ColKey } from "@/store/team-store"
import { useAlertStore } from "@/store/alert-store"
import { cn } from "@/lib/utils"

// ─── Validation helpers ────────────────────────────────────────────────────

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const isValidPhone = (v: string) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, ""))

// ─── Page ───────────────────────────────────────────────────────────────────

export default function InvitePage() {
  const router = useRouter()
  const s      = useTeamStore()
  const alert  = useAlertStore()

  // Redirect to /team after success
  useEffect(() => {
    if (s.success) {
      const t = setTimeout(() => {
        s.resetForm()
        router.push("/team")
      }, 1200)
      return () => clearTimeout(t)
    }
  }, [s.success])

  const emailValid = isValidEmail(s.email)
  const phoneValid = isValidPhone(s.phone)
  const canSubmit  = emailValid && phoneValid && !s.submitting

  // How many permissions are selected
  const permCount = Object.values(s.perms).reduce(
    (acc, row) => acc + Object.values(row).filter(Boolean).length, 0
  )

  return (
    <div className="max-w-4xl">
      {/* Page header */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22 }}
        className="mb-7">
        <h1 className="text-[20px] font-extrabold text-[#111827] mb-1">Invite someone to Sayzo Team</h1>
        <p className="text-[12.5px] text-[#8FA3A0] max-w-2xl leading-relaxed">
          After your invitation is accepted, they&apos;ll have access to the Sayzo Admin Panel based on the access level you choose.
          They&apos;ll receive an email with a secure login link valid for 7 days.
        </p>
      </motion.div>

      {/* Success banner */}
      <AnimatePresence>
        {s.success && (
          <motion.div
            initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
            transition={{ duration:0.22 }}
            className="flex items-center gap-2.5 mb-5 px-4 py-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} strokeWidth={2} className="text-[#17B890] shrink-0" />
            <p className="text-[12.5px] font-semibold text-[#16A34A]">
              Invitation sent to <span className="font-extrabold">{s.email}</span> — redirecting…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form card */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.26, delay:0.06 }}
        className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-6">

        {/* Phone + Email */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-[12px] font-bold text-[#374151] mb-1.5">
              Phone Number <span className="text-[#EF4444]">*</span>
            </label>
            <div className="relative">
              <HugeiconsIcon icon={SmartPhone01Icon} size={14} strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA3A0]" />
              <input
                type="tel"
                value={s.phone}
                onChange={(e) => s.setPhone(e.target.value)}
                placeholder="9876543210"
                maxLength={10}
                className={cn(
                  "w-full h-10 pl-9 pr-9 rounded-xl border text-[13px] text-[#374151] outline-none transition-colors",
                  s.phone && !phoneValid ? "border-[#EF4444] bg-[#FEF2F2] focus:border-[#EF4444]" :
                  s.phone && phoneValid  ? "border-[#17B890] bg-white focus:border-[#17B890]" :
                  "border-[#E2E8E6] focus:border-[#17B890]"
                )}
              />
              {s.phone && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <HugeiconsIcon
                    icon={phoneValid ? CheckmarkCircle02Icon : Cancel01Icon}
                    size={15} strokeWidth={2}
                    className={phoneValid ? "text-[#17B890]" : "text-[#EF4444]"}
                  />
                </div>
              )}
            </div>
            {s.phone && !phoneValid && (
              <p className="text-[10.5px] text-[#EF4444] mt-1">Enter a valid 10-digit Indian mobile number</p>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#374151] mb-1.5">
              Email address <span className="text-[#EF4444]">*</span>
            </label>
            <div className="relative">
              <HugeiconsIcon icon={Mail01Icon} size={14} strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA3A0]" />
              <input
                type="email"
                value={s.email}
                onChange={(e) => s.setEmail(e.target.value)}
                placeholder="agent@sayzo.in"
                className={cn(
                  "w-full h-10 pl-9 pr-9 rounded-xl border text-[13px] text-[#374151] outline-none transition-colors",
                  s.email && !emailValid ? "border-[#EF4444] bg-[#FEF2F2] focus:border-[#EF4444]" :
                  s.email && emailValid  ? "border-[#17B890] bg-white focus:border-[#17B890]" :
                  "border-[#E2E8E6] focus:border-[#17B890]"
                )}
              />
              {s.email && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <HugeiconsIcon
                    icon={emailValid ? CheckmarkCircle02Icon : Cancel01Icon}
                    size={15} strokeWidth={2}
                    className={emailValid ? "text-[#17B890]" : "text-[#EF4444]"}
                  />
                </div>
              )}
            </div>
            {s.email && !emailValid && (
              <p className="text-[10.5px] text-[#EF4444] mt-1">Enter a valid email address</p>
            )}
          </div>
        </div>

        {/* Access expiry */}
        <div>
          <label className="block text-[12px] font-bold text-[#374151] mb-1.5">Access expires</label>
          <select
            value={s.expiry}
            onChange={(e) => s.setExpiry(e.target.value)}
            className="h-9 px-3 pr-8 rounded-xl border border-[#E2E8E6] text-[13px] text-[#374151] outline-none focus:border-[#17B890] bg-white appearance-none cursor-pointer min-w-[180px] transition-colors"
          >
            {["Never","7 days","30 days","90 days","Custom date"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <p className="text-[11.5px] text-[#8FA3A0] mt-1.5 max-w-lg">
            Set an expiry to automatically revoke access — useful for contractors or temporary cover.
          </p>
        </div>

        {/* Permission matrix */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[13px] font-bold text-[#374151]">
                Select access level <span className="text-[#EF4444]">*</span>
              </p>
              <p className="text-[11.5px] text-[#8FA3A0] mt-0.5">
                {permCount > 0 ? `${permCount} permission${permCount !== 1 ? "s" : ""} selected` : "No permissions selected yet"}
              </p>
            </div>
          </div>

          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-[11px] font-black tracking-wider text-white uppercase bg-[#111827] px-4 py-3 w-44">
                    Permission
                  </th>
                  {COLS.map(({ key, label }) => (
                    <th key={key}
                      className="text-center text-[11px] font-black tracking-wider text-white uppercase bg-[#111827] px-3 py-3 cursor-pointer hover:bg-[#1f2937] transition-colors select-none"
                      onClick={() => s.toggleCol(key)}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MODULES.map((mod, ri) => (
                  <motion.tr key={mod}
                    className={cn("border-b border-[#F3F4F6] last:border-0", ri % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]")}>
                    <td className="px-4 py-3 text-[13px] font-medium text-[#374151]">{mod}</td>
                    {COLS.map(({ key }) => {
                      const checked = s.perms[mod]?.[key] ?? false
                      return (
                        <td key={key} className="px-3 py-3 text-center">
                          <motion.button
                            whileTap={{ scale:0.85 }}
                            onClick={() => s.togglePerm(mod, key)}
                            className={cn(
                              "w-[18px] h-[18px] rounded border-2 mx-auto flex items-center justify-center cursor-pointer transition-all",
                              checked
                                ? "bg-[#17B890] border-[#17B890]"
                                : "border-[#D1D5DB] hover:border-[#17B890] bg-white"
                            )}
                          >
                            <AnimatePresence>
                              {checked && (
                                <motion.div
                                  initial={{ scale:0, opacity:0 }}
                                  animate={{ scale:1, opacity:1 }}
                                  exit={{ scale:0, opacity:0 }}
                                  transition={{ duration:0.15 }}
                                >
                                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} strokeWidth={3} className="text-white" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        </td>
                      )
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Role preset shortcuts */}
          <div className="flex items-center gap-3 mt-3">
            <p className="text-[11.5px] text-[#8FA3A0]">Quick presets:</p>
            {(["Read Only","Standard","Admin","Super Admin"] as const).map((preset) => (
              <button key={preset}
                onClick={() => {
                  const colMap: Record<string, ColKey> = {
                    "Read Only":"read", "Standard":"standard", "Admin":"admin", "Super Admin":"superadmin"
                  }
                  s.toggleCol(colMap[preset])
                }}
                className="h-6 px-2.5 rounded-lg border border-[#E2E8E6] text-[10.5px] font-semibold text-[#374151] hover:bg-[#F5F8F7] transition-colors">
                {preset}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22, delay:0.1 }}
        className="flex items-center justify-between mt-5">
        <p className="text-[11.5px] text-[#8FA3A0]">
          Note: Invitation link expires in 7 days
        </p>
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/team")}
            className="h-9 px-5 rounded-xl border border-[#E2E8E6] text-[12.5px] font-semibold text-[#374151] hover:bg-[#F5F8F7] transition-colors">
            Cancel
          </button>
          <button
            onClick={() => {
              s.submitInvite()
              if (canSubmit) alert.show("success", `Invitation sent to ${s.email}`)
            }}
            disabled={!canSubmit}
            className={cn(
              "h-9 px-5 rounded-xl text-white text-[12.5px] font-bold flex items-center gap-1.5 transition-all",
              canSubmit
                ? s.submitting
                  ? "bg-[#8FA3A0] cursor-wait"
                  : "bg-[#111827] hover:bg-[#1f2937]"
                : "bg-[#D1D5DB] cursor-not-allowed"
            )}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
            {s.submitting ? "Sending…" : "Send invitation"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
