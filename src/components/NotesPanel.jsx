import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Plus, GripHorizontal } from 'lucide-react'
import { useNotes } from '../hooks/useNotes'
import NoteCard from './NoteCard'
import NoteEditor from './NoteEditor'
import { useCurrentBlock } from '../hooks/useCurrentBlock'

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

function getDayTabs(notes) {
  const days = new Set([todayString()])
  notes.forEach(n => days.add(n.date))
  return Array.from(days).sort((a, b) => b.localeCompare(a)).slice(0, 7)
}

function formatTab(dateStr) {
  if (dateStr === todayString()) return 'Today'
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getDefaultState() {
  const w = window.innerWidth
  const h = window.innerHeight
  return {
    pos: { top: 60, left: Math.max(0, w - 500) },
    size: { width: 480, height: Math.min(680, h - 80) },
  }
}

export default function NotesPanel({ open, onClose, schedule }) {
  const { notes, customSubjects, addNote, updateNote, deleteNote, addCustomSubject, refresh } = useNotes()
  const { current } = useCurrentBlock(schedule)
  const [activeDay, setActiveDay] = useState(todayString())
  const [editingId, setEditingId] = useState(null)
  const currentIdRef = useRef(null)

  const [pos, setPos] = useState(() => getDefaultState().pos)
  const [size, setSize] = useState(() => getDefaultState().size)

  useEffect(() => {
    if (open) refresh()
  }, [open])

  useEffect(() => {
    currentIdRef.current = editingId === 'new' ? null : editingId
  }, [editingId])

  useEffect(() => {
    if (open) {
      const d = getDefaultState()
      setPos(d.pos)
      setSize(d.size)
    }
  }, [open])

  const onDragStart = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('select') || e.target.closest('input')) return
    e.preventDefault()
    const startX = e.clientX - pos.left
    const startY = e.clientY - pos.top

    function onMove(e) {
      setPos({
        left: Math.max(0, Math.min(window.innerWidth - 100, e.clientX - startX)),
        top: Math.max(0, Math.min(window.innerHeight - 60, e.clientY - startY)),
      })
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [pos])

  const onResizeStart = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const startW = size.width
    const startH = size.height

    function onMove(e) {
      setSize({
        width: Math.max(320, startW + (e.clientX - startX)),
        height: Math.max(400, startH + (e.clientY - startY)),
      })
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [size])

  const days = getDayTabs(notes)
  const dayNotes = notes.filter(n => n.date === activeDay)
  const editingNote = editingId && editingId !== 'new'
    ? notes.find(n => n.id === editingId) || null
    : null

  function handleSave(data, andBack) {
    if (!currentIdRef.current) {
      const id = addNote(data)
      currentIdRef.current = id
      if (!andBack) setEditingId(id)
    } else {
      updateNote(currentIdRef.current, data)
    }
    if (andBack) {
      setEditingId(null)
      currentIdRef.current = null
    }
  }

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed', top: pos.top, left: pos.left, zIndex: 50,
        width: size.width, height: size.height,
        background: 'var(--bg)',
        border: '2px solid var(--border)',
        borderRadius: 16,
        boxShadow: '0 12px 48px var(--shadow-panel)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        userSelect: 'none',
        animation: 'panelPop 0.18s ease',
      }}
    >
      {/* Drag handle header */}
      <div
        onMouseDown={onDragStart}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', borderBottom: '1.5px solid var(--border)', flexShrink: 0,
          cursor: 'grab',
          background: 'var(--bg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <GripHorizontal size={14} color="var(--fg4)" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--fg)', userSelect: 'none' }}>Notes</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {!editingId && (
            <button
              onClick={() => setEditingId('new')}
              style={{
                background: 'linear-gradient(135deg, #b794f4, #e88d67)',
                border: 'none', borderRadius: 8, padding: '5px 11px',
                fontSize: 12, fontWeight: 500, color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <Plus size={13} /> New
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: 'var(--surface3)', color: 'var(--purple-d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface4)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--surface3)'}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {editingId ? (
        <div style={{ flex: 1, overflow: 'hidden', userSelect: 'text' }}>
          <NoteEditor
            key={editingId}
            note={editingNote}
            onSave={handleSave}
            onBack={() => setEditingId(null)}
            customSubjects={customSubjects}
            onAddSubject={addCustomSubject}
            currentBlockLabel={current?.label || 'General'}
          />
        </div>
      ) : (
        <>
          {/* Day tabs */}
          <div style={{ borderBottom: '1.5px solid var(--border)', flexShrink: 0 }}>
            <div className="no-scrollbar" style={{ display: 'flex', gap: 6, padding: '10px 16px', overflowX: 'auto' }}>
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  style={{
                    padding: '5px 12px', borderRadius: 20, border: '1.5px solid',
                    fontSize: 12, fontWeight: 500, cursor: 'pointer', flexShrink: 0,
                    background: activeDay === day ? 'var(--surface3)' : 'var(--surface)',
                    borderColor: activeDay === day ? 'var(--purple-bright)' : 'var(--border)',
                    color: activeDay === day ? 'var(--purple-dd)' : 'var(--fg3)',
                    transition: 'all 0.15s',
                  }}
                >
                  {formatTab(day)}
                </button>
              ))}
            </div>
          </div>

          {/* Notes list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', userSelect: 'text' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--fg3)' }}>
                {activeDay === todayString() ? 'Notes for today' : `Notes from ${formatTab(activeDay)}`}
              </span>
              <span style={{ fontSize: 11, color: 'var(--fg4)', background: 'var(--surface3)', padding: '2px 8px', borderRadius: 20 }}>
                {dayNotes.length} {dayNotes.length === 1 ? 'note' : 'notes'}
              </span>
            </div>

            {dayNotes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--fg4)', fontSize: 13 }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>📓</div>
                No notes yet
                <br />
                <button
                  onClick={() => setEditingId('new')}
                  style={{
                    background: 'none', border: 'none',
                    color: 'var(--purple)', fontSize: 12, cursor: 'pointer',
                    marginTop: 8, textDecoration: 'underline',
                  }}
                >
                  Create your first note
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {dayNotes.map(note => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onClick={() => setEditingId(note.id)}
                    onDelete={deleteNote}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Resize handle */}
      <div
        onMouseDown={onResizeStart}
        style={{
          position: 'absolute', bottom: 0, right: 0,
          width: 22, height: 22, cursor: 'nwse-resize',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
          padding: 5,
        }}
      >
        <svg width="9" height="9" viewBox="0 0 9 9">
          <path d="M1,8 L8,1 M4.5,8 L8,4.5" stroke="var(--fg4)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}
