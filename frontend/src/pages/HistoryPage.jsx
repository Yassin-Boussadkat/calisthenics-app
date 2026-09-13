import { useEffect, useState } from 'react'
import { getMyLogs } from '../api/workoutLogs'
import { getMySchedule } from '../api/scheduledWorkouts'
import Navbar from '../components/Navbar'

const DAY_KEYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
const DAY_LABELS = {
    MONDAY: 'Maandag', TUESDAY: 'Dinsdag', WEDNESDAY: 'Woensdag', THURSDAY: 'Donderdag',
    FRIDAY: 'Vrijdag', SATURDAY: 'Zaterdag', SUNDAY: 'Zondag',
}

function dayKeyForDateString(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number)
    const jsDay = new Date(y, m - 1, d).getDay()
    return DAY_KEYS[jsDay === 0 ? 6 : jsDay - 1]
}

export default function HistoryPage() {
    const [logs, setLogs] = useState([])
    const [schedule, setSchedule] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        Promise.all([getMyLogs(), getMySchedule()])
            .then(([logsData, scheduleData]) => {
                setLogs(logsData)
                setSchedule(scheduleData)
            })
            .catch(() => setError('Kon geschiedenis niet laden.'))
    }, [])

    const dates = [...new Set(logs.map((l) => l.date))].sort((a, b) => (a < b ? 1 : -1))

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="mx-auto max-w-3xl px-6 py-10">
                <h1 className="mb-1 font-display text-3xl text-paper">Geschiedenis</h1>
                <p className="mb-8 text-sm text-mute">Planning naast wat je daadwerkelijk hebt gedaan.</p>

                {error && (
                    <p className="mb-6 border border-power/30 bg-power-dim px-3 py-2 text-sm text-power">{error}</p>
                )}

                {dates.length === 0 ? (
                    <p className="border border-dashed border-line px-4 py-8 text-center text-sm text-mute">
                        Nog geen voltooide workouts. Start er een via je agenda.
                    </p>
                ) : (
                    <div className="space-y-6">
                        {dates.map((date) => {
                            const dayKey = dayKeyForDateString(date)
                            const plannedForDay = schedule.filter((s) => s.dayOfWeek === dayKey)
                            const logsForDate = logs.filter((l) => l.date === date)

                            const rows = plannedForDay.map((item) => {
                                const match = logsForDate.find((l) => l.exercise?.id === item.exercise?.id)
                                return { exerciseName: item.exercise?.name, target: item, actual: match }
                            })

                            const extraLogs = logsForDate.filter(
                                (l) => !plannedForDay.some((p) => p.exercise?.id === l.exercise?.id)
                            )

                            const completed = rows.filter((r) => r.actual).length
                            const percentage = rows.length > 0 ? Math.round((completed / rows.length) * 100) : null

                            return (
                                <div key={date} className="border border-line bg-panel p-5">
                                    <div className="mb-4 flex items-baseline justify-between">
                                        <div>
                                            <p className="font-medium text-paper">{DAY_LABELS[dayKey]}</p>
                                            <p className="text-xs text-mute">{date}</p>
                                        </div>
                                        {percentage !== null && (
                                            <span className={`font-display text-xl ${percentage === 100 ? 'text-power' : 'text-paper'}`}>
                        {percentage}%
                      </span>
                                        )}
                                    </div>

                                    <ul className="space-y-2">
                                        {rows.map((row, i) => (
                                            <li key={i} className="flex items-center justify-between text-sm">
                        <span className={row.actual ? 'text-paper' : 'text-mute'}>
                          {row.actual ? '✓ ' : '— '}
                            {row.exerciseName}
                        </span>
                                                <span className="text-xs text-mute">
                          gepland {row.target.targetSets}×{row.target.targetReps}
                                                    {row.actual && (
                                                        <> · gedaan {row.actual.sets}×{row.actual.reps}
                                                            {row.actual.weightInKg > 0 ? ` @ ${row.actual.weightInKg}kg` : ''}
                                                        </>
                                                    )}
                        </span>
                                            </li>
                                        ))}
                                        {extraLogs.map((log) => (
                                            <li key={log.id} className="flex items-center justify-between text-sm">
                                                <span className="text-paper">+ {log.exercise?.name}</span>
                                                <span className="text-xs text-mute">
                          {log.sets}×{log.reps}{log.weightInKg > 0 ? ` @ ${log.weightInKg}kg` : ''}
                        </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
