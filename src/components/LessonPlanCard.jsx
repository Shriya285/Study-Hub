import { useState } from 'react'
import { ChevronRight, Plus, CheckCircle, Lock } from 'lucide-react'
import LessonPanel from './LessonPanel'
import { useClaudeAPI } from '../hooks/useClaudeAPI'

const LESSON_PROMPT = (topic, title, summary) => `You are a placement prep tutor. Generate a focused lesson for a CS student preparing for technical interviews at MNCs like Cisco.

Topic: ${topic}
Lesson: ${title}
Summary: ${summary}

Format your response EXACTLY as follows (use these exact headings):

## Overview
2-3 sentences explaining the concept clearly.

## Key Concepts
- Bullet point 1
- Bullet point 2
(4-6 bullets, each 1-2 sentences)

## How it works
A concrete explanation with a simple example. Keep it under 150 words.

## Interview Questions
1. Question one?
2. Question two?
3. Question three?
(3-5 common interview questions for this topic)

## Quick Tips
- Tip 1
- Tip 2
(2-4 memorable tips specific to interview context)`

const MORE_PROMPT = (topic, existingTitles) => `You are a placement prep tutor. Generate 3 more lessons for this plan.

Topic: ${topic}
Existing lessons:
${existingTitles}

Generate 3 additional lessons that continue from where the existing lessons left off, going deeper or covering related areas.

Respond with ONLY a valid JSON array (no markdown, no explanation):
[
  { "id": "new1", "title": "Lesson title", "summary": "One sentence description" },
  { "id": "new2", "title": "...", "summary": "..." },
  { "id": "new3", "title": "...", "summary": "..." }
]`

function parseJSON(text) {
  const m = text.match(/\[[\s\S]*\]/)
  if (!m) throw new Error('Could not parse response')
  return JSON.parse(m[0])
}

export default function LessonPlanCard({ plan, onUpdate, addXP }) {
  const [openId, setOpenId] = useState(null)
  const [loadingId, setLoadingId] = useState(null)
  const { call: callContent, error: contentError, clearError: clearContent } = useClaudeAPI()
  const { call: callMore, loading: loadingMore, error: moreError, clearError: clearMore } = useClaudeAPI()

  const done = plan.lessons.filter(l => l.status === 'done').length
  const total = plan.lessons.length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  async function studyLesson(lesson) {
    if (openId === lesson.id) { setOpenId(null); return }

    if (lesson.content) { setOpenId(lesson.id); return }

    setLoadingId(lesson.id)
    setOpenId(lesson.id)
    clearContent()

    try {
      const content = await callContent(LESSON_PROMPT(plan.topic, lesson.title, lesson.summary))
      onUpdate({
        ...plan,
        lessons: plan.lessons.map(l => l.id === lesson.id ? { ...l, content } : l),
      })
    } catch {
      // error shown via contentError
    } finally {
      setLoadingId(null)
    }
  }

  function markDone(lessonId) {
    const lessons = plan.lessons.map((l, idx, arr) => {
      if (l.id === lessonId) return { ...l, status: 'done' }
      if (idx > 0 && arr[idx - 1].id === lessonId && l.status === 'locked') return { ...l, status: 'unlocked' }
      return l
    })
    addXP(20)
    onUpdate({ ...plan, lessons })
    setOpenId(null)
  }

  async function generateMore() {
    clearMore()
    const titles = plan.lessons.map((l, i) => `${i + 1}. ${l.title}`).join('\n')
    try {
      const text = await callMore(MORE_PROMPT(plan.topic, titles), { maxTokens: 800 })
      const raw = parseJSON(text)
      const newLessons = raw.map((l, i) => ({
        id: `${plan.id}-x${Date.now()}-${i}`,
        title: l.title, summary: l.summary,
        status: 'locked', content: null,
      }))
      onUpdate({ ...plan, lessons: [...plan.lessons, ...newLessons] })
    } catch {
      // error shown via moreError
    }
  }

  return (
    <div style={{
      background: '#ffffff', border: '1.5px solid #f0eaf7',
      borderRadius: 16, padding: '16px 18px',
    }}>
      {/* Plan header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <span style={{
            fontSize: 10, fontWeight: 600, color: '#c0aed8',
            textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 2,
          }}>Topic</span>
          <p style={{ fontSize: 16, fontWeight: 500, color: '#2d2a3e', margin: 0 }}>{plan.topic}</p>
          {plan.focusArea && (
            <p style={{ fontSize: 12, color: '#a898be', margin: '2px 0 0' }}>{plan.focusArea}</p>
          )}
        </div>
        <span style={{
          fontSize: 12, fontWeight: 500, color: '#4ecfa0',
          background: '#e8faf3', padding: '4px 10px', borderRadius: 20, flexShrink: 0,
        }}>
          {done}/{total} done
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: '#f0eaf7', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: 'linear-gradient(90deg, #7ee6b8, #4ecfa0)',
          transition: 'width 0.5s ease', borderRadius: 4,
        }} />
      </div>

      {/* Error banners */}
      {contentError && (
        <div style={{
          background: '#fef2f2', border: '1.5px solid #fee2e2', borderRadius: 8,
          padding: '8px 12px', marginBottom: 10, fontSize: 12, color: '#e57373',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>Something went wrong generating lesson content.</span>
          <button onClick={clearContent} style={{ background: 'none', border: 'none', color: '#8b6fc0', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>Dismiss</button>
        </div>
      )}

      {/* Lessons */}
      <div>
        {plan.lessons.map(lesson => {
          const isOpen = openId === lesson.id
          const isLoadingThis = loadingId === lesson.id
          const isDone = lesson.status === 'done'
          const isLocked = lesson.status === 'locked'
          const isUnlocked = lesson.status === 'unlocked'

          return (
            <div key={lesson.id}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 0', borderBottom: '1px solid #faf8ff',
                opacity: isLocked ? 0.4 : 1,
              }}>
                {/* State icon */}
                <div style={{ flexShrink: 0, width: 20, display: 'flex', justifyContent: 'center' }}>
                  {isDone ? (
                    <CheckCircle size={16} color="#4ecfa0" />
                  ) : isLocked ? (
                    <Lock size={13} color="#c0aed8" />
                  ) : (
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      border: '2px solid #c4a8ff',
                    }} />
                  )}
                </div>

                {/* Title */}
                <span style={{
                  flex: 1, fontSize: 13,
                  fontWeight: isUnlocked ? 500 : 400,
                  color: isDone ? '#a898be' : '#2d2a3e',
                  textDecoration: isDone ? 'line-through' : 'none',
                }}>
                  {lesson.title}
                </span>

                {/* Action button */}
                {isLoadingThis && (
                  <div className="spin" style={{ width: 16, height: 16, flexShrink: 0 }}>
                    <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                      <circle cx="8" cy="8" r="6" stroke="#c4a8ff" strokeWidth="2" strokeDasharray="20 18" />
                    </svg>
                  </div>
                )}

                {!isLoadingThis && isUnlocked && !isDone && (
                  <button
                    onClick={() => studyLesson(lesson)}
                    style={{
                      background: isOpen ? '#f5f1fc' : 'linear-gradient(135deg, #b794f4, #e88d67)',
                      border: 'none', borderRadius: 8, padding: '5px 12px',
                      fontSize: 12, fontWeight: 500,
                      color: isOpen ? '#8b6fc0' : '#ffffff',
                      cursor: 'pointer', flexShrink: 0,
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    {isOpen ? 'Close' : <><ChevronRight size={12} />Study now</>}
                  </button>
                )}

                {!isLoadingThis && isDone && (
                  <button
                    onClick={() => studyLesson(lesson)}
                    style={{
                      background: 'none', border: 'none', fontSize: 12,
                      color: '#c0aed8', cursor: 'pointer', textDecoration: 'underline', flexShrink: 0,
                    }}
                  >
                    Review
                  </button>
                )}
              </div>

              {/* Inline lesson panel */}
              {isOpen && !isLoadingThis && !contentError && lesson.content && (
                <LessonPanel
                  lesson={lesson}
                  planTopic={plan.topic}
                  onClose={() => setOpenId(null)}
                  onMarkDone={() => markDone(lesson.id)}
                />
              )}
              {isOpen && isLoadingThis && (
                <div style={{
                  background: '#faf8ff', borderRadius: 12, padding: '16px 20px',
                  margin: '6px 0', display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 13, color: '#a898be',
                }}>
                  <div className="spin" style={{ width: 16, height: 16 }}>
                    <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                      <circle cx="8" cy="8" r="6" stroke="#c4a8ff" strokeWidth="2" strokeDasharray="20 18" />
                    </svg>
                  </div>
                  Generating lesson content…
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Generate more */}
      {moreError && (
        <p style={{ fontSize: 12, color: '#e57373', margin: '10px 0 4px' }}>
          Failed to generate more lessons.{' '}
          <button onClick={clearMore} style={{ background: 'none', border: 'none', color: '#8b6fc0', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>Dismiss</button>
        </p>
      )}
      <button
        onClick={generateMore}
        disabled={loadingMore}
        style={{
          marginTop: 12, width: '100%', height: 36,
          border: '1.5px dashed #e0d6f0', borderRadius: 10,
          background: 'transparent', cursor: loadingMore ? 'wait' : 'pointer',
          fontSize: 12, color: '#8b6fc0',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          opacity: loadingMore ? 0.6 : 1,
        }}
        onMouseEnter={e => { if (!loadingMore) e.currentTarget.style.background = '#faf8ff' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >
        {loadingMore ? (
          <>
            <div className="spin" style={{ width: 12, height: 12 }}>
              <svg viewBox="0 0 12 12" fill="none" width="12" height="12">
                <circle cx="6" cy="6" r="4.5" stroke="#c4a8ff" strokeWidth="2" strokeDasharray="14 12" />
              </svg>
            </div>
            Generating…
          </>
        ) : (
          <><Plus size={12} /> Generate more lessons</>
        )}
      </button>
    </div>
  )
}
