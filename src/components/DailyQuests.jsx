import { useState, useCallback } from 'react'

export default function DailyQuests({ quests, onQuestToggle }) {
  const [xpPops, setXpPops] = useState([])

  const handleToggle = useCallback((questId) => {
    const quest = quests.find(q => q.id === questId)
    if (quest && !quest.done) {
      const key = Date.now()
      setXpPops(prev => [...prev, { questId, xp: quest.xp, key }])
      setTimeout(() => setXpPops(prev => prev.filter(p => p.key !== key)), 900)
    }
    onQuestToggle(questId)
  }, [quests, onQuestToggle])

  const done = quests.filter(q => q.done).length
  const total = quests.length
  const pct = total === 0 ? 0 : (done / total) * 100
  const allDone = done === total && total > 0

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1.5px solid var(--border)',
      borderRadius: 16, padding: '14px 16px',
      flex: 1,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{
          fontSize: 10, fontWeight: 500, color: 'var(--fg4)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          Daily Quests
        </span>
        <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--mint)' }}>
          {done}/{total}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 4, background: 'var(--xp-track)', borderRadius: 4,
        overflow: 'hidden', marginBottom: 10,
      }}>
        <div style={{
          height: '100%', borderRadius: 4,
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #7ee6b8, #4ecfa0)',
          transition: 'width 0.5s ease',
        }} />
      </div>

      {/* Quest rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {quests.map((quest, idx) => {
          const pop = xpPops.find(p => p.questId === quest.id)
          const isLast = idx === quests.length - 1
          return (
            <div key={quest.id} style={{ position: 'relative' }}>
              {pop && (
                <span
                  key={pop.key}
                  className="xp-float"
                  style={{
                    position: 'absolute', right: 8, top: 6,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12, fontWeight: 700,
                    color: 'var(--mint)', pointerEvents: 'none', zIndex: 10,
                  }}
                >
                  +{pop.xp}
                </span>
              )}

              <button
                onClick={() => handleToggle(quest.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: 10, padding: '7px 0',
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  borderBottom: isLast ? 'none' : '1px solid var(--surface2)',
                }}
              >
                {/* Checkbox */}
                <div style={{
                  width: 18, height: 18, borderRadius: 6, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: quest.done ? 'linear-gradient(135deg, #7ee6b8, #4ecfa0)' : 'var(--surface2)',
                  border: quest.done ? 'none' : '1.5px solid var(--border2)',
                  transition: 'all 0.2s ease',
                }}>
                  {quest.done && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4.2 7.5L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                {/* Label */}
                <span style={{
                  flex: 1, fontSize: 12, lineHeight: 1.4,
                  color: quest.done ? 'var(--fg3)' : 'var(--fg2)',
                  textDecoration: quest.done ? 'line-through' : 'none',
                  transition: 'color 0.2s ease',
                }}>
                  {quest.label}
                </span>

                {/* XP badge */}
                <span style={{
                  fontSize: 10, fontWeight: 500, color: 'var(--mint)',
                  opacity: quest.done ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  flexShrink: 0,
                }}>
                  +{quest.xp}
                </span>
              </button>
            </div>
          )
        })}
      </div>

      {allDone && (
        <div style={{
          marginTop: 10, padding: '8px 12px', borderRadius: 10,
          background: 'var(--badge-mint-bg)',
          border: '1.5px solid var(--mint-light)',
          fontSize: 12, color: 'var(--mint-d)', fontWeight: 500, textAlign: 'center',
        }}>
          🎉 All quests complete!
        </div>
      )}
    </div>
  )
}
