import { useState } from 'react'
import { Trash2 } from 'lucide-react'

function stripHtml(html) {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  } catch {
    return html.replace(/<[^>]+>/g, '')
  }
}

export default function NoteCard({ note, onClick, onDelete }) {
  const [hov, setHov] = useState(false)
  const [delHov, setDelHov] = useState(false)

  const preview = stripHtml(note.content).slice(0, 120)
  const time = new Date(note.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  })

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--surface)',
        border: `1.5px solid ${hov ? 'var(--border2)' : 'var(--border)'}`,
        borderRadius: 12, padding: '10px 14px',
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: hov ? 'var(--shadow-card) 0 2px 8px' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          background: 'var(--surface3)', color: 'var(--purple-d)',
          fontSize: 9, fontWeight: 500, padding: '2px 8px', borderRadius: 20,
          flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {note.subject}
        </span>
        <span style={{
          fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--fg4)', flex: 1,
        }}>
          {time}
        </span>
        {hov && (
          <button
            onClick={e => { e.stopPropagation(); onDelete(note.id) }}
            onMouseEnter={() => setDelHov(true)}
            onMouseLeave={() => setDelHov(false)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 2,
              color: delHov ? '#e57373' : 'var(--fg4)', transition: 'color 0.15s',
              display: 'flex', alignItems: 'center',
            }}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {note.title && (
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)', margin: '0 0 6px' }}>
          {note.title}
        </p>
      )}

      <div style={{ height: 1, background: 'var(--border)', marginBottom: 6 }} />

      <p style={{
        fontSize: 12, color: 'var(--fg3)', margin: 0, lineHeight: 1.5,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {preview || 'No content yet'}
      </p>
    </div>
  )
}
