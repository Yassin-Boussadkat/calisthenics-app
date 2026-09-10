import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getExercises, createExercise, deleteExercise } from '../api/exercises'
import Navbar from '../components/Navbar'

export default function ExercisesPage() {
    const { user } = useAuth()
    const [exercises, setExercises] = useState([])
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        name: '',
        description: '',
        difficultyLevel: 'BEGINNER',
        exerciseType: 'STRENGTH',
        muscleGroups: ['CHEST'],
    })

    useEffect(() => {
        loadExercises()
    }, [])

    function loadExercises() {
        getExercises().then(setExercises).catch(() => setError('Kon oefeningen niet laden.'))
    }

    async function handleCreate(e) {
        e.preventDefault()
        setError('')
        try {
            await createExercise(form)
            setForm({ ...form, name: '', description: '' })
            setShowForm(false)
            loadExercises()
        } catch (err) {
            setError(err.response?.data?.message || 'Aanmaken mislukt.')
        }
    }

    async function handleDelete(id) {
        await deleteExercise(id)
        loadExercises()
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="mx-auto max-w-3xl px-6 py-10">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h1 className="font-display text-3xl text-paper">Oefeningen</h1>
                        <p className="text-sm text-mute">{exercises.length} beschikbaar</p>
                    </div>
                    {user.role === 'ADMIN' && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="border border-line px-4 py-2 text-sm text-paper hover:border-mute"
                        >
                            {showForm ? 'Annuleren' : '+ Nieuwe oefening'}
                        </button>
                    )}
                </div>

                {error && (
                    <p className="mb-4 border border-power/30 bg-power-dim px-3 py-2 text-sm text-power">{error}</p>
                )}

                {showForm && (
                    <form onSubmit={handleCreate} className="mb-8 border border-line bg-panel p-5">
                        <input
                            placeholder="Naam"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="mb-2 w-full border border-line bg-ink px-3 py-2 text-paper outline-none focus:border-mute"
                            required
                        />
                        <input
                            placeholder="Beschrijving"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="mb-3 w-full border border-line bg-ink px-3 py-2 text-paper outline-none focus:border-mute"
                        />
                        <div className="mb-4 flex gap-2">
                            <select
                                value={form.difficultyLevel}
                                onChange={(e) => setForm({ ...form, difficultyLevel: e.target.value })}
                                className="w-full border border-line bg-ink px-3 py-2 text-paper"
                            >
                                <option value="BEGINNER">BEGINNER</option>
                                <option value="INTERMEDIATE">INTERMEDIATE</option>
                                <option value="ADVANCED">ADVANCED</option>
                                <option value="ELITE">ELITE</option>
                            </select>
                            <select
                                value={form.exerciseType}
                                onChange={(e) => setForm({ ...form, exerciseType: e.target.value })}
                                className="w-full border border-line bg-ink px-3 py-2 text-paper"
                            >
                                <option value="SKILL">SKILL</option>
                                <option value="STRENGTH">STRENGTH</option>
                                <option value="CONDITION">CONDITION</option>
                            </select>
                        </div>
                        <button type="submit" className="bg-power px-4 py-2 font-medium text-ink hover:opacity-90">
                            Toevoegen
                        </button>
                    </form>
                )}

                {exercises.length === 0 ? (
                    <p className="border border-dashed border-line px-4 py-8 text-center text-sm text-mute">
                        Nog geen oefeningen. {user.role === 'ADMIN' ? 'Voeg de eerste toe hierboven.' : ''}
                    </p>
                ) : (
                    <ul className="divide-y divide-line border-y border-line">
                        {exercises.map((ex) => (
                            <li key={ex.id} className="flex items-center justify-between py-4">
                                <div>
                                    <p className="font-medium text-paper">{ex.name}</p>
                                    {ex.description && <p className="text-sm text-mute">{ex.description}</p>}
                                </div>
                                <div className="flex items-center gap-3">
                  <span className="border border-line px-2 py-0.5 text-xs text-mute">
                    {ex.difficultyLevel}
                  </span>
                                    {user.role === 'ADMIN' && (
                                        <button
                                            onClick={() => handleDelete(ex.id)}
                                            className="text-xs text-mute hover:text-power"
                                        >
                                            Verwijderen
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
