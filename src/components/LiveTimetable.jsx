import { useState, useEffect } from 'react'
import { Sun, Code2, Coffee, BookOpen, Utensils, Terminal, Send, PenLine, CheckCircle2, Circle } from 'lucide-react'

const ICON_MAP = {
  sun: Sun, code: Code2, coffee: Coffee, book: BookOpen,
  utensils: Utensils, terminal: Terminal, send: Send, pencil: PenLine,
}

function nowSec() {
  const d = new Date()
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()
}
function toSec(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 3600 + m * 60
}
function fmt12(t) {
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}
function durLabel(s, e) {
  const sec = toSec(e) - toSec(s)
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60)
  if (h > 0 && m > 0) return `${h}h ${m}m`
  return h > 0 ? `${h}h` : `${m}m`
}
function countdown(sec) {
  if (sec <= 0) return '0s'
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`
  if (m > 0 && s > 0) return `${m}m ${s}s`
  return m > 0 ? `${m}m` : `${s}s`
}

export default function LiveTimetable({ schedule }) {
  const [now, setNow] = useState(nowSec)

  useEffect(() => {
    const id = setInterval(() => setNow(nowSec()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!schedule || schedule.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#9b8bbd]">No schedule configured. Add blocks in Settings.</p>
      </div>
    )
  }

  const firstSec = toSec(schedule[0].start)
  const lastSec = toSec(schedule[schedule.length - 1].end)
  const totalDaySec = lastSec - firstSec
  const elapsedSec = Math.max(0, Math.min(totalDaySec, now - firstSec))
  const dayPct = totalDaySec > 0 ? Math.round((elapsedSec / totalDaySec) * 100) : 0

  const past = [], upcoming = []
  let active = null
  for (const block of schedule) {
    const s = toSec(block.start), e = toSec(block.end)
    if (now >= e) past.push(block)
    else if (now >= s && now < e) {
      const elapsed = now - s, total = e - s
      active = { block, elapsed, total, pct: Math.round((elapsed / total) * 100), remaining: e - now }
    } else upcoming.push(block)
  }

  const d = new Date()
  const dateStr = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const timeStr = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`

  return (
    <div className="p-7 max-w-175 mx-auto flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-[26px] text-[#1a1240]">{dateStr}</h1>
          <p className="text-[14px] text-[#9b8bbd] mt-1">{past.length} of {schedule.length} blocks complete</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-[14px] px-4 py-2.5 shadow-sm border border-[#ede8f8] shrink-0">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
          <span className="font-mono font-bold text-[17px] text-[#7c3aed] tabular-nums">{timeStr}</span>
        </div>
      </div>

      {/* Day progress */}
      <div className="bg-white rounded-pill shadow-sm border border-[#ede8f8] p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#c4b0e0]">Day Progress</span>
          <span className="font-bold text-[15px] text-[#7c3aed]">{dayPct}%</span>
        </div>
        <div className="h-3 bg-[#f0e8ff] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${dayPct}%`, background: 'linear-gradient(90deg, #7c3aed, #f59e0b)' }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-mono text-[11px] text-[#c4b0e0]">{fmt12(schedule[0].start)}</span>
          <span className="font-mono text-[11px] text-[#c4b0e0]">{fmt12(schedule[schedule.length - 1].end)}</span>
        </div>
      </div>

      {/* Completed */}
      {past.length > 0 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#c4b0e0] mb-2 px-1">Completed</p>
          <div className="bg-white rounded-pill shadow-sm border border-[#ede8f8] overflow-hidden">
            {past.map((block, i) => {
              const Icon = ICON_MAP[block.icon] ?? Sun
              return (
                <div key={block.id} className={`flex items-center gap-3 px-5 py-3.5 opacity-40 ${i < past.length - 1 ? 'border-b border-[#f5f0ff]' : ''}`}>
                  <CheckCircle2 size={15} className="text-[#34d399] shrink-0" />
                  <Icon size={13} className="text-[#c4b0e0] shrink-0" />
                  <span className="flex-1 text-[13px] font-medium text-[#5b3fa0] line-through truncate">{block.label}</span>
                  <span className="font-mono text-[11px] text-[#c4b0e0] shrink-0">{block.start}–{block.end}</span>
                  <span className="text-[11px] text-[#c4b0e0] shrink-0 w-10 text-right">{durLabel(block.start, block.end)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* NOW divider */}
      {active && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #a855f7)' }} />
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>Now</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #a855f7, transparent)' }} />
        </div>
      )}

      {/* Active block */}
      {active && (() => {
        const { block, pct, remaining } = active
        const Icon = ICON_MAP[block.icon] ?? Sun
        return (
          <div
            className="rounded-3xl overflow-hidden shadow-md border-2 border-lavender-400"
            style={{ background: 'linear-gradient(140deg, #fdf4ff 0%, #ede9fe 60%, #fef3c7 100%)' }}
          >
            <div className="px-7 pt-7 pb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-red-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      Live Now
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#ede9fe', color: '#6d28d9' }}>{pct}%</span>
                  </div>
                  <h2 className="font-bold text-[24px] text-[#1a1240] leading-tight">{block.label}</h2>
                  <p className="font-mono text-[12px] text-[#9b8bbd] mt-1.5 flex items-center gap-1.5">
                    <Icon size={12} />
                    {fmt12(block.start)} → {fmt12(block.end)}
                  </p>
                  {block.subtitle && <p className="text-[12px] text-[#9b8bbd] mt-1">{block.subtitle}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono font-bold text-[34px] text-[#7c3aed] leading-none tabular-nums">{countdown(remaining)}</p>
                  <p className="text-[10px] text-[#b0a0d0] mt-1">remaining</p>
                </div>
              </div>
              <div className="mt-5">
                <div className="h-3 bg-[#e8e0f8] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #7c3aed, #f59e0b)' }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="font-mono text-[10px] text-[#c4b0e0]">{fmt12(block.start)}</span>
                  <span className="font-mono text-[10px] text-[#c4b0e0]">{durLabel(block.start, block.end)} total</span>
                  <span className="font-mono text-[10px] text-[#c4b0e0]">{fmt12(block.end)}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Between-blocks notice */}
      {!active && past.length > 0 && upcoming.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#e8e0f8]" />
          <span className="text-[12px] text-[#9b8bbd] px-2">Next: {upcoming[0].label} at {fmt12(upcoming[0].start)}</span>
          <div className="flex-1 h-px bg-[#e8e0f8]" />
        </div>
      )}
      {!active && past.length === 0 && upcoming.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#e8e0f8]" />
          <span className="text-[12px] text-[#9b8bbd] px-2">Schedule starts at {fmt12(schedule[0].start)}</span>
          <div className="flex-1 h-px bg-[#e8e0f8]" />
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#c4b0e0] mb-2 px-1">Upcoming</p>
          <div className="bg-white rounded-pill shadow-sm border border-[#ede8f8] overflow-hidden">
            {upcoming.map((block, i) => {
              const Icon = ICON_MAP[block.icon] ?? Sun
              const startsIn = toSec(block.start) - now
              return (
                <div key={block.id} className={`flex items-center gap-3 px-5 py-3.5 ${i < upcoming.length - 1 ? 'border-b border-[#f5f0ff]' : ''}`}>
                  <Circle size={13} className="text-[#ddd5f8] shrink-0" />
                  <Icon size={13} className="text-[#c4b0e0] shrink-0" />
                  <span className="flex-1 text-[13px] font-medium text-[#1a1240] truncate">{block.label}</span>
                  {block.subtitle && <span className="text-[11px] text-[#c4b0e0] truncate max-w-32.5 hidden sm:block">{block.subtitle}</span>}
                  <span className="font-mono text-[11px] text-[#c4b0e0] shrink-0">{block.start}–{block.end}</span>
                  <span className="text-[11px] text-[#9b8bbd] shrink-0 w-10 text-right">{durLabel(block.start, block.end)}</span>
                  {i === 0 && startsIn > 0 && startsIn < 7200 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: '#fff7ed', color: '#c2410c' }}>
                      in {Math.ceil(startsIn / 60)}m
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* All done */}
      {upcoming.length === 0 && !active && past.length > 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="font-bold text-[22px] text-[#1a1240]">Day complete!</h3>
          <p className="text-[14px] text-[#9b8bbd] mt-2">All {past.length} blocks done. See you tomorrow!</p>
        </div>
      )}
    </div>
  )
}
