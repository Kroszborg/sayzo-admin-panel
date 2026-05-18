"use client"

import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon, EyeIcon, Download01Icon, CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"
import { useDisputesStore } from "@/store/disputes-store"
import { MOCK_DISPUTES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── Evidence data ─────────────────────────────────────────────────────────

const GIVER_FILES = [
  { id:"g1", name:"chat_screenshot.png",  type:"PNG",  size:"2.4 MB",  time:"Apr 9, 10:22 AM", preview:"image" },
  { id:"g2", name:"payment_receipt.pdf",  type:"PDF",  size:"0.8 MB",  time:"Apr 9, 10:24 AM", preview:"pdf"   },
]
const DOER_FILES = [
  { id:"d1", name:"deliverables.zip",     type:"ZIP",  size:"18.2 MB", time:"Apr 8, 03:14 PM", preview:"zip"   },
  { id:"d2", name:"client_approval.png",  type:"PNG",  size:"1.1 MB",  time:"Apr 8, 03:16 PM", preview:"image" },
  { id:"d3", name:"work_video.mp4",       type:"MP4",  size:"42.8 MB", time:"Apr 8, 03:20 PM", preview:"video" },
]

const TYPE_COLOR: Record<string, { bg:string; color:string }> = {
  PNG:  { bg:"#DBEAFE", color:"#2563EB" },
  JPG:  { bg:"#DBEAFE", color:"#2563EB" },
  PDF:  { bg:"#FEE2E2", color:"#DC2626" },
  ZIP:  { bg:"#F3F4F6", color:"#374151" },
  MP4:  { bg:"#FEF3C7", color:"#D97706" },
  DOCX: { bg:"#EEF2FF", color:"#6366F1" },
}

// ─── File preview ──────────────────────────────────────────────────────────

function FilePreview({ fileId, allFiles }: { fileId: string; allFiles: typeof GIVER_FILES }) {
  const file = allFiles.find((f) => f.id === fileId)
  if (!file) return null

  return (
    <motion.div
      key={fileId}
      initial={{ opacity:0, y:4 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.2 }}
      className="flex-1 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] flex flex-col overflow-hidden"
    >
      {/* Preview header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black rounded px-1.5 py-0.5"
            style={{ backgroundColor:TYPE_COLOR[file.type]?.bg ?? "#F3F4F6", color:TYPE_COLOR[file.type]?.color ?? "#374151" }}>
            {file.type}
          </span>
          <div>
            <p className="text-[12.5px] font-semibold text-[#374151]">{file.name}</p>
            <p className="text-[10.5px] text-[#8FA3A0]">{file.size} · Uploaded {file.time}</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 h-7 px-3 border border-[#E2E8E6] rounded-lg text-[11px] font-semibold text-[#374151] hover:bg-[#F5F8F7]">
          <HugeiconsIcon icon={Download01Icon} size={12} strokeWidth={1.5} />
          Download
        </button>
      </div>

      {/* Preview body */}
      <div className="flex-1 flex items-center justify-center p-6 min-h-[200px]">
        {file.preview === "image" && (
          <div className="w-full max-w-sm h-48 bg-gradient-to-br from-[#E8F7F3] to-[#DBEAFE] rounded-xl flex items-center justify-center border border-[#E5E7EB]">
            <p className="text-[12px] font-medium text-[#8FA3A0]">Image preview · {file.name}</p>
          </div>
        )}
        {file.preview === "pdf" && (
          <div className="w-full max-w-sm h-48 bg-[#FEE2E2]/30 rounded-xl flex items-center justify-center border border-[#FCA5A5]/30">
            <div className="text-center">
              <p className="text-[28px] mb-2">📄</p>
              <p className="text-[12px] font-medium text-[#8FA3A0]">PDF Document</p>
              <p className="text-[11px] text-[#8FA3A0]">{file.name}</p>
            </div>
          </div>
        )}
        {file.preview === "zip" && (
          <div className="w-full max-w-sm h-48 bg-[#F3F4F6] rounded-xl flex items-center justify-center border border-[#E5E7EB]">
            <div className="text-center">
              <p className="text-[28px] mb-2">🗜️</p>
              <p className="text-[12px] font-medium text-[#8FA3A0]">Archive File</p>
              <p className="text-[11px] text-[#8FA3A0]">{file.size} compressed</p>
            </div>
          </div>
        )}
        {file.preview === "video" && (
          <div className="w-full max-w-sm h-48 bg-[#111827] rounded-xl flex items-center justify-center border border-[#374151]">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2 mx-auto cursor-pointer hover:bg-white/30 transition-colors">
                <span className="text-white text-lg ml-1">▶</span>
              </div>
              <p className="text-[12px] font-medium text-white/70">{file.name}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── File row ──────────────────────────────────────────────────────────────

function FileRow({ file, active, onSelect }: {
  file: typeof GIVER_FILES[0]; active: boolean; onSelect: () => void
}) {
  const tc = TYPE_COLOR[file.type] ?? { bg:"#F3F4F6", color:"#374151" }
  return (
    <motion.button
      whileHover={{ y:-1 }} transition={{ duration:0.12 }}
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all",
        active ? "border-[#17B890] bg-[#F0FDF4] shadow-sm" : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB] hover:bg-[#F9FAFB]"
      )}
    >
      <span className="text-[9px] font-black rounded px-1.5 py-1 shrink-0"
        style={{ backgroundColor:tc.bg, color:tc.color }}>{file.type}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-[#374151] truncate">{file.name}</p>
        <p className="text-[10px] text-[#8FA3A0]">{file.size} · {file.time}</p>
      </div>
      {active ? (
        <span className="text-[10.5px] font-bold text-[#17B890] shrink-0 flex items-center gap-1">
          <HugeiconsIcon icon={EyeIcon} size={11} strokeWidth={2} />Viewing
        </span>
      ) : (
        <span className="text-[10.5px] font-semibold text-[#8FA3A0] shrink-0">View</span>
      )}
    </motion.button>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function EvidenceReviewPage({ params }: { params: { id: string } }) {
  const router   = useRouter()
  const s        = useDisputesStore()
  const dispute  = MOCK_DISPUTES.find((d) => d.id === params.id) ?? MOCK_DISPUTES[0]
  const allFiles = [...GIVER_FILES, ...DOER_FILES]

  const activeGiverFile = GIVER_FILES.find((f) => f.id === s.previewFile)
  const activeDoerFile  = DOER_FILES.find((f) => f.id === s.previewFile)
  const previewFile     = activeGiverFile ?? activeDoerFile

  return (
    <div>
      {/* Back nav */}
      <button onClick={() => router.push(`/disputes/${params.id}`)}
        className="flex items-center gap-1.5 text-[12px] font-semibold text-[#8FA3A0] hover:text-[#374151] transition-colors mb-4">
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
        Back to Dispute
      </button>

      {/* Header */}
      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22 }}
        className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#111827]">Evidence Review</h1>
          <div className="flex items-center gap-2.5 mt-1 text-[12px] text-[#8FA3A0]">
            <span>{dispute.id}</span><span>·</span>
            <span className="truncate max-w-[280px]">{dispute.title}</span><span>·</span>
            <span className="font-bold text-[#DC2626]">₹{dispute.amount.toLocaleString("en-IN")}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11.5px] text-[#8FA3A0]">{allFiles.length} files total</span>
          <button className="flex items-center gap-1.5 h-8 px-3 border border-[#E2E8E6] rounded-lg text-[12px] font-semibold text-[#374151] bg-white hover:bg-[#F5F8F7]">
            <HugeiconsIcon icon={Download01Icon} size={13} strokeWidth={1.5} />
            Download all
          </button>
        </div>
      </motion.div>

      {/* 2-col evidence comparison */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.28, delay:0.06 }}
        className="grid grid-cols-2 gap-4 mb-4">
        {/* Giver side */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#F3F4F6] bg-[#F9FAFB]">
            <div className="w-8 h-8 rounded-full bg-[#F3E8FF] flex items-center justify-center text-[10px] font-bold text-[#9333EA]">
              {dispute.giver.split(" ").map(n=>n[0]).join("")}
            </div>
            <div>
              <p className="text-[12.5px] font-bold text-[#374151]">{dispute.giver}</p>
              <span className="text-[9px] font-black bg-[#F3E8FF] text-[#9333EA] rounded px-1.5 py-0.5">Giver · Reporter</span>
            </div>
            <span className="ml-auto text-[11px] font-semibold text-[#8FA3A0]">{GIVER_FILES.length} files</span>
          </div>
          <div className="p-3 border-b border-[#F3F4F6]">
            <p className="text-[12px] text-[#374151] italic leading-relaxed">
              "The deliverables did not meet the agreed specifications..."
            </p>
          </div>
          <div className="p-3 space-y-2">
            <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-2">Submitted Files</p>
            {GIVER_FILES.map((f) => (
              <FileRow key={f.id} file={f} active={s.previewFile === f.id} onSelect={() => s.setPreviewFile(f.id)} />
            ))}
          </div>
        </div>

        {/* Doer side */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#F3F4F6] bg-[#F9FAFB]">
            <div className="w-8 h-8 rounded-full bg-[#DBEAFE] flex items-center justify-center text-[10px] font-bold text-[#2563EB]">
              {dispute.doer.split(" ").map(n=>n[0]).join("")}
            </div>
            <div>
              <p className="text-[12.5px] font-bold text-[#374151]">{dispute.doer}</p>
              <span className="text-[9px] font-black bg-[#DBEAFE] text-[#2563EB] rounded px-1.5 py-0.5">Doer · Respondent</span>
            </div>
            <span className="ml-auto text-[11px] font-semibold text-[#8FA3A0]">{DOER_FILES.length} files</span>
          </div>
          <div className="p-3 border-b border-[#F3F4F6]">
            <p className="text-[12px] text-[#374151] italic leading-relaxed">
              "All deliverables were submitted on schedule. The giver approved in chat..."
            </p>
          </div>
          <div className="p-3 space-y-2">
            <p className="text-[9px] font-black tracking-[0.18em] text-[#8FA3A0] uppercase mb-2">Submitted Files</p>
            {DOER_FILES.map((f) => (
              <FileRow key={f.id} file={f} active={s.previewFile === f.id} onSelect={() => s.setPreviewFile(f.id)} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Preview area */}
      <AnimatePresence mode="wait">
        {s.previewFile && previewFile ? (
          <motion.div key={s.previewFile}
            initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }}
            transition={{ duration:0.2 }}
            className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black rounded px-1.5 py-0.5"
                  style={{ backgroundColor:TYPE_COLOR[previewFile.type]?.bg, color:TYPE_COLOR[previewFile.type]?.color }}>
                  {previewFile.type}
                </span>
                <div>
                  <p className="text-[12.5px] font-semibold text-[#374151]">{previewFile.name}</p>
                  <p className="text-[10.5px] text-[#8FA3A0]">{previewFile.size} · {previewFile.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => s.setPreviewFile(null)}
                  className="h-7 px-3 border border-[#E2E8E6] rounded-lg text-[11px] font-semibold text-[#374151] hover:bg-[#F5F8F7]">
                  Close preview
                </button>
                <button className="h-7 px-3 rounded-lg bg-[#111827] text-white text-[11px] font-bold flex items-center gap-1.5 hover:bg-[#1f2937]">
                  <HugeiconsIcon icon={Download01Icon} size={12} strokeWidth={2} />Download
                </button>
              </div>
            </div>
            <div className="p-6 flex justify-center bg-[#F9FAFB] min-h-[220px] items-center">
              {previewFile.preview === "image" && (
                <div className="w-full max-w-lg h-52 bg-gradient-to-br from-[#E8F7F3] to-[#DBEAFE] rounded-xl flex items-center justify-center border border-[#E5E7EB]">
                  <p className="text-[12px] font-medium text-[#8FA3A0]">Image preview · {previewFile.name}</p>
                </div>
              )}
              {previewFile.preview === "pdf" && (
                <div className="w-full max-w-lg h-52 bg-white rounded-xl flex items-center justify-center border border-[#E5E7EB] shadow-inner">
                  <div className="text-center"><p className="text-[32px] mb-2">📄</p><p className="text-[12px] font-medium text-[#374151]">{previewFile.name}</p><p className="text-[11px] text-[#8FA3A0]">{previewFile.size}</p></div>
                </div>
              )}
              {(previewFile.preview === "zip" || previewFile.preview === "video") && (
                <div className="w-full max-w-lg h-52 bg-[#111827] rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[32px] mb-2">{previewFile.preview === "zip" ? "🗜️" : "🎬"}</p>
                    <p className="text-[12px] font-medium text-white/70">{previewFile.name}</p>
                    <p className="text-[11px] text-white/40 mt-1">{previewFile.size}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty"
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="bg-white border border-[#E5E7EB] rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <HugeiconsIcon icon={EyeIcon} size={24} strokeWidth={1} className="text-[#D1D5DB] mb-3" />
            <p className="text-[13px] font-semibold text-[#8FA3A0]">Select a file to preview</p>
            <p className="text-[12px] text-[#D1D5DB] mt-1">Click any file above to view its contents</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin decision strip */}
      <div className="flex items-center justify-between mt-4 p-4 bg-white border border-[#E5E7EB] rounded-xl">
        <div>
          <p className="text-[12.5px] font-bold text-[#374151]">Evidence review complete?</p>
          <p className="text-[11.5px] text-[#8FA3A0]">Make your resolution decision after reviewing all files.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => router.push(`/disputes/${params.id}`)}
            className="flex items-center gap-1.5 h-8 px-4 border border-[#E2E8E6] rounded-lg text-[12px] font-semibold text-[#374151] hover:bg-[#F5F8F7]">
            Back to case
          </button>
          <button className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#111827] hover:bg-[#1f2937] text-white text-[12px] font-bold transition-colors">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2} />
            Resolve dispute
          </button>
        </div>
      </div>
    </div>
  )
}
