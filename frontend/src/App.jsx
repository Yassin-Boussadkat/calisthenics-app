import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AgendaPage from './pages/AgendaPage'
import WorkoutPage from './pages/WorkoutPage'
import HistoryPage from './pages/HistoryPage'
import StatsPage from './pages/StatsPage'
import ExercisesPage from './pages/ExercisesPage'
import WorkoutLogsPage from './pages/WorkoutLogsPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/agenda"
                element={
                    <ProtectedRoute>
                        <AgendaPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/stats"
                element={
                    <ProtectedRoute>
                        <StatsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/history"
                element={
                    <ProtectedRoute>
                        <HistoryPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/workout"
                element={
                    <ProtectedRoute>
                        <WorkoutPage />
                    </ProtectedRoute>
                }
            />
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
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
