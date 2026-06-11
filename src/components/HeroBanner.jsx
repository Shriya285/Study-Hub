import { useState, useEffect } from 'react'
import { useCurrentBlock } from '../hooks/useCurrentBlock'

function pad2(n) { return String(n).padStart(2, '0') }
function clockNow() {
  const d = new Date()
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}
function getRemaining(endTime) {
  const [h, m] = endTime.split(':').map(Number)
  const end = new Date(); end.setHours(h, m, 0, 0)
  const diffMin = Math.max(0, Math.floor((end - new Date()) / 60000))
  if (diffMin === 0) return 'ending now'
  return diffMin < 60 ? `${diffMin}m remaining` : `${Math.floor(diffMin / 60)}h ${diffMin % 60}m remaining`
}
function blockProgress(start, end) {
  const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
  const now = new Date().getHours() * 60 + new Date().getMinutes()
  const s = toMin(start), e = toMin(end)
  return Math.min(1, Math.max(0, (now - s) / (e - s)))
}

export default function HeroBanner({ schedule, poms, questsDone, questsTotal }) {
  const { current, next, status } = useCurrentBlock(schedule)
  const [, tick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => tick(t => t + 1), 30000)
    return () => clearInterval(id)
  }, [])

  let tag, title, subtitle, extraLine, rightTop, rightSub

  if (status === 'before' && schedule?.length) {
    tag = 'GOOD MORNING'
    title = `Your day starts at ${schedule[0].start}`
    subtitle = `First up: ${schedule[0].label} · ${schedule[0].durationLabel || ''}`
    rightTop = clockNow()
    rightSub = null
  } else if (status === 'active' && current) {
    tag = current.isBreak ? 'BREAK TIME' : 'RIGHT NOW'
    title = current.label
    subtitle = current.isBreak
      ? `Ends at ${current.end}`
      : `${current.start} – ${current.end} · ${getRemaining(current.end)}`
    extraLine = next ? `Next → ${next.label} at ${next.start}` : 'Last block of the day'
    rightTop = `${current.start} – ${current.end}`
    rightSub = current.durationLabel || null
  } else if (status === 'after') {
    tag = 'ALL DONE ✨'
    title = 'Great work today!'
    subtitle = `${questsDone}/${questsTotal} quests · ${poms} pomodoro${poms !== 1 ? 's' : ''}`
    rightTop = clockNow()
    rightSub = null
  } else {
    tag = 'TODAY'
    title = questsTotal > 0 ? `${questsDone}/${questsTotal} quests done` : 'Study Hub'
    subtitle = 'Open ⚙️ Settings to add your schedule'
    rightTop = clockNow()
    rightSub = null
  }

  const showProgress = status === 'active' && current && !current.isBreak
  const pct = showProgress ? Math.round(blockProgress(current.start, current.end) * 100) : 0

  return (
    <div style={{
      background: 'var(--hero-bg)',
      border: '1.5px solid var(--border)',
      borderRadius: 18,
      padding: '18px 22px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        {/* Left */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            fontSize: 9, fontWeight: 600, letterSpacing: '0.1em',
            color: 'var(--purple)', textTransform: 'uppercase',
            display: 'block', marginBottom: 4,
          }}>
            {tag}
          </span>
          <p style={{
            fontSize: 18, fontWeight: 500, color: 'var(--fg)',
            margin: '0 0 3px', lineHeight: 1.3,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {title}
          </p>
          <p style={{ fontSize: 12, color: 'var(--fg3)', margin: 0 }}>{subtitle}</p>

          {showProgress && (
            <div style={{ marginTop: 8 }}>
              <div style={{ height: 4, background: 'var(--xp-track)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 4,
                  width: `${pct}%`,
                  background: 'var(--purple-bright)',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          )}

          {extraLine && (
            <p style={{ fontSize: 11, color: 'var(--fg4)', margin: '5px 0 0' }}>{extraLine}</p>
          )}
        </div>

        {/* Right — hidden on mobile */}
        <div className="hero-right" style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 22, fontWeight: 500, color: 'var(--purple-bright)',
            margin: 0, lineHeight: 1, letterSpacing: '0.03em',
          }}>
            {rightTop}
          </p>
          {rightSub && (
            <p style={{ fontSize: 11, color: 'var(--fg4)', margin: '4px 0 0' }}>{rightSub}</p>
          )}
          {next && status === 'active' && !current?.isBreak && (
            <p style={{ fontSize: 11, color: 'var(--fg4)', margin: '3px 0 0', maxWidth: 130 }}>
              Next: {next.label} at {next.start}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
