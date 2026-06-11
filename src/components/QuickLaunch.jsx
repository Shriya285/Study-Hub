import { Code2, ListChecks, Laptop, BookOpen, Briefcase, FileText, School, Rocket } from 'lucide-react'

const ICON_MAP = {
  'code':          Code2,
  'list-check':    ListChecks,
  'device-laptop': Laptop,
  'laptop':        Laptop,
  'book':          BookOpen,
  'school':        School,
  'rocket':        Rocket,
  'briefcase':     Briefcase,
  'file-text':     FileText,
}

const HIGHLIGHT_LABELS = ['Cisco Prep']

export default function QuickLaunch({ resources }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1.5px solid var(--border)',
      borderRadius: 16, padding: 14,
    }}>
      <p style={{
        fontSize: 10, fontWeight: 500, color: 'var(--fg4)',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        margin: '0 0 10px',
      }}>
        Quick Launch
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 6,
      }}>
        {resources.slice(0, 8).map(r => {
          const Icon = ICON_MAP[r.icon] ?? Code2
          const isHighlighted = HIGHLIGHT_LABELS.includes(r.label)

          const card = (
            <div
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '10px 4px', gap: 5,
                background: 'var(--surface2)',
                border: `1.5px solid ${isHighlighted ? 'var(--border2)' : 'var(--border)'}`,
                borderRadius: 12,
                cursor: r.url ? 'pointer' : 'default',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => {
                if (!r.url) return
                e.currentTarget.style.borderColor = 'var(--border2)'
                e.currentTarget.style.background = 'var(--surface3)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = isHighlighted ? 'var(--border2)' : 'var(--border)'
                e.currentTarget.style.background = 'var(--surface2)'
              }}
            >
              <Icon size={18} color="var(--purple)" />
              <span style={{
                fontSize: 9, fontWeight: 500, color: 'var(--purple-d)',
                textAlign: 'center', lineHeight: 1.2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                maxWidth: '100%',
              }}>
                {r.label}
              </span>
            </div>
          )

          return r.url ? (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', display: 'block' }}
            >
              {card}
            </a>
          ) : (
            <div key={r.id} style={{ opacity: 0.4 }}>
              {card}
            </div>
          )
        })}
      </div>
    </div>
  )
}
