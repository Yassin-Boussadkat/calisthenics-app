import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ExercisesPage from './pages/ExercisesPage.jsx'
import WorkoutLogsPage from './pages/WorkoutLogsPage.jsx'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/exercises"
                element={
                    <ProtectedRoute>
                        <ExercisesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/workout-logs"
                element={
                    <ProtectedRoute>
                        <WorkoutLogsPage />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/exercises" replace />} />
        </Routes>
    )
}