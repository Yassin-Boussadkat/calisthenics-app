import { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { getMySchedule } from '../api/scheduledWorkouts'
import { createLog } from '../api/workoutLogs'
import Navbar from '../components/Navbar'

const DAY_KEYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

function getTodayKey() {
    const jsDay = new Date().getDay()
    return DAY_KEYS[jsDay === 0 ? 6 : jsDay - 1]
}

function todayDateString() {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function WorkoutPage() {
    const [planned, setPlanned] = useState(null)
    const [results, setResults] = useState({})
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        getMySchedule()
            .then((all) => {
                const todays = all.filter((s) => s.dayOfWeek === getTodayKey())
                setPlanned(todays)
                const initial = {}
                todays.forEach((item) => {
                    initial[item.id] = { sets: item.targetSets, reps: item.targetReps, weightInKg: item.targetWeightKg }
                })
                setResults(initial)
            })
            .catch(() => setError('Kon de planning van vandaag niet laden.'))
    }, [])

    function updateResult(itemId, field, value) {
        setResults((r) => ({ ...r, [itemId]: { ...r[itemId], [field]: value } }))
    }

    async function handleComplete() {
        setSaving(true)
        setError('')
        try {
            const date = todayDateString()
            for (const item of planned) {
                const r = results[item.id]
                await createLog({
                    exerciseId: item.exercise.id,
                    date,
                    sets: r.sets,
                    reps: r.reps,
                    weightInKg: r.weightInKg,
                })
            }
            navigate('/agenda')
        } catch (err) {
            setError(err.response?.data?.message || 'Opslaan mislukt.')
            setSaving(false)
        }
    }

    if (planned === null) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <p className="p-10 text-sm text-mute">Laden...</p>
            </div>
        )
    }


    if (planned.length === 0) {
        return <Navigate to="/agenda" replace />
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="mx-auto max-w-2xl px-6 py-10">
                <h1 className="mb-1 font-display text-3xl text-paper">Workout van vandaag</h1>
                <p className="mb-8 text-sm text-mute">Vul in wat je daadwerkelijk hebt gehaald per oefening.</p>

                {error && (
                    <p className="mb-6 border border-power/30 bg-power-dim px-3 py-2 text-sm text-power">{error}</p>
                )}

                <div className="mb-8 space-y-4">
                    {planned.map((item) => (
                        <div key={item.id} className="border border-line bg-panel p-4">
                            <div className="mb-3 flex items-baseline justify-between">
                                <p className="font-medium text-paper">{item.exercise?.name}</p>
                                <p className="text-xs text-mute">
                                    Gepland: {item.targetSets}×{item.targetReps}
                                    {item.targetWeightKg > 0 ? ` @ ${item.targetWeightKg}kg` : ''}
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="mb-0.5 block text-[10px] text-mute">Sets</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={results[item.id]?.sets ?? 0}
                                        onChange={(e) => updateResult(item.id, 'sets', Number(e.target.value))}
                                        className="w-full border border-line bg-ink px-2 py-1.5 text-sm text-paper"
                                    />
                                </div>
                                <div>
                                    <label className="mb-0.5 block text-[10px] text-mute">Reps</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={results[item.id]?.reps ?? 0}
                                        onChange={(e) => updateResult(item.id, 'reps', Number(e.target.value))}
                                        className="w-full border border-line bg-ink px-2 py-1.5 text-sm text-paper"
                                    />
                                </div>
                                <div>
                                    <label className="mb-0.5 block text-[10px] text-mute">Gewicht (kg)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={results[item.id]?.weightInKg ?? 0}
                                        onChange={(e) => updateResult(item.id, 'weightInKg', Number(e.target.value))}
                                        className="w-full border border-line bg-ink px-2 py-1.5 text-sm text-paper"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleComplete}
                    disabled={saving}
                    className="w-full bg-power py-3 font-medium text-ink hover:opacity-90 disabled:opacity-50"
                >
                    {saving ? 'Bezig met opslaan...' : 'Workout voltooien'}
                </button>
            </div>
        </div>
    )
}
