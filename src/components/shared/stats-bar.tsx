import { cn } from "@/lib/utils"

export interface StatSection {
  label: string
  value: string
  sub?: string
  valueColor?: string
}

interface StatsBarProps {
  stats: StatSection[]
  className?: string
}

export function StatsBar({ stats, className }: StatsBarProps) {
  return (
    <div className={cn("flex bg-white border-b border-[#E5E7EB]", className)}>
      {stats.map((s, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 px-6 py-4",
            i < stats.length - 1 && "border-r border-[#F3F4F6]"
          )}
        >
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
            {s.label}
          </p>
          <p
            className="text-2xl font-extrabold"
            style={{ color: s.valueColor ?? "#111827" }}
          >
            {s.value}
          </p>
          {s.sub && (
            <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
          )}
        </div>
      ))}
    </div>
  )
}
