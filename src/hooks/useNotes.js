import { useState } from 'react'

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

function load() {
  try { return JSON.parse(localStorage.getItem('study_hub_notes') || '[]') }
  catch { return [] }
}

function loadSubjects() {
  try { return JSON.parse(localStorage.getItem('study_hub_note_subjects') || '[]') }
  catch { return [] }
}

export function useNotes() {
  const [notes, setNotes] = useState(load)
  const [customSubjects, setCustomSubjects] = useState(loadSubjects)

  function refresh() { setNotes(load()) }

  function addNote({ subject = 'General', title = '', content = '' } = {}) {
    const now = new Date()
    const note = {
      id: now.getTime().toString(),
      date: todayString(),
      subject, title, content,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }
    const updated = [note, ...load()]
    localStorage.setItem('study_hub_notes', JSON.stringify(updated))
    setNotes(updated)
    return note.id
  }

  function updateNote(id, changes) {
    const updated = load().map(n =>
      n.id === id ? { ...n, ...changes, updatedAt: new Date().toISOString() } : n
    )
    localStorage.setItem('study_hub_notes', JSON.stringify(updated))
    setNotes(updated)
  }

  function deleteNote(id) {
    const updated = load().filter(n => n.id !== id)
    localStorage.setItem('study_hub_notes', JSON.stringify(updated))
    setNotes(updated)
  }

  function addCustomSubject(subject) {
    if (!subject || customSubjects.includes(subject)) return
    const updated = [...customSubjects, subject]
    localStorage.setItem('study_hub_note_subjects', JSON.stringify(updated))
    setCustomSubjects(updated)
  }

  return { notes, customSubjects, addNote, updateNote, deleteNote, addCustomSubject, refresh }
}
