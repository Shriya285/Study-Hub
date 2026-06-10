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
      background: '#ffffff',
      border: '1.5px solid #f0eaf7',
      borderRadius: 16, padding: '14px 16px',
      flex: 1,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{
          fontSize: 10, fontWeight: 500, color: '#c0aed8',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          Daily Quests
        </span>
        <span style={{ fontSize: 10, fontWeight: 500, color: '#4ecfa0' }}>
          {done}/{total}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 4, background: '#f0eaf7', borderRadius: 4,
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
                    color: '#4ecfa0', pointerEvents: 'none', zIndex: 10,
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
                  borderBottom: isLast ? 'none' : '1px solid #faf8ff',
                }}
              >
                {/* Checkbox */}
                <div style={{
                  width: 18, height: 18, borderRadius: 6, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: quest.done ? 'linear-gradient(135deg, #7ee6b8, #4ecfa0)' : '#faf8ff',
                  border: quest.done ? 'none' : '1.5px solid #e0d6f0',
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
                  color: quest.done ? '#a898be' : '#5c4a7e',
                  textDecoration: quest.done ? 'line-through' : 'none',
                  transition: 'color 0.2s ease',
                }}>
                  {quest.label}
                </span>

                {/* XP badge — opacity 0 unchecked → 1 checked */}
                <span style={{
                  fontSize: 10, fontWeight: 500, color: '#4ecfa0',
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
          background: 'linear-gradient(135deg, #f0fdf8, #e8faf3)',
          border: '1.5px solid #7ee6b8',
          fontSize: 12, color: '#3da87a', fontWeight: 500, textAlign: 'center',
        }}>
          🎉 All quests complete!
        </div>
      )}
    </div>
  )
}
