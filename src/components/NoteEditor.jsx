import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Bold, Italic, Underline, List, ListOrdered, CheckSquare, Minus } from 'lucide-react'

const DEFAULT_SUBJECTS = [
  'General', 'Warm Up', 'DSA Block 1', 'DSA Block 2', 'CS Fundamentals',
  'Mock OA', 'Applications', 'Review', 'Session Guide',
]

export default function NoteEditor({ note, onSave, onBack, customSubjects = [], onAddSubject, currentBlockLabel }) {
  const [subject, setSubject] = useState(note?.subject || currentBlockLabel || 'General')
  const [title, setTitle] = useState(note?.title || '')
  const [showDrop, setShowDrop] = useState(false)
  const [customInput, setCustomInput] = useState('')
  const editorRef = useRef(null)
  const saveTimer = useRef(null)

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
        padding: '14px 20px', borderBottom: '1.5px solid #f0eaf7', flexShrink: 0,
      }}>
        <button
          onClick={flushAndBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#8b6fc0', fontSize: 13, padding: '4px 0',
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
      <div style={{ padding: '14px 20px 12px', borderBottom: '1.5px solid #f0eaf7', flexShrink: 0 }}>
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <label style={{
            display: 'block', fontSize: 10, fontWeight: 500, color: '#c0aed8',
            textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4,
          }}>
            Subject
          </label>
          <button
            onClick={() => setShowDrop(d => !d)}
            style={{
              background: '#faf8ff', border: '1.5px solid #f0eaf7', borderRadius: 8,
              padding: '6px 12px', fontSize: 12, color: '#7c5cbf', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {subject} <span style={{ fontSize: 10, color: '#c0aed8' }}>▾</span>
          </button>
          {showDrop && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, zIndex: 20, marginTop: 4,
              background: '#fff', border: '1.5px solid #f0eaf7', borderRadius: 10,
              boxShadow: '0 4px 20px rgba(124,92,191,0.12)', padding: 6,
              maxHeight: 200, overflowY: 'auto', minWidth: 180,
            }}>
              {allSubjects.map(s => (
                <button
                  key={s}
                  onClick={() => { setSubject(s); setShowDrop(false); autoSave() }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    background: subject === s ? '#f5f1fc' : 'none',
                    border: 'none', borderRadius: 6, padding: '7px 10px',
                    fontSize: 12, color: subject === s ? '#7c5cbf' : '#5c4a7e', cursor: 'pointer',
                  }}
                >
                  {s}
                </button>
              ))}
              <div style={{ borderTop: '1px solid #f0eaf7', padding: '6px 4px 2px' }}>
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
                    width: '100%', background: '#faf8ff', border: '1.5px solid #f0eaf7',
                    borderRadius: 6, padding: '5px 8px', fontSize: 11, color: '#2d2a3e',
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
            fontSize: 16, fontWeight: 500, color: '#2d2a3e',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        />
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex', gap: 4, padding: '8px 16px',
        borderBottom: '1.5px solid #f0eaf7', flexShrink: 0,
      }}>
        {toolbarBtns.map((btn, i) => (
          <button
            key={i}
            title={btn.title}
            onMouseDown={e => { e.preventDefault(); btn.action() }}
            style={{
              width: 28, height: 28, borderRadius: 6,
              border: '1.5px solid #f0eaf7', background: '#faf8ff',
              color: '#8b6fc0', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.1s, border-color 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f0eaf7'; e.currentTarget.style.borderColor = '#c4a8ff' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#faf8ff'; e.currentTarget.style.borderColor = '#f0eaf7' }}
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
          fontSize: 13, color: '#5c4a7e', lineHeight: 1.7,
          fontFamily: "'Inter', system-ui, sans-serif",
          overflowY: 'auto', minHeight: 300, position: 'relative',
        }}
      />
    </div>
  )
}
