import { useEffect } from 'react'

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

export function useDailyReset(todayData, goals, setTodayData) {
  useEffect(() => {
    const today = todayString()
    if (todayData.date !== today) {
      const reset = {
        date: today,
        quests: goals.map(g => ({ id: g.id, label: g.label, xp: g.xp || 20, done: false })),
        poms: 0,
      }
      setTodayData(reset)
      localStorage.setItem('study_hub_today', JSON.stringify(reset))
    }
  }, []) // only on mount
}
