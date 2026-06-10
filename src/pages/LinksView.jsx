import { Code2, ListChecks, Laptop, BookOpen, Briefcase, FileText, ArrowUpRight } from 'lucide-react'

const ICON_MAP = { code: Code2, 'list-check': ListChecks, laptop: Laptop, book: BookOpen, briefcase: Briefcase, 'file-text': FileText }
const ICON_GRADS = [
  'linear-gradient(135deg, #7c3aed, #a855f7)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  'linear-gradient(135deg, #ef4444, #b91c1c)',
  'linear-gradient(135deg, #ec4899, #be185d)',
]

export default function LinksView({ resources }) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-7">
        <div className="mb-6">
          <h1 className="font-bold text-[28px] text-[#1a1240]">Quick Links</h1>
          <p className="text-[14px] text-[#9b8bbd] mt-1">Jump to your study resources</p>
        </div>

        <div className="flex flex-col gap-3">
          {resources.map((r, i) => {
            const Icon = ICON_MAP[r.icon] ?? Code2
            const grad = ICON_GRADS[i % ICON_GRADS.length]
            return r.url ? (
              <a
                key={r.id}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-5 py-4 bg-white rounded-2xl shadow-sm border border-white/60 hover:shadow-md hover:border-[#d4c4f4] transition-all group"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: grad }}>
                  <Icon size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[15px] text-[#1a1240] group-hover:text-[#6d28d9] transition-colors">{r.label}</p>
                  <p className="text-[12px] text-[#c4b0e0] truncate mt-0.5">{r.url}</p>
                </div>
                <ArrowUpRight size={18} className="text-[#d4c4f4] group-hover:text-[#7c3aed] transition-colors shrink-0" />
              </a>
            ) : (
              <div
                key={r.id}
                title="Add URL in Settings"
                className="flex items-center gap-4 px-5 py-4 bg-white rounded-2xl border border-[#f0e8ff] opacity-40 cursor-not-allowed"
              >
                <div className="w-11 h-11 rounded-xl bg-[#f0e8ff] flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-[#b0a0d0]" />
                </div>
                <div>
                  <p className="font-semibold text-[15px] text-[#9b8bbd]">{r.label}</p>
                  <p className="text-[12px] text-[#c4b0e0] mt-0.5">No URL set — edit in Settings</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
