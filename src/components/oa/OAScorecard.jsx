import { CheckCircle, XCircle, Eye, Clock, Zap } from 'lucide-react'

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1.5px solid var(--border)',
      borderRadius: 14, padding: '18px 20px', flex: 1, minWidth: 140,
    }}>
      <div style={{ color: accent || 'var(--purple-d)', marginBottom: 8 }}>{icon}</div>
      <p style={{ fontSize: 26, fontWeight: 600, color: accent || 'var(--fg)', margin: '0 0 2px', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 12, color: 'var(--fg3)', margin: 0 }}>{label}</p>
      {sub && <p style={{ fontSize: 11, color: 'var(--fg4)', margin: '3px 0 0' }}>{sub}</p>}
    </div>
  )
}

export default function OAScorecard({ session, onEnterDashboard }) {
  const { subject, mcqScore, mcqAnswers, dsaProblems, tabSwitches, durationSeconds, completedByTimeout } = session

  const attempted = dsaProblems?.filter(p => p.solutionPasted).length ?? 0
  const switchCount = tabSwitches?.length ?? 0
  const mins = Math.floor(durationSeconds / 60)
  const secs = durationSeconds % 60
  const passed = mcqScore >= 6

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px 40px' }}>
      {/* Header */}
      <div style={{
        textAlign: 'center', padding: '32px 0 28px',
        borderBottom: '1.5px solid var(--border)', marginBottom: 28,
      }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>{passed ? '🎉' : '💪'}</div>
        <h2 style={{ fontSize: 24, fontWeight: 600, color: 'var(--fg)', margin: '0 0 6px' }}>
          OA Complete{completedByTimeout ? ' (timed out)' : ''}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--fg3)', margin: 0 }}>
          Subject: <strong style={{ color: 'var(--fg)' }}>{subject}</strong>
        </p>
        {passed && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10,
            padding: '5px 14px', borderRadius: 20,
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
            fontSize: 12, fontWeight: 500, color: '#22c55e',
          }}>
            <Zap size={12} /> Counts as a study session for streak
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <StatCard
          icon={<CheckCircle size={18} />}
          label="MCQ Score"
          value={`${mcqScore}/10`}
          sub={passed ? 'Passed (6+)' : 'Below pass mark'}
          accent={passed ? '#22c55e' : '#f97316'}
        />
        <StatCard
          icon={<Eye size={18} />}
          label="DSA Attempted"
          value={`${attempted}/${dsaProblems?.length ?? 2}`}
          sub={attempted === 0 ? 'No solutions pasted' : undefined}
        />
        <StatCard
          icon={<Clock size={18} />}
          label="Time Taken"
          value={`${mins}m ${secs}s`}
        />
        <StatCard
          icon={<XCircle size={18} />}
          label="Tab Switches"
          value={switchCount}
          sub="Not penalised"
          accent={switchCount > 5 ? '#f97316' : undefined}
        />
      </div>

      {/* MCQ breakdown */}
      <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '18px 20px', marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', margin: '0 0 12px' }}>MCQ Breakdown</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {mcqAnswers?.map((a, i) => (
            <div
              key={i}
              title={`Q${i + 1}: picked ${a.selected}, answer ${a.correct}`}
              style={{
                width: 30, height: 30, borderRadius: 6, fontSize: 11, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: a.isCorrect ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.12)',
                color: a.isCorrect ? '#22c55e' : '#ef4444',
                border: `1px solid ${a.isCorrect ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* DSA problems */}
      <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '18px 20px', marginBottom: 28 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', margin: '0 0 12px' }}>DSA Problems</p>
        {dsaProblems?.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < dsaProblems.length - 1 ? '1px solid var(--border)' : 'none' }}>
            {p.solutionPasted
              ? <CheckCircle size={14} color="#22c55e" />
              : <XCircle size={14} color="#94a3b8" />}
            <span style={{ flex: 1, fontSize: 13, color: 'var(--fg2)' }}>{p.title}</span>
            <span style={{ fontSize: 11, color: p.solutionPasted ? '#22c55e' : 'var(--fg4)' }}>
              {p.solutionPasted ? 'Solution pasted' : 'Not attempted'}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onEnterDashboard}
        style={{
          width: '100%', padding: '14px', borderRadius: 12, border: 'none',
          background: 'linear-gradient(135deg, #b794f4, #e88d67)',
          color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer',
        }}
      >
        Enter Dashboard
      </button>
    </div>
  )
}
