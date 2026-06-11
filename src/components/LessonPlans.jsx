import { useState } from 'react'
import { BookOpen, Plus } from 'lucide-react'
import LessonPlanCard from './LessonPlanCard'
import { useClaudeAPI } from '../hooks/useClaudeAPI'

const PLAN_PROMPT = (topic, focusArea) => `You are a placement prep tutor for a Computer Science student preparing for MNC technical interviews (Cisco, Atlassian, NetApp, Intuit).

Generate a structured lesson plan for the topic: "${topic}"
${focusArea ? `Focus area: "${focusArea}"` : ''}

Respond with ONLY a valid JSON array (no markdown, no explanation):
[
  { "id": "1", "title": "Lesson title", "summary": "One sentence description" },
  { "id": "2", "title": "...", "summary": "..." }
]

Generate 5-8 lessons. Order them from foundational to advanced. Each title should be specific and actionable, not vague.`

function parseJSON(text) {
  const m = text.match(/\[[\s\S]*\]/)
  if (!m) throw new Error('Could not parse plan')
  return JSON.parse(m[0])
}

function loadPlans() {
  try { return JSON.parse(localStorage.getItem('study_hub_lesson_plans') || '[]') } catch { return [] }
}

function savePlans(plans) {
  localStorage.setItem('study_hub_lesson_plans', JSON.stringify(plans))
}

export default function LessonPlans({ addXP }) {
  const [plans, setPlans] = useState(loadPlans)
  const [activeId, setActiveId] = useState(() => loadPlans()[0]?.id || null)
  const [showForm, setShowForm] = useState(false)
  const [topic, setTopic] = useState('')
  const [focusArea, setFocusArea] = useState('')
  const { call, loading: generating, error: genError, clearError } = useClaudeAPI()

  const hasKey = Boolean(localStorage.getItem('study_hub_claude_api_key') || import.meta.env.VITE_CLAUDE_API_KEY)
  const activePlan = plans.find(p => p.id === activeId)

  function updatePlan(updated) {
    const next = plans.map(p => p.id === updated.id ? updated : p)
    setPlans(next)
    savePlans(next)
  }

  async function generatePlan() {
    if (!topic.trim()) return
    clearError()
    try {
      const text = await call(PLAN_PROMPT(topic.trim(), focusArea.trim()), { maxTokens: 1000 })
      const raw = parseJSON(text)
      const planId = `plan-${Date.now()}`
      const lessons = raw.map((l, i) => ({
        id: `${planId}-l${i}`,
        title: l.title, summary: l.summary,
        status: i <= 1 ? 'unlocked' : 'locked',
        content: null,
      }))
      const newPlan = {
        id: planId, topic: topic.trim(), focusArea: focusArea.trim(),
        createdAt: new Date().toISOString(), lessons,
      }
      const next = [newPlan, ...plans]
      setPlans(next)
      savePlans(next)
      setActiveId(planId)
      setTopic(''); setFocusArea(''); setShowForm(false)
    } catch {
      // genError shown below
    }
  }

  /* Input focus style helpers */
  function focusIn(e) {
    e.target.style.borderColor = '#c4a8ff'
    e.target.style.boxShadow = '0 0 0 3px rgba(196,168,255,0.15)'
  }
  function focusOut(e) {
    e.target.style.borderColor = '#f0eaf7'
    e.target.style.boxShadow = 'none'
  }

  const baseInput = {
    width: '100%', background: '#ffffff',
    border: '1.5px solid #f0eaf7', borderRadius: 8,
    padding: '9px 12px', fontSize: 13, color: '#2d2a3e',
    outline: 'none', fontFamily: "'Inter', system-ui, sans-serif",
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }
  const LABEL = {
    display: 'block', fontSize: 11, fontWeight: 500, color: '#a898be',
    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5,
  }

  return (
    <div style={{
      background: '#ffffff', border: '1.5px solid #f0eaf7',
      borderRadius: 16, padding: '16px 18px',
    }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookOpen size={16} color="#b794f4" />
          <span style={{
            fontSize: 10, fontWeight: 500, color: '#c0aed8',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            Lesson Plans
          </span>
        </div>
        {hasKey && (
          <button
            onClick={() => { setShowForm(f => !f); clearError() }}
            style={{
              background: showForm ? '#f5f1fc' : 'linear-gradient(135deg, #b794f4, #e88d67)',
              border: 'none', borderRadius: 8, padding: '6px 12px',
              fontSize: 12, fontWeight: 500,
              color: showForm ? '#8b6fc0' : '#ffffff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <Plus size={13} /> New Plan
          </button>
        )}
      </div>

      {/* No API key message */}
      {!hasKey && (
        <div style={{
          background: '#faf8ff', border: '1.5px solid #f0eaf7',
          borderRadius: 10, padding: '14px 16px',
          fontSize: 13, color: '#a898be', textAlign: 'center', lineHeight: 1.6,
        }}>
          Add your Claude API key in{' '}
          <strong style={{ color: '#8b6fc0' }}>⚙ Settings → General</strong>{' '}
          to generate AI-powered lesson plans
        </div>
      )}

      {/* New plan form */}
      {hasKey && showForm && (
        <div style={{
          background: '#faf8ff', border: '1.5px solid #f0eaf7',
          borderRadius: 12, padding: '14px 16px', marginBottom: 14,
        }}>
          <div style={{ marginBottom: 10 }}>
            <span style={LABEL}>Topic</span>
            <input
              type="text" value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Operating Systems, Dynamic Programming, System Design"
              onKeyDown={e => e.key === 'Enter' && !generating && generatePlan()}
              style={baseInput}
              onFocus={focusIn} onBlur={focusOut}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <span style={LABEL}>
              Focus area{' '}
              <span style={{ textTransform: 'none', fontSize: 10, color: '#c0aed8' }}>(optional)</span>
            </span>
            <input
              type="text" value={focusArea}
              onChange={e => setFocusArea(e.target.value)}
              placeholder="e.g. Cisco interview MCQs, system design basics"
              style={baseInput}
              onFocus={focusIn} onBlur={focusOut}
            />
          </div>

          {genError && (
            <p style={{ fontSize: 12, color: '#e57373', marginBottom: 10 }}>
              {genError}{' '}
              <button onClick={clearError} style={{ background: 'none', border: 'none', color: '#8b6fc0', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
                Try again
              </button>
            </p>
          )}

          <button
            onClick={generatePlan}
            disabled={generating || !topic.trim()}
            style={{
              background: generating || !topic.trim()
                ? '#e0d6f0'
                : 'linear-gradient(135deg, #b794f4, #e88d67)',
              border: 'none', borderRadius: 8, padding: '9px 20px',
              fontSize: 13, fontWeight: 500, color: '#ffffff',
              cursor: generating || !topic.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              opacity: generating ? 0.8 : 1,
            }}
          >
            {generating ? (
              <>
                <div className="spin" style={{ width: 14, height: 14 }}>
                  <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
                    <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="2" strokeDasharray="18 14" />
                  </svg>
                </div>
                Generating plan…
              </>
            ) : 'Generate plan'}
          </button>
        </div>
      )}

      {/* Active plan card */}
      {hasKey && activePlan && (
        <LessonPlanCard plan={activePlan} onUpdate={updatePlan} addXP={addXP} />
      )}

      {/* Empty state */}
      {hasKey && plans.length === 0 && !showForm && (
        <div style={{
          padding: '24px 16px', textAlign: 'center',
          fontSize: 13, color: '#a898be', lineHeight: 1.6,
        }}>
          No plans yet — click <strong style={{ color: '#8b6fc0' }}>+ New Plan</strong> to generate a structured lesson plan with AI
        </div>
      )}

      {/* Plan switcher pills */}
      {hasKey && plans.length > 1 && (
        <div style={{
          display: 'flex', gap: 6, flexWrap: 'wrap',
          marginTop: 14, paddingTop: 14,
          borderTop: '1px solid #f0eaf7',
        }}>
          {plans.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              style={{
                background: activeId === p.id ? '#f5f1fc' : '#faf8ff',
                border: `1.5px solid ${activeId === p.id ? '#d8c4f0' : '#f0eaf7'}`,
                borderRadius: 20, padding: '4px 12px',
                fontSize: 12, fontWeight: 500,
                color: activeId === p.id ? '#7c5cbf' : '#a898be',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {p.topic}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
