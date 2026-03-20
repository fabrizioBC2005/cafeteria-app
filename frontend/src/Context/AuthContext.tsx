import { createContext, useContext, useState, useEffect, ReactNode } from "react"

/* ── TIPOS ── */
interface User {
  id: number
  name: string
  email: string
  role: "user" | "admin"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; message: string }>
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; message: string }>
  logout: () => void
  isAdmin: boolean
}

/* ── CONTEXTO ── */
const AuthContext = createContext<AuthContextType | null>(null)

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api"

/* ── HELPERS DE TOKEN ── */
function getAccessToken()  { return localStorage.getItem("locafe_access")  }
function getRefreshToken() { return localStorage.getItem("locafe_refresh") }
function saveTokens(access: string, refresh: string) {
  localStorage.setItem("locafe_access",  access)
  localStorage.setItem("locafe_refresh", refresh)
}
function clearTokens() {
  localStorage.removeItem("locafe_access")
  localStorage.removeItem("locafe_refresh")
  localStorage.removeItem("locafe_user")
}

/* ── FETCH CON AUTO-REFRESH ── */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken()
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  let res = await fetch(url, { ...options, headers })

  // Si el access token expiró, intentar refresh automático
  if (res.status === 401) {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      const refreshRes = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      })

      if (refreshRes.ok) {
        const data = await refreshRes.json()
        saveTokens(data.accessToken, data.refreshToken)

        // Reintentar petición original con nuevo token
        const newHeaders = { ...headers, Authorization: `Bearer ${data.accessToken}` }
        res = await fetch(url, { ...options, headers: newHeaders })
      } else {
        clearTokens()
      }
    }
  }

  return res
}

/* ── PROVIDER ── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  /* Al montar: restaurar sesión desde localStorage */
  useEffect(() => {
    const restore = async () => {
      const token = getAccessToken()
      if (!token) { setLoading(false); return }

      try {
        const res = await authFetch(`${API}/auth/me`)
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
          localStorage.setItem("locafe_user", JSON.stringify(data.user))
        } else {
          clearTokens()
        }
      } catch {
        // Backend offline — usar usuario guardado localmente como fallback
        const saved = localStorage.getItem("locafe_user")
        if (saved) setUser(JSON.parse(saved))
      } finally {
        setLoading(false)
      }
    }
    restore()
  }, [])

  /* ── LOGIN ── */
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.ok) {
        saveTokens(data.accessToken, data.refreshToken)
        setUser(data.user)
        localStorage.setItem("locafe_user", JSON.stringify(data.user))
        return { ok: true, message: data.message }
      }
      return { ok: false, message: data.message || "Error al iniciar sesión" }
    } catch {
      return { ok: false, message: "No se pudo conectar con el servidor" }
    }
  }

  /* ── REGISTER ── */
  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()

      if (data.ok) {
        saveTokens(data.accessToken, data.refreshToken)
        setUser(data.user)
        localStorage.setItem("locafe_user", JSON.stringify(data.user))
        return { ok: true, message: data.message }
      }
      return { ok: false, message: data.message || "Error al registrarse" }
    } catch {
      return { ok: false, message: "No se pudo conectar con el servidor" }
    }
  }

  /* ── LOGOUT ── */
  const logout = async () => {
    try {
      await authFetch(`${API}/auth/logout`, { method: "POST" })
    } catch { /* silencioso */ }
    clearTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAdmin: user?.role === "admin",
    }}>
      {children}
    </AuthContext.Provider>
  )
}

/* ── HOOK ── */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}