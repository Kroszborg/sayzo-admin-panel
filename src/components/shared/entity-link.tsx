"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface EntityLinkProps {
  href:      string
  label:     string
  muted?:    boolean
  className?: string
}

/** Inline arrow-link for cross-module navigation */
export function EntityLink({ href, label, muted = false, className }: EntityLinkProps) {
  return (
    <Link href={href}
      className={cn(
        "inline-flex items-center gap-0.5 font-semibold hover:underline transition-colors",
        muted ? "text-[11px] text-[#8FA3A0] hover:text-[#374151]" : "text-[11px] text-[#17B890]",
        className
      )}>
      {label}
      <HugeiconsIcon icon={ArrowRight01Icon} size={10} strokeWidth={2} />
    </Link>
  )
}
