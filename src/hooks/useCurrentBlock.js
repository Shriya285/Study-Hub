import { useState, useEffect } from 'react'

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

function nowMinutes() {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

// Returns unwrapped [start, end] pairs in minutes that are monotonically increasing,
// so schedules that span past midnight still compare correctly.
function buildUnwrapped(schedule) {
  const result = []
  let prevEnd = -Infinity
  for (const block of schedule) {
    let start = timeToMinutes(block.start)
    let end = timeToMinutes(block.end)
    // If start dropped by more than 60 mins relative to prevEnd, it wrapped midnight
    if (start < prevEnd - 60) start += 1440
    // If end is before start, the block itself spans midnight
    if (end < start) end += 1440
    result.push({ start, end, block })
    prevEnd = end
  }
  return result
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

  const unwrapped = buildUnwrapped(schedule)
  const firstStart = unwrapped[0].start
  const lastEnd = unwrapped[unwrapped.length - 1].end

  let now = nowMinutes()
  // If the schedule extends past midnight and we're currently in the early-morning
  // (past-midnight) portion, add 1440 so the comparison stays valid
  if (lastEnd > 1440 && now < firstStart) now += 1440

  if (now < firstStart) return { current: null, next: schedule[0], status: 'before' }
  if (now >= lastEnd) return { current: null, next: null, status: 'after' }

  let current = null
  let next = null

  for (let i = 0; i < unwrapped.length; i++) {
    const { start, end, block } = unwrapped[i]
    if (now >= start && now < end) {
      current = block
      next = schedule[i + 1] || null
      break
    }
  }

  // In a gap between blocks: find the next upcoming block
  if (!current) {
    for (let i = 0; i < unwrapped.length; i++) {
      if (now < unwrapped[i].start) {
        next = schedule[i]
        break
      }
    }
  }

  return { current, next, status: 'active' }
}
