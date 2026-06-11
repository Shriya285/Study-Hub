import { useRef, useEffect, useState } from 'react'
import { useCurrentBlock } from '../hooks/useCurrentBlock'
import { Sun, Code2, Coffee, BookOpen, Utensils, Terminal, Send, PenLine, Zap, Moon, Brain, Clock, Laptop2, Flame, Target, Dumbbell, Music, FileText, Globe, Star } from 'lucide-react'

const ICON_MAP = {
  sun: Sun, code: Code2, coffee: Coffee, book: BookOpen,
  utensils: Utensils, 'terminal-2': Terminal, terminal: Terminal,
  send: Send, pencil: PenLine, bolt: Zap,
  moon: Moon, brain: Brain, clock: Clock, laptop: Laptop2,
  flame: Flame, target: Target, dumbbell: Dumbbell,
  music: Music, file: FileText, globe: Globe, star: Star,
}

function toMin(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m }

function blockStatus(block) {
  const now = new Date().getHours() * 60 + new Date().getMinutes()
  const s = toMin(block.start), e = toMin(block.end)
  if (now < s) return 'upcoming'
  if (now >= s && now < e) return 'active'
  return 'past'
}

function getBlockProgress(block) {
  const now = new Date().getHours() * 60 + new Date().getMinutes()
  const s = toMin(block.start), e = toMin(block.end)
  return Math.min(1, Math.max(0, (now - s) / (e - s)))
}

function getSummary(schedule) {
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes()
  const studyBlocks = schedule.filter(b => !b.isBreak)
  const totalStudyMin = studyBlocks.reduce((s, b) => s + toMin(b.end) - toMin(b.start), 0)
  const doneBlocks = schedule.filter(b => nowMin >= toMin(b.end))
  const doneStudyMin = doneBlocks.filter(b => !b.isBreak).reduce((s, b) => s + toMin(b.end) - toMin(b.start), 0)
  const lastEnd = schedule.length ? toMin(schedule[schedule.length - 1].end) : nowMin
  const remMin = Math.max(0, lastEnd - nowMin)
  const remH = Math.floor(remMin / 60), remM = remMin % 60
  const remStr = remH > 0 ? `${remH}h${remM > 0 ? ` ${remM}m` : ''}` : `${remM}m`
  const totalH = Math.floor(totalStudyMin / 60)
  return `${totalH}h study plan · ${doneBlocks.length}/${schedule.length} blocks done · ${remStr} remaining`
}

export default function ScheduleStrip({ schedule }) {
  const { current } = useCurrentBlock(schedule)
  const [, tick] = useState(0)
  const stripRef = useRef(null)
  const activeRef = useRef(null)

  useEffect(() => {
    const id = setInterval(() => tick(t => t + 1), 30000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [current?.id])

  if (!schedule?.length) {
    return (
      <div style={{
        background: '#faf8ff', border: '1.5px solid #f0eaf7',
        borderRadius: 12, padding: '12px 16px',
        fontSize: 12, color: '#a898be', textAlign: 'center',
      }}>
        No schedule yet — add blocks in Settings ⚙️
      </div>
    )
  }

  const summary = getSummary(schedule)

  return (
    <div>
      <p style={{ fontSize: 11, color: '#c0aed8', marginBottom: 8, letterSpacing: '0.01em' }}>{summary}</p>
      <div
        ref={stripRef}
        className="no-scrollbar"
        style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}
      >
        {schedule.map((block, i) => {
          const st = blockStatus(block)
          const isActive = st === 'active'
          const isPast = st === 'past'
          const Icon = ICON_MAP[block.icon] ?? BookOpen
          const prog = isActive ? getBlockProgress(block) : 0

          return (
            <div
              key={block.id || i}
              ref={isActive ? activeRef : null}
              style={{
                minWidth: 86, flexShrink: 0,
                padding: '8px 10px', borderRadius: 12,
                border: `1.5px solid ${isActive ? '#d8c4f0' : '#f0eaf7'}`,
                background: isActive
                  ? 'linear-gradient(135deg, #fef8f4, #f8f0ff)'
                  : block.isBreak ? '#faf8ff' : '#ffffff',
                opacity: isPast ? 0.32 : 1,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 3,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Icon size={14} color={isActive ? '#8b6fc0' : isPast ? '#4ecfa0' : '#a898be'} />
              <span style={{
                fontSize: 11, fontWeight: 500,
                color: isActive ? '#5c4a7e' : '#6e6088',
                whiteSpace: 'nowrap',
                textDecoration: isPast ? 'line-through' : 'none',
                fontStyle: block.isBreak ? 'italic' : 'normal',
              }}>
                {block.label}
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9, color: '#c0aed8',
              }}>
                {block.start}
              </span>
              {block.durationLabel && (
                <span style={{ fontSize: 8, color: '#c0aed8' }}>{block.durationLabel}</span>
              )}
              {isActive && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: 3, background: '#f0eaf7',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.round(prog * 100)}%`,
                    background: '#4ecfa0',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
