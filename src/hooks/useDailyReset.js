import { useEffect } from 'react'

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

function buildReset(goals) {
  return {
    date: todayString(),
    quests: goals.map(g => ({ id: g.id, label: g.label, xp: g.xp || 20, done: false })),
    poms: 0,
  }
}

export function useDailyReset(todayData, goals, setTodayData) {
  function checkAndReset() {
    const today = todayString()
    if (todayData.date !== today) {
      const reset = buildReset(goals)
      setTodayData(reset)
      localStorage.setItem('study_hub_today', JSON.stringify(reset))
    }
  }

  useEffect(() => {
    checkAndReset()

    function onVisible() {
      if (document.visibilityState === 'visible') checkAndReset()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [todayData.date])
}
