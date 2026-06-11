import { useState, useEffect } from 'react'
import { ArrowLeft, Palette, Play, Pause, RotateCcw, Music } from 'lucide-react'
import { useCurrentBlock } from '../hooks/useCurrentBlock'
import { MODE_LABELS } from '../hooks/useTimer'
import AmbientPlayer from './AmbientPlayer'

const RADIUS = 52
const CIRC = 2 * Math.PI * RADIUS

const SCENES = [
  { id: 'room',    label: 'Study Room', img: '/scene-room.jpg'    },
  { id: 'balcony', label: 'Balcony',    img: '/scene-balcony.jpg' },
  { id: 'focus',   label: 'Deep Focus', img: null                  },
]

const SOUNDS = ['rain', 'cafe', 'forest', 'off']
const SOUND_LABELS = { rain: '🌧 Rain', cafe: '☕ Café', forest: '🌿 Forest', off: '✕ Off' }

function getRemaining(endTime) {
  const [h, m] = endTime.split(':').map(Number)
  const end = new Date(); end.setHours(h, m, 0, 0)
  const diff = Math.max(0, Math.floor((end - new Date()) / 60000))
  if (diff === 0) return 'ending now'
  return diff < 60 ? `${diff}m left` : `${Math.floor(diff / 60)}h ${diff % 60}m left`
}

export default function FocusMode({ timer, schedule, pomCount, daysLeft, onClose }) {
  const { current } = useCurrentBlock(schedule)
  const [scene, setScene] = useState(() => localStorage.getItem('study_hub_focus_scene') || 'room')
  const [showPicker, setShowPicker] = useState(false)
  const [ambience, setAmbience] = useState(() => localStorage.getItem('study_hub_ambience') || 'off')
  const [volume, setVolume] = useState(() => Number(localStorage.getItem('study_hub_volume') || '50'))
  const [spotifyUrl, setSpotifyUrl] = useState(() => localStorage.getItem('study_hub_spotify_url') || '')
  const [showSpotify, setShowSpotify] = useState(false)
  const [spotifyInput, setSpotifyInput] = useState(() => localStorage.getItem('study_hub_spotify_url') || '')

  const { mode, timeLeft, running, setRunning, switchMode, reset, progress } = timer
  const dash = CIRC * progress
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const secs = (timeLeft % 60).toString().padStart(2, '0')
  const activeScene = SCENES.find(s => s.id === scene) || SCENES[0]

  useEffect(() => {
    function onEsc(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [onClose])

  function pickScene(id) {
    setScene(id)
    localStorage.setItem('study_hub_focus_scene', id)
    setShowPicker(false)
  }

  function pickAmbience(s) {
    setAmbience(s)
    localStorage.setItem('study_hub_ambience', s)
  }

  function saveVolume(v) {
    setVolume(v)
    localStorage.setItem('study_hub_volume', String(v))
  }

  function saveSpotify() {
    setSpotifyUrl(spotifyInput.trim())
    localStorage.setItem('study_hub_spotify_url', spotifyInput.trim())
    setShowSpotify(false)
  }

  /* ── scene backgrounds ── */
  const bgStyle = activeScene.img
    ? { backgroundImage: `url(${activeScene.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'radial-gradient(ellipse at 50% 60%, #1e1648 0%, #100e2b 60%, #09071a 100%)' }

  /* ── timer card style (dark glass for all scenes) ── */
  const cardBg = 'rgba(10,8,24,0.58)'
  const cardBorder = '1px solid rgba(255,255,255,0.13)'
  const textColor = '#ffffff'
  const mutedColor = 'rgba(255,255,255,0.5)'
  const timeColor = '#e0d5ff'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', flexDirection: 'column',
      ...bgStyle,
    }}>
      <AmbientPlayer sound={ambience} volume={volume} />

      {/* Deep focus particles */}
      {scene === 'focus' && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              width: i % 5 === 0 ? 3 : 2,
              height: i % 5 === 0 ? 3 : 2,
              borderRadius: '50%',
              background: i % 3 === 0 ? '#c4a8ff' : 'rgba(196,168,255,0.3)',
              opacity: 0.15 + (i % 7) * 0.08,
            }} />
          ))}
        </div>
      )}

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)',
      }}>
        {/* Current block badge */}
        <div style={{
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 20, padding: '6px 14px',
          fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.85)',
        }}>
          {current ? current.label : 'Focus Mode'}
          {current && <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: 8 }}>{getRemaining(current.end)}</span>}
        </div>

        {/* Back button */}
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 20, padding: '6px 14px',
            fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.85)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
        >
          <ArrowLeft size={14} /> Back to hub
        </button>
      </div>

      {/* Centered timer card */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: cardBg, border: cardBorder,
        borderRadius: 18, padding: '28px 36px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        minWidth: 240,
      }}>
        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
          {Object.entries(MODE_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              style={{
                padding: '4px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: 500, transition: 'all 0.15s',
                background: mode === key ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: mode === key ? '#ffffff' : 'rgba(255,255,255,0.4)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* SVG Ring */}
        <div style={{ position: 'relative', width: 150, height: 150 }}>
          <svg width="150" height="150" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
            <defs>
              <linearGradient id="fmGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#c4a8ff" />
                <stop offset="100%" stopColor="#e88d67" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
            <circle
              cx="60" cy="60" r={RADIUS} fill="none"
              stroke="url(#fmGrad)" strokeWidth="5" strokeLinecap="round"
              strokeDasharray={`${dash} ${CIRC}`}
              style={{ transition: 'stroke-dasharray 0.5s linear' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 42, fontWeight: 500, color: timeColor,
              lineHeight: 1, letterSpacing: '0.03em',
            }}>
              {mins}:{secs}
            </span>
            <span style={{ fontSize: 11, color: mutedColor, textTransform: 'capitalize' }}>
              {MODE_LABELS[mode].toLowerCase()}
            </span>
          </div>
        </div>

        {/* Pom count */}
        <p style={{ fontSize: 11, color: mutedColor, margin: 0 }}>
          {pomCount > 0 ? `${pomCount} pomodoro${pomCount !== 1 ? 's' : ''} today` : 'No sessions yet'}
        </p>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            onClick={() => setRunning(r => !r)}
            style={{
              background: 'linear-gradient(135deg, #b794f4, #e88d67)',
              border: 'none', borderRadius: 10, padding: '9px 24px',
              fontSize: 13, fontWeight: 500, color: '#ffffff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {running ? <Pause size={14} /> : <Play size={14} />}
            {running ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={reset}
            style={{
              width: 38, height: 38, borderRadius: 10, border: 'none',
              background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Scene picker button (bottom-left) */}
      <button
        onClick={() => setShowPicker(p => !p)}
        style={{
          position: 'absolute', bottom: 80, left: 24,
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 10, padding: '8px 12px',
          color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
      >
        <Palette size={14} /> Scene
      </button>

      {/* Scene picker thumbnails */}
      {showPicker && (
        <div style={{
          position: 'absolute', bottom: 120, left: 24,
          display: 'flex', gap: 8,
          background: 'rgba(10,8,24,0.7)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 14, padding: 10,
        }}>
          {SCENES.map(s => (
            <button
              key={s.id}
              onClick={() => pickScene(s.id)}
              style={{
                width: 80, height: 56, borderRadius: 8, border: `2px solid ${scene === s.id ? '#b794f4' : 'rgba(255,255,255,0.15)'}`,
                cursor: 'pointer', overflow: 'hidden', position: 'relative', padding: 0,
                backgroundImage: s.img ? `url(${s.img})` : 'radial-gradient(#1e1648, #09071a)',
                backgroundSize: 'cover', backgroundPosition: 'center',
              }}
              title={s.label}
            >
              <span style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'rgba(0,0,0,0.55)', fontSize: 8, fontWeight: 500,
                color: '#fff', padding: '2px 4px', textAlign: 'center',
              }}>
                {s.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Bottom bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)',
        padding: '16px 24px 20px',
        display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      }}>
        {/* Ambience buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          {SOUNDS.map(s => (
            <button
              key={s}
              onClick={() => pickAmbience(s)}
              style={{
                padding: '5px 11px', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: 500, transition: 'all 0.15s',
                background: ambience === s ? 'rgba(196,168,255,0.25)' : 'rgba(255,255,255,0.08)',
                color: ambience === s ? '#d8c4f0' : 'rgba(255,255,255,0.5)',
                outline: ambience === s ? '1px solid rgba(196,168,255,0.4)' : 'none',
              }}
            >
              {SOUND_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Volume slider */}
        {ambience !== 'off' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Vol</span>
            <input
              type="range" min="0" max="100" value={volume}
              onChange={e => saveVolume(Number(e.target.value))}
              style={{ width: 80, accentColor: '#b794f4', cursor: 'pointer' }}
            />
          </div>
        )}

        {/* Spotify */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {spotifyUrl ? (
            <iframe
              src={spotifyUrl}
              width="240" height="52" frameBorder="0"
              allow="encrypted-media"
              style={{ borderRadius: 8 }}
            />
          ) : null}
          {!showSpotify && (
            <button
              onClick={() => setShowSpotify(true)}
              style={{
                background: 'rgba(30,215,96,0.15)', border: '1px solid rgba(30,215,96,0.3)',
                borderRadius: 20, padding: '5px 12px',
                fontSize: 11, fontWeight: 500, color: 'rgba(30,215,96,0.85)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <Music size={12} />
              {spotifyUrl ? 'Edit Spotify' : 'Connect Spotify'}
            </button>
          )}
          {showSpotify && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="text"
                value={spotifyInput}
                onChange={e => setSpotifyInput(e.target.value)}
                placeholder="https://open.spotify.com/embed/playlist/..."
                style={{
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8, padding: '5px 10px', fontSize: 11,
                  color: '#fff', outline: 'none', width: 280,
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
              />
              <button
                onClick={saveSpotify}
                style={{
                  background: 'rgba(30,215,96,0.2)', border: '1px solid rgba(30,215,96,0.4)',
                  borderRadius: 8, padding: '5px 10px', fontSize: 11,
                  color: 'rgba(30,215,96,0.9)', cursor: 'pointer',
                }}
              >
                Save
              </button>
              <button
                onClick={() => setShowSpotify(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 11 }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
