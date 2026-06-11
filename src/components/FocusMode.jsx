import { useState, useEffect } from 'react'
import { ArrowLeft, Palette, Play, Pause, RotateCcw, Music } from 'lucide-react'
import { useCurrentBlock } from '../hooks/useCurrentBlock'
import { MODE_LABELS } from '../hooks/useTimer'
import AmbientPlayer from './AmbientPlayer'

const RADIUS = 52
const CIRC = 2 * Math.PI * RADIUS

const SCENES = [
  { id: 'lofi',    label: 'Lofi Night',  img: null },
  { id: 'room',    label: 'Study Room',  img: '/scene-room.jpg' },
  { id: 'balcony', label: 'Balcony',     img: '/scene-balcony.jpg' },
  { id: 'focus',   label: 'Deep Focus',  img: null },
]

const SOUNDS = ['rain', 'cafe', 'forest', 'off']
const SOUND_LABELS = { rain: '🌧 Rain', cafe: '☕ Café', forest: '🌿 Forest', off: '✕ Off' }

const LOFI_STARS = Array.from({ length: 55 }, (_, i) => ({
  x: (i * 137.508) % 100,
  y: 2 + (i * 61.803) % 44,
  r: i % 7 === 0 ? 2.5 : i % 4 === 0 ? 1.5 : 1,
  op: 0.25 + (i % 7) * 0.1,
  dur: 2.2 + (i % 5) * 0.7,
  delay: (i % 8) * 0.35,
}))

const BUILDINGS = [
  { x: 0,    y: 118, w: 68 }, { x: 72,   y: 88,  w: 56 },
  { x: 132,  y: 136, w: 48 }, { x: 184,  y: 76,  w: 64 },
  { x: 252,  y: 102, w: 54 }, { x: 310,  y: 60,  w: 74 },
  { x: 388,  y: 94,  w: 56 }, { x: 448,  y: 120, w: 44 },
  { x: 496,  y: 70,  w: 68 }, { x: 568,  y: 96,  w: 54 },
  { x: 626,  y: 50,  w: 78 }, { x: 708,  y: 80,  w: 58 },
  { x: 770,  y: 110, w: 46 }, { x: 820,  y: 66,  w: 68 },
  { x: 892,  y: 90,  w: 54 }, { x: 950,  y: 46,  w: 80 },
  { x: 1034, y: 76,  w: 58 }, { x: 1096, y: 104, w: 46 },
  { x: 1146, y: 60,  w: 74 }, { x: 1224, y: 90,  w: 54 },
  { x: 1282, y: 114, w: 58 }, { x: 1344, y: 70,  w: 68 },
  { x: 1416, y: 96,  w: 70 },
]

const LOFI_WINDOWS = BUILDINGS.flatMap((b, bi) => {
  const cols = Math.max(1, Math.floor((b.w - 12) / 16))
  const rows = Math.max(1, Math.floor((226 - b.y - 10) / 20))
  const wins = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const seed = bi * 23 + col * 7 + row * 13
      if (seed % 4 === 0) continue
      wins.push({
        x: b.x + 6 + col * 16,
        y: b.y + 12 + row * 20,
        c: ['#f5c842', '#ff9050', '#ffd060', '#ffb870'][seed % 4],
        op: 0.18 + (seed % 6) * 0.07,
      })
    }
  }
  return wins
})

function LofiNightBg({ rain }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <style>{`
        @keyframes lofiTwinkle {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(0.1); }
        }
        @keyframes lofiRain {
          0% { transform: translateY(-60px) translateX(0) rotate(15deg); }
          100% { transform: translateY(110vh) translateX(-8vw) rotate(15deg); }
        }
      `}</style>

      {/* Sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #06041a 0%, #100828 18%, #1c0d38 35%, #2e1050 50%, #44153e 62%, #601a34 72%, #862025 80%, #a83020 87%, #c04828 93%, #d46038 100%)',
      }} />

      {/* Stars */}
      {LOFI_STARS.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.r * 2, height: s.r * 2,
          borderRadius: '50%', background: '#ffffff',
          opacity: s.op,
          animation: `lofiTwinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}

      {/* Moon */}
      <div style={{
        position: 'absolute', top: '7%', right: '13%',
        width: 54, height: 54, borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 32%, #fffaee, #f5e8c0)',
        boxShadow: '0 0 20px 5px rgba(245,218,140,0.3), 0 0 55px 18px rgba(240,160,60,0.1)',
      }} />

      {/* Horizon glow */}
      <div style={{
        position: 'absolute',
        bottom: '20%', left: 0, right: 0, height: 140,
        background: 'radial-gradient(ellipse 70% 100% at 50% 100%, rgba(190,70,25,0.32) 0%, rgba(150,45,15,0.14) 45%, transparent 100%)',
      }} />

      {/* Distant mountains */}
      <svg style={{ position: 'absolute', bottom: '19%', left: 0, right: 0, width: '100%' }}
        viewBox="0 0 1440 180" preserveAspectRatio="none">
        <path d="M0,180 L0,112 C90,112 145,52 205,74 C265,96 315,38 378,56 C441,74 494,28 555,48 C616,68 668,33 730,52 C792,71 845,24 908,46 C971,68 1020,38 1082,60 C1144,82 1192,44 1255,66 C1318,88 1380,54 1440,72 L1440,180 Z" fill="#0c0921" />
        <path d="M0,180 L0,132 C110,132 175,84 248,102 C321,120 375,68 448,88 C521,108 574,64 648,84 C722,104 776,70 850,88 C924,106 978,66 1052,86 C1126,106 1185,76 1258,94 C1331,112 1390,82 1440,94 L1440,180 Z" fill="#0e0b24" />
      </svg>

      {/* City skyline + windows */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%' }}
        viewBox="0 0 1440 240" preserveAspectRatio="none">
        <rect x="0" y="150" width="1440" height="90" fill="#07051a" />
        {BUILDINGS.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.w} height={240 - b.y} fill="#07051a" />
        ))}
        {LOFI_WINDOWS.map((w, i) => (
          <rect key={i} x={w.x} y={w.y} width={5} height={4} fill={w.c} opacity={w.op} />
        ))}
      </svg>

      {/* Rain */}
      {rain && Array.from({ length: 28 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${(i * 7.3 + 2) % 100}%`, top: '-3%',
          width: 1, height: `${35 + (i % 5) * 12}px`,
          background: 'rgba(160,200,255,0.1)',
          transformOrigin: 'top center',
          animation: `lofiRain ${0.7 + (i % 4) * 0.25}s linear ${(i * 0.09) % 0.9}s infinite`,
        }} />
      ))}
    </div>
  )
}

function getRemaining(endTime) {
  const [h, m] = endTime.split(':').map(Number)
  const end = new Date(); end.setHours(h, m, 0, 0)
  const diff = Math.max(0, Math.floor((end - new Date()) / 60000))
  if (diff === 0) return 'ending now'
  return diff < 60 ? `${diff}m left` : `${Math.floor(diff / 60)}h ${diff % 60}m left`
}

function toEmbedUrl(raw) {
  if (!raw) return ''
  // If user pastes a full <iframe ...> embed code, pull out the src
  const srcMatch = raw.match(/\bsrc=["']([^"']+)["']/)
  const url = srcMatch ? srcMatch[1].trim() : raw.trim()
  const full = url.startsWith('http') ? url : 'https://' + url
  if (full.includes('open.spotify.com/embed')) return full
  try {
    const u = new URL(full)
    if (!u.hostname.includes('spotify.com')) return full
    const path = u.pathname.replace(/^\//, '')
    return `https://open.spotify.com/embed/${path}?utm_source=generator`
  } catch {
    return full
  }
}

function thumbStyle(s) {
  if (s.img) return { backgroundImage: `url(${s.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  if (s.id === 'lofi') return { background: 'linear-gradient(180deg, #07051a 20%, #2e1050 55%, #862025 80%, #d46038 100%)' }
  return { background: 'radial-gradient(#1e1648, #09071a)' }
}

export default function FocusMode({ timer, schedule, pomCount, daysLeft, onClose }) {
  const { current } = useCurrentBlock(schedule)
  const [scene, setScene] = useState(() => localStorage.getItem('study_hub_focus_scene') || 'lofi')
  const [showPicker, setShowPicker] = useState(false)
  const [ambience, setAmbience] = useState(() => localStorage.getItem('study_hub_ambience') || 'off')
  const [volume, setVolume] = useState(() => Number(localStorage.getItem('study_hub_volume') || '50'))
  const [spotifyUrl, setSpotifyUrl] = useState(() => localStorage.getItem('study_hub_spotify_url') || '')
  const [showSpotify, setShowSpotify] = useState(false)
  const [spotifyInput, setSpotifyInput] = useState(() => localStorage.getItem('study_hub_spotify_url') || '')

  const [clockTime, setClockTime] = useState(new Date())

  const { mode, timeLeft, running, setRunning, switchMode, reset, progress } = timer
  const dash = CIRC * progress
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const secs = (timeLeft % 60).toString().padStart(2, '0')
  const activeScene = SCENES.find(s => s.id === scene) || SCENES[0]

  useEffect(() => {
    const id = setInterval(() => setClockTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    function onEsc(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [onClose])

  const clockHH = clockTime.getHours().toString().padStart(2, '0')
  const clockMM = clockTime.getMinutes().toString().padStart(2, '0')
  const clockSS = clockTime.getSeconds().toString().padStart(2, '0')

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
    const clean = toEmbedUrl(spotifyInput.trim())
    setSpotifyUrl(clean)
    setSpotifyInput(clean)
    localStorage.setItem('study_hub_spotify_url', clean)
    setShowSpotify(false)
  }

  const bgStyle = activeScene.id === 'lofi'
    ? { background: '#06041a' }
    : activeScene.img
    ? { backgroundImage: `url(${activeScene.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'radial-gradient(ellipse at 50% 60%, #1e1648 0%, #100e2b 60%, #09071a 100%)' }

  const mutedColor = 'rgba(255,255,255,0.5)'
  const timeColor = '#e0d5ff'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', ...bgStyle }}>
      <AmbientPlayer sound={ambience} volume={volume} />

      {scene === 'lofi' && <LofiNightBg rain={ambience === 'rain'} />}

      {scene === 'focus' && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${(i * 37 + 11) % 100}%`, top: `${(i * 53 + 7) % 100}%`,
              width: i % 5 === 0 ? 3 : 2, height: i % 5 === 0 ? 3 : 2,
              borderRadius: '50%',
              background: i % 3 === 0 ? '#c4a8ff' : 'rgba(196,168,255,0.3)',
              opacity: 0.15 + (i % 7) * 0.08,
            }} />
          ))}
        </div>
      )}

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 20, padding: '6px 14px',
          fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.85)',
        }}>
          {current ? current.label : 'Focus Mode'}
          {current && <span style={{ color: mutedColor, marginLeft: 8 }}>{getRemaining(current.end)}</span>}
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 500,
            color: 'rgba(255,255,255,0.85)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
        >
          <ArrowLeft size={14} /> Back to hub
        </button>
      </div>

      {/* Digital clock widget */}
      <div style={{
        position: 'absolute', top: 68, left: 24,
        background: 'rgba(0,0,0,0.28)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10, padding: '8px 16px',
        display: 'flex', alignItems: 'baseline', gap: 2,
        backdropFilter: 'blur(8px)',
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 28, fontWeight: 300,
          color: 'rgba(255,255,255,0.88)',
          letterSpacing: '0.04em', lineHeight: 1,
        }}>
          {clockHH}:{clockMM}
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 14, fontWeight: 300,
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.04em', marginLeft: 3,
        }}>
          :{clockSS}
        </span>
      </div>

      {/* Centered timer card */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(10,8,24,0.58)', border: '1px solid rgba(255,255,255,0.13)',
        borderRadius: 18, padding: '28px 36px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        minWidth: 240,
      }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
          {Object.entries(MODE_LABELS).map(([key, label]) => (
            <button key={key} onClick={() => switchMode(key)} style={{
              padding: '4px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 500, transition: 'all 0.15s',
              background: mode === key ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: mode === key ? '#ffffff' : mutedColor,
            }}>{label}</button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 150, height: 150 }}>
          <svg width="150" height="150" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
            <defs>
              <linearGradient id="fmGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#c4a8ff" />
                <stop offset="100%" stopColor="#e88d67" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
            <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="url(#fmGrad)" strokeWidth="5" strokeLinecap="round"
              strokeDasharray={`${dash} ${CIRC}`} style={{ transition: 'stroke-dasharray 0.5s linear' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 42, fontWeight: 500, color: timeColor, lineHeight: 1, letterSpacing: '0.03em' }}>
              {mins}:{secs}
            </span>
            <span style={{ fontSize: 11, color: mutedColor, textTransform: 'capitalize' }}>
              {MODE_LABELS[mode].toLowerCase()}
            </span>
          </div>
        </div>

        <p style={{ fontSize: 11, color: mutedColor, margin: 0 }}>
          {pomCount > 0 ? `${pomCount} pomodoro${pomCount !== 1 ? 's' : ''} today` : 'No sessions yet'}
        </p>

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            onClick={() => setRunning(r => !r)}
            style={{
              background: 'linear-gradient(135deg, #b794f4, #e88d67)',
              border: 'none', borderRadius: 10, padding: '9px 24px',
              fontSize: 13, fontWeight: 500, color: '#ffffff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 7, transition: 'opacity 0.15s',
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

      {/* Scene picker button */}
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

      {showPicker && (
        <div style={{
          position: 'absolute', bottom: 120, left: 24,
          display: 'flex', gap: 8,
          background: 'rgba(10,8,24,0.7)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 14, padding: 10,
        }}>
          {SCENES.map(s => (
            <button key={s.id} onClick={() => pickScene(s.id)} style={{
              width: 80, height: 56, borderRadius: 8,
              border: `2px solid ${scene === s.id ? '#b794f4' : 'rgba(255,255,255,0.15)'}`,
              cursor: 'pointer', overflow: 'hidden', position: 'relative', padding: 0,
              ...thumbStyle(s),
            }} title={s.label}>
              <span style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'rgba(0,0,0,0.55)', fontSize: 8, fontWeight: 500,
                color: '#fff', padding: '2px 4px', textAlign: 'center',
              }}>{s.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Spotify player — floats bottom-right above the bar */}
      {spotifyUrl && !showSpotify && (
        <div style={{ position: 'absolute', bottom: 76, right: 24, zIndex: 2 }}>
          <iframe
            src={toEmbedUrl(spotifyUrl)}
            width="300" height="152"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            style={{ borderRadius: 12, display: 'block' }}
          />
        </div>
      )}

      {/* Bottom bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)',
        padding: '16px 24px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {SOUNDS.map(s => (
            <button key={s} onClick={() => pickAmbience(s)} style={{
              padding: '5px 11px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 500, transition: 'all 0.15s',
              background: ambience === s ? 'rgba(196,168,255,0.25)' : 'rgba(255,255,255,0.08)',
              color: ambience === s ? '#d8c4f0' : mutedColor,
              outline: ambience === s ? '1px solid rgba(196,168,255,0.4)' : 'none',
            }}>{SOUND_LABELS[s]}</button>
          ))}
        </div>

        {ambience !== 'off' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Vol</span>
            <input type="range" min="0" max="100" value={volume}
              onChange={e => saveVolume(Number(e.target.value))}
              style={{ width: 80, accentColor: '#b794f4', cursor: 'pointer' }} />
          </div>
        )}

        {/* Spotify connect / edit button — always visible in bar */}
        <div style={{ marginLeft: 'auto' }}>
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
                onKeyDown={e => e.key === 'Enter' && saveSpotify()}
                placeholder="Paste a Spotify URL or full embed code"
                style={{
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8, padding: '5px 10px', fontSize: 11,
                  color: '#fff', outline: 'none', width: 300,
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
              />
              <button onClick={saveSpotify} style={{
                background: 'rgba(30,215,96,0.2)', border: '1px solid rgba(30,215,96,0.4)',
                borderRadius: 8, padding: '5px 10px', fontSize: 11,
                color: 'rgba(30,215,96,0.9)', cursor: 'pointer',
              }}>Save</button>
              <button onClick={() => setShowSpotify(false)} style={{
                background: 'none', border: 'none',
                color: mutedColor, cursor: 'pointer', fontSize: 11,
              }}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
