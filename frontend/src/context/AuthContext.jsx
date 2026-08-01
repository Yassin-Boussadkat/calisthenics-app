import { createContext, useContext, useState } from 'react'
import { login as loginApi, register as registerApi } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const email = localStorage.getItem('email')
        const role = localStorage.getItem('role')
        return email ? { email, role } : null
    })

    function storeSession(authResponse) {
        localStorage.setItem('token', authResponse.token)
        localStorage.setItem('email', authResponse.email)
        localStorage.setItem('role', authResponse.role)
        setUser({ email: authResponse.email, role: authResponse.role })
    }

    async function login(email, password) {
        const authResponse = await loginApi(email, password)
        storeSession(authResponse)
    }

    async function register(firstName, lastName, email, password) {
        const authResponse = await registerApi(firstName, lastName, email, password)
        storeSession(authResponse)
    }

    function logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        localStorage.removeItem('role')
        setUser(null)
    }

    const value = { user, login, register, logout }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext)
}
