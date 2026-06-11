import { Sword, Flame, Trophy, Zap, Gem, Crown, Lock } from 'lucide-react'

const DEFS = [
  { key: 'firstDay',   Icon: Sword,  label: 'Day 1',   tip: 'Complete your first day' },
  { key: 'streak3',    Icon: Flame,  label: '3 Days',   tip: '3-day streak' },
  { key: 'problems50', Icon: Trophy, label: '50 Solve', tip: '50 problems logged' },
  { key: 'streak7',    Icon: Zap,    label: '1 Week',   tip: '7-day streak' },
  { key: 'streak14',   Icon: Gem,    label: '2 Weeks',  tip: '14-day streak' },
  { key: 'streak30',   Icon: Crown,  label: '1 Month',  tip: '30-day streak' },
]

export default function Trophies({ trophies }) {
  const earned = DEFS.filter(d => trophies[d.key]).length

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1.5px solid var(--border)',
      borderRadius: 16, padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg2)' }}>Trophies</span>
        <span style={{
          fontSize: 10, fontWeight: 600,
          background: 'var(--surface3)', color: 'var(--purple-d)',
          padding: '2px 8px', borderRadius: 10,
        }}>
          {earned}/{DEFS.length}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
        {DEFS.map(({ key, Icon, label, tip }) => {
          const isEarned = trophies[key]
          return (
            <div
              key={key}
              title={tip}
              style={{
                width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isEarned ? 'var(--badge-peach-bg)' : 'var(--surface2)',
                border: `1.5px solid ${isEarned ? 'var(--border2)' : 'var(--border)'}`,
                opacity: isEarned ? 1 : 0.3,
                cursor: 'default',
              }}
            >
              {isEarned
                ? <Icon size={14} color="var(--peach)" />
                : <Lock size={11} color="var(--fg4)" />
              }
            </div>
          )
        })}
      </div>

      {earned > 0 && (
        <p style={{ fontSize: 10, color: 'var(--fg4)', margin: '8px 0 0' }}>
          {DEFS.filter(d => trophies[d.key]).map(d => d.label).join(' · ')}
        </p>
      )}
    </div>
  )
}
