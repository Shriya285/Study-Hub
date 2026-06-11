import { useState, useEffect } from 'react'
import { Settings, Headphones, NotebookPen, Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function Header({ name, streak, daysLeft, poms, onSettingsOpen, onFocusOpen, onNotesOpen }) {
  const [now, setNow] = useState(new Date())
  const { isDark, toggle } = useTheme()

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
        <p style={{ fontSize: 20, fontWeight: 500, color: 'var(--fg)', margin: 0 }}>
          Hey, <span style={{ color: 'var(--peach-d)' }}>{name}</span>! ✨
        </p>
        <p style={{ margin: '3px 0 0', display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 15, fontWeight: 400, color: 'var(--purple-d)',
            letterSpacing: '0.04em',
          }}>
            {hh}:{mm}
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, color: 'var(--fg4)',
            letterSpacing: '0.04em', marginLeft: 2,
          }}>
            :{ss}
          </span>
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ background: 'var(--badge-peach-bg)', color: 'var(--badge-peach-text)', padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
          🔥 {streak}
        </span>
        <span style={{ background: 'var(--badge-purple-bg)', color: 'var(--badge-purple-text)', padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
          ⏳ {daysLeft}d
        </span>
        <span style={{ background: 'var(--badge-mint-bg)', color: 'var(--badge-mint-text)', padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
          🍅 {poms} poms
        </span>

        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'var(--surface3)', color: 'var(--purple-d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface4)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface3)' }}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button
          onClick={onFocusOpen}
          style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'var(--surface3)', color: 'var(--purple-d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s, color 0.15s',
          }}
          title="Focus Mode"
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface4)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--surface3)'}
        >
          <Headphones size={16} />
        </button>

        <button
          onClick={onNotesOpen}
          style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'var(--surface3)', color: 'var(--purple-d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s, color 0.15s',
          }}
          title="Notes"
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface4)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--surface3)'}
        >
          <NotebookPen size={15} />
        </button>

        <button
          onClick={onSettingsOpen}
          style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'var(--surface3)', color: 'var(--purple-d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface4)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--surface3)'}
        >
          <Settings size={16} />
        </button>
      </div>
    </div>
  )
}
