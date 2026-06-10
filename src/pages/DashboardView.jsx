import HeroBanner from '../components/HeroBanner'
import DailyQuests from '../components/DailyQuests'
import Trophies from '../components/Trophies'
import QuickLaunch from '../components/QuickLaunch'
import { Flame, Clock3, Zap, Coffee } from 'lucide-react'

function StatCard({ icon: Icon, label, value, grad, iconBg }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-white/60 p-5 flex flex-col gap-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: iconBg }}
      >
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="font-bold text-[28px] text-[#1a1240] leading-none">{value}</p>
        <p className="text-[12px] font-semibold text-[#9b8bbd] mt-1">{label}</p>
      </div>
    </div>
  )
}

export default function DashboardView({ settings, todayData, onQuestToggle, xpProps, trophies, streak, daysLeft }) {
  const { xp, level, title, xpInLevel, xpToNext, progress, leveledUp } = xpProps
  const pct = Math.round(progress * 100)
  const d = new Date()
  const greeting = d.getHours() < 12 ? 'Good morning' : d.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-7 flex flex-col gap-6">

        {/* Greeting */}
        <div>
          <h1 className="font-bold text-[28px] text-[#1a1240] leading-tight">
            {greeting}, <span style={{ color: '#7c3aed' }}>{settings.name || 'there'}</span>! ✨
          </h1>
          <p className="text-[14px] text-[#9b8bbd] mt-1">
            {d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Hero Banner */}
        <HeroBanner schedule={settings.schedule} />

        {/* Stats row — 4 compact cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard icon={Flame} label="Day streak" value={streak} iconBg="linear-gradient(135deg, #f97316, #ea580c)" />
          <StatCard icon={Clock3} label="Days left" value={daysLeft} iconBg="linear-gradient(135deg, #8b5cf6, #7c3aed)" />
          <StatCard icon={Zap} label="Total XP" value={xp} iconBg="linear-gradient(135deg, #eab308, #ca8a04)" />
          <StatCard icon={Coffee} label="Poms today" value={todayData.poms} iconBg="linear-gradient(135deg, #10b981, #059669)" />
        </div>

        {/* XP bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-white/60 p-5">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${leveledUp ? 'animate-level-up' : ''}`}
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
            >
              <span className="text-white font-bold text-[18px]">{level}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[16px] text-[#1a1240]">{title}</span>
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: '#ede9fe', color: '#6d28d9' }}
                  >
                    Level {level}
                  </span>
                </div>
                <span className="font-mono text-[12px] text-[#9b8bbd]">{xpInLevel} / {xpToNext} XP</span>
              </div>
              <div className="h-3 bg-[#f0e8ff] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #7c3aed, #f59e0b)' }}
                />
              </div>
              <p className="text-[11px] text-[#c4b0e0] mt-1">{pct}% to next level</p>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <DailyQuests quests={todayData.quests} onQuestToggle={onQuestToggle} />
          </div>
          <div className="flex flex-col gap-4">
            <Trophies trophies={trophies} />
            <QuickLaunch resources={settings.resources} />
          </div>
        </div>

      </div>
    </div>
  )
}
