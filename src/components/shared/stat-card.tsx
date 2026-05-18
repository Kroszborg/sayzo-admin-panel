import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface StatCardProps {
  label: string
  value: string
  delta?: string
  deltaLabel?: string
  deltaPositive?: boolean
  sub?: string
  children?: ReactNode
  className?: string
}

export function StatCard({
  label,
  value,
  delta,
  deltaLabel,
  deltaPositive = true,
  sub,
  children,
  className,
}: StatCardProps) {
  return (
    <div className={cn("bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3", className)}>
      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-extrabold text-gray-900">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        {delta && (
          <span
            className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-full",
              deltaPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
            )}
          >
            {deltaPositive ? "▲" : "▼"} {delta}
          </span>
        )}
      </div>
      {deltaLabel && <p className="text-[11px] text-gray-400">{deltaLabel}</p>}
      {children}
    </div>
  )
}
