import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Bold, Italic, Underline, List, ListOrdered, CheckSquare, Minus, ChevronDown } from 'lucide-react'

const PRESET_COLORS = [
  { name: 'red',    label: 'Red',    light: '#dc2626', dark: '#fca5a5' },
  { name: 'orange', label: 'Orange', light: '#c2410c', dark: '#fdba74' },
  { name: 'yellow', label: 'Yellow', light: '#a16207', dark: '#fde047' },
  { name: 'green',  label: 'Green',  light: '#15803d', dark: '#86efac' },
  { name: 'teal',   label: 'Teal',   light: '#0e7490', dark: '#67e8f9' },
  { name: 'blue',   label: 'Blue',   light: '#1d4ed8', dark: '#93c5fd' },
  { name: 'purple', label: 'Purple', light: '#7c3aed', dark: '#c4b5fd' },
  { name: 'pink',   label: 'Pink',   light: '#be185d', dark: '#f9a8d4' },
  { name: 'gray',   label: 'Gray',   light: '#6b7280', dark: '#9ca3af' },
]

const DEFAULT_SUBJECTS = [
  'General', 'Warm Up', 'DSA Block 1', 'DSA Block 2', 'CS Fundamentals',
  'Mock OA', 'Applications', 'Review', 'Session Guide',
]

export default function NoteEditor({ note, onSave, onBack, customSubjects = [], onAddSubject, currentBlockLabel }) {
  const [subject, setSubject] = useState(note?.subject || currentBlockLabel || 'General')
  const [title, setTitle] = useState(note?.title || '')
  const [showDrop, setShowDrop] = useState(false)
  const [customInput, setCustomInput] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [activeColor, setActiveColor] = useState('red')
  const editorRef = useRef(null)
  const saveTimer = useRef(null)
  const savedSelRef = useRef(null)
  const colorBtnRef = useRef(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = note?.content || ''
      if (!note?.content) editorRef.current.classList.add('is-empty')
    }
  }, [])

  function autoSave() {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(flush, 500)
  }

  function flush() {
    clearTimeout(saveTimer.current)
    onSave({ subject, title, content: editorRef.current?.innerHTML || '' }, false)
  }

  function flushAndBack() {
    clearTimeout(saveTimer.current)
    onSave({ subject, title, content: editorRef.current?.innerHTML || '' }, true)
  }

  function execCmd(cmd) {
    document.execCommand(cmd, false, null)
    editorRef.current?.focus()
    autoSave()
  }

  function handleKeyDown(e) {
    if (e.key !== ' ') return
    const sel = window.getSelection()
    if (!sel?.rangeCount || !sel.getRangeAt(0).collapsed) return
    const range = sel.getRangeAt(0)
    if (!editorRef.current?.contains(range.startContainer)) return
    const node = range.startContainer
    if (node.nodeType !== Node.TEXT_NODE) return
    const text = node.textContent.slice(0, range.startOffset)
    if (text === '-' || text === '*') {
      e.preventDefault()
      const r = document.createRange()
      r.setStart(node, 0); r.setEnd(node, range.startOffset)
      sel.removeAllRanges(); sel.addRange(r)
      document.execCommand('delete', false, null)
      document.execCommand('insertUnorderedList', false, null)
      autoSave()
    } else if (text === '1.') {
      e.preventDefault()
      const r = document.createRange()
      r.setStart(node, 0); r.setEnd(node, range.startOffset)
      sel.removeAllRanges(); sel.addRange(r)
      document.execCommand('delete', false, null)
      document.execCommand('insertOrderedList', false, null)
      autoSave()
    }
  }

  function saveSelForFormat() {
    const sel = window.getSelection()
    savedSelRef.current = sel?.rangeCount ? sel.getRangeAt(0).cloneRange() : null
  }

  function applyColor(colorName) {
    setActiveColor(colorName)
    setShowColorPicker(false)
    const sel = window.getSelection()
    const range = savedSelRef.current
    if (!range || range.collapsed) {
      editorRef.current?.focus()
      return
    }
    sel.removeAllRanges()
    sel.addRange(range)
    const span = document.createElement('span')
    span.className = `nc-${colorName}`
    try {
      range.surroundContents(span)
    } catch {
      const contents = range.extractContents()
      span.appendChild(contents)
      range.insertNode(span)
    }
    editorRef.current?.focus()
    autoSave()
  }

  function applyFormat(blockTag) {
    if (savedSelRef.current) {
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(savedSelRef.current)
    }
    document.execCommand('formatBlock', false, blockTag)
    editorRef.current?.focus()
    autoSave()
  }

  function insertHtml(html) {
    document.execCommand('insertHTML', false, html)
    editorRef.current?.focus()
    autoSave()
  }

  const allSubjects = [...new Set([...DEFAULT_SUBJECTS, ...customSubjects])]

  const toolbarBtns = [
    { icon: <Bold size={13} />, action: () => execCmd('bold'), title: 'Bold' },
    { icon: <Italic size={13} />, action: () => execCmd('italic'), title: 'Italic' },
    { icon: <Underline size={13} />, action: () => execCmd('underline'), title: 'Underline' },
    { icon: <List size={13} />, action: () => execCmd('insertUnorderedList'), title: 'Bullet list' },
    { icon: <ListOrdered size={13} />, action: () => execCmd('insertOrderedList'), title: 'Numbered list' },
    { icon: <CheckSquare size={13} />, action: () => insertHtml('<input type="checkbox"> '), title: 'Checkbox' },
    { icon: <Minus size={13} />, action: () => insertHtml('<hr>'), title: 'Divider' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderBottom: '1.5px solid var(--border)', flexShrink: 0,
      }}>
        <button
          onClick={flushAndBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--purple-d)', fontSize: 13, padding: '4px 0',
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={flushAndBack}
          style={{
            background: 'linear-gradient(135deg, #b794f4, #e88d67)',
            border: 'none', borderRadius: 8, padding: '6px 14px',
            fontSize: 12, fontWeight: 500, color: '#ffffff', cursor: 'pointer',
          }}
        >
          Save note
        </button>
      </div>

      {/* Subject + Title */}
      <div style={{ padding: '14px 20px 12px', borderBottom: '1.5px solid var(--border)', flexShrink: 0 }}>
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <label style={{
            display: 'block', fontSize: 10, fontWeight: 500, color: 'var(--fg4)',
            textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4,
          }}>
            Subject
          </label>
          <button
            onClick={() => setShowDrop(d => !d)}
            style={{
              background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 8,
              padding: '6px 12px', fontSize: 12, color: 'var(--purple-dd)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {subject} <span style={{ fontSize: 10, color: 'var(--fg4)' }}>▾</span>
          </button>
          {showDrop && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, zIndex: 20, marginTop: 4,
              background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 10,
              boxShadow: '0 4px 20px rgba(124,92,191,0.12)', padding: 6,
              maxHeight: 200, overflowY: 'auto', minWidth: 180,
            }}>
              {allSubjects.map(s => (
                <button
                  key={s}
                  onClick={() => { setSubject(s); setShowDrop(false); autoSave() }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    background: subject === s ? 'var(--surface3)' : 'none',
                    border: 'none', borderRadius: 6, padding: '7px 10px',
                    fontSize: 12, color: subject === s ? 'var(--purple-dd)' : 'var(--fg2)', cursor: 'pointer',
                  }}
                >
                  {s}
                </button>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', padding: '6px 4px 2px' }}>
                <input
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && customInput.trim()) {
                      onAddSubject(customInput.trim())
                      setSubject(customInput.trim())
                      setCustomInput('')
                      setShowDrop(false)
                    }
                  }}
                  placeholder="+ Custom subject"
                  style={{
                    width: '100%', background: 'var(--surface2)', border: '1.5px solid var(--border)',
                    borderRadius: 6, padding: '5px 8px', fontSize: 11, color: 'var(--fg)',
                    outline: 'none', fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <input
          value={title}
          onChange={e => { setTitle(e.target.value); autoSave() }}
          placeholder="Note title"
          style={{
            width: '100%', background: 'none', border: 'none', outline: 'none',
            fontSize: 16, fontWeight: 500, color: 'var(--fg)',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        />
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex', gap: 4, padding: '8px 16px',
        borderBottom: '1.5px solid var(--border)', flexShrink: 0, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <select
          title="Text style"
          defaultValue=""
          onMouseDown={saveSelForFormat}
          onChange={e => {
            applyFormat(e.target.value)
            e.target.value = ''
          }}
          style={{
            height: 28, borderRadius: 6, border: '1.5px solid var(--border)',
            background: 'var(--surface2)', color: 'var(--purple-d)', fontSize: 11,
            padding: '0 6px', cursor: 'pointer', outline: 'none',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          <option value="" disabled>Style</option>
          <option value="p">Normal</option>
          <option value="h1">Title</option>
          <option value="h2">Heading</option>
          <option value="h3">Subheading</option>
        </select>

        <div style={{ width: 1, height: 20, background: 'var(--border)', flexShrink: 0 }} />

        {/* Font color picker */}
        <div style={{ position: 'relative' }}>
          <button
            ref={colorBtnRef}
            title="Font color"
            onMouseDown={e => { e.preventDefault(); saveSelForFormat(); setShowColorPicker(v => !v) }}
            style={{
              height: 28, borderRadius: 6, border: '1.5px solid var(--border)',
              background: 'var(--surface2)', color: 'var(--purple-d)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 3, padding: '0 6px',
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--surface2)'}
          >
            <span className={`nc-${activeColor}`} style={{ fontSize: 12, fontWeight: 700, lineHeight: 1, borderBottom: '2.5px solid currentColor' }}>A</span>
            <ChevronDown size={10} />
          </button>
          {showColorPicker && (
            <>
              <div onClick={() => setShowColorPicker(false)} style={{ position: 'fixed', inset: 0, zIndex: 29 }} />
              <div style={{
                position: 'absolute', top: '100%', left: 0, zIndex: 30, marginTop: 4,
                background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 10,
                boxShadow: '0 4px 20px rgba(124,92,191,0.14)', padding: 8, minWidth: 160,
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c.name}
                      onMouseDown={e => { e.preventDefault(); applyColor(c.name) }}
                      title={c.label}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        borderRadius: 6, border: activeColor === c.name ? '1.5px solid var(--purple-bright)' : '1.5px solid transparent',
                        background: activeColor === c.name ? 'var(--surface3)' : 'none',
                        padding: '4px 6px', cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: c.light, flexShrink: 0, border: '1px solid rgba(0,0,0,0.1)' }} />
                      <span style={{ fontSize: 11, color: 'var(--fg2)' }}>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div style={{ width: 1, height: 20, background: 'var(--border)', flexShrink: 0 }} />

        {toolbarBtns.map((btn, i) => (
          <button
            key={i}
            title={btn.title}
            onMouseDown={e => { e.preventDefault(); btn.action() }}
            style={{
              width: 28, height: 28, borderRadius: 6,
              border: '1.5px solid var(--border)', background: 'var(--surface2)',
              color: 'var(--purple-d)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.1s, border-color 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--border)'; e.currentTarget.style.borderColor = 'var(--purple-bright)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Start writing... your notes auto-save"
        className="note-editor-area"
        onKeyDown={handleKeyDown}
        onInput={() => {
          const el = editorRef.current
          if (el) {
            if (el.innerHTML === '<br>') el.innerHTML = ''
            el.classList.toggle('is-empty', el.textContent.trim() === '' && !el.innerHTML)
          }
          autoSave()
        }}
        style={{
          flex: 1, padding: '16px 20px', outline: 'none',
          fontSize: 13, color: 'var(--fg2)', lineHeight: 1.7,
          fontFamily: "'Inter', system-ui, sans-serif",
          overflowY: 'auto', minHeight: 300, position: 'relative',
        }}
      />
    </div>
  )
}
