import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useAuth } from './context/AuthContext'

function DashboardPlaceholder() {
    const { user, logout } = useAuth()
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Welkom, {user.email}</h1>
            <p className="text-gray-600">Rol: {user.role}</p>
            <button onClick={logout} className="mt-4 rounded bg-gray-800 px-4 py-2 text-white">
                Uitloggen
            </button>
        </div>
    )
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/exercises"
                element={
                    <ProtectedRoute>
                        <DashboardPlaceholder />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/exercises" replace />} />
        </Routes>
    )
}
