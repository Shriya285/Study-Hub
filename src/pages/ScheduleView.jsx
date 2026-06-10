import LiveTimetable from '../components/LiveTimetable'

export default function ScheduleView({ schedule }) {
  return (
    <div className="h-full overflow-y-auto">
      <LiveTimetable schedule={schedule} />
    </div>
  )
}
