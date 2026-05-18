import { cn } from "@/lib/utils"

type StatusVariant =
  | "active" | "in-progress" | "completed" | "disputed" | "force-closed"
  | "matching" | "critical" | "high" | "medium" | "low"
  | "pending" | "suspended" | "banned" | "unassigned" | "escalated"
  | "evidence-pending" | "resolved" | "open" | "pending-reply"
  | "in-escrow" | "released" | "refunded" | "failed"
  | "doer" | "giver" | "both"
  | "super-admin" | "admin" | "agent" | "viewer"

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  "active":           "bg-green-50 text-green-700 border-green-200",
  "in-progress":      "bg-blue-50 text-blue-700 border-blue-200",
  "completed":        "bg-green-100 text-green-800 border-green-300",
  "disputed":         "bg-red-50 text-red-700 border-red-200",
  "force-closed":     "bg-gray-100 text-gray-700 border-gray-300",
  "matching":         "bg-orange-50 text-orange-700 border-orange-200",
  "critical":         "bg-red-100 text-red-800 border-red-300",
  "high":             "bg-orange-100 text-orange-800 border-orange-300",
  "medium":           "bg-yellow-50 text-yellow-700 border-yellow-200",
  "low":              "bg-gray-50 text-gray-600 border-gray-200",
  "pending":          "bg-yellow-50 text-yellow-700 border-yellow-200",
  "suspended":        "bg-orange-50 text-orange-700 border-orange-200",
  "banned":           "bg-red-100 text-red-800 border-red-300",
  "unassigned":       "bg-gray-100 text-gray-600 border-gray-200",
  "escalated":        "bg-purple-50 text-purple-700 border-purple-200",
  "evidence-pending": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "resolved":         "bg-green-50 text-green-700 border-green-200",
  "open":             "bg-blue-50 text-blue-700 border-blue-200",
  "pending-reply":    "bg-yellow-50 text-yellow-700 border-yellow-200",
  "in-escrow":        "bg-blue-50 text-blue-700 border-blue-200",
  "released":         "bg-green-50 text-green-700 border-green-200",
  "refunded":         "bg-gray-100 text-gray-700 border-gray-200",
  "failed":           "bg-red-50 text-red-600 border-red-200",
  "doer":             "bg-blue-50 text-blue-700 border-blue-200",
  "giver":            "bg-purple-50 text-purple-700 border-purple-200",
  "both":             "bg-teal-50 text-teal-700 border-teal-200",
  "super-admin":      "bg-purple-100 text-purple-800 border-purple-300",
  "admin":            "bg-blue-100 text-blue-800 border-blue-300",
  "agent":            "bg-green-50 text-green-700 border-green-200",
  "viewer":           "bg-gray-100 text-gray-600 border-gray-200",
}

function toVariant(status: string): StatusVariant {
  return status.toLowerCase().replace(/\s+/g, "-") as StatusVariant
}

interface StatusBadgeProps {
  status: string
  dot?: boolean
  className?: string
}

export function StatusBadge({ status, dot = false, className }: StatusBadgeProps) {
  const variant = toVariant(status)
  const classes = VARIANT_CLASSES[variant] ?? "bg-gray-50 text-gray-600 border-gray-200"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        classes,
        className
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0",
          classes.includes("green") ? "bg-green-500" :
          classes.includes("blue") ? "bg-blue-500" :
          classes.includes("red") ? "bg-red-500" :
          classes.includes("orange") ? "bg-orange-500" :
          classes.includes("yellow") ? "bg-yellow-500" :
          classes.includes("purple") ? "bg-purple-500" : "bg-gray-400"
        )} />
      )}
      {status}
    </span>
  )
}
