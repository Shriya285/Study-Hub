import { useState, useEffect } from 'react'

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

function nowMinutes() {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

export function useCurrentBlock(schedule) {
  const [result, setResult] = useState(() => compute(schedule))

  useEffect(() => {
    setResult(compute(schedule))
    const id = setInterval(() => setResult(compute(schedule)), 30_000)
    return () => clearInterval(id)
  }, [schedule])

  return result
}

function compute(schedule) {
  if (!schedule || schedule.length === 0) return { current: null, next: null, status: 'empty' }

  const now = nowMinutes()
  const firstStart = timeToMinutes(schedule[0].start)
  const lastEnd = timeToMinutes(schedule[schedule.length - 1].end)

  if (now < firstStart) return { current: null, next: schedule[0], status: 'before' }
  if (now >= lastEnd) return { current: null, next: null, status: 'after' }

  let current = null
  let next = null

  for (let i = 0; i < schedule.length; i++) {
    const start = timeToMinutes(schedule[i].start)
    const end = timeToMinutes(schedule[i].end)
    if (now >= start && now < end) {
      current = schedule[i]
      next = schedule[i + 1] || null
      break
    }
  }

  return { current, next, status: 'active' }
}
