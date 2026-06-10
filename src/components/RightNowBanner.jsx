import { useCurrentBlock } from '../hooks/useCurrentBlock'
import PixelMascot from './PixelMascot'

function fmt(time) {
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}

export default function RightNowBanner({ schedule }) {
  const { current, next, status } = useCurrentBlock(schedule)

  if (status === 'before') {
    const firstStart = schedule[0]?.start
    return (
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#1a1928] bg-[#0e0d1a]">
        <div className="w-2 h-2 rounded-full bg-[#3a3858] shrink-0" />
        <div>
          <p className="text-[11px] font-medium text-[#4a4860] uppercase tracking-widest mb-0.5">Waiting to start</p>
          <p className="text-[#8e8ca8] text-sm">
            Schedule begins at{' '}
            <span className="text-white font-medium">{firstStart ? fmt(firstStart) : '8:00 AM'}</span>
          </p>
        </div>
      </div>
    )
  }

  if (status === 'after') {
    return (
      <div className="flex items-center gap-4 px-6 py-4 border-b border-emerald-900/30 bg-emerald-950/20">
        <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_#34d399]" />
        <div>
          <p className="text-[11px] font-medium text-emerald-500 uppercase tracking-widest mb-0.5">All done</p>
          <p className="text-emerald-300 text-sm">Schedule complete — great work today! 🎉</p>
        </div>
      </div>
    )
  }

  if (!current) return null

  const isStudy = !current.isBreak

  return (
    <div className={`flex items-center justify-between px-6 py-5 border-b ${
      isStudy ? 'border-[#1e1535] bg-[#110e1e]' : 'border-[#14211e] bg-[#0d1512]'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
          isStudy ? 'bg-[#7c6ef5] shadow-[0_0_10px_#7c6ef580]' : 'bg-teal-400 shadow-[0_0_10px_#2dd4bf60]'
        }`} />
        <div>
          <p className={`text-[11px] font-medium uppercase tracking-widest mb-1.5 ${
            isStudy ? 'text-[#7c6ef5]' : 'text-teal-400'
          }`}>
            {isStudy ? 'In session' : 'Break time'}
          </p>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-[20px] font-semibold text-white leading-tight">{current.label}</span>
            {current.subtitle && (
              <span className="text-[13px] text-[#8e8ca8]">{current.subtitle}</span>
            )}
          </div>
          {next && (
            <p className="text-xs text-[#4a4860] mt-1.5">
              Up next —{' '}
              <span className="text-[#8e8ca8]">{next.label}</span>
              {' '}at <span className="text-[#8e8ca8]">{fmt(next.start)}</span>
            </p>
          )}
        </div>
      </div>
      <PixelMascot size={5} />
    </div>
  )
}
