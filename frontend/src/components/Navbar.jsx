import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

export default function Navbar() {
    const { user, logout } = useAuth()

    const linkClass = ({ isActive }) =>
        `text-sm transition-colors ${isActive ? 'text-paper' : 'text-mute hover:text-paper'}`

    return (
        <header className="border-b border-line bg-panel">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2 text-power">
                        <Logo className="h-5 w-5" />
                        <span className="font-display text-sm tracking-tight text-paper">
                            Calisthenics
                        </span>
                    </Link>

                    {user && (
                        <nav className="flex gap-6">
                            <NavLink to="/agenda" className={linkClass}>
                                Agenda
                            </NavLink>
                            <NavLink to="/history" className={linkClass}>
                                Geschiedenis
                            </NavLink>
                        </nav>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {user && (
                        <>
                            <span className="text-sm text-mute">{user.email}</span>

                            <button
                                onClick={logout}
                                className="rounded-none border border-line px-3 py-1.5 text-xs text-mute transition-colors hover:border-mute hover:text-paper"
                            >
                                Uitloggen
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}