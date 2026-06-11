import { useState, useEffect } from 'react'
import { Settings, Headphones, NotebookPen } from 'lucide-react'

export default function Header({ name, streak, daysLeft, poms, onSettingsOpen, onFocusOpen, onNotesOpen }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hh = now.getHours().toString().padStart(2, '0')
  const mm = now.getMinutes().toString().padStart(2, '0')
  const ss = now.getSeconds().toString().padStart(2, '0')

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
      <div>
        <p style={{ fontSize: 20, fontWeight: 500, color: '#2d2a3e', margin: 0 }}>
          Hey, <span style={{ color: '#d97a4a' }}>{name}</span>! ✨
        </p>
        <p style={{ margin: '3px 0 0', display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 15, fontWeight: 400, color: '#8b6fc0',
            letterSpacing: '0.04em',
          }}>
            {hh}:{mm}
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, color: '#c0aed8',
            letterSpacing: '0.04em', marginLeft: 2,
          }}>
            :{ss}
          </span>
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ background: '#fff4ec', color: '#d97a4a', padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
          🔥 {streak}
        </span>
        <span style={{ background: '#f5f1fc', color: '#8b6fc0', padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
          ⏳ {daysLeft}d
        </span>
        <span style={{ background: '#e8faf3', color: '#3da87a', padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
          🍅 {poms} poms
        </span>

        <button
          onClick={onFocusOpen}
          style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: '#f5f1fc', color: '#8b6fc0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s, color 0.15s',
          }}
          title="Focus Mode"
          onMouseEnter={e => { e.currentTarget.style.background = '#e0d6f0'; e.currentTarget.style.color = '#5c4a7e' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f5f1fc'; e.currentTarget.style.color = '#8b6fc0' }}
        >
          <Headphones size={16} />
        </button>

        <button
          onClick={onNotesOpen}
          style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: '#f5f1fc', color: '#8b6fc0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s, color 0.15s',
          }}
          title="Notes"
          onMouseEnter={e => { e.currentTarget.style.background = '#e0d6f0'; e.currentTarget.style.color = '#5c4a7e' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f5f1fc'; e.currentTarget.style.color = '#8b6fc0' }}
        >
          <NotebookPen size={15} />
        </button>

        <button
          onClick={onSettingsOpen}
          style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: '#f5f1fc', color: '#8b6fc0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#e0d6f0'; e.currentTarget.style.color = '#5c4a7e' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f5f1fc'; e.currentTarget.style.color = '#8b6fc0' }}
        >
          <Settings size={16} />
        </button>
      </div>
    </div>
  )
}
