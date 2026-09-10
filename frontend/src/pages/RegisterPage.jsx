import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { register } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        try {
            await register(firstName, lastName, email, password)
            navigate('/exercises')
        } catch (err) {
            setError(err.response?.data?.message || 'Registreren is mislukt.')
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
                    Begin met
                    <br />
                    wat je hebt.
                </h1>
                <p className="max-w-xs text-sm text-mute">
                    Geen abonnement, geen apparatuur nodig. Alleen jij en je lichaamsgewicht.
                </p>
            </div>

            <div className="flex items-center justify-center p-8">
                <form onSubmit={handleSubmit} className="w-full max-w-sm">
                    <div className="mb-8 flex items-center gap-2 text-power md:hidden">
                        <Logo className="h-5 w-5" />
                        <span className="font-display text-sm tracking-tight text-paper">Calisthenics</span>
                    </div>

                    <h2 className="mb-1 text-xl font-semibold text-paper">Registreren</h2>
                    <p className="mb-6 text-sm text-mute">Maak een account aan om te beginnen.</p>

                    {error && (
                        <p className="mb-4 border border-power/30 bg-power-dim px-3 py-2 text-sm text-power">
                            {error}
                        </p>
                    )}

                    <div className="mb-4 grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs text-mute">Voornaam</label>
                            <input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full border border-line bg-ink px-3 py-2.5 text-paper outline-none focus:border-mute"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-mute">Achternaam</label>
                            <input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full border border-line bg-ink px-3 py-2.5 text-paper outline-none focus:border-mute"
                                required
                            />
                        </div>
                    </div>

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
                        Registreren
                    </button>

                    <p className="mt-5 text-sm text-mute">
                        Al een account?{' '}
                        <Link to="/login" className="text-paper underline underline-offset-2">
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
