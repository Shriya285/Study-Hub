import { useState } from 'react'
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react'

const OPTION_KEYS = ['A', 'B', 'C', 'D']

const DIFF_COLOR = { Easy: '#22c55e', Medium: '#f97316', Hard: '#ef4444' }

function difficultyFromIndex(i) {
  if (i < 4) return 'Easy'
  if (i < 8) return 'Medium'
  return 'Hard'
}

export default function MCQPhase({ questions, onComplete }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState([])

  const q = questions[current]
  const isLast = current === questions.length - 1

  function pick(opt) {
    if (revealed) return
    setSelected(opt)
    setRevealed(true)
  }

  function next() {
    const record = { id: q.id, selected, correct: q.correct, isCorrect: selected === q.correct }
    const updated = [...answers, record]
    if (isLast) {
      const score = updated.filter(a => a.isCorrect).length
      onComplete({ answers: updated, score })
    } else {
      setAnswers(updated)
      setCurrent(c => c + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  const diff = difficultyFromIndex(current)

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px' }}>
      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--fg3)' }}>Question {current + 1} of {questions.length}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: DIFF_COLOR[diff] }}>{diff}</span>
        </div>
        <div style={{ height: 4, background: 'var(--surface3)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((current + 1) / questions.length) * 100}%`, background: 'linear-gradient(90deg, #b794f4, #e88d67)', borderRadius: 4, transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          {questions.map((_, i) => {
            const ans = answers[i]
            let bg = 'var(--surface3)'
            if (i === current) bg = '#b794f4'
            else if (ans) bg = ans.isCorrect ? '#22c55e' : '#ef4444'
            return <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: bg, transition: 'background 0.3s' }} />
          })}
        </div>
      </div>

      {/* Question card */}
      <div style={{
        background: 'var(--surface)', border: '1.5px solid var(--border)',
        borderRadius: 16, padding: '24px 28px', marginBottom: 16,
      }}>
        <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--fg)', lineHeight: 1.65, margin: 0 }}>
          {q.question}
        </p>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {OPTION_KEYS.map(key => {
          let border = '1.5px solid var(--border)'
          let bg = 'var(--surface)'
          let color = 'var(--fg2)'
          let icon = null

          if (revealed) {
            if (key === q.correct) {
              border = '1.5px solid #22c55e'; bg = 'rgba(34,197,94,0.08)'; color = '#22c55e'
              icon = <CheckCircle size={16} color="#22c55e" />
            } else if (key === selected && key !== q.correct) {
              border = '1.5px solid #ef4444'; bg = 'rgba(239,68,68,0.08)'; color = '#ef4444'
              icon = <XCircle size={16} color="#ef4444" />
            }
          } else if (key === selected) {
            border = '1.5px solid var(--purple-bright)'; bg = 'rgba(183,148,244,0.1)'
          }

          return (
            <button
              key={key}
              onClick={() => pick(key)}
              disabled={revealed}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: bg, border, borderRadius: 10,
                padding: '12px 16px', cursor: revealed ? 'default' : 'pointer',
                textAlign: 'left', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!revealed) e.currentTarget.style.borderColor = 'var(--purple-bright)' }}
              onMouseLeave={e => { if (!revealed && key !== selected) e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <span style={{
                width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                background: revealed && key === q.correct ? '#22c55e' : revealed && key === selected ? '#ef4444' : 'var(--surface2)',
                color: revealed && (key === q.correct || key === selected) ? '#fff' : 'var(--fg3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
              }}>{key}</span>
              <span style={{ fontSize: 13, color, flex: 1, lineHeight: 1.5 }}>{q.options[key]}</span>
              {icon && <span style={{ flexShrink: 0 }}>{icon}</span>}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div style={{
          background: selected === q.correct ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
          border: `1.5px solid ${selected === q.correct ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          borderRadius: 10, padding: '12px 16px', marginBottom: 20,
        }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: selected === q.correct ? '#22c55e' : '#ef4444', margin: '0 0 4px' }}>
            {selected === q.correct ? 'Correct' : `Correct answer: ${q.correct}`}
          </p>
          <p style={{ fontSize: 12, color: 'var(--fg3)', margin: 0, lineHeight: 1.55 }}>{q.explanation}</p>
        </div>
      )}

      {revealed && (
        <button
          onClick={next}
          style={{
            width: '100%', padding: '13px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #b794f4, #e88d67)',
            color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          {isLast ? 'Finish MCQ Phase' : 'Next Question'} <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}
