import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
            navigate('/exercises')
        } catch (err) {
            setError('Ongeldige email of wachtwoord.')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-6 text-2xl font-bold text-gray-800">Inloggen</h1>

                {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4 w-full rounded border border-gray-300 px-3 py-2"
                    required
                />

                <label className="mb-1 block text-sm font-medium text-gray-700">Wachtwoord</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-6 w-full rounded border border-gray-300 px-3 py-2"
                    required
                />

                <button
                    type="submit"
                    className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
                >
                    Inloggen
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Nog geen account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Registreer
                    </Link>
                </p>
            </form>
        </div>
    )
}
