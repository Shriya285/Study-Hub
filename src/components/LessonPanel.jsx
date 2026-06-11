import { X, CheckCircle } from 'lucide-react'

/* Parse Claude's markdown response into named sections */
function parseSections(text) {
  const result = {}
  const parts = text.split(/\n## /)
  for (const part of parts) {
    const nl = part.indexOf('\n')
    if (nl === -1) continue
    const heading = part.slice(0, nl).replace(/^## /, '').trim()
    const body = part.slice(nl + 1).trim()
    result[heading] = body
  }
  return result
}

function BulletList({ text, dotColor }) {
  const items = text.split('\n')
    .filter(l => l.trim().startsWith('-'))
    .map(l => l.replace(/^-\s*/, '').trim())
    .filter(Boolean)
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: dotColor, flexShrink: 0, marginTop: 7,
          }} />
          <span style={{ fontSize: 13, color: '#5c4a7e', lineHeight: 1.5 }}>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function QuestionList({ text }) {
  const items = text.split('\n')
    .filter(l => /^\d+\./.test(l.trim()))
    .map(l => l.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: 'flex', gap: 10, alignItems: 'flex-start',
          background: '#faf8ff', border: '1.5px solid #f0eaf7',
          borderRadius: 8, padding: '8px 12px',
        }}>
          <span style={{
            fontSize: 11, fontWeight: 600, color: '#c4a8ff',
            flexShrink: 0, minWidth: 18, paddingTop: 1,
          }}>
            {i + 1}.
          </span>
          <span style={{ fontSize: 13, color: '#5c4a7e', lineHeight: 1.5 }}>{item}</span>
        </div>
      ))}
    </div>
  )
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <span style={{
        display: 'block', fontSize: 10, fontWeight: 600,
        color: '#c0aed8', textTransform: 'uppercase',
        letterSpacing: '0.08em', marginBottom: 8,
      }}>
        {label}
      </span>
      {children}
    </div>
  )
}

export default function LessonPanel({ lesson, planTopic, onClose, onMarkDone }) {
  const s = parseSections(lesson.content || '')
  const isDone = lesson.status === 'done'

  return (
    <div style={{
      background: '#ffffff', border: '1.5px solid #f0eaf7',
      borderRadius: 16, padding: 20, margin: '6px 0 4px',
    }}>
      {/* Panel header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <div>
          <span style={{
            fontSize: 10, fontWeight: 600, color: '#c9a0e8',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            display: 'block', marginBottom: 3,
          }}>
            {planTopic}
          </span>
          <h3 style={{ fontSize: 15, fontWeight: 500, color: '#2d2a3e', margin: 0 }}>
            {lesson.title}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 28, height: 28, borderRadius: '50%', border: 'none',
            background: '#f5f1fc', color: '#8b6fc0', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#e0d6f0'}
          onMouseLeave={e => e.currentTarget.style.background = '#f5f1fc'}
        >
          <X size={13} />
        </button>
      </div>

      {/* Sections */}
      {s['Overview'] && (
        <Section label="Overview">
          <p style={{ fontSize: 13, color: '#5c4a7e', lineHeight: 1.6, margin: 0 }}>{s['Overview']}</p>
        </Section>
      )}

      {s['Key Concepts'] && (
        <Section label="Key Concepts">
          <BulletList text={s['Key Concepts']} dotColor="#c4a8ff" />
        </Section>
      )}

      {s['How it works'] && (
        <Section label="How it works">
          <div style={{
            background: '#faf8ff', borderRadius: 8,
            padding: '12px 14px', fontSize: 13,
            color: '#5c4a7e', lineHeight: 1.6,
          }}>
            {s['How it works']}
          </div>
        </Section>
      )}

      {s['Interview Questions'] && (
        <Section label="Interview Questions">
          <QuestionList text={s['Interview Questions']} />
        </Section>
      )}

      {s['Quick Tips'] && (
        <Section label="Quick Tips">
          <BulletList text={s['Quick Tips']} dotColor="#e88d67" />
        </Section>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        {!isDone && (
          <button
            onClick={onMarkDone}
            style={{
              background: 'linear-gradient(90deg, #7ee6b8, #4ecfa0)',
              border: 'none', borderRadius: 8, padding: '8px 18px',
              fontSize: 13, fontWeight: 500, color: '#ffffff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <CheckCircle size={14} /> Mark as done
          </button>
        )}
        <button
          onClick={onClose}
          style={{
            background: 'transparent', border: '1.5px solid #f0eaf7',
            borderRadius: 8, padding: '8px 16px',
            fontSize: 13, color: '#a898be', cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#e0d6f0'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#f0eaf7'}
        >
          Close
        </button>
      </div>
    </div>
  )
}
