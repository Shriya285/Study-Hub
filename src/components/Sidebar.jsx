import { LayoutDashboard, Calendar, CheckSquare, Timer, Link2, Settings } from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Today', icon: LayoutDashboard },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'quests', label: 'Quests', icon: CheckSquare },
  { id: 'timer', label: 'Timer', icon: Timer },
  { id: 'links', label: 'Links', icon: Link2 },
]

export default function Sidebar({ activeView, onViewChange, name, streak, daysLeft, level, xpInLevel, xpToNext, progress, leveledUp, onSettingsOpen }) {
  const pct = Math.round(progress * 100)

  return (
    <aside style={{ width: 220, minWidth: 220 }} className="h-screen flex flex-col bg-white border-r border-[#e2d9f8]">

      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
          >
            <span className="text-white font-bold text-[15px]">S</span>
          </div>
          <div>
            <p className="font-bold text-[15px] text-[#1a1240]">Study Hub</p>
            <p className="text-[11px] text-[#9b8bbd] leading-none mt-0.5">{name} 👋</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = activeView === id
          return (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] w-full text-left transition-all text-[14px] font-medium ${
                active
                  ? 'text-white'
                  : 'text-[#7c6fa0] hover:bg-[#f4f0ff] hover:text-[#5b3fa0]'
              }`}
              style={active ? { background: 'linear-gradient(135deg, #7c3aed, #a855f7)' } : {}}
            >
              <Icon size={17} className={active ? 'text-white/90' : 'text-[#b0a0d0]'} />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Stats footer */}
      <div className="p-3 border-t border-[#f0e8ff]">
        {/* Streak + days */}
        <div className="grid grid-cols-2 gap-2 mb-2.5">
          <div className="rounded-[10px] py-2.5 px-3 flex flex-col gap-0.5 text-center" style={{ background: 'linear-gradient(135deg, #fff1e0, #ffe0c0)' }}>
            <span className="text-[18px] font-bold text-[#c45c00] leading-none">{streak}</span>
            <span className="text-[10px] font-medium text-[#e07820]">streak 🔥</span>
          </div>
          <div className="rounded-[10px] py-2.5 px-3 flex flex-col gap-0.5 text-center" style={{ background: 'linear-gradient(135deg, #ede9fe, #ddd5f9)' }}>
            <span className="text-[18px] font-bold text-[#5b3fa0] leading-none">{daysLeft}</span>
            <span className="text-[10px] font-medium text-[#7c5cbf]">days left</span>
          </div>
        </div>

        {/* XP bar */}
        <div className="bg-[#f8f5ff] rounded-[10px] p-3 mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-[#5b3fa0]">Level {level}</span>
            <span className="font-mono text-[10px] text-[#b0a0d0]">{xpInLevel}/{xpToNext}</span>
          </div>
          <div className="h-2.5 bg-[#e8e0f8] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${leveledUp ? 'animate-level-up' : ''}`}
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #7c3aed, #f59e0b)' }}
            />
          </div>
          <p className="text-[10px] text-[#b0a0d0] mt-1 text-right">{pct}% to next</p>
        </div>

        {/* Settings */}
        <button
          onClick={onSettingsOpen}
          className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-[12px] font-medium text-[#9b8bbd] hover:text-[#5b3fa0] hover:bg-[#f4f0ff] transition-colors w-full"
        >
          <Settings size={14} />
          Settings
        </button>
      </div>
    </aside>
  )
}
