import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMySchedule, createScheduledWorkout, deleteScheduledWorkout } from '../api/scheduledWorkouts'
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
    const [form, setForm] = useState({ exerciseId: '', targetSets: 3, targetReps: 10, targetWeightKg: 0 })

    const todayKey = getTodayKey()
    const todayLabel = DAYS.find((d) => d.key === todayKey).label
    const todaysWorkout = schedule.filter((s) => s.dayOfWeek === todayKey)

    const completedToday =
        todaysWorkout.length > 0 &&
        todaysWorkout.every((item) =>
            todaysLogs.some((log) => log.exercise?.id === item.exercise?.id)
        )

    useEffect(() => {
        loadAll()
    }, [])

    function loadAll() {
        Promise.all([getMySchedule(), getMyLogs(), getExercises()])
            .then(([scheduleData, logsData, exercisesData]) => {
                setSchedule(scheduleData)
                setTodaysLogs(logsData.filter((l) => l.date === todayDateString()))
                setExercises(exercisesData)
            })
            .catch(() => setError('Kon agenda niet laden.'))
    }

    async function handleAdd(dayKey) {
        if (!form.exerciseId) return
        try {
            await createScheduledWorkout(
                Number(form.exerciseId), dayKey, form.targetSets, form.targetReps, form.targetWeightKg
            )
            setAddingFor(null)
            setForm({ exerciseId: '', targetSets: 3, targetReps: 10, targetWeightKg: 0 })
            loadAll()
        } catch (err) {
            setError(err.response?.data?.message || 'Toevoegen mislukt.')
        }
    }

    async function handleRemove(id) {
        await deleteScheduledWorkout(id)
        loadAll()
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="mx-auto max-w-5xl px-6 py-10">
                <h1 className="mb-1 font-display text-3xl text-paper">Agenda</h1>
                <p className="mb-8 text-sm text-mute">Bouw je eigen weekplanning, oefening voor oefening.</p>

                {error && (
                    <p className="mb-6 border border-power/30 bg-power-dim px-3 py-2 text-sm text-power">{error}</p>
                )}

                <div className="mb-10 border border-line bg-panel p-6">
                    <p className="mb-1 text-xs uppercase tracking-wide text-mute">Vandaag · {todayLabel}</p>
                    {todaysWorkout.length === 0 ? (
                        <p className="mt-2 font-display text-2xl text-paper">Rustdag</p>
                    ) : (
                        <>
                            <ul className="mt-3 mb-5 space-y-1">
                                {todaysWorkout.map((item) => (
                                    <li key={item.id} className="text-paper">
                                        {item.exercise?.name}{' '}
                                        <span className="text-sm text-mute">
                      — {item.targetSets}×{item.targetReps}
                                            {item.targetWeightKg > 0 ? ` @ ${item.targetWeightKg}kg` : ''}
                    </span>
                                    </li>
                                ))}
                            </ul>
                            {completedToday ? (
                                <p className="border border-power/30 bg-power-dim px-4 py-2.5 text-sm text-power">
                                    ✓ Je hebt de training van vandaag al gedaan.
                                </p>
                            ) : (
                                <Link
                                    to="/workout"
                                    className="inline-block bg-power px-5 py-2.5 text-sm font-medium text-ink hover:opacity-90"
                                >
                                    Start workout
                                </Link>
                            )}
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-7">
                    {DAYS.map((day) => {
                        const items = schedule.filter((s) => s.dayOfWeek === day.key)
                        const isToday = day.key === todayKey

                        return (
                            <div key={day.key} className="bg-ink p-4">
                                <p className={`mb-3 text-sm font-medium ${isToday ? 'text-power' : 'text-paper'}`}>
                                    {day.label}
                                </p>

                                <ul className="mb-3 space-y-2">
                                    {items.length === 0 && <li className="text-xs text-mute">Nog geen oefeningen</li>}
                                    {items.map((item) => (
                                        <li key={item.id} className="flex items-start justify-between gap-2">
                      <span className="text-sm text-paper">
                        {item.exercise?.name}
                          <br />
                        <span className="text-xs text-mute">
                          {item.targetSets}×{item.targetReps}
                            {item.targetWeightKg > 0 ? ` @ ${item.targetWeightKg}kg` : ''}
                        </span>
                      </span>
                                            <button onClick={() => handleRemove(item.id)} className="text-xs text-mute hover:text-power">×</button>
                                        </li>
                                    ))}
                                </ul>

                                {addingFor === day.key ? (
                                    <div>
                                        <select
                                            value={form.exerciseId}
                                            onChange={(e) => setForm({ ...form, exerciseId: e.target.value })}
                                            className="mb-2 w-full border border-line bg-panel px-2 py-1.5 text-xs text-paper"
                                        >
                                            <option value="">Kies oefening</option>
                                            {exercises.map((ex) => (
                                                <option key={ex.id} value={ex.id}>{ex.name}</option>
                                            ))}
                                        </select>
                                        <div className="mb-2 flex gap-1">
                                            <div className="w-1/3">
                                                <label className="mb-0.5 block text-[10px] text-mute">Sets</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={form.targetSets}
                                                    onChange={(e) => setForm({ ...form, targetSets: Number(e.target.value) })}
                                                    className="w-full border border-line bg-panel px-2 py-1.5 text-xs text-paper"
                                                />
                                            </div>
                                            <div className="w-1/3">
                                                <label className="mb-0.5 block text-[10px] text-mute">Reps</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={form.targetReps}
                                                    onChange={(e) => setForm({ ...form, targetReps: Number(e.target.value) })}
                                                    className="w-full border border-line bg-panel px-2 py-1.5 text-xs text-paper"
                                                />
                                            </div>
                                            <div className="w-1/3">
                                                <label className="mb-0.5 block text-[10px] text-mute">Kg</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={form.targetWeightKg}
                                                    onChange={(e) => setForm({ ...form, targetWeightKg: Number(e.target.value) })}
                                                    className="w-full border border-line bg-panel px-2 py-1.5 text-xs text-paper"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAdd(day.key)}
                                            className="w-full bg-power py-1.5 text-xs font-medium text-ink hover:opacity-90"
                                        >
                                            Toevoegen
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => setAddingFor(day.key)} className="text-xs text-mute hover:text-paper">
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


