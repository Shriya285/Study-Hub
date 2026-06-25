import { useState, useEffect } from 'react'

function fmt(secs) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function OATimer({ endTime, onExpire, phase }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, Math.floor((endTime - Date.now()) / 1000)))

  useEffect(() => {
    const id = setInterval(() => {
      const r = Math.max(0, Math.floor((endTime - Date.now()) / 1000))
      setRemaining(r)
      if (r === 0) { clearInterval(id); onExpire?.() }
    }, 1000)
    return () => clearInterval(id)
  }, [endTime])

  const urgent = remaining < 300

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: urgent ? 'rgba(239,68,68,0.95)' : 'rgba(10,8,24,0.92)',
      backdropFilter: 'blur(8px)',
      borderBottom: `2px solid ${urgent ? '#fca5a5' : 'rgba(196,168,255,0.25)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 24px',
      transition: 'background 0.5s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: urgent ? '#fff' : 'rgba(196,168,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Mock OA
        </span>
        <span style={{ fontSize: 10, color: urgent ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '2px 8px' }}>
          {phase}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        {urgent && <span style={{ fontSize: 11, color: '#fff', marginRight: 6 }}>Time running out</span>}
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 22, fontWeight: 500,
          color: urgent ? '#fff' : '#e0d5ff',
          letterSpacing: '0.04em', lineHeight: 1,
        }}>
          {fmt(remaining)}
        </span>
      </div>

      <div style={{ width: 80 }} />
    </div>
  )
}
