import { useEffect, useState } from 'react'
import { getMyLogs } from '../api/workoutLogs'
import { getMySchedule } from '../api/scheduledWorkouts'
import Navbar from '../components/Navbar'

const DAY_KEYS = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
]

const DAY_LABELS = {
    MONDAY: 'Maandag',
    TUESDAY: 'Dinsdag',
    WEDNESDAY: 'Woensdag',
    THURSDAY: 'Donderdag',
    FRIDAY: 'Vrijdag',
    SATURDAY: 'Zaterdag',
    SUNDAY: 'Zondag',
}

function dayKeyForDateString(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number)
    const jsDay = new Date(y, m - 1, d).getDay()

    return DAY_KEYS[jsDay === 0 ? 6 : jsDay - 1]
}

function calculateExerciseScore(target, actual) {
    if (!actual) return 0

    const targetSets = Number(target.targetSets) || 0
    const targetReps = Number(target.targetReps) || 0
    const targetWeight = Number(target.targetWeightKg) || 0

    const actualSets = Number(actual.sets) || 0
    const actualReps = Number(actual.reps) || 0
    const actualWeight = Number(actual.weightInKg) || 0

    if (targetSets <= 0 || targetReps <= 0) {
        return 0
    }

    const setsScore = (actualSets / targetSets) * 100
    const repsScore = (actualReps / targetReps) * 100

    if (actualWeight > 0) {
        const weightScore =
            targetWeight > 0
                ? (actualWeight / targetWeight) * 100
                : 100 + actualWeight * 2

        return Math.round(
            setsScore * 0.4 +
            repsScore * 0.4 +
            weightScore * 0.2
        )
    }

    return Math.round(
        setsScore * 0.5 +
        repsScore * 0.5
    )
}

function formatWeight(weight) {
    const value = Number(weight) || 0

    if (value <= 0) {
        return 'bodyweight'
    }

    return `+${value} kg`
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

    const dates = [
        ...new Set(logs.map((l) => l.date)),
    ].sort((a, b) => (a < b ? 1 : -1))

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="mx-auto max-w-3xl px-6 py-10">
                <h1 className="mb-1 font-display text-3xl text-paper">
                    Geschiedenis
                </h1>

                <p className="mb-8 text-sm text-mute">
                    Planning naast wat je daadwerkelijk hebt gedaan.
                </p>

                {error && (
                    <p className="mb-6 border border-power/30 bg-power-dim px-3 py-2 text-sm text-power">
                        {error}
                    </p>
                )}

                {dates.length === 0 ? (
                    <p className="border border-dashed border-line px-4 py-8 text-center text-sm text-mute">
                        Nog geen voltooide workouts. Start er een via je agenda.
                    </p>
                ) : (
                    <div className="space-y-6">
                        {dates.map((date) => {
                            const dayKey = dayKeyForDateString(date)

                            const plannedForDay = schedule.filter(
                                (s) => s.dayOfWeek === dayKey
                            )

                            const logsForDate = logs.filter(
                                (l) => l.date === date
                            )

                            const rows = plannedForDay.map((item) => {
                                const match = logsForDate.find(
                                    (l) =>
                                        l.exercise?.id ===
                                        item.exercise?.id
                                )

                                return {
                                    exerciseName: item.exercise?.name,
                                    target: item,
                                    actual: match,
                                }
                            })

                            /*
                             * Bereken de gemiddelde workoutscore
                             * over alle geplande oefeningen die
                             * daadwerkelijk zijn uitgevoerd.
                             */
                            const exerciseScores = rows
                                .filter((row) => row.actual)
                                .map((row) =>
                                    calculateExerciseScore(
                                        row.target,
                                        row.actual
                                    )
                                )

                            const percentage =
                                exerciseScores.length > 0
                                    ? Math.round(
                                          exerciseScores.reduce(
                                              (sum, score) =>
                                                  sum + score,
                                              0
                                          ) /
                                              exerciseScores.length
                                      )
                                    : null

                            const completedCount = rows.filter(
                                (row) => row.actual
                            ).length

                            return (
                                <div
                                    key={date}
                                    className="border border-line bg-panel p-5"
                                >
                                    {/* Header */}
                                    <div className="mb-5 flex items-baseline justify-between">
                                        <div>
                                            <p className="font-medium text-paper">
                                                {DAY_LABELS[dayKey]}
                                            </p>

                                            <p className="text-xs text-mute">
                                                {date}
                                            </p>
                                        </div>

                                        {percentage !== null && (
                                            <div className="group relative">
                                                <span
                                                    className={`cursor-help font-display text-xl ${
    percentage >= 100
        ? 'text-power'
        : 'text-paper'
}`}
                                                >
                                                    {percentage}%
                                                </span>

                                                {/* Tooltip */}
                                                <div className="pointer-events-none absolute right-0 top-full z-20 mt-2 w-72 rounded border border-line bg-ink p-4 text-xs text-mute opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                                                    <p className="mb-2 font-medium text-paper">
                                                        Workout score
                                                    </p>

                                                    <p className="mb-3">
                                                        Je score vergelijkt
                                                        je daadwerkelijke
                                                        prestatie met je
                                                        geplande workout.
                                                    </p>

                                                    <div className="space-y-1">
                                                        <p>
                                                            <span className="text-paper">
                                                                Bodyweight:
                                                            </span>{' '}
                                                            sets 50% + reps
                                                            50%
                                                        </p>

                                                        <p>
                                                            <span className="text-paper">
                                                                Added weight:
                                                            </span>{' '}
                                                            sets 40% + reps
                                                            40% + gewicht 20%
                                                        </p>
                                                    </div>

                                                    <p className="mt-3 border-t border-line pt-3">
                                                        Meer sets, reps of
                                                        added weight dan
                                                        gepland kan je score
                                                        boven 100% brengen.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Summary */}
                                    {percentage !== null && (
                                        <div className="mb-6 grid grid-cols-2 gap-3">
                                            <div className="border border-line bg-ink p-3">
                                                <p className="mb-1 text-[10px] uppercase tracking-wide text-mute">
                                                    Oefeningen
                                                </p>

                                                <p className="font-display text-lg text-paper">
                                                    {completedCount}/{rows.length}
                                                </p>
                                            </div>

                                            <div className="border border-line bg-ink p-3">
                                                <p className="mb-1 text-[10px] uppercase tracking-wide text-mute">
                                                    Workout score
                                                </p>

                                                <p
                                                    className={`font-display text-lg ${
    percentage >= 100
        ? 'text-power'
        : 'text-paper'
}`}
                                                >
                                                    {percentage}%
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Exercises */}
                                    <ul className="space-y-3">
                                        {rows.map((row, i) => {
                                            const targetSets =
                                                Number(
                                                    row.target.targetSets
                                                ) || 0

                                            const targetReps =
                                                Number(
                                                    row.target.targetReps
                                                ) || 0

                                            const targetWeight =
                                                Number(
                                                    row.target.targetWeightKg
                                                ) || 0

                                            const actualSets =
                                                Number(
                                                    row.actual?.sets
                                                ) || 0

                                            const actualReps =
                                                Number(
                                                    row.actual?.reps
                                                ) || 0

                                            const actualWeight =
                                                Number(
                                                    row.actual?.weightInKg
                                                ) || 0

                                            const exerciseScore =
                                                row.actual
                                                    ? calculateExerciseScore(
                                                          row.target,
                                                          row.actual
                                                      )
                                                    : 0

                                            return (
                                                <li
                                                    key={i}
                                                    className="border-t border-line pt-3"
                                                >
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span
                                                            className={
                                                                row.actual
                                                                    ? 'font-medium text-paper'
                                                                    : 'text-mute'
                                                            }
                                                        >
                                                            {row.actual
                                                                ? '✓ '
                                                                : '— '}
                                                            {row.exerciseName}
                                                        </span>

                                                        {row.actual && (
                                                            <span
                                                                className={`text-xs ${
    exerciseScore >=
    100
        ? 'text-power'
        : 'text-mute'
}`}
                                                            >
                                                                {exerciseScore}%
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        {/* Gepland */}
                                                        <div className="bg-ink p-3">
                                                            <p className="mb-1 text-[10px] uppercase tracking-wide text-mute">
                                                                Gepland
                                                            </p>

                                                            <p className="text-sm text-paper">
                                                                {targetSets} ×{' '}
                                                                {targetReps}
                                                            </p>

                                                            <p className="mt-1 text-xs text-mute">
                                                                {formatWeight(
                                                                    targetWeight
                                                                )}
                                                            </p>
                                                        </div>

                                                        {/* Gedaan */}
                                                        <div className="bg-ink p-3">
                                                            <p className="mb-1 text-[10px] uppercase tracking-wide text-mute">
                                                                Gedaan
                                                            </p>

                                                            {row.actual ? (
                                                                <>
                                                                    <p className="text-sm text-paper">
                                                                        {
                                                                            actualSets
                                                                        }{' '}
                                                                        ×{' '}
                                                                        {
                                                                            actualReps
                                                                        }
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-mute">
                                                                        {formatWeight(
                                                                            actualWeight
                                                                        )}
                                                                    </p>
                                                                </>
                                                            ) : (
                                                                <p className="text-xs text-mute">
                                                                    Niet
                                                                    uitgevoerd
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
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

