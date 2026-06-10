import DailyQuests from '../components/DailyQuests'
import Trophies from '../components/Trophies'
import { Zap, Star, TrendingUp } from 'lucide-react'

function MiniStat({ icon: Icon, label, value, iconBg }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-white/60 p-5 flex items-center gap-3.5">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: iconBg }}>
        <Icon size={17} className="text-white" />
      </div>
      <div>
        <p className="font-bold text-[24px] text-[#1a1240] leading-none">{value}</p>
        <p className="text-[11px] font-semibold text-[#9b8bbd] mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default function QuestsView({ todayData, onQuestToggle, trophies, xp, level, title }) {
  const earned = (todayData.quests || []).filter(q => q.done).reduce((s, q) => s + q.xp, 0)
  const done = (todayData.quests || []).filter(q => q.done).length
  const questTotal = (todayData.quests || []).length

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-7 flex flex-col gap-6">
        <div>
          <h1 className="font-bold text-[28px] text-[#1a1240]">Daily Quests</h1>
          <p className="text-[14px] text-[#9b8bbd] mt-1">Complete quests to earn XP and extend your streak</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <MiniStat icon={Zap} label="XP today" value={`+${earned}`} iconBg="linear-gradient(135deg, #8b5cf6, #7c3aed)" />
          <MiniStat icon={Star} label="Total XP" value={xp} iconBg="linear-gradient(135deg, #eab308, #ca8a04)" />
          <MiniStat icon={TrendingUp} label={`Done · Lvl ${level}`} value={`${done}/${questTotal}`} iconBg="linear-gradient(135deg, #10b981, #059669)" />
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <DailyQuests quests={todayData.quests || []} onQuestToggle={onQuestToggle} />
          </div>
          <div>
            <Trophies trophies={trophies} />
          </div>
        </div>
      </div>
    </div>
  )
}
