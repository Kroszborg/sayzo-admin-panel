import { ReactNode } from "react"

interface PageHeaderProps {
  breadcrumbs: string[]
  greeting?: string
  actions?: ReactNode
}

function getCurrentTime() {
  return new Date().toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function PageHeader({ breadcrumbs, greeting, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-[#6B7280] mb-1.5">
          <span>Modules</span>
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span>/</span>
              <span className={i === breadcrumbs.length - 1 ? "text-gray-700 dark:text-[#E8E8E8] font-medium" : ""}>{b}</span>
            </span>
          ))}
        </div>
        {greeting && (
          <h1 className="text-xl font-bold text-gray-900 dark:text-[#E8E8E8]">{greeting}</h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 mr-2">{getCurrentTime()}</span>
        {actions}
      </div>
    </div>
  )
}
