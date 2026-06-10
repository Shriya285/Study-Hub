import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

export default function XPBar({ level, xpInLevel, xpToNext, progress, leveledUp, onLevelUpDone }) {
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (leveledUp) {
      setAnimating(true)
      const t = setTimeout(() => { setAnimating(false); onLevelUpDone() }, 400)
      return () => clearTimeout(t)
    }
  }, [leveledUp])

  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100)

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: '#faf8ff', borderRadius: 14, padding: 4,
    }}>
      <div
        className={animating ? 'animate-level-up' : ''}
        style={{
          width: 28, height: 28, borderRadius: 9, flexShrink: 0,
          background: 'linear-gradient(135deg, #c4a8ff, #f0eaf7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Star size={13} color="#7c5cbf" fill="#7c5cbf" />
      </div>

      <div style={{
        flex: 1, height: 8,
        background: '#f0eaf7', borderRadius: 4, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 4,
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #c4a8ff, #e88d67)',
          transition: 'width 0.6s ease',
        }} />
      </div>

      <span style={{ fontSize: 11, fontWeight: 500, color: '#8b6fc0', whiteSpace: 'nowrap', paddingRight: 4 }}>
        Lvl {level} · {xpInLevel}/{xpToNext}
      </span>
    </div>
  )
}
