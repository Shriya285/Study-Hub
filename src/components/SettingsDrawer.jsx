import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Sun, Code2, Coffee, BookOpen, Utensils, Terminal, Send, PenLine, Zap, Moon, Brain, Clock, Laptop2, Flame, Target, Dumbbell, Music, FileText, Globe, Star } from 'lucide-react'

const BLOCK_ICONS = [
  { key: 'sun',        Icon: Sun        },
  { key: 'code',       Icon: Code2      },
  { key: 'coffee',     Icon: Coffee     },
  { key: 'book',       Icon: BookOpen   },
  { key: 'utensils',   Icon: Utensils   },
  { key: 'terminal-2', Icon: Terminal   },
  { key: 'send',       Icon: Send       },
  { key: 'pencil',     Icon: PenLine    },
  { key: 'bolt',       Icon: Zap        },
  { key: 'moon',       Icon: Moon       },
  { key: 'brain',      Icon: Brain      },
  { key: 'clock',      Icon: Clock      },
  { key: 'laptop',     Icon: Laptop2    },
  { key: 'flame',      Icon: Flame      },
  { key: 'target',     Icon: Target     },
  { key: 'dumbbell',   Icon: Dumbbell   },
  { key: 'music',      Icon: Music      },
  { key: 'file',       Icon: FileText   },
  { key: 'globe',      Icon: Globe      },
  { key: 'star',       Icon: Star       },
]

/* ─── shared style helpers ─────────────────────────────── */
const LABEL = {
  display: 'block', fontSize: 11, fontWeight: 500,
  color: 'var(--fg3)', textTransform: 'uppercase',
  letterSpacing: '0.07em', marginBottom: 5,
}

function inp(focused) {
  return {
    width: '100%',
    background: 'var(--surface)',
    border: `1.5px solid ${focused ? 'var(--purple-bright)' : 'var(--border)'}`,
    borderRadius: 8, padding: '9px 12px',
    fontSize: 13, color: 'var(--fg)', outline: 'none',
    fontFamily: "'Inter', system-ui, sans-serif",
    boxShadow: focused ? '0 0 0 3px rgba(196,168,255,0.15)' : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }
}

function inlineInp(focused) {
  return {
    background: 'none', border: 'none', outline: 'none',
    borderBottom: `1.5px solid ${focused ? 'var(--purple-bright)' : 'transparent'}`,
    transition: 'border-color 0.15s', padding: '2px 0',
    color: 'var(--fg)',
  }
}

function addBtn(hov) {
  return {
    width: '100%', height: 40,
    border: '1.5px dashed var(--border2)', borderRadius: 10,
    background: hov ? 'var(--surface2)' : 'transparent',
    cursor: 'pointer', fontSize: 13,
    color: hov ? 'var(--purple-dd)' : 'var(--purple-d)',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 6,
    transition: 'all 0.15s', marginTop: 4,
  }
}

function trashBtn(hov) {
  return {
    width: 26, height: 26, borderRadius: 6, border: 'none', flexShrink: 0,
    background: hov ? '#fee2e2' : '#fef2f2',
    color: hov ? '#ef4444' : '#f87171',
    cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s',
  }
}

/* ─── Focusable field ───────────────────────────────────── */
function Field({ type = 'text', value, onChange, placeholder, style }) {
  const [f, setF] = useState(false)
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ ...inp(f), ...style }}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
    />
  )
}

/* ─── TrashButton ───────────────────────────────────────── */
function Trash({ onClick }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} style={trashBtn(h)}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <Trash2 size={11} />
    </button>
  )
}

/* ─── AddButton ─────────────────────────────────────────── */
function AddBtn({ onClick, children }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} style={addBtn(h)}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <Plus size={14} /> {children}
    </button>
  )
}

/* ─── InlineInput ───────────────────────────────────────── */
function Inline({ value, onChange, placeholder, style }) {
  const [f, setF] = useState(false)
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ ...inlineInp(f), ...style }}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
    />
  )
}

/* ─── GeneralTab ────────────────────────────────────────── */
function GeneralTab({ local, setLocal }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <span style={LABEL}>Your Name</span>
        <Field
          value={local.name || ''}
          onChange={e => setLocal(l => ({ ...l, name: e.target.value }))}
          placeholder="Your name"
        />
      </div>
      <div>
        <span style={LABEL}>Target Date</span>
        <Field
          type="date"
          value={local.targetDate || ''}
          onChange={e => setLocal(l => ({ ...l, targetDate: e.target.value }))}
        />
      </div>
    </div>
  )
}

/* ─── IconPicker ────────────────────────────────────────── */
function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const CurrentIcon = BLOCK_ICONS.find(i => i.key === value)?.Icon || Sun

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Change icon"
        style={{
          width: 32, height: 32, borderRadius: 8,
          background: open ? 'var(--border)' : 'var(--surface2)',
          border: `1.5px solid ${open ? 'var(--purple-bright)' : 'var(--border)'}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--purple-d)', transition: 'all 0.15s', flexShrink: 0,
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.borderColor = 'var(--border2)' }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.borderColor = 'var(--border)' }}
      >
        <CurrentIcon size={15} />
      </button>
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 29 }}
          />
          <div style={{
            position: 'absolute', top: '100%', left: 0, zIndex: 30, marginTop: 4,
            background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12,
            boxShadow: '0 4px 20px rgba(124,92,191,0.14)', padding: 8,
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 3,
            width: 176,
          }}>
            {BLOCK_ICONS.map(({ key, Icon }) => (
              <button
                key={key}
                onClick={() => { onChange(key); setOpen(false) }}
                title={key}
                style={{
                  width: 30, height: 30, borderRadius: 6, border: 'none',
                  background: value === key ? 'var(--border)' : 'none',
                  color: value === key ? 'var(--purple-dd)' : 'var(--purple-d)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (value !== key) e.currentTarget.style.background = 'var(--surface2)' }}
                onMouseLeave={e => { if (value !== key) e.currentTarget.style.background = 'none' }}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ─── ScheduleTab ───────────────────────────────────────── */
function ScheduleTab({ local, setLocal }) {
  function upd(id, f, v) {
    setLocal(l => ({ ...l, schedule: l.schedule.map(b => b.id === id ? { ...b, [f]: v } : b) }))
  }
  function add() {
    setLocal(l => ({ ...l, schedule: [...l.schedule, {
      id: `s${Date.now()}`, start: '08:00', end: '09:00',
      label: 'New Block', subtitle: '', isBreak: false, icon: 'sun', durationLabel: '1h',
    }] }))
  }
  function del(id) {
    setLocal(l => ({ ...l, schedule: l.schedule.filter(b => b.id !== id) }))
  }

  return (
    <div>
      {local.schedule.map(block => (
        <div key={block.id} style={{
          background: 'var(--surface)',
          border: '1.5px solid var(--border)',
          borderLeft: `3px solid ${block.isBreak ? 'var(--border2)' : 'var(--purple-bright)'}`,
          borderRadius: '4px 12px 12px 4px',
          padding: '12px 14px', marginBottom: 8,
        }}>
          {/* Row 1: icon + label + delete */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <IconPicker value={block.icon || 'sun'} onChange={v => upd(block.id, 'icon', v)} />
            <Inline
              value={block.label}
              onChange={e => upd(block.id, 'label', e.target.value)}
              placeholder="Block name"
              style={{ flex: 1, fontSize: 13, fontWeight: 500 }}
            />
            <Trash onClick={() => del(block.id)} />
          </div>
          {/* Row 2: subtitle */}
          <Inline
            value={block.subtitle || ''}
            onChange={e => upd(block.id, 'subtitle', e.target.value)}
            placeholder="Subtitle (optional)"
            style={{ width: '100%', fontSize: 12, color: 'var(--fg3)', marginBottom: 8, display: 'block' }}
          />
          {/* Row 3: times + break toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="time" value={block.start}
              onChange={e => upd(block.id, 'start', e.target.value)}
              style={{
                background: 'var(--surface2)', border: '1.5px solid var(--border)',
                borderRadius: 8, padding: '5px 10px',
                fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                color: 'var(--fg2)', outline: 'none', width: 100,
              }}
            />
            <span style={{ color: 'var(--fg4)', fontSize: 12 }}>–</span>
            <input type="time" value={block.end}
              onChange={e => upd(block.id, 'end', e.target.value)}
              style={{
                background: 'var(--surface2)', border: '1.5px solid var(--border)',
                borderRadius: 8, padding: '5px 10px',
                fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                color: 'var(--fg2)', outline: 'none', width: 100,
              }}
            />
            <label style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <div
                onClick={() => upd(block.id, 'isBreak', !block.isBreak)}
                style={{
                  width: 28, height: 16, borderRadius: 8,
                  background: block.isBreak ? 'var(--purple-bright)' : 'var(--surface4)',
                  position: 'relative', cursor: 'pointer',
                  transition: 'background 0.2s', flexShrink: 0,
                }}
              >
                <div style={{
                  position: 'absolute', top: 2,
                  left: block.isBreak ? 12 : 2,
                  width: 12, height: 12, borderRadius: '50%',
                  background: '#ffffff',
                  transition: 'left 0.2s',
                }} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--fg3)' }}>Break</span>
            </label>
          </div>
        </div>
      ))}
      <AddBtn onClick={add}>Add block</AddBtn>
    </div>
  )
}

/* ─── QuestsTab ─────────────────────────────────────────── */
function QuestsTab({ local, setLocal }) {
  function upd(id, f, v) {
    setLocal(l => ({ ...l, goals: l.goals.map(g => g.id === id ? { ...g, [f]: v } : g) }))
  }
  function add() {
    setLocal(l => ({ ...l, goals: [...l.goals, { id: `g${Date.now()}`, label: 'New quest', xp: 20 }] }))
  }
  function del(id) {
    setLocal(l => ({ ...l, goals: l.goals.filter(g => g.id !== id) }))
  }

  return (
    <div>
      {local.goals.map(goal => (
        <div key={goal.id} style={{
          background: 'var(--surface)', border: '1.5px solid var(--border)',
          borderRadius: 10, padding: '10px 12px', marginBottom: 6,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: 'var(--border2)', fontSize: 14, cursor: 'grab', flexShrink: 0 }}>⠿</span>
          <input
            type="text"
            value={goal.label}
            onChange={e => upd(goal.id, 'label', e.target.value)}
            placeholder="Quest label"
            style={{
              flex: 1, background: 'none', border: 'none',
              fontSize: 13, color: 'var(--fg)', outline: 'none',
            }}
          />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'var(--surface2)', border: '1.5px solid var(--border)',
            borderRadius: 6, padding: '3px 6px', flexShrink: 0,
          }}>
            <input
              type="number"
              value={goal.xp || 20}
              onChange={e => upd(goal.id, 'xp', Math.max(5, Math.min(100, Number(e.target.value) || 5)))}
              min={5} max={100}
              style={{
                width: 32, textAlign: 'center',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12, background: 'none', border: 'none',
                color: 'var(--mint)', outline: 'none',
              }}
            />
            <span style={{ fontSize: 10, color: 'var(--fg3)' }}>XP</span>
          </div>
          <Trash onClick={() => del(goal.id)} />
        </div>
      ))}
      <AddBtn onClick={add}>Add quest</AddBtn>
    </div>
  )
}

/* ─── LinksTab ──────────────────────────────────────────── */
function LinksTab({ local, setLocal }) {
  function upd(id, f, v) {
    setLocal(l => ({ ...l, resources: l.resources.map(r => r.id === id ? { ...r, [f]: v } : r) }))
  }
  function add() {
    setLocal(l => ({ ...l, resources: [...l.resources, { id: `r${Date.now()}`, label: 'New Link', url: '', icon: 'code' }] }))
  }
  function del(id) {
    setLocal(l => ({ ...l, resources: l.resources.filter(r => r.id !== id) }))
  }

  return (
    <div>
      {local.resources.map(r => (
        <div key={r.id} style={{
          background: 'var(--surface)', border: '1.5px solid var(--border)',
          borderRadius: 10, padding: '10px 14px', marginBottom: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <Inline
              value={r.label}
              onChange={e => upd(r.id, 'label', e.target.value)}
              placeholder="Link name"
              style={{ flex: 1, fontSize: 13, fontWeight: 500 }}
            />
            <Trash onClick={() => del(r.id)} />
          </div>
          <Inline
            value={r.url || ''}
            onChange={e => upd(r.id, 'url', e.target.value)}
            placeholder="https://..."
            style={{ width: '100%', fontSize: 12, color: 'var(--fg3)', display: 'block' }}
          />
        </div>
      ))}
      <AddBtn onClick={add}>Add link</AddBtn>
    </div>
  )
}

/* ─── DangerTab ─────────────────────────────────────────── */
function DangerTab({ onResetStreak, onResetAll, onClose }) {
  const [confirmStreak, setConfirmStreak] = useState(false)
  const [confirmAll, setConfirmAll] = useState(false)

  function DangerBtn({ onClick, children }) {
    const [h, setH] = useState(false)
    return (
      <button onClick={onClick}
        style={{
          background: h ? '#fee2e2' : '#fef2f2',
          border: `1.5px solid ${h ? '#fca5a5' : '#fee2e2'}`,
          color: h ? '#ef4444' : '#e57373',
          borderRadius: 8, padding: '7px 16px',
          fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
        }}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
        {children}
      </button>
    )
  }

  function GhostBtn({ onClick, children }) {
    return (
      <button onClick={onClick}
        style={{ background: 'none', border: 'none', color: 'var(--fg3)', fontSize: 12, cursor: 'pointer', padding: '4px 8px' }}>
        {children}
      </button>
    )
  }

  return (
    <div>
      {/* Reset streak */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)', marginBottom: 4 }}>Reset Streak</p>
        <p style={{ fontSize: 12, color: 'var(--fg3)', marginBottom: 10, lineHeight: 1.5 }}>
          Resets your day streak to 0. Cannot be undone.
        </p>
        {!confirmStreak ? (
          <DangerBtn onClick={() => setConfirmStreak(true)}>Reset streak</DangerBtn>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <DangerBtn onClick={() => { onResetStreak(); setConfirmStreak(false); onClose() }}>
              Yes, reset streak
            </DangerBtn>
            <GhostBtn onClick={() => setConfirmStreak(false)}>Cancel</GhostBtn>
          </div>
        )}
      </div>

      <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />

      {/* Reset all */}
      <div>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)', marginBottom: 4 }}>Reset All Progress</p>
        <p style={{ fontSize: 12, color: 'var(--fg3)', marginBottom: 10, lineHeight: 1.5 }}>
          Clears XP, trophies, streak, and today's quests.<br />
          Your schedule and settings are kept.
        </p>
        {!confirmAll ? (
          <DangerBtn onClick={() => setConfirmAll(true)}>Reset all progress</DangerBtn>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <DangerBtn onClick={() => { onResetAll(); setConfirmAll(false); onClose() }}>
              Yes, reset everything
            </DangerBtn>
            <GhostBtn onClick={() => setConfirmAll(false)}>Cancel</GhostBtn>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Main drawer ───────────────────────────────────────── */
const TABS = [
  { id: 'general',  label: 'General'  },
  { id: 'schedule', label: 'Schedule' },
  { id: 'quests',   label: 'Quests'   },
  { id: 'links',    label: 'Links'    },
  { id: 'danger',   label: 'Danger'   },
]

export default function SettingsDrawer({ open, onClose, settings, onSave, onResetStreak, onResetAll }) {
  const [local, setLocal] = useState(settings)
  const [activeTab, setActiveTab] = useState('general')
  const [closeHov, setCloseHov] = useState(false)

  useEffect(() => {
    setLocal(settings)
  }, [settings, open])

  function save() {
    onSave(local)
    onClose()
  }

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.08)', zIndex: 40 }}
        />
      )}

      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100%', width: 400,
        background: 'var(--bg)',
        borderLeft: '2px solid var(--border)',
        boxShadow: '-8px 0 32px rgba(124,92,191,0.06)',
        zIndex: 50,
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
      }}>

        {/* ── Header ── */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--fg)' }}>Settings</span>
            <button
              onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: closeHov ? 'var(--surface4)' : 'var(--surface3)',
                color: 'var(--purple-d)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}
              onMouseEnter={() => setCloseHov(true)}
              onMouseLeave={() => setCloseHov(false)}
            >
              <X size={14} />
            </button>
          </div>

          {/* ── Tab row ── */}
          <div style={{ display: 'flex', gap: 2, borderBottom: '1.5px solid var(--border)' }}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.id
              const isDanger = tab.id === 'danger'
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '8px 12px',
                    fontSize: 13, fontWeight: 500,
                    borderRadius: '8px 8px 0 0',
                    border: isActive ? '1.5px solid var(--border)' : 'none',
                    borderBottom: isActive ? '2px solid var(--bg)' : 'none',
                    marginBottom: isActive ? -2 : 0,
                    background: isActive ? 'var(--bg)' : 'transparent',
                    color: isActive ? (isDanger ? '#e57373' : 'var(--purple-dd)') : 'var(--fg4)',
                    cursor: 'pointer', outline: 'none',
                    transition: 'color 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {activeTab === 'general'  && <GeneralTab  local={local} setLocal={setLocal} />}
          {activeTab === 'schedule' && <ScheduleTab local={local} setLocal={setLocal} />}
          {activeTab === 'quests'   && <QuestsTab   local={local} setLocal={setLocal} />}
          {activeTab === 'links'    && <LinksTab     local={local} setLocal={setLocal} />}
          {activeTab === 'danger'   && (
            <DangerTab
              onResetStreak={onResetStreak}
              onResetAll={onResetAll}
              onClose={onClose}
            />
          )}
        </div>

        {/* ── Save bar ── */}
        <div style={{
          background: 'var(--bg)',
          borderTop: '1.5px solid var(--border)',
          padding: '14px 20px',
          display: 'flex', justifyContent: 'flex-end', gap: 8,
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: '1.5px solid var(--border)',
              borderRadius: 8, padding: '8px 18px',
              fontSize: 13, fontWeight: 500, color: 'var(--fg3)', cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            Cancel
          </button>
          <button
            onClick={save}
            style={{
              background: 'linear-gradient(135deg, #b794f4, #e88d67)',
              border: 'none', borderRadius: 8, padding: '8px 22px',
              fontSize: 13, fontWeight: 500, color: '#ffffff',
              cursor: 'pointer', transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Save changes
          </button>
        </div>
      </div>
    </>
  )
}
