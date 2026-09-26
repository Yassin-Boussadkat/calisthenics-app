import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        try {
            await login(email, password)
            navigate('/agenda')
        } catch {
            setError('Ongeldige email of wachtwoord.')
        }
    }

    return (
        <div className="grid min-h-screen md:grid-cols-2">
            <div className="hidden flex-col justify-between border-r border-line bg-panel p-12 md:flex">
                <div className="flex items-center gap-2 text-power">
                    <Logo className="h-6 w-6" />
                    <span className="font-display text-base tracking-tight text-paper">Calisthenics</span>
                </div>
                <h1 className="font-display text-5xl leading-tight text-paper">
                    Elke rep telt.
                    <br />
                    Elke sessie ook.
                </h1>
                <p className="max-w-xs text-sm text-mute">
                    Log je workouts, volg je progressie, en bouw kracht en spiermassa op.
                </p>
            </div>

            <div className="flex items-center justify-center p-8">
                <form onSubmit={handleSubmit} className="w-full max-w-sm">
                    <div className="mb-8 flex items-center gap-2 text-power md:hidden">
                        <Logo className="h-5 w-5" />
                        <span className="font-display text-sm tracking-tight text-paper">Calisthenics</span>
                    </div>

                    <h2 className="mb-1 text-xl font-semibold text-paper">Inloggen</h2>
                    <p className="mb-6 text-sm text-mute">Welkom terug.</p>

                    {error && (
                        <p className="mb-4 border border-power/30 bg-power-dim px-3 py-2 text-sm text-power">
                            {error}
                        </p>
                    )}

                    <label className="mb-1 block text-xs text-mute">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-4 w-full border border-line bg-ink px-3 py-2.5 text-paper outline-none focus:border-mute"
                        required
                    />

                    <label className="mb-1 block text-xs text-mute">Wachtwoord</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-6 w-full border border-line bg-ink px-3 py-2.5 text-paper outline-none focus:border-mute"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-power py-2.5 font-medium text-ink transition-opacity hover:opacity-90"
                    >
                        Inloggen
                    </button>

                    <p className="mt-5 text-sm text-mute">
                        Nog geen account?{' '}
                        <Link to="/register" className="text-paper underline underline-offset-2">
                            Registreer
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
