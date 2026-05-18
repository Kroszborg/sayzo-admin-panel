"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SmartPhone01Icon,
  Mail01Icon,
  ArrowRight01Icon,
  ArrowDown01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

type Tab = "mobile" | "email"

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("mobile")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  const handleSend = () => {
    const value = tab === "mobile" ? phone : email
    router.push(`/login/otp?method=${tab}&value=${encodeURIComponent(value)}`)
  }

  const canSend = tab === "mobile" ? phone.length >= 6 : email.includes("@")

  return (
    <div className="flex flex-col items-center w-full max-w-[440px]">
      {/* Pill badge */}
      <div className="mb-8 flex items-center gap-1.5 bg-[#F7F7F7] backdrop-blur-sm rounded-full px-4 py-1.5 shadow-sm border border-[#CECECE]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#232323]" />
        <span className="text-[11px] font-bold text-[#232323]">Sayzo Admin Panel</span>
      </div>

      {/* Headings */}
      <p className="text-[10.5px] font-bold tracking-[1.8px] text-white uppercase mb-2">Welcome Back</p>
      <h1 className="text-[28px] font-extrabold text-white mb-3 text-center leading-tight">Sign in to SAYZO</h1>
      <p className="text-[13px] text-white text-center mb-8 max-w-[400px] leading-relaxed">
        Enter your mobile number or email — we&apos;ll send you a one-time passcode to verify.
      </p>

      {/* White card */}
      <div className="w-full bg-transparent overflow-hidden">
        {/* Segmented tab control */}
        <div className="p-3 pb-0">
          <div className="grid grid-cols-2 bg-[#F5F8F7] rounded-xl p-1 gap-1">
            <button
              onClick={() => setTab("mobile")}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                tab === "mobile"
                  ? "bg-white text-[#0C0F0E] border border-[#E2E8E6] shadow-sm"
                  : "text-[#8FA3A0] hover:text-gray-700"
              )}
            >
              <HugeiconsIcon icon={SmartPhone01Icon} size={13} strokeWidth={2} />
              Mobile Number
            </button>
            <button
              onClick={() => setTab("email")}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                tab === "email"
                  ? "bg-white text-[#0C0F0E] border border-[#E2E8E6] shadow-sm"
                  : "text-[#8FA3A0] hover:text-gray-700"
              )}
            >
              <HugeiconsIcon icon={Mail01Icon} size={13} strokeWidth={2} />
              Email Address
            </button>
          </div>
        </div>

        <div className="p-5 pt-4">
          {tab === "mobile" ? (
            <div className="space-y-2">
              <label className="block text-[11.5px] font-bold text-[#1A2421]">Mobile Number</label>
              <div className="flex gap-0 rounded-xl border border-gray-200 overflow-hidden focus-within:border-gray-400 transition-colors">
                <div className="flex items-center gap-2 px-3 py-2.5 border-r border-[#E2E8E6] bg-[#F5F8F7] shrink-0 select-none">
                  <span className="text-[15px]">🇮🇳</span>
                  <span className="text-[13px] font-bold text-[#1A2421]">+91</span>
                  <HugeiconsIcon icon={ArrowDown01Icon} size={11} strokeWidth={2} className="text-[#8FA3A0]" />
                </div>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 px-3 py-2.5 text-sm bg-white outline-none text-[#0C0F0E] placeholder:text-[#C8D8D4]"
                  maxLength={10}
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <HugeiconsIcon icon={InformationCircleIcon} size={11} strokeWidth={1.5} />
                OTP will be sent via SMS
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-[11.5px] font-bold text-[#1A2421]">Email Address</label>
              <input
                type="email"
                placeholder="admin@sayzo.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white outline-none text-[#0C0F0E] placeholder:text-[#C8D8D4] focus:border-gray-400 transition-colors"
              />
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <HugeiconsIcon icon={InformationCircleIcon} size={11} strokeWidth={1.5} />
                OTP will be sent via email
              </div>
            </div>
          )}

          <button
            onClick={handleSend}
            className="mt-5 w-full h-12 tracking-[0.2px] rounded-xl bg-[#232323] hover:bg-gray-800 active:bg-gray-700 text-white text-sm font-extrabold flex items-center justify-center gap-2 transition-colors"
          >
            Send OTP
            <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
