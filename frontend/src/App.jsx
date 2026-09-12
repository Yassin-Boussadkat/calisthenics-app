import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SchemaPage from './pages/SchemaPage'
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
                path="/schema"
                element={
                    <ProtectedRoute>
                        <SchemaPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/schemas"
                element={
                    <ProtectedRoute>
                        <SchemaPage />
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