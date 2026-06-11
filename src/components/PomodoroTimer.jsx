import { useState } from 'react'
import { Play, Pause, RotateCcw, Settings2 } from 'lucide-react'
import { MODE_LABELS } from '../hooks/useTimer'

const RADIUS = 50
const CIRC = 2 * Math.PI * RADIUS

export default function PomodoroTimer({ timer, pomCount = 0 }) {
  const { mode, durations, timeLeft, running, setRunning, switchMode, reset, updateDuration, dash } = timer
  const [showCustomize, setShowCustomize] = useState(false)

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const secs = (timeLeft % 60).toString().padStart(2, '0')

  return (
    <div style={{ background: '#ffffff', border: '1.5px solid #f0eaf7', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px 0' }}>
        <span style={{ fontSize: 10, fontWeight: 500, color: '#c0aed8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Pomodoro
        </span>
      </div>

      {/* Mode tabs */}
      <div style={{ padding: '10px 16px 0' }}>
        <div style={{ display: 'flex', background: '#f5f1fc', borderRadius: 10, padding: 3 }}>
          {Object.entries(MODE_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              style={{
                flex: 1, padding: '5px 0', borderRadius: 8,
                fontSize: 11, fontWeight: 500, border: 'none', cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: mode === key ? '#ffffff' : 'transparent',
                color: mode === key ? '#7c5cbf' : '#a898be',
                boxShadow: mode === key ? '0 1px 3px rgba(124,92,191,0.1)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Ring */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 16px 14px' }}>
        <div style={{ position: 'relative', width: 140, height: 140 }}>
          <svg width="140" height="140" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
            <defs>
              <linearGradient id="timerGradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#c4a8ff" />
                <stop offset="100%" stopColor="#e88d67" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#f0eaf7" strokeWidth="6" />
            <circle
              cx="60" cy="60" r={RADIUS} fill="none"
              stroke="url(#timerGradient)" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${dash} ${CIRC}`}
              style={{ transition: 'stroke-dasharray 0.5s linear' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 26, fontWeight: 500, color: '#5c4a7e', lineHeight: 1, letterSpacing: '0.03em',
            }}>
              {mins}:{secs}
            </span>
            <span style={{ fontSize: 10, color: '#c0aed8' }}>{MODE_LABELS[mode]}</span>
          </div>
        </div>

        <p style={{ fontSize: 11, color: '#c0aed8', margin: '6px 0 12px', textAlign: 'center' }}>
          {pomCount > 0 ? `${pomCount} pomodoro${pomCount !== 1 ? 's' : ''} today` : 'No sessions yet'}
        </p>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 5, width: '100%', alignItems: 'center' }}>
          <button
            onClick={() => setRunning(r => !r)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, padding: '8px 0', borderRadius: 10,
              background: 'linear-gradient(135deg, #b794f4, #e88d67)',
              color: '#ffffff', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {running ? <Pause size={15} /> : <Play size={15} />}
            {running ? 'Pause' : 'Start'}
          </button>

          <button
            onClick={reset}
            style={{
              width: 36, height: 36, borderRadius: 10, border: 'none',
              background: '#f5f1fc', color: '#a898be', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e0d6f0'; e.currentTarget.style.color = '#5c4a7e' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f5f1fc'; e.currentTarget.style.color = '#a898be' }}
          >
            <RotateCcw size={14} />
          </button>

          <button
            onClick={() => setShowCustomize(c => !c)}
            style={{
              width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer',
              background: showCustomize ? '#e0d6f0' : '#f5f1fc',
              color: showCustomize ? '#5c4a7e' : '#a898be',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s, color 0.15s',
            }}
          >
            <Settings2 size={14} />
          </button>
        </div>

        {showCustomize && (
          <div style={{
            width: '100%', background: '#faf8ff', borderRadius: 10,
            padding: '10px 12px', marginTop: 10, border: '1.5px solid #f0eaf7',
          }}>
            <p style={{ fontSize: 10, fontWeight: 500, color: '#c0aed8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              Durations
            </p>
            {Object.entries(MODE_LABELS).map(([key, label]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0' }}>
                <span style={{ fontSize: 11, color: '#8b6fc0' }}>{label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="number"
                    value={durations[key]}
                    onChange={e => updateDuration(key, e.target.value)}
                    min={1} max={99}
                    style={{
                      width: 50, textAlign: 'center',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13, fontWeight: 500, background: '#ffffff',
                      border: '1.5px solid #f0eaf7', borderRadius: 6, padding: '4px 0', color: '#2d2a3e', outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = '#c4a8ff'}
                    onBlur={e => e.target.style.borderColor = '#f0eaf7'}
                  />
                  <span style={{ fontSize: 10, color: '#c0aed8' }}>min</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
