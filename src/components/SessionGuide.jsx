import { useState, useEffect } from 'react'
import { ChevronRight, RefreshCw } from 'lucide-react'
import { useCurrentBlock } from '../hooks/useCurrentBlock'
import { callClaude } from '../hooks/useClaudeAPI'

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

function loadGuides() {
  try { return JSON.parse(localStorage.getItem('study_hub_session_guides') || '{}') }
  catch { return {} }
}

function saveGuide(key, content) {
  const guides = loadGuides()
  guides[key] = content
  localStorage.setItem('study_hub_session_guides', JSON.stringify(guides))
}

function guideKey(blockLabel) {
  return `${todayString()}-${blockLabel}`
}

function makePrompt(block, daysLeft) {
  const [sh, sm] = block.start.split(':').map(Number)
  const [eh, em] = block.end.split(':').map(Number)
  const dur = (eh * 60 + em) - (sh * 60 + sm)
  const durStr = dur >= 60
    ? `${Math.floor(dur / 60)}h${dur % 60 > 0 ? ` ${dur % 60}m` : ''}`
    : `${dur}m`
  const dayNum = Math.max(1, 31 - daysLeft)

  return `You are a focused placement prep coach for Shriya, a final-year CS student preparing for technical interviews at companies like Cisco, Atlassian, NetApp, and Intuit.

Current study block: ${block.label} (${block.start}–${block.end}, ${durStr})
Block subtitle: ${block.subtitle || ''}
Day in sprint: Day ${dayNum} of 30

Generate a focused session guide. Be specific and actionable, not generic.
Write like a tutor briefing a student before a session — warm but direct.

Respond in this EXACT format (plain text, no markdown headers, use these labels):

TODAY'S FOCUS
[2-3 sentences on what to focus on in this specific session and why]

CONCEPTS TO COVER
• [concept 1]
• [concept 2]
• [concept 3 if needed]

PRACTICE PROBLEMS
1. [Problem name] — [Easy/Medium/Hard] — [one line on what it tests]
2. [Problem name] — [Easy/Medium/Hard] — [one line]
3. [Problem name] — [Easy/Medium/Hard] — [one line]

RESOURCES
→ [Resource name]: [specific link or location]
→ [Resource name]: [specific link or location]`
}

const SECTION_LABELS = ["TODAY'S FOCUS", "CONCEPTS TO COVER", "PRACTICE PROBLEMS", "RESOURCES"]

function parseGuide(text) {
  const result = {}
  for (let i = 0; i < SECTION_LABELS.length; i++) {
    const label = SECTION_LABELS[i]
    const start = text.indexOf(label)
    if (start === -1) continue
    const remaining = SECTION_LABELS.slice(i + 1).map(l => text.indexOf(l, start + label.length)).filter(p => p > start)
    const end = remaining.length ? Math.min(...remaining) : text.length
    result[label] = text.slice(start + label.length, end).trim()
  }
  return result
}

/* ─── Section renderers ─────────────────────────────────── */
const SECTION_LABEL_STYLE = {
  display: 'block', fontSize: 10, fontWeight: 600,
  color: '#c0aed8', textTransform: 'uppercase',
  letterSpacing: '0.08em', marginBottom: 8,
}

function FocusSection({ text }) {
  return (
    <div style={{ background: '#faf8ff', border: '1.5px solid #f0eaf7', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
      <span style={SECTION_LABEL_STYLE}>Today's Focus</span>
      <p style={{ fontSize: 13, color: '#5c4a7e', lineHeight: 1.6, margin: 0 }}>{text}</p>
    </div>
  )
}

function ConceptsSection({ text }) {
  const items = text.split('\n')
    .filter(l => l.trim().startsWith('•'))
    .map(l => l.replace(/^•\s*/, '').trim())
    .filter(Boolean)
  return (
    <div style={{ marginBottom: 14 }}>
      <span style={SECTION_LABEL_STYLE}>Concepts to Cover</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ecfa0', flexShrink: 0, marginTop: 6 }} />
            <span style={{ fontSize: 13, color: '#5c4a7e', lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const DIFF_COLORS = {
  Easy:   { bg: '#e8faf3', color: '#3da87a' },
  Medium: { bg: '#fff4ec', color: '#d97a4a' },
  Hard:   { bg: '#fef2f2', color: '#e57373' },
}

function ProblemsSection({ text }) {
  const items = text.split('\n')
    .filter(l => /^\d+\./.test(l.trim()))
    .map(l => {
      const content = l.replace(/^\d+\.\s*/, '').trim()
      const parts = content.split(/\s*[—–-]\s*/)
      return { name: parts[0] || '', diff: parts[1] || '', desc: parts.slice(2).join(' – ') || '' }
    })
    .filter(i => i.name)

  return (
    <div style={{ marginBottom: 14 }}>
      <span style={SECTION_LABEL_STYLE}>Practice Problems</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item, i) => {
          const dc = DIFF_COLORS[item.diff] || { bg: '#f5f1fc', color: '#8b6fc0' }
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              background: '#ffffff', border: '1.5px solid #f0eaf7',
              borderRadius: 8, padding: '8px 12px',
            }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#c4a8ff', flexShrink: 0, minWidth: 16, paddingTop: 1 }}>
                {i + 1}.
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#2d2a3e' }}>{item.name}</span>
                {item.desc && (
                  <p style={{ fontSize: 11, color: '#a898be', margin: '2px 0 0', lineHeight: 1.4 }}>{item.desc}</p>
                )}
              </div>
              {item.diff && (
                <span style={{ fontSize: 10, fontWeight: 600, background: dc.bg, color: dc.color, padding: '2px 8px', borderRadius: 20, flexShrink: 0 }}>
                  {item.diff}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ResourcesSection({ text }) {
  const items = text.split('\n')
    .filter(l => l.trim().startsWith('→'))
    .map(l => l.replace(/^→\s*/, '').trim())
    .filter(Boolean)

  return (
    <div style={{ marginBottom: 14 }}>
      <span style={SECTION_LABEL_STYLE}>Resources</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item, i) => {
          const colonIdx = item.indexOf(':')
          const name = colonIdx > -1 ? item.slice(0, colonIdx).trim() : item
          const rest = colonIdx > -1 ? item.slice(colonIdx + 1).trim() : ''
          const isUrl = rest.startsWith('http')
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#c4a8ff', flexShrink: 0 }}>→</span>
              <span style={{ fontSize: 13, color: '#5c4a7e', lineHeight: 1.5 }}>
                <strong style={{ color: '#7c5cbf' }}>{name}</strong>
                {rest && (
                  <>: {isUrl
                    ? <a href={rest} target="_blank" rel="noreferrer" style={{ color: '#b794f4', textDecoration: 'underline' }}>{rest}</a>
                    : rest}
                  </>
                )}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Main component ────────────────────────────────────── */
export default function SessionGuide({ schedule, daysLeft }) {
  const { current, status } = useCurrentBlock(schedule)
  const [expanded, setExpanded] = useState(false)
  const [guide, setGuide] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [spinning, setSpinning] = useState(false)

  useEffect(() => {
    if (!current || current.isBreak) {
      setGuide(null)
      setExpanded(false)
      return
    }
    const cached = loadGuides()[guideKey(current.label)]
    setGuide(cached || null)
    if (cached) setExpanded(true)
    else setExpanded(false)
  }, [current?.id])

  async function generate(refresh = false) {
    if (!current || current.isBreak) return
    if (!refresh) {
      const cached = loadGuides()[guideKey(current.label)]
      if (cached) { setGuide(cached); setExpanded(true); return }
    }
    setExpanded(true)
    setLoading(true)
    setSpinning(true)
    setError(null)
    try {
      const text = await callClaude({ userPrompt: makePrompt(current, daysLeft), maxTokens: 900 })
      setGuide(text)
      saveGuide(guideKey(current.label), text)
    } catch (e) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
      setSpinning(false)
    }
  }

  if (!current || current.isBreak || status !== 'active') return null

  const s = guide ? parseGuide(guide) : {}

  return (
    <div style={{ background: '#ffffff', border: '1.5px solid #f0eaf7', borderRadius: 16, padding: '16px 18px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: expanded && guide ? 14 : 0 }}>
        <span style={{ fontSize: 10, fontWeight: 500, color: '#c0aed8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {current.label} Guide
        </span>
        {guide && (
          <button
            onClick={() => generate(true)}
            disabled={loading}
            style={{
              background: 'none', border: 'none', cursor: loading ? 'wait' : 'pointer',
              color: '#c0aed8', display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 11, padding: '4px 6px', borderRadius: 6,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.color = '#8b6fc0' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#c0aed8' }}
          >
            <RefreshCw size={12} className={spinning ? 'spin' : ''} />
            Refresh
          </button>
        )}
      </div>

      {/* CTA — collapsed state */}
      {!expanded && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 13, color: '#a898be', margin: 0 }}>
            <strong style={{ color: '#7c5cbf' }}>{current.label}</strong> is active. Want a study guide for this session?
          </p>
          <button
            onClick={() => generate(false)}
            style={{
              background: 'linear-gradient(135deg, #b794f4, #e88d67)',
              border: 'none', borderRadius: 8, padding: '6px 14px',
              fontSize: 12, fontWeight: 500, color: '#ffffff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
              flexShrink: 0, marginLeft: 12,
            }}
          >
            Ask <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* Loading */}
      {expanded && loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 0', fontSize: 13, color: '#a898be' }}>
          <div className="spin" style={{ width: 16, height: 16 }}>
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <circle cx="8" cy="8" r="6" stroke="#c4a8ff" strokeWidth="2" strokeDasharray="20 18" />
            </svg>
          </div>
          Generating your session guide…
        </div>
      )}

      {/* Error */}
      {expanded && error && !loading && (
        <div style={{ background: '#fef2f2', border: '1.5px solid #fee2e2', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#e57373', marginTop: 8 }}>
          {error}{' '}
          <button
            onClick={() => generate(false)}
            style={{ background: 'none', border: 'none', color: '#8b6fc0', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Try again
          </button>
        </div>
      )}

      {/* Guide content */}
      {expanded && guide && !loading && (
        <>
          {s["TODAY'S FOCUS"] && <FocusSection text={s["TODAY'S FOCUS"]} />}
          {s["CONCEPTS TO COVER"] && <ConceptsSection text={s["CONCEPTS TO COVER"]} />}
          {s["PRACTICE PROBLEMS"] && <ProblemsSection text={s["PRACTICE PROBLEMS"]} />}
          {s["RESOURCES"] && <ResourcesSection text={s["RESOURCES"]} />}

          <div style={{ borderTop: '1px solid #f0eaf7', paddingTop: 14 }}>
            <button
              onClick={() => setExpanded(false)}
              style={{
                background: 'linear-gradient(90deg, #7ee6b8, #4ecfa0)',
                border: 'none', borderRadius: 8, padding: '8px 18px',
                fontSize: 13, fontWeight: 500, color: '#ffffff', cursor: 'pointer',
              }}
            >
              ✓ Got it — let's go
            </button>
          </div>
        </>
      )}
    </div>
  )
}
