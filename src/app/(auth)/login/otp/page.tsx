"use client"

import { Suspense, useState, useEffect, useRef, KeyboardEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { SmartPhone01Icon, Mail01Icon, Clock01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

const OTP_LEN = 6
const RESEND_SECS = 60

function OtpContent() {
  const router = useRouter()
  const params = useSearchParams()
  const method = params.get("method") ?? "mobile"
  const rawValue = decodeURIComponent(params.get("value") ?? "")

  const [digits, setDigits] = useState<string[]>(Array(OTP_LEN).fill(""))
  const [countdown, setCountdown] = useState(RESEND_SECS)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (countdown <= 0) return
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [countdown])

  const maskedValue =
    method === "email"
      ? rawValue.replace(/(.{2}).+(@.+)/, "$1****$2")
      : `+91 ${rawValue.slice(0, 5)} •••${rawValue.slice(-2) || "43"}`

  const handleChange = (val: string, idx: number) => {
    const clean = val.replace(/\D/g, "").slice(-1)
    const next = [...digits]
    next[idx] = clean
    setDigits(next)
    if (clean && idx < OTP_LEN - 1) inputRefs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      const next = [...digits]
      next[idx - 1] = ""
      setDigits(next)
      inputRefs.current[idx - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN)
    const next = Array(OTP_LEN).fill("")
    text.split("").forEach((ch, i) => { next[i] = ch })
    setDigits(next)
    inputRefs.current[Math.min(text.length, OTP_LEN - 1)]?.focus()
  }

  const filled = digits.filter(Boolean).length
  const mins = Math.floor(countdown / 60)
  const secs = countdown % 60
  const timeStr = `${mins}:${String(secs).padStart(2, "0")}`

  // DUMMY — any 6 digits accepted
  const handleVerify = () => {
    if (filled < OTP_LEN) return
    router.push("/modules")
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm">
      {/* Icon */}
      <div className="mb-5 w-14 h-14 rounded-[16px] bg-[#E8F7F3] border border-[#A8DFD0] flex items-center justify-center">
        <HugeiconsIcon
          icon={method === "email" ? Mail01Icon : SmartPhone01Icon}
          size={26}
          strokeWidth={1.5}
          className="text-[#232323]"
        />
      </div>

      {/* Step dots */}
      <div className="flex items-center gap-2 mb-5">
        <div className="h-1 w-7 rounded-full bg-[#232323]" />
        <div className="h-1 w-7 rounded-full bg-white" />
      </div>

      <p className="text-[10.5px] font-bold tracking-[1.8px] text-white uppercase mb-2">Step 2 of 2</p>
      <h1 className="text-[27px] font-extrabold text-white mb-1 text-center leading-tight">Enter the OTP</h1>
      <p className="text-[13px] text-[#F1F1F1] text-center mb-2 leading-relaxed">
        We sent a 6-digit code to your {method === "email" ? "email address" : "mobile number"}.
      </p>

      {/* Masked value badge */}
      <div className="flex items-center gap-[7px] mb-7 bg-[#F5F8F7] border border-[#E2E8E6] rounded-[10px] px-[13px] py-[7px]">
        <div className="w-[20px] h-[20px] rounded-[6px] bg-[#E8F7F3] items-center justify-center flex">
          <HugeiconsIcon icon={method === "email" ? Mail01Icon : SmartPhone01Icon} size={11} strokeWidth={2} className="text-[#232323] bg-[#E8F7F3]" />
        </div>
        <span className="text-[13px] font-bold text-[#1A2421]">{maskedValue || "+91 98765 •••43"}</span>
        <button onClick={() => router.back()} className="text-[#232323] font-bold text-[11.5px] ml-1 hover:underline">
          Change
        </button>
      </div>

      <div className="w-full">
        <p className="text-[11.5px] font-bold text-[#424242] text-center mb-3 tracking-wide">6-Digit OTP</p>

        {/* OTP boxes */}
        <div className="flex gap-2.5 justify-center mb-5" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={cn(
                "w-12 h-[52px] rounded-xl text-center text-2xl font-extrabold text-gray-900 border-2 transition-all outline-none",
                d
                  ? "bg-[#E8F7F3] border-[#232323]"
                  : "bg-white border-[#E2E8E6] focus:border-[#232323] focus:bg-white"
              )}
            />
          ))}
        </div>

        {/* Resend row */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon icon={Clock01Icon} size={12} strokeWidth={1.5} className="text-[#8FA3A0]" />
            <span className="text-[12.5px] text-[#8FA3A0]">Resend in</span>
            <span className="bg-[#F5F8F7] border border-[#E2E8E6] text-[#1A2421] rounded-full px-[9px] py-[3px] font-bold text-xs min-w-[49px] text-center">
              {timeStr}
            </span>
          </div>
          <button
            onClick={() => { if (countdown === 0) setCountdown(RESEND_SECS) }}
            disabled={countdown > 0}
            className={cn("text-[12.5px] font-bold transition-colors", countdown > 0 ? "text-[#C8D8D4]" : "text-[#17B890] hover:underline")}
          >
            Resend OTP
          </button>
        </div>

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={filled < OTP_LEN}
          className={cn(
            "w-full h-[43px] rounded-[10px] bg-[#232323] text-white text-[14px] font-extrabold flex items-center justify-center gap-2 transition-all",
            filled < OTP_LEN ? "opacity-40 cursor-not-allowed" : "hover:bg-[#1A2421] active:bg-[#232323]"
          )}
        >
          Verify &amp; Sign In
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} strokeWidth={2} />
        </button>

        <p className="text-center font-medium text-[12.5px] text-[#8FA3A0] mt-4">
          Didn&apos;t receive it?{" "}
          <button onClick={() => router.push("/login")} className="font-bold text-[#232323] hover:underline">
            Try email login instead
          </button>
        </p>
      </div>
    </div>
  )
}

export default function OtpPage() {
  return (
    <Suspense>
      <OtpContent />
    </Suspense>
  )
}
