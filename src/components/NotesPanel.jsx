import { useState, useEffect, useRef } from 'react'
import { X, Plus } from 'lucide-react'
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

export default function NotesPanel({ open, onClose, schedule }) {
  const { notes, customSubjects, addNote, updateNote, deleteNote, addCustomSubject, refresh } = useNotes()
  const { current } = useCurrentBlock(schedule)
  const [activeDay, setActiveDay] = useState(todayString())
  const [editingId, setEditingId] = useState(null) // null=list, 'new'=new note, id=editing
  const currentIdRef = useRef(null) // tracks actual saved ID to avoid duplicate creates

  useEffect(() => {
    if (open) refresh()
  }, [open])

  useEffect(() => {
    currentIdRef.current = editingId === 'new' ? null : editingId
  }, [editingId])

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
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 49,
          background: 'rgba(45,42,62,0.18)',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 50,
        width: 480, background: '#fefcfa',
        borderLeft: '2px solid #f0eaf7',
        boxShadow: '-8px 0 40px rgba(124,92,191,0.1)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 0.25s cubic-bezier(0.4,0,0.2,1)',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: '1.5px solid #f0eaf7', flexShrink: 0,
        }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: '#2d2a3e' }}>Notes</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {!editingId && (
              <button
                onClick={() => setEditingId('new')}
                style={{
                  background: 'linear-gradient(135deg, #b794f4, #e88d67)',
                  border: 'none', borderRadius: 8, padding: '6px 12px',
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
                width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: '#f5f1fc', color: '#8b6fc0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#e0d6f0'}
              onMouseLeave={e => e.currentTarget.style.background = '#f5f1fc'}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {editingId ? (
          <NoteEditor
            key={editingId}
            note={editingNote}
            onSave={handleSave}
            onBack={() => setEditingId(null)}
            customSubjects={customSubjects}
            onAddSubject={addCustomSubject}
            currentBlockLabel={current?.label || 'General'}
          />
        ) : (
          <>
            {/* Day tabs */}
            <div style={{ borderBottom: '1.5px solid #f0eaf7', flexShrink: 0 }}>
              <div
                className="no-scrollbar"
                style={{ display: 'flex', gap: 6, padding: '10px 20px', overflowX: 'auto' }}
              >
                {days.map(day => (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    style={{
                      padding: '5px 12px', borderRadius: 20, border: '1.5px solid',
                      fontSize: 12, fontWeight: 500, cursor: 'pointer', flexShrink: 0,
                      background: activeDay === day ? '#f5f1fc' : '#ffffff',
                      borderColor: activeDay === day ? '#c4a8ff' : '#f0eaf7',
                      color: activeDay === day ? '#7c5cbf' : '#a898be',
                      transition: 'all 0.15s',
                    }}
                  >
                    {formatTab(day)}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 14,
              }}>
                <span style={{ fontSize: 12, color: '#a898be' }}>
                  {activeDay === todayString() ? 'Notes for today' : `Notes from ${formatTab(activeDay)}`}
                </span>
                <span style={{
                  fontSize: 11, color: '#c0aed8',
                  background: '#f5f1fc', padding: '2px 8px', borderRadius: 20,
                }}>
                  {dayNotes.length} {dayNotes.length === 1 ? 'note' : 'notes'}
                </span>
              </div>

              {dayNotes.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '48px 0',
                  color: '#c0aed8', fontSize: 13,
                }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>📓</div>
                  No notes yet
                  <br />
                  <button
                    onClick={() => setEditingId('new')}
                    style={{
                      background: 'none', border: 'none',
                      color: '#b794f4', fontSize: 12, cursor: 'pointer',
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
      </div>
    </>
  )
}
