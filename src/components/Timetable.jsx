import { useCurrentBlock } from '../hooks/useCurrentBlock'

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function fmt(time) {
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}

function nowMinutes() {
  const n = new Date()
  return n.getHours() * 60 + n.getMinutes()
}

export default function Timetable({ schedule }) {
  const { current } = useCurrentBlock(schedule)
  const now = nowMinutes()

  return (
    <div className="py-5">
      <p className="text-[11px] font-medium text-[#4a4860] uppercase tracking-widest mb-3 px-3">Schedule</p>
      <div className="flex flex-col gap-0.5">
        {schedule.map(block => {
          const end = timeToMinutes(block.end)
          const isPast = now >= end
          const isCurrent = current?.id === block.id

          return (
            <div
              key={block.id}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-[#1b1635] ring-1 ring-inset ring-[#7c6ef5]/20'
                  : 'hover:bg-[#13121e]'
              } ${isPast && !isCurrent ? 'opacity-25' : ''}`}
            >
              <span className={`text-[11px] font-medium tabular-nums w-16 shrink-0 pt-0.5 ${
                isCurrent ? 'text-[#a78bfa]' : 'text-[#4a4860]'
              }`}>
                {fmt(block.start)}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[13px] font-medium ${
                    isCurrent ? 'text-white' : isPast ? 'text-[#2e2d45]' : 'text-[#c5c3d8]'
                  }`}>
                    {block.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#7c6ef5]/15 text-[#a78bfa]">
                      now
                    </span>
                  )}
                  {isPast && !isCurrent && (
                    <span className="text-[#2e2d45] text-xs">✓</span>
                  )}
                </div>
                {block.subtitle && (
                  <p className="text-[11px] text-[#32304e] mt-0.5 truncate">{block.subtitle}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
