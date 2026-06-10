import PomodoroTimer from '../components/PomodoroTimer'

export default function TimerView({ poms, onPomComplete }) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-md mx-auto p-7">
        <div className="mb-6">
          <h1 className="font-bold text-[28px] text-[#1a1240]">Focus Timer</h1>
          <p className="text-[14px] text-[#9b8bbd] mt-1">
            {poms} session{poms !== 1 ? 's' : ''} completed today 🍅
          </p>
        </div>
        <PomodoroTimer pomCount={poms} onPomComplete={onPomComplete} />
      </div>
    </div>
  )
}
