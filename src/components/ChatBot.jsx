import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { useCurrentBlock } from '../hooks/useCurrentBlock'
import { callClaudeChat } from '../hooks/useClaudeAPI'

function buildSystemPrompt(current, schedule, questsDone, questsTotal, pomCount, daysLeft) {
  const dayNum = Math.max(1, 31 - daysLeft)
  const blockInfo = current ? `${current.label} (${current.start}–${current.end})` : 'No active block'
  const scheduleJSON = JSON.stringify(
    schedule.map(b => ({ label: b.label, start: b.start, end: b.end, isBreak: b.isBreak }))
  )
  return `You are Study Buddy, a friendly placement prep assistant for Shriya, a final-year CS student at PES University preparing for technical interviews at Cisco, Atlassian, NetApp, and Intuit.

Current context (updates with each message):
- Current time block: ${blockInfo}
- Today's schedule: ${scheduleJSON}
- Day in placement sprint: Day ${dayNum} of 30
- Quests done today: ${questsDone}/${questsTotal}
- Pomodoros today: ${pomCount}

You know her study schedule and can give specific, actionable advice.
Keep responses concise — 3-5 sentences max unless asked for more.
Be warm but direct. Use bullet points for lists.
Don't say "Great question!" or sycophantic openers.
If she asks what to do next, look at her schedule and tell her specifically.`
}

function fmt(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '4px 2px' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#c4a8ff', display: 'inline-block',
          animation: `cbBounce 1s ease ${i * 0.15}s infinite`,
        }} />
      ))}
    </div>
  )
}

export default function ChatBot({ schedule, questsDone, questsTotal, pomCount, daysLeft }) {
  const { current } = useCurrentBlock(schedule)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const prevBlockId = useRef(null)
  const firstBlock = useRef(true)

  /* Pulse + unread dot when block changes */
  useEffect(() => {
    if (current?.id === prevBlockId.current) return
    prevBlockId.current = current?.id
    if (firstBlock.current) { firstBlock.current = false; return }
    setPulse(true)
    setTimeout(() => setPulse(false), 500)
    if (!open) setHasUnread(true)
  }, [current?.id, open])

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  /* Welcome message on first open */
  useEffect(() => {
    if (!open) return
    setHasUnread(false)
    if (messages.length === 0) {
      const blockName = current ? current.label : 'your study session'
      setMessages([{
        role: 'assistant',
        content: `You're in ${blockName}. How's it going? Ask me anything — I know your full schedule for today.`,
        time: new Date(),
      }])
    }
  }, [open])

  /* Focus input on open */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200)
  }, [open])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const userMsg = { role: 'user', content: text, time: new Date() }
    const next = [...messages, userMsg]
    setMessages(next)
    setLoading(true)
    try {
      const history = next.slice(-10).map(m => ({ role: m.role, content: m.content }))
      const sys = buildSystemPrompt(current, schedule, questsDone, questsTotal, pomCount, daysLeft)
      const reply = await callClaudeChat({ systemPrompt: sys, messages: history })
      setMessages(prev => [...prev, { role: 'assistant', content: reply, time: new Date() }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Try again.', time: new Date() }])
    } finally {
      setLoading(false)
    }
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      <style>{`
        @keyframes cbBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes cbSlide  { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes cbPulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
      `}</style>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 84, right: 24,
          width: 340, maxHeight: 480,
          background: '#ffffff', border: '1.5px solid #f0eaf7',
          borderRadius: 20, boxShadow: '0 8px 40px rgba(124,92,191,0.15)',
          display: 'flex', flexDirection: 'column', zIndex: 100,
          animation: 'cbSlide 0.2s ease',
          overflow: 'hidden',
        }}>
          {/* Panel header */}
          <div style={{ padding: '14px 16px', borderBottom: '1.5px solid #f0eaf7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#2d2a3e', margin: 0 }}>Study Buddy</p>
              <p style={{ fontSize: 11, color: '#a898be', margin: '2px 0 0' }}>Online · knows your schedule</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: '#f5f1fc', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b6fc0' }}
              onMouseEnter={e => e.currentTarget.style.background = '#e0d6f0'}
              onMouseLeave={e => e.currentTarget.style.background = '#f5f1fc'}
            >
              <X size={13} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #b794f4, #e88d67)' : '#faf8ff',
                  color: msg.role === 'user' ? '#ffffff' : '#5c4a7e',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '9px 13px', fontSize: 13, lineHeight: 1.55,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {msg.content}
                </div>
                <span style={{ fontSize: 10, color: '#c0aed8', marginTop: 3, padding: '0 4px' }}>
                  {fmt(msg.time)}
                </span>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ background: '#faf8ff', borderRadius: '16px 16px 16px 4px', padding: '9px 13px' }}>
                  <LoadingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div style={{ padding: '10px 12px', borderTop: '1.5px solid #f0eaf7', display: 'flex', gap: 8, flexShrink: 0 }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask anything…"
              rows={1}
              style={{
                flex: 1, resize: 'none', border: '1.5px solid #f0eaf7',
                borderRadius: 10, padding: '8px 10px', fontSize: 13,
                color: '#2d2a3e', outline: 'none',
                fontFamily: "'Inter', system-ui, sans-serif",
                background: '#faf8ff', lineHeight: 1.4,
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onFocus={e => { e.target.style.borderColor = '#c4a8ff'; e.target.style.boxShadow = '0 0 0 3px rgba(196,168,255,0.15)' }}
              onBlur={e => { e.target.style.borderColor = '#f0eaf7'; e.target.style.boxShadow = 'none' }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                width: 36, height: 36, borderRadius: 10, border: 'none',
                background: input.trim() && !loading ? 'linear-gradient(135deg, #b794f4, #e88d67)' : '#e0d6f0',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, alignSelf: 'flex-end',
                transition: 'background 0.15s',
              }}
            >
              <Send size={14} color="#ffffff" />
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24,
          width: 48, height: 48, borderRadius: '50%', border: 'none',
          background: 'linear-gradient(135deg, #b794f4, #e88d67)',
          cursor: 'pointer', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(124,92,191,0.2)',
          animation: pulse ? 'cbPulse 0.5s ease' : 'none',
          position: 'fixed',
        }}
      >
        <MessageCircle size={20} color="#ffffff" />
        {hasUnread && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            width: 8, height: 8, borderRadius: '50%',
            background: '#4ecfa0', border: '1.5px solid #ffffff',
          }} />
        )}
      </button>
    </>
  )
}
