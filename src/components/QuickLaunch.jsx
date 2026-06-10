import { Code2, ListChecks, Laptop, BookOpen, Briefcase, FileText } from 'lucide-react'

const ICON_MAP = {
  'code':          Code2,
  'list-check':    ListChecks,
  'device-laptop': Laptop,
  'laptop':        Laptop,
  'book':          BookOpen,
  'briefcase':     Briefcase,
  'file-text':     FileText,
}

export default function QuickLaunch({ resources }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #f0eaf7',
      borderRadius: 16, padding: 14,
    }}>
      <p style={{
        fontSize: 10, fontWeight: 500, color: '#c0aed8',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        marginBottom: 10, margin: '0 0 10px',
      }}>
        Quick Launch
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 6,
      }}>
        {resources.slice(0, 6).map(r => {
          const Icon = ICON_MAP[r.icon] ?? Code2

          const card = (
            <div
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '10px 4px', gap: 5,
                background: '#faf8ff',
                border: '1.5px solid #f0eaf7',
                borderRadius: 12,
                cursor: r.url ? 'pointer' : 'default',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => {
                if (!r.url) return
                e.currentTarget.style.borderColor = '#d8c4f0'
                e.currentTarget.style.background = '#f5f1fc'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#f0eaf7'
                e.currentTarget.style.background = '#faf8ff'
              }}
            >
              <Icon size={18} color="#b794f4" />
              <span style={{
                fontSize: 9, fontWeight: 500, color: '#8b6fc0',
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
