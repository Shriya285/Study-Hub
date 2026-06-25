import { useState, useEffect, useRef } from 'react'
import { BookOpen, AlertCircle } from 'lucide-react'
import OATimer from '../components/oa/OATimer'
import MCQPhase from '../components/oa/MCQPhase'
import DSAPhase from '../components/oa/DSAPhase'
import OAScorecard from '../components/oa/OAScorecard'
import { SUBJECTS, pickDSAProblems } from '../data/dsaProblems'
import { generateMCQs } from '../api/generateMCQs'
import { saveOASession } from '../api/saveOASession'

const OA_DURATION = 3600      // 1 hour in seconds
const STORAGE_START = 'study_hub_oa_start_time'

function todayStr() { return new Date().toISOString().slice(0, 10) }

function getEndTime() {
  const stored = sessionStorage.getItem(STORAGE_START)
  if (stored) return Number(stored) + OA_DURATION * 1000
  const now = Date.now()
  sessionStorage.setItem(STORAGE_START, String(now))
  return now + OA_DURATION * 1000
}

// ─── Gate splash ────────────────────────────────────────────
function GateSplash({ subject, onStart }) {
  const [ready, setReady] = useState(false)
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', padding: '24px',
      background: 'var(--bg)',
    }}>
      <div style={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18, margin: '0 auto 20px',
          background: 'linear-gradient(135deg, #b794f4, #e88d67)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <BookOpen size={28} color="#fff" />
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 600, color: 'var(--fg)', margin: '0 0 8px' }}>
          Daily Mock OA
        </h1>
        <p style={{ fontSize: 14, color: 'var(--fg3)', margin: '0 0 28px', lineHeight: 1.6 }}>
          Complete today's assessment to unlock the dashboard.
        </p>

        <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '24px', marginBottom: 24, textAlign: 'left' }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>Subject</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--purple-dd)', margin: 0 }}>{subject}</p>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--fg4)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>Duration</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg)', margin: 0 }}>1 hour</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Phase 1 (30 min): 10 MCQs on ' + subject,
              'Phase 2 (30 min): 2 DSA problems on LeetCode',
              'Tab switches are logged but not penalised',
              'Timer starts when you click Start',
            ].map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--purple-bright)', fontSize: 14, lineHeight: 1.4, flexShrink: 0 }}>•</span>
                <span style={{ fontSize: 13, color: 'var(--fg3)', lineHeight: 1.5 }}>{line}</span>
              </div>
            ))}
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 18, justifyContent: 'center' }}>
          <input type="checkbox" checked={ready} onChange={e => setReady(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#b794f4' }} />
          <span style={{ fontSize: 13, color: 'var(--fg3)' }}>I understand the rules and I am ready</span>
        </label>

        <button
          disabled={!ready}
          onClick={onStart}
          style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 'none',
            background: ready ? 'linear-gradient(135deg, #b794f4, #e88d67)' : 'var(--surface3)',
            color: ready ? '#fff' : 'var(--fg4)',
            fontSize: 15, fontWeight: 500, cursor: ready ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          Start OA
        </button>
      </div>
    </div>
  )
}

// ─── Loading screen ──────────────────────────────────────────
function LoadingScreen({ subject }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)', gap: 16 }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border)', borderTop: '3px solid #b794f4', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ fontSize: 14, color: 'var(--fg3)', margin: 0 }}>Generating {subject} questions...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── Phase header ────────────────────────────────────────────
function PhaseHeader({ phase, subject }) {
  return (
    <div style={{ padding: '20px 24px 16px', borderBottom: '1.5px solid var(--border)', marginBottom: 28 }}>
      <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--purple-d)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>
            {phase === 'mcq' ? 'Phase 1 of 2' : 'Phase 2 of 2'}
          </p>
          <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--fg)', margin: 0 }}>
            {phase === 'mcq' ? `MCQs: ${subject}` : 'DSA Problems'}
          </p>
        </div>
        <div style={{
          padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500,
          background: phase === 'mcq' ? 'rgba(183,148,244,0.15)' : 'rgba(232,141,103,0.15)',
          color: phase === 'mcq' ? '#b794f4' : '#e88d67',
        }}>
          {phase === 'mcq' ? '30 min' : '30 min'}
        </div>
      </div>
    </div>
  )
}

// ─── Main OA gate page ────────────────────────────────────────
export default function OAGatePage({ onComplete }) {
  const [phase, setPhase] = useState('gate')   // gate | loading | mcq | dsa | scorecard
  const [subject, setSubject] = useState('')
  const [questions, setQuestions] = useState([])
  const [dsaProblems, setDsaProblems] = useState([])
  const [mcqResult, setMcqResult] = useState(null)
  const [session, setSession] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const startTimeRef = useRef(null)
  const tabSwitchesRef = useRef([])

  // Determine subject from stored index
  useEffect(() => {
    const idx = Number(localStorage.getItem('study_hub_oa_subject_index') || '0')
    setSubject(SUBJECTS[idx % SUBJECTS.length])
  }, [])

  // Tab switch logging
  useEffect(() => {
    if (phase === 'gate' || phase === 'scorecard') return
    function log() {
      if (document.hidden) {
        tabSwitchesRef.current.push({ timestamp: new Date().toISOString(), phase })
      }
    }
    function logBlur() {
      tabSwitchesRef.current.push({ timestamp: new Date().toISOString(), phase })
    }
    document.addEventListener('visibilitychange', log)
    window.addEventListener('blur', logBlur)
    return () => {
      document.removeEventListener('visibilitychange', log)
      window.removeEventListener('blur', logBlur)
    }
  }, [phase])

  async function handleStart() {
    const et = getEndTime()
    setEndTime(et)
    startTimeRef.current = Date.now()
    setPhase('loading')
    const qs = await generateMCQs(subject)
    setQuestions(qs)
    setPhase('mcq')
  }

  function handleMCQComplete({ answers, score }) {
    setMcqResult({ answers, score })
    const seenSlugs = JSON.parse(localStorage.getItem('study_hub_oa_seen_problems') || '[]')
    const problems = pickDSAProblems(score, seenSlugs)
    setDsaProblems(problems)
    setPhase('dsa')
  }

  async function handleDSAComplete(dsaResults) {
    await finishSession(dsaResults, false)
  }

  async function handleTimeout() {
    await finishSession(dsaProblems.map(p => ({ ...p, solutionPasted: false, solutionText: '' })), true)
  }

  async function finishSession(dsaResults, byTimeout) {
    const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000)
    const today = todayStr()

    // Update subject index
    const idx = Number(localStorage.getItem('study_hub_oa_subject_index') || '0')
    localStorage.setItem('study_hub_oa_subject_index', String((idx + 1) % SUBJECTS.length))

    // Update seen problems
    const seenSlugs = JSON.parse(localStorage.getItem('study_hub_oa_seen_problems') || '[]')
    const newSeen = [...new Set([...seenSlugs, ...dsaResults.map(p => p.slug)])]
    localStorage.setItem('study_hub_oa_seen_problems', JSON.stringify(newSeen))

    // Mark OA done today
    localStorage.setItem('study_hub_last_oa_date', today)

    const sessionData = {
      date: today,
      subject,
      mcqScore: mcqResult?.score ?? 0,
      mcqAnswers: mcqResult?.answers ?? [],
      dsaProblems: dsaResults,
      tabSwitches: tabSwitchesRef.current,
      durationSeconds,
      completedByTimeout: byTimeout,
    }

    sessionStorage.removeItem(STORAGE_START)
    setSession(sessionData)
    setPhase('scorecard')
    await saveOASession(sessionData)
  }

  // ── Renders ──────────────────────────────────────────────────

  if (phase === 'gate') {
    return <GateSplash subject={subject} onStart={handleStart} />
  }

  if (phase === 'loading') {
    return <LoadingScreen subject={subject} />
  }

  if (phase === 'scorecard') {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 24 }}>
        <OAScorecard session={session} onEnterDashboard={onComplete} />
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {endTime && (
        <OATimer
          endTime={endTime}
          phase={phase === 'mcq' ? 'Phase 1: MCQs' : 'Phase 2: DSA'}
          onExpire={handleTimeout}
        />
      )}

      <div style={{ paddingTop: 56 }}>
        <PhaseHeader phase={phase} subject={subject} />

        {phase === 'mcq' && (
          <MCQPhase questions={questions} onComplete={handleMCQComplete} />
        )}

        {phase === 'dsa' && (
          <DSAPhase
            problems={dsaProblems}
            mcqScore={mcqResult?.score ?? 0}
            onComplete={handleDSAComplete}
          />
        )}
      </div>
    </div>
  )
}
