import { Settings } from 'lucide-react'

export default function Header({ name, streak, daysLeft, poms, onSettingsOpen }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
      <p style={{ fontSize: 20, fontWeight: 500, color: '#2d2a3e', margin: 0 }}>
        Hey, <span style={{ color: '#d97a4a' }}>{name}</span>! ✨
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          background: '#fff4ec', color: '#d97a4a',
          padding: '5px 12px', borderRadius: 20,
          fontSize: 12, fontWeight: 500,
        }}>
          🔥 {streak}
        </span>
        <span style={{
          background: '#f5f1fc', color: '#8b6fc0',
          padding: '5px 12px', borderRadius: 20,
          fontSize: 12, fontWeight: 500,
        }}>
          ⏳ {daysLeft}d
        </span>
        <span style={{
          background: '#e8faf3', color: '#3da87a',
          padding: '5px 12px', borderRadius: 20,
          fontSize: 12, fontWeight: 500,
        }}>
          🍅 {poms} poms
        </span>

        <button
          onClick={onSettingsOpen}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '6px', borderRadius: 8,
            color: '#a898be', display: 'flex', alignItems: 'center',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#8b6fc0'}
          onMouseLeave={e => e.currentTarget.style.color = '#a898be'}
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  )
}
