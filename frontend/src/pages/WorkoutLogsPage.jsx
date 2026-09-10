import { useEffect, useState } from 'react'
import { getMyLogs, createLog, deleteLog } from '../api/workoutLogs'
import { getExercises } from '../api/exercises'
import Navbar from '../components/Navbar'

export default function WorkoutLogsPage() {
    const [logs, setLogs] = useState([])
    const [exercises, setExercises] = useState([])
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        exerciseId: '',
        date: new Date().toISOString().split('T')[0],
        sets: 3,
        reps: 10,
        weightInKg: 0,
        notes: '',
    })

    useEffect(() => {
        loadLogs()
        getExercises().then(setExercises).catch(() => {})
    }, [])

    function loadLogs() {
        getMyLogs().then(setLogs).catch(() => setError('Kon logs niet laden.'))
    }

    async function handleCreate(e) {
        e.preventDefault()
        setError('')
        try {
            await createLog({ ...form, exerciseId: Number(form.exerciseId) })
            setShowForm(false)
            loadLogs()
        } catch (err) {
            setError(err.response?.data?.message || 'Aanmaken mislukt.')
        }
    }

    async function handleDelete(id) {
        await deleteLog(id)
        loadLogs()
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="mx-auto max-w-3xl px-6 py-10">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h1 className="font-display text-3xl text-paper">Mijn logs</h1>
                        <p className="text-sm text-mute">{logs.length} sessies vastgelegd</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="border border-line px-4 py-2 text-sm text-paper hover:border-mute"
                    >
                        {showForm ? 'Annuleren' : '+ Nieuwe log'}
                    </button>
                </div>

                {error && (
                    <p className="mb-4 border border-power/30 bg-power-dim px-3 py-2 text-sm text-power">{error}</p>
                )}

                {showForm && (
                    <form onSubmit={handleCreate} className="mb-8 border border-line bg-panel p-5">
                        <select
                            value={form.exerciseId}
                            onChange={(e) => setForm({ ...form, exerciseId: e.target.value })}
                            className="mb-3 w-full border border-line bg-ink px-3 py-2 text-paper"
                            required
                        >
                            <option value="">Kies een oefening</option>
                            {exercises.map((ex) => (
                                <option key={ex.id} value={ex.id}>{ex.name}</option>
                            ))}
                        </select>

                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="mb-3 w-full border border-line bg-ink px-3 py-2 text-paper"
                            required
                        />

                        <div className="mb-3 grid grid-cols-3 gap-2">
                            <div>
                                <label className="mb-1 block text-xs text-mute">Sets</label>
                                <input
                                    type="number"
                                    value={form.sets}
                                    onChange={(e) => setForm({ ...form, sets: Number(e.target.value) })}
                                    className="w-full border border-line bg-ink px-3 py-2 text-paper"
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-mute">Reps</label>
                                <input
                                    type="number"
                                    value={form.reps}
                                    onChange={(e) => setForm({ ...form, reps: Number(e.target.value) })}
                                    className="w-full border border-line bg-ink px-3 py-2 text-paper"
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-mute">Gewicht (kg)</label>
                                <input
                                    type="number"
                                    value={form.weightInKg}
                                    onChange={(e) => setForm({ ...form, weightInKg: Number(e.target.value) })}
                                    className="w-full border border-line bg-ink px-3 py-2 text-paper"
                                    min="0"
                                />
                            </div>
                        </div>

                        <input
                            placeholder="Notities"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            className="mb-4 w-full border border-line bg-ink px-3 py-2 text-paper outline-none focus:border-mute"
                        />

                        <button type="submit" className="bg-power px-4 py-2 font-medium text-ink hover:opacity-90">
                            Toevoegen
                        </button>
                    </form>
                )}

                {logs.length === 0 ? (
                    <p className="border border-dashed border-line px-4 py-8 text-center text-sm text-mute">
                        Nog geen logs. Voeg je eerste sessie toe hierboven.
                    </p>
                ) : (
                    <ul className="divide-y divide-line border-y border-line">
                        {logs.map((log) => (
                            <li key={log.id} className="flex items-center justify-between py-4">
                                <div>
                                    <p className="font-medium text-paper">{log.exercise?.name}</p>
                                    <p className="text-xs text-mute">{log.date}{log.notes ? ` · ${log.notes}` : ''}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <span className="font-display text-2xl text-paper">{log.sets}×{log.reps}</span>
                                        {log.weightInKg > 0 && (
                                            <span className="ml-2 text-sm text-mute">{log.weightInKg}kg</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(log.id)}
                                        className="text-xs text-mute hover:text-power"
                                    >
                                        Verwijderen
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
