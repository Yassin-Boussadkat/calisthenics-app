import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    getMySchedule,
    createScheduledWorkout,
    deleteScheduledWorkout,
} from '../api/scheduledWorkouts'
import { getMyLogs } from '../api/workoutLogs'
import { getExercises } from '../api/exercises'
import Navbar from '../components/Navbar'

const DAYS = [
    { key: 'MONDAY', label: 'Maandag' },
    { key: 'TUESDAY', label: 'Dinsdag' },
    { key: 'WEDNESDAY', label: 'Woensdag' },
    { key: 'THURSDAY', label: 'Donderdag' },
    { key: 'FRIDAY', label: 'Vrijdag' },
    { key: 'SATURDAY', label: 'Zaterdag' },
    { key: 'SUNDAY', label: 'Zondag' },
]

function getTodayKey() {
    const jsDay = new Date().getDay()
    return DAYS[jsDay === 0 ? 6 : jsDay - 1].key
}

function todayDateString() {
    const d = new Date()

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function AgendaPage() {
    const [schedule, setSchedule] = useState([])
    const [todaysLogs, setTodaysLogs] = useState([])
    const [exercises, setExercises] = useState([])
    const [error, setError] = useState('')
    const [addingFor, setAddingFor] = useState(null)

    const [form, setForm] = useState({
        exerciseId: '',
        targetSets: '',
        targetReps: '',
        targetWeightKg: '',
    })

    const todayKey = getTodayKey()
    const todayLabel = DAYS.find((d) => d.key === todayKey).label

    const todaysWorkout = schedule.filter(
        (s) => s.dayOfWeek === todayKey
    )

    const completedToday =
        todaysWorkout.length > 0 &&
        todaysWorkout.every((item) =>
            todaysLogs.some(
                (log) => log.exercise?.id === item.exercise?.id
            )
        )

    useEffect(() => {
        loadAll()
    }, [])

    function loadAll() {
        Promise.all([
            getMySchedule(),
            getMyLogs(),
            getExercises(),
        ])
            .then(([scheduleData, logsData, exercisesData]) => {
                setSchedule(scheduleData)

                setTodaysLogs(
                    logsData.filter(
                        (l) => l.date === todayDateString()
                    )
                )

                setExercises(exercisesData)
            })
            .catch(() => setError('Kon agenda niet laden.'))
    }

    async function handleAdd(dayKey) {
        if (
            !form.exerciseId ||
            !form.targetSets ||
            !form.targetReps
        ) {
            return
        }

        try {
            await createScheduledWorkout(
                Number(form.exerciseId),
                dayKey,
                Number(form.targetSets),
                Number(form.targetReps),
                Number(form.targetWeightKg || 0)
            )

            setAddingFor(null)

            setForm({
                exerciseId: '',
                targetSets: '',
                targetReps: '',
                targetWeightKg: '',
            })

            loadAll()
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Toevoegen mislukt.'
            )
        }
    }

    async function handleRemove(id) {
        await deleteScheduledWorkout(id)
        loadAll()
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="mx-auto max-w-6xl px-6 py-10">
                <h1 className="mb-1 font-display text-3xl text-paper">
                    Agenda
                </h1>

                <p className="mb-8 text-sm text-mute">
                    Bouw je eigen weekplanning, oefening voor oefening.
                </p>

                {error && (
                    <p className="mb-6 border border-power/30 bg-power-dim px-3 py-2 text-sm text-power">
                        {error}
                    </p>
                )}

                {/* Vandaag */}
                <div
                    className={`mb-10 border bg-panel p-6 ${
    completedToday
        ? 'border-power/40'
        : 'border-line'
}`}
                >
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <p className="mb-1 text-xs uppercase tracking-wide text-mute">
                                Vandaag · {todayLabel}
                            </p>

                            {todaysWorkout.length === 0 ? (
                                <p className="mt-2 font-display text-2xl text-paper">
                                    Rustdag
                                </p>
                            ) : completedToday ? (
                                <>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-power text-ink">
                                            ✓
                                        </span>

                                        <p className="font-display text-2xl text-power">
                                            Workout voltooid
                                        </p>
                                    </div>

                                    <p className="mt-2 text-sm text-mute">
                                        Goed gewerkt. Rust uit en herstel.
                                    </p>
                                </>
                            ) : (
                                <p className="mt-2 font-display text-2xl text-paper">
                                    Klaar om te trainen?
                                </p>
                            )}
                        </div>

                        {todaysWorkout.length > 0 &&
                            !completedToday && (
                                <Link
                                    to="/workout"
                                    className="shrink-0 bg-power px-5 py-2.5 text-sm font-medium text-ink transition hover:opacity-90"
                                >
                                    Start workout
                                </Link>
                            )}
                    </div>

                    {todaysWorkout.length > 0 && (
                        <ul className="mt-5 space-y-2 border-t border-line pt-4">
                            {todaysWorkout.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex items-center justify-between gap-4 text-paper"
                                >
                                    <span className="min-w-0">
                                        {completedToday && (
                                            <span className="mr-2 text-power">
                                                ✓
                                            </span>
                                        )}

                                        {item.exercise?.name}
                                    </span>

                                    <span className="shrink-0 text-sm text-mute">
                                        {item.targetSets} ×{' '}
                                        {item.targetReps}

                                        {item.targetWeightKg > 0 &&
                                            ` + ${item.targetWeightKg} kg`}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Weekplanning */}
                <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                    {DAYS.map((day) => {
                        const items = schedule.filter(
                            (s) => s.dayOfWeek === day.key
                        )

                        const isToday = day.key === todayKey
                        const isCompleted =
                            isToday && completedToday

                        return (
                            <div
                                key={day.key}
                                className={`min-w-0 bg-ink p-5 ${
    isCompleted
        ? 'bg-power/5'
        : ''
}`}
                            >
                                {/* Dag header */}
                                <div className="mb-4 flex items-center justify-between gap-2">
                                    <p
                                        className={`text-sm font-medium ${
    isToday
        ? 'text-power'
        : 'text-paper'
}`}
                                    >
                                        {day.label}
                                    </p>

                                    {isCompleted && (
                                        <span
                                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-power text-xs font-bold text-ink"
                                            title="Workout voltooid"
                                        >
                                            ✓
                                        </span>
                                    )}
                                </div>

                                {/* Oefeningen */}
                                <ul className="mb-5 space-y-3">
                                    {items.length === 0 && (
                                        <li className="text-xs text-mute">
                                            Nog geen oefeningen
                                        </li>
                                    )}

                                    {items.map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex min-w-0 items-start justify-between gap-2"
                                        >
                                            <span className="min-w-0 break-words text-sm text-paper">
                                                {item.exercise?.name}

                                                <br />

                                                <span className="text-xs text-mute">
                                                    {item.targetSets} ×{' '}
                                                    {item.targetReps}

                                                    {item.targetWeightKg >
                                                        0 &&
                                                        ` + ${item.targetWeightKg} kg`}
                                                </span>
                                            </span>

                                            {!isCompleted && (
                                                <button
                                                    onClick={() =>
                                                        handleRemove(
                                                            item.id
                                                        )
                                                    }
                                                    className="shrink-0 text-xs text-mute transition hover:text-power"
                                                    title="Oefening verwijderen"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                {/* Oefening toevoegen */}
                                {isCompleted ? (
                                    <div className="border-t border-power/20 pt-3 text-xs text-power">
                                        ✓ Workout voltooid
                                    </div>
                                ) : addingFor === day.key ? (
                                    <div className="min-w-0 space-y-3">
                                        {/* Oefening */}
                                        <select
                                            value={form.exerciseId}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    exerciseId:
                                                        e.target.value,
                                                })
                                            }
                                            className="block h-9 w-full min-w-0 border border-line bg-panel px-2 text-sm text-paper outline-none transition focus:border-power"
                                        >
                                            <option value="">
                                                Kies oefening
                                            </option>

                                            {exercises.map((ex) => (
                                                <option
                                                    key={ex.id}
                                                    value={ex.id}
                                                >
                                                    {ex.name}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Sets / Reps / Extra kg */}
                                        <div className="grid w-full grid-cols-3 gap-2">
                                            <div className="min-w-0">
                                                <label className="mb-1 block text-center text-[9px] uppercase tracking-wide text-mute">
                                                    Sets
                                                </label>

                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    placeholder="3"
                                                    value={
                                                        form.targetSets
                                                    }
                                                    onChange={(e) =>
                                                        setForm({
                                                            ...form,
                                                            targetSets:
                                                                e.target.value.replace(
                                                                    /\D/g,
                                                                    ''
                                                                ),
                                                        })
                                                    }
                                                    className="block h-9 w-full border border-line bg-panel px-1 text-center text-sm text-paper placeholder:text-mute/50 outline-none transition focus:border-power"
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <label className="mb-1 block text-center text-[9px] uppercase tracking-wide text-mute">
                                                    Reps
                                                </label>

                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    placeholder="8"
                                                    value={
                                                        form.targetReps
                                                    }
                                                    onChange={(e) =>
                                                        setForm({
                                                            ...form,
                                                            targetReps:
                                                                e.target.value.replace(
                                                                    /\D/g,
                                                                    ''
                                                                ),
                                                        })
                                                    }
                                                    className="block h-9 w-full border border-line bg-panel px-1 text-center text-sm text-paper placeholder:text-mute/50 outline-none transition focus:border-power"
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <label className="mb-1 block whitespace-nowrap text-center text-[9px] uppercase tracking-wide text-mute">
                                                    Extra kg
                                                </label>

                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    placeholder="0"
                                                    value={
                                                        form.targetWeightKg
                                                    }
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value
                                                                .replace(
                                                                    ',',
                                                                    '.'
                                                                )
                                                                .replace(
                                                                    /[^0-9.]/g,
                                                                    ''
                                                                )

                                                        if (
                                                            (
                                                                value.match(
                                                                    /\./g
                                                                ) || []
                                                            ).length <= 1
                                                        ) {
                                                            setForm({
                                                                ...form,
                                                                targetWeightKg:
                                                                    value,
                                                            })
                                                        }
                                                    }}
                                                    className="block h-9 w-full border border-line bg-panel px-1 text-center text-sm text-paper placeholder:text-mute/50 outline-none transition focus:border-power"
                                                />
                                            </div>
                                        </div>

                                        {/* Knoppen */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() =>
                                                    handleAdd(day.key)
                                                }
                                                className="w-full bg-power px-2 py-2 text-xs font-medium text-ink transition hover:opacity-90"
                                            >
                                                Toevoegen
                                            </button>

                                            <button
                                                onClick={() =>
                                                    setAddingFor(null)
                                                }
                                                className="w-full border border-line px-2 py-2 text-xs text-mute transition hover:text-paper"
                                            >
                                                Annuleren
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() =>
                                            setAddingFor(day.key)
                                        }
                                        className="text-xs text-mute transition hover:text-paper"
                                    >
                                        + Oefening toevoegen
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
