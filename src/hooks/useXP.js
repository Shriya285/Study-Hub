import { useState, useCallback } from 'react'
import { XP_LEVELS } from '../constants/defaults'

export function calcLevel(xp) {
  let level = 1
  for (const l of XP_LEVELS) {
    if (xp >= l.threshold) level = l.level
  }
  return level
}

export function getLevelInfo(xp) {
  const level = calcLevel(xp)
  const currentLevel = XP_LEVELS.find(l => l.level === level) ?? XP_LEVELS[0]
  const nextLevel = XP_LEVELS.find(l => l.level === level + 1)

  const currentThreshold = currentLevel.threshold
  const nextThreshold = nextLevel?.threshold ?? currentThreshold + 200

  const xpInLevel = xp - currentThreshold
  const xpToNext = nextThreshold - currentThreshold
  const progress = Math.min(1, Math.max(0, xpInLevel / xpToNext))

  return {
    level,
    title: currentLevel.title,
    xpInLevel,
    xpToNext,
    progress,
    isMaxLevel: !nextLevel,
  }
}

function loadXP() {
  const s = localStorage.getItem('study_hub_xp')
  return s ? JSON.parse(s) : { xp: 0 }
}

export function useXP() {
  const [data, setData] = useState(loadXP)
  const [leveledUp, setLeveledUp] = useState(false)

  const addXP = useCallback((amount) => {
    setData(prev => {
      const oldLevel = calcLevel(prev.xp)
      const newXP = prev.xp + amount
      const newLevel = calcLevel(newXP)
      const updated = { xp: newXP }
      localStorage.setItem('study_hub_xp', JSON.stringify(updated))
      if (newLevel > oldLevel) setLeveledUp(true)
      return updated
    })
  }, [])

  const subtractXP = useCallback((amount) => {
    setData(prev => {
      const newXP = Math.max(0, prev.xp - amount)
      const updated = { xp: newXP }
      localStorage.setItem('study_hub_xp', JSON.stringify(updated))
      return updated
    })
  }, [])

  const resetXP = useCallback(() => {
    localStorage.removeItem('study_hub_xp')
    setData({ xp: 0 })
    setLeveledUp(false)
  }, [])

  const clearLevelUp = useCallback(() => setLeveledUp(false), [])

  return { xp: data.xp, leveledUp, addXP, subtractXP, resetXP, clearLevelUp, ...getLevelInfo(data.xp) }
}
