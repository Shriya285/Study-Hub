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

  const iconBtn = {
    width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
    background: 'var(--surface3)', color: 'var(--purple-d)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.15s',
    flexShrink: 0,
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      {/* Left: greeting + clock */}
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 18, fontWeight: 500, color: 'var(--fg)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Hey, <span style={{ color: 'var(--peach-d)' }}>{name}</span>! ✨
        </p>
        <p style={{ margin: '3px 0 0', display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14, fontWeight: 400, color: 'var(--purple-d)',
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

      {/* Right: badges (hidden on mobile) + icon buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {/* Badges — hidden on small screens via CSS */}
        <span className="hide-mobile" style={{ background: 'var(--badge-peach-bg)', color: 'var(--badge-peach-text)', padding: '5px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>
          🔥 {streak}
        </span>
        <span className="hide-mobile" style={{ background: 'var(--badge-purple-bg)', color: 'var(--badge-purple-text)', padding: '5px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>
          ⏳ {daysLeft}d
        </span>
        <span className="hide-mobile" style={{ background: 'var(--badge-mint-bg)', color: 'var(--badge-mint-text)', padding: '5px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>
          🍅 {poms}
        </span>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          title={isDark ? 'Light mode' : 'Dark mode'}
          style={iconBtn}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface4)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface3)' }}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button
          onClick={onFocusOpen}
          style={iconBtn}
          title="Focus Mode"
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface4)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--surface3)'}
        >
          <Headphones size={16} />
        </button>

        <button
          onClick={onNotesOpen}
          style={iconBtn}
          title="Notes"
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface4)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--surface3)'}
        >
          <NotebookPen size={15} />
        </button>

        <button
          onClick={onSettingsOpen}
          style={iconBtn}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface4)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--surface3)'}
        >
          <Settings size={16} />
        </button>
      </div>
    </div>
  )
}
