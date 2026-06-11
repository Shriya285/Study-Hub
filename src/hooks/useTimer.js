import { useState, useEffect, useRef } from 'react'

export const DEFAULT_DURATIONS = { focus: 25, break: 5, long: 15 }
export const MODE_LABELS = { focus: 'Focus', break: 'Break', long: 'Long' }
const CIRC = 2 * Math.PI * 50

function requestNotif() {
  if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission()
}
function notify(msg) {
  if ('Notification' in window && Notification.permission === 'granted') new Notification('Study Hub', { body: msg })
}

export function useTimer(onPomComplete) {
  const [mode, setMode] = useState('focus')
  const [durations, setDurations] = useState(DEFAULT_DURATIONS)
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATIONS.focus * 60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)
  const modeRef = useRef(mode)
  const durRef = useRef(durations)
  const onPomRef = useRef(onPomComplete)

  useEffect(() => { requestNotif() }, [])
  useEffect(() => { modeRef.current = mode }, [mode])
  useEffect(() => { durRef.current = durations }, [durations])
  useEffect(() => { onPomRef.current = onPomComplete }, [onPomComplete])

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current)
          setTimeout(() => {
            setRunning(false)
            if (modeRef.current === 'focus') {
              onPomRef.current()
              notify('Focus session done! Take a break. 🎉')
              setMode('break')
              setTimeLeft(durRef.current.break * 60)
            } else {
              notify('Break over — back to it! 💪')
              setMode('focus')
              setTimeLeft(durRef.current.focus * 60)
            }
          }, 0)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running])

  function switchMode(m) {
    clearInterval(intervalRef.current)
    setMode(m); setTimeLeft(durations[m] * 60); setRunning(false)
  }

  function reset() {
    clearInterval(intervalRef.current)
    setRunning(false); setTimeLeft(durations[mode] * 60)
  }

  function updateDuration(m, val) {
    const v = Math.max(1, Math.min(99, Number(val) || 1))
    const updated = { ...durations, [m]: v }
    setDurations(updated)
    if (m === mode && !running) setTimeLeft(v * 60)
  }

  const total = durations[mode] * 60
  const progress = total > 0 ? timeLeft / total : 0
  const dash = CIRC * progress

  return { mode, durations, timeLeft, running, setRunning, switchMode, reset, updateDuration, total, progress, dash }
}
