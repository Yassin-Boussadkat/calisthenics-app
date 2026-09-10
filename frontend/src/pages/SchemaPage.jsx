import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getSchemes, createScheme, deleteScheme } from '../api/trainingSchemes'
import { getExercises } from '../api/exercises'
import Navbar from '../components/Navbar'

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE']

export default function SchemaPage() {
    const { user } = useAuth()
    const [schemes, setSchemes] = useState([])
    const [exercises, setExercises] = useState([])
    const [levelFilter, setLevelFilter] = useState('')
    const [expandedId, setExpandedId] = useState(null)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        name: '',
        description: '',
        difficultyLevel: 'BEGINNER',
        exerciseType: 'STRENGTH',
        exerciseIds: [],
    })

    useEffect(() => {
        loadSchemes()
        getExercises().then(setExercises).catch(() => {})
    }, [levelFilter])

    function loadSchemes() {
        getSchemes(levelFilter || undefined)
            .then(setSchemes)
            .catch(() => setError('Kon schema\'s niet laden.'))
    }

    function toggleExercise(id) {
        setForm((f) => ({
            ...f,
            exerciseIds: f.exerciseIds.includes(id)
                ? f.exerciseIds.filter((x) => x !== id)
                : [...f.exerciseIds, id],
        }))
    }

    async function handleCreate(e) {
        e.preventDefault()
        setError('')
        try {
            await createScheme(form)
            setForm({ ...form, name: '', description: '', exerciseIds: [] })
            setShowForm(false)
            loadSchemes()
        } catch (err) {
            setError(err.response?.data?.message || 'Aanmaken mislukt.')
        }
    }

    async function handleDelete(id) {
        await deleteScheme(id)
        loadSchemes()
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="mx-auto max-w-3xl px-6 py-10">
                <div className="mb-6 flex items-end justify-between">
                    <div>
                        <h1 className="font-display text-3xl text-paper">Trainingsschema's</h1>
                        <p className="text-sm text-mute">{schemes.length} beschikbaar</p>
                    </div>
                    {user.role === 'ADMIN' && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="border border-line px-4 py-2 text-sm text-paper hover:border-mute"
                        >
                            {showForm ? 'Annuleren' : '+ Nieuw schema'}
                        </button>
                    )}
                </div>

                <div className="mb-6 flex gap-2">
                    <button
                        onClick={() => setLevelFilter('')}
                        className={`border px-3 py-1.5 text-xs ${levelFilter === '' ? 'border-power text-power' : 'border-line text-mute hover:text-paper'}`}
                    >
                        Alle niveaus
                    </button>
                    {LEVELS.map((level) => (
                        <button
                            key={level}
                            onClick={() => setLevelFilter(level)}
                            className={`border px-3 py-1.5 text-xs ${levelFilter === level ? 'border-power text-power' : 'border-line text-mute hover:text-paper'}`}
                        >
                            {level}
                        </button>
                    ))}
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
                        <div className="mb-3 flex gap-2">
                            <select
                                value={form.difficultyLevel}
                                onChange={(e) => setForm({ ...form, difficultyLevel: e.target.value })}
                                className="w-full border border-line bg-ink px-3 py-2 text-paper"
                            >
                                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
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

                        <p className="mb-2 text-xs text-mute">Oefeningen in dit schema</p>
                        <div className="mb-4 max-h-40 space-y-1 overflow-y-auto border border-line p-2">
                            {exercises.map((ex) => (
                                <label key={ex.id} className="flex items-center gap-2 text-sm text-paper">
                                    <input
                                        type="checkbox"
                                        checked={form.exerciseIds.includes(ex.id)}
                                        onChange={() => toggleExercise(ex.id)}
                                    />
                                    {ex.name}
                                </label>
                            ))}
                        </div>

                        <button type="submit" className="bg-power px-4 py-2 font-medium text-ink hover:opacity-90">
                            Aanmaken
                        </button>
                    </form>
                )}

                {schemes.length === 0 ? (
                    <p className="border border-dashed border-line px-4 py-8 text-center text-sm text-mute">
                        Geen schema's gevonden voor dit niveau.
                    </p>
                ) : (
                    <ul className="divide-y divide-line border-y border-line">
                        {schemes.map((scheme) => (
                            <li key={scheme.id} className="py-4">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => setExpandedId(expandedId === scheme.id ? null : scheme.id)}
                                        className="text-left"
                                    >
                                        <p className="font-medium text-paper">{scheme.name}</p>
                                        <p className="text-sm text-mute">{scheme.description}</p>
                                    </button>
                                    <div className="flex items-center gap-3">
                    <span className="border border-line px-2 py-0.5 text-xs text-mute">
                      {scheme.difficultyLevel}
                    </span>
                                        {user.role === 'ADMIN' && (
                                            <button
                                                onClick={() => handleDelete(scheme.id)}
                                                className="text-xs text-mute hover:text-power"
                                            >
                                                Verwijderen
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {expandedId === scheme.id && (
                                    <ul className="mt-3 space-y-1 border-t border-line pt-3">
                                        {scheme.exercises?.map((ex) => (
                                            <li key={ex.id} className="text-sm text-mute">— {ex.name}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
