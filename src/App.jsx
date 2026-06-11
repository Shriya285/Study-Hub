import { useState } from 'react'
import { DEFAULT_SCHEDULE, DEFAULT_GOALS, DEFAULT_RESOURCES, DEFAULT_TROPHIES } from './constants/defaults'
import { useDailyReset } from './hooks/useDailyReset'
import { useXP } from './hooks/useXP'
import { useTimer } from './hooks/useTimer'
import Header from './components/Header'
import FocusMode from './components/FocusMode'
import XPBar from './components/XPBar'
import HeroBanner from './components/HeroBanner'
import ScheduleStrip from './components/ScheduleStrip'
import PomodoroTimer from './components/PomodoroTimer'
import DailyQuests from './components/DailyQuests'
import Trophies from './components/Trophies'
import QuickLaunch from './components/QuickLaunch'
import SessionGuide from './components/SessionGuide'
import NotesPanel from './components/NotesPanel'
import ChatBot from './components/ChatBot'
import SettingsDrawer from './components/SettingsDrawer'

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

function timeToMins(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m }
function minsToTime(m) {
  const mm = ((m % 1440) + 1440) % 1440
  return `${String(Math.floor(mm / 60)).padStart(2, '0')}:${String(mm % 60).padStart(2, '0')}`
}

function getSessionSchedule(schedule) {
  if (!schedule?.length) return schedule
  const today = todayString()
  const key = `study_hub_login_${today}`
  let loginStr = localStorage.getItem(key)
  if (!loginStr) {
    const now = new Date()
    loginStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    localStorage.setItem(key, loginStr)
  }
  const offset = timeToMins(loginStr) - timeToMins(schedule[0].start)
  if (offset === 0) return schedule
  return schedule.map(b => ({
    ...b,
    start: minsToTime(timeToMins(b.start) + offset),
    end: minsToTime(timeToMins(b.end) + offset),
  }))
}

function daysFromNow(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

function initSettings() {
  const stored = localStorage.getItem('study_hub_settings')
  if (stored) {
    const parsed = JSON.parse(stored)
    if (!parsed.name) parsed.name = 'Shriya'
    if (!parsed.goals?.[0]?.xp) parsed.goals = DEFAULT_GOALS
    if (!parsed.schedule?.[0]?.icon || parsed.schedule[0]?.end === '08:30') parsed.schedule = DEFAULT_SCHEDULE
    if (!parsed.resources?.[0]?.icon || parsed.resources.length < DEFAULT_RESOURCES.length) parsed.resources = DEFAULT_RESOURCES
    return parsed
  }
  const defaults = {
    name: 'Shriya',
    targetDate: daysFromNow(30),
    schedule: DEFAULT_SCHEDULE,
    goals: DEFAULT_GOALS,
    resources: DEFAULT_RESOURCES,
  }
  localStorage.setItem('study_hub_settings', JSON.stringify(defaults))
  return defaults
}

function initTodayData(goals) {
  const stored = localStorage.getItem('study_hub_today')
  if (stored) {
    const parsed = JSON.parse(stored)
    if (parsed.date === todayString()) {
      if (parsed.tasks && !parsed.quests) {
        parsed.quests = goals.map(g => {
          const old = parsed.tasks.find(t => t.id === g.id)
          return { id: g.id, label: g.label, xp: g.xp || 20, done: old?.done || false }
        })
        delete parsed.tasks
      }
      return parsed
    }
  }
  return {
    date: todayString(),
    quests: goals.map(g => ({ id: g.id, label: g.label, xp: g.xp || 20, done: false })),
    poms: 0,
  }
}

function computeStreak(lastComplete, current) {
  if (!lastComplete) return 0
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yStr = yesterday.toISOString().slice(0, 10)
  const today = todayString()
  return (lastComplete === today || lastComplete === yStr) ? current : 0
}

function initTrophies() {
  const s = localStorage.getItem('study_hub_trophies')
  return s ? JSON.parse(s) : { ...DEFAULT_TROPHIES }
}

export default function App() {
  const [settings, setSettings] = useState(initSettings)
  const [streak, setStreak] = useState(() => {
    const lc = localStorage.getItem('study_hub_last_complete') || ''
    const s = Number(localStorage.getItem('study_hub_streak') || '0')
    return computeStreak(lc, s)
  })
  const [lastComplete, setLastComplete] = useState(
    () => localStorage.getItem('study_hub_last_complete') || ''
  )
  const [todayData, setTodayData] = useState(() => initTodayData(initSettings().goals))
  const [trophies, setTrophies] = useState(initTrophies)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const { level, progress, xpInLevel, xpToNext, leveledUp, addXP, resetXP, clearLevelUp } = useXP()
  const sessionSchedule = getSessionSchedule(settings.schedule)
  const [focusOpen, setFocusOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)

  useDailyReset(todayData, settings.goals, setTodayData)

  const daysLeft = Math.max(0, Math.ceil(
    (new Date(settings.targetDate).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / 86400000
  ))

  function saveSettings(updated) {
    setSettings(updated)
    localStorage.setItem('study_hub_settings', JSON.stringify(updated))
  }

  function saveTodayData(updated) {
    setTodayData(updated)
    localStorage.setItem('study_hub_today', JSON.stringify(updated))
  }

  function onPomComplete() {
    addXP(10)
    saveTodayData({ ...todayData, poms: todayData.poms + 1 })
  }

  const timer = useTimer(onPomComplete)

  function onQuestToggle(questId) {
    const quest = todayData.quests.find(q => q.id === questId)
    if (!quest) return
    const updatedQuests = todayData.quests.map(q =>
      q.id === questId ? { ...q, done: !q.done } : q
    )
    if (!quest.done) addXP(quest.xp)

    const allDone = updatedQuests.every(q => q.done)
    const today = todayString()
    if (allDone && lastComplete !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yStr = yesterday.toISOString().slice(0, 10)
      const newStreak = lastComplete === yStr ? streak + 1 : 1
      setStreak(newStreak)
      setLastComplete(today)
      localStorage.setItem('study_hub_streak', String(newStreak))
      localStorage.setItem('study_hub_last_complete', today)
      const updated = { ...trophies }
      if (!updated.firstDay) updated.firstDay = true
      if (newStreak >= 3 && !updated.streak3) updated.streak3 = true
      if (newStreak >= 7 && !updated.streak7) updated.streak7 = true
      if (newStreak >= 14 && !updated.streak14) updated.streak14 = true
      if (newStreak >= 30 && !updated.streak30) updated.streak30 = true
      setTrophies(updated)
      localStorage.setItem('study_hub_trophies', JSON.stringify(updated))
    }
    saveTodayData({ ...todayData, quests: updatedQuests })
  }

  function onResetStreak() {
    setStreak(0); setLastComplete('')
    localStorage.setItem('study_hub_streak', '0')
    localStorage.removeItem('study_hub_last_complete')
  }

  function saveNoteFromGuide({ subject, title, content }) {
    const now = new Date()
    const note = {
      id: now.getTime().toString(),
      date: todayString(),
      subject, title, content,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }
    const existing = (() => {
      try { return JSON.parse(localStorage.getItem('study_hub_notes') || '[]') }
      catch { return [] }
    })()
    localStorage.setItem('study_hub_notes', JSON.stringify([note, ...existing]))
  }

  function onResetAll() {
    resetXP(); setStreak(0); setLastComplete('')
    setTrophies({ ...DEFAULT_TROPHIES })
    localStorage.removeItem('study_hub_streak')
    localStorage.removeItem('study_hub_last_complete')
    localStorage.removeItem('study_hub_trophies')
    saveTodayData({
      date: todayString(),
      quests: settings.goals.map(g => ({ id: g.id, label: g.label, xp: g.xp || 20, done: false })),
      poms: 0,
    })
  }

  return (
    <div style={{ background: '#fefcfa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '16px 24px 48px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* 1. Header */}
          <Header
            name={settings.name || 'Shriya'}
            streak={streak}
            daysLeft={daysLeft}
            poms={todayData.poms}
            onSettingsOpen={() => setSettingsOpen(true)}
            onFocusOpen={() => setFocusOpen(true)}
            onNotesOpen={() => setNotesOpen(true)}
          />

          {/* 2. XP Bar */}
          <XPBar
            level={level}
            xpInLevel={xpInLevel}
            xpToNext={xpToNext}
            progress={progress}
            leveledUp={leveledUp}
            onLevelUpDone={clearLevelUp}
          />

          {/* 3. Hero Card */}
          <HeroBanner
            schedule={sessionSchedule}
            poms={todayData.poms}
            questsDone={todayData.quests?.filter(q => q.done).length ?? 0}
            questsTotal={todayData.quests?.length ?? 0}
          />

          {/* 4. Schedule Strip */}
          <ScheduleStrip schedule={sessionSchedule} />

          {/* 5. 2-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <PomodoroTimer timer={timer} pomCount={todayData.poms} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <DailyQuests quests={todayData.quests} onQuestToggle={onQuestToggle} />
              <Trophies trophies={trophies} />
            </div>
          </div>

          {/* 6. Quick Launch */}
          <QuickLaunch resources={settings.resources} />

          {/* 7. Session Guide */}
          <SessionGuide
            schedule={sessionSchedule}
            daysLeft={daysLeft}
            onSaveNote={saveNoteFromGuide}
            onOpenNotes={() => setNotesOpen(true)}
          />

        </div>
      </div>

      {focusOpen && (
        <FocusMode
          timer={timer}
          schedule={sessionSchedule}
          pomCount={todayData.poms}
          daysLeft={daysLeft}
          onClose={() => setFocusOpen(false)}
        />
      )}

      <NotesPanel
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
        schedule={sessionSchedule}
      />

      <ChatBot
        schedule={sessionSchedule}
        questsDone={todayData.quests?.filter(q => q.done).length ?? 0}
        questsTotal={todayData.quests?.length ?? 0}
        pomCount={todayData.poms}
        daysLeft={daysLeft}
      />

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={saveSettings}
        onResetStreak={onResetStreak}
        onResetAll={onResetAll}
      />
    </div>
  )
}
