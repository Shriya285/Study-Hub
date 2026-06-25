import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

const DIFF_COLOR = { Easy: '#22c55e', Medium: '#f97316', Hard: '#ef4444' }
const DIFF_BG    = { Easy: 'rgba(34,197,94,0.1)', Medium: 'rgba(249,115,22,0.1)', Hard: 'rgba(239,68,68,0.1)' }

export default function DSAPhase({ problems, mcqScore, onComplete }) {
  const [solutions, setSolutions] = useState(problems.map(() => ''))
  const [focused, setFocused] = useState(null)

  function submit() {
    const result = problems.map((p, i) => ({
      title: p.title,
      url: p.url,
      difficulty: p.difficulty,
      slug: p.slug,
      solutionPasted: solutions[i].trim().length > 0,
      solutionText: solutions[i].trim(),
    }))
    onComplete(result)
  }

  const scoreLabel = mcqScore <= 4 ? 'Easy + Easy' : mcqScore <= 7 ? 'Easy + Medium' : 'Medium + Hard'

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px' }}>
      <div style={{ marginBottom: 24, padding: '14px 18px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12 }}>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--fg3)' }}>
          MCQ score: <strong style={{ color: 'var(--fg)' }}>{mcqScore}/10</strong> — Problem set: <strong style={{ color: 'var(--purple-dd)' }}>{scoreLabel}</strong>
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--fg4)' }}>
          Open each problem on LeetCode, solve it, then paste your solution here. Solutions are saved as-is.
        </p>
      </div>

      {problems.map((p, i) => (
        <div key={p.slug} style={{
          background: 'var(--surface)', border: '1.5px solid var(--border)',
          borderRadius: 16, padding: '20px 22px', marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                  background: DIFF_BG[p.difficulty], color: DIFF_COLOR[p.difficulty],
                }}>{p.difficulty}</span>
                <span style={{ fontSize: 11, color: 'var(--fg4)' }}>Problem {i + 1}</span>
              </div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: 'var(--fg)' }}>{p.title}</p>
            </div>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8, flexShrink: 0,
                background: 'rgba(255,161,22,0.1)', border: '1.5px solid rgba(255,161,22,0.3)',
                color: '#f97316', fontSize: 12, fontWeight: 500, textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Open on LeetCode <ExternalLink size={12} />
            </a>
          </div>

          <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
            Paste your solution
          </label>
          <textarea
            value={solutions[i]}
            onChange={e => setSolutions(prev => prev.map((s, j) => j === i ? e.target.value : s))}
            onFocus={() => setFocused(i)}
            onBlur={() => setFocused(null)}
            placeholder="Paste your code here... (or leave empty if not attempted)"
            rows={8}
            style={{
              width: '100%', resize: 'vertical', boxSizing: 'border-box',
              background: 'var(--surface2)',
              border: `1.5px solid ${focused === i ? 'var(--purple-bright)' : 'var(--border)'}`,
              borderRadius: 10, padding: '10px 14px',
              fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
              color: 'var(--fg)', lineHeight: 1.6, outline: 'none',
              boxShadow: focused === i ? '0 0 0 3px rgba(196,168,255,0.12)' : 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
          />
          {solutions[i].trim() && (
            <p style={{ margin: '6px 0 0', fontSize: 11, color: '#22c55e' }}>Solution pasted</p>
          )}
        </div>
      ))}

      <button
        onClick={submit}
        style={{
          width: '100%', padding: '14px', borderRadius: 10, border: 'none',
          background: 'linear-gradient(135deg, #b794f4, #e88d67)',
          color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer',
          marginBottom: 8,
        }}
      >
        Submit OA
      </button>
      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--fg4)', margin: 0 }}>
        Empty solutions are fine. The timer will auto-submit when it reaches zero.
      </p>
    </div>
  )
}
