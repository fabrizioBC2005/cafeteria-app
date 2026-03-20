import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { authService } from "../services/api.ts"

interface User {
  id: number
  nombre: string
  email: string
  rol: string
  telefono?: string
  plan?: string
  puntos?: number
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { nombre: string; email: string; password: string; telefono?: string }) => Promise<void>
  logout: () => void
  isAdmin: boolean
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [token, setToken]     = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("locafe_token")
    const savedUser  = localStorage.getItem("locafe_user")
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await authService.login({ email, password })
    localStorage.setItem("locafe_token", data.token)
    localStorage.setItem("locafe_user", JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }

  const register = async (formData: { nombre: string; email: string; password: string; telefono?: string }) => {
    const { data } = await authService.register(formData)
    localStorage.setItem("locafe_token", data.token)
    localStorage.setItem("locafe_user", JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem("locafe_token")
    localStorage.removeItem("locafe_user")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, logout,
      isAdmin:    user?.rol === "admin",
      isLoggedIn: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
