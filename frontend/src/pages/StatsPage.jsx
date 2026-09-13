import { useEffect, useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { getMyLogs } from '../api/workoutLogs'
import Navbar from '../components/Navbar'

export default function StatsPage() {
    const [logs, setLogs] = useState([])
    const [error, setError] = useState('')
    const [selectedExercise, setSelectedExercise] = useState('')

    useEffect(() => {
        getMyLogs()
            .then((data) => {
                setLogs(data)
                if (data.length > 0) {
                    setSelectedExercise(data[0].exercise?.name)
                }
            })
            .catch(() => setError('Kon statistieken niet laden.'))
    }, [])

    const exerciseNames = useMemo(
        () => [...new Set(logs.map((l) => l.exercise?.name).filter(Boolean))],
        [logs]
    )

    const personalRecords = useMemo(() => {
        const byExercise = {}
        logs.forEach((log) => {
            const name = log.exercise?.name
            if (!name) return
            if (!byExercise[name]) {
                byExercise[name] = { bestReps: log.reps, bestWeight: log.weightInKg }
            } else {
                byExercise[name].bestReps = Math.max(byExercise[name].bestReps, log.reps)
                byExercise[name].bestWeight = Math.max(byExercise[name].bestWeight, log.weightInKg)
            }
        })
        return byExercise
    }, [logs])

    const chartData = useMemo(() => {
        return logs
            .filter((l) => l.exercise?.name === selectedExercise)
            .sort((a, b) => (a.date < b.date ? -1 : 1))
            .map((l) => ({ date: l.date, reps: l.reps, sets: l.sets }))
    }, [logs, selectedExercise])

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="mx-auto max-w-3xl px-6 py-10">
                <h1 className="mb-1 font-display text-3xl text-paper">Statistieken</h1>
                <p className="mb-8 text-sm text-mute">Je persoonlijke records en progressie per oefening.</p>

                {error && (
                    <p className="mb-6 border border-power/30 bg-power-dim px-3 py-2 text-sm text-power">{error}</p>
                )}

                {logs.length === 0 ? (
                    <p className="border border-dashed border-line px-4 py-8 text-center text-sm text-mute">
                        Nog geen data. Voltooi eerst een paar workouts.
                    </p>
                ) : (
                    <>
                        <h2 className="mb-3 text-sm font-medium text-mute">Persoonlijke records</h2>
                        <ul className="mb-10 divide-y divide-line border-y border-line">
                            {Object.entries(personalRecords).map(([name, pr]) => (
                                <li key={name} className="flex items-center justify-between py-3">
                                    <span className="text-paper">{name}</span>
                                    <span className="text-sm text-mute">
                    max {pr.bestReps} reps{pr.bestWeight > 0 ? ` · max ${pr.bestWeight}kg` : ''}
                  </span>
                                </li>
                            ))}
                        </ul>

                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-medium text-mute">Progressie</h2>
                            <select
                                value={selectedExercise}
                                onChange={(e) => setSelectedExercise(e.target.value)}
                                className="border border-line bg-panel px-2 py-1.5 text-xs text-paper"
                            >
                                {exerciseNames.map((name) => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="h-64 border border-line bg-panel p-4">
                            {chartData.length < 2 ? (
                                <p className="flex h-full items-center justify-center text-sm text-mute">
                                    Nog te weinig data voor een grafiek — log deze oefening nog een paar keer.
                                </p>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid stroke="#2B2E35" strokeDasharray="3 3" />
                                        <XAxis dataKey="date" stroke="#9498A0" fontSize={11} />
                                        <YAxis stroke="#9498A0" fontSize={11} />
                                        <Tooltip
                                            contentStyle={{ background: '#1B1D22', border: '1px solid #2B2E35', fontSize: 12 }}
                                            labelStyle={{ color: '#EDEEF0' }}
                                        />
                                        <Line type="monotone" dataKey="reps" stroke="#FF4B2E" strokeWidth={2} dot={{ r: 3 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
