export default function DailyGoals({ tasks, onTaskToggle }) {
  const done = tasks.filter(t => t.done).length
  const total = tasks.length
  const pct = total === 0 ? 0 : (done / total) * 100
  const allDone = done === total && total > 0

  return (
    <div className="bg-[#13121e] border border-[#1e1d2e] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-medium text-[#4a4860] uppercase tracking-widest">Daily Goals</p>
        <span className={`text-[12px] font-semibold tabular-nums ${allDone ? 'text-emerald-400' : 'text-[#4a4860]'}`}>
          {done} / {total}
        </span>
      </div>

      <div className="h-0.75 rounded-full bg-[#1e1d2e] mb-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: allDone ? '#34d399' : '#7c6ef5' }}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        {tasks.map(task => (
          <label key={task.id} className="flex items-start gap-3 cursor-pointer group">
            <div className="mt-0.5 shrink-0">
              <input type="checkbox" checked={task.done} onChange={() => onTaskToggle(task.id)} className="sr-only" />
              <div className={`w-4.5 h-4.5 rounded-[5px] border flex items-center justify-center transition-all ${
                task.done
                  ? 'bg-[#7c6ef5] border-[#7c6ef5]'
                  : 'border-[#2a2945] group-hover:border-[#7c6ef5]/50'
              }`}>
                {task.done && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className={`text-[13px] leading-snug transition-colors ${
              task.done ? 'line-through text-[#32304e]' : 'text-[#c5c3d8] group-hover:text-white'
            }`}>
              {task.label}
            </span>
          </label>
        ))}
      </div>

      {allDone && (
        <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
          <span className="text-emerald-400 text-sm">✓</span>
          <span className="text-[12px] text-emerald-400 font-medium">All done — streak extended! 🔥</span>
        </div>
      )}
    </div>
  )
}
