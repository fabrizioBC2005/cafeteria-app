import { useState } from "react"
import "./Login.css"
import { useAuth } from "../../Context/AuthContext"
import { useNavigate } from "react-router-dom"

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]         = useState({ email: "", password: "" })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await login(form.email, form.password)
      navigate("/")
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error || "Credenciales incorrectas"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">

      <div className="login-left">
        <div className="login-left-content">
          <p className="login-left-eyebrow">LOCAFE / ACCESO</p>
          <h2 className="login-left-title">TU CAFE,<br /><span>TU CUENTA</span></h2>
          <p className="login-left-sub">
            Accede para gestionar tus reservas, revisar tu historial de pedidos
            y disfrutar de los beneficios exclusivos de Coffee Members.
          </p>
          <div className="login-perks">
            {[
              { icon: "☕", text: "Acumula puntos con cada pedido" },
              { icon: "📅", text: "Administra tus reservas facilmente" },
              { icon: "🎁", text: "Acceso anticipado a nuevos lotes" },
              { icon: "💚", text: "Descuentos exclusivos para miembros" },
            ].map((p) => (
              <div className="perk-item" key={p.text}>
                <span className="perk-icon">{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="login-left-img">
          <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80" alt="Cafe Locafe" />
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">

          <div className="login-card-header">
            <div className="login-logo" onClick={() => navigate("/")}>
              <span className="login-logo-text">LOCA<span className="login-logo-accent">CAFE</span></span>
            </div>
            <h1 className="login-card-title">Iniciar sesion</h1>
            <p className="login-card-sub">Bienvenido de vuelta</p>
          </div>

          <button className="google-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

          <div className="login-divider">
            <span />
            <p>o ingresa con tu correo</p>
            <span />
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="email">Correo electronico</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@correo.com" required autoComplete="email" />
            </div>

            <div className="login-field">
              <div className="field-label-row">
                <label htmlFor="password">Contrasena</label>
                <button type="button" className="forgot-btn">Olvidaste tu contrasena?</button>
              </div>
              <div className="password-wrap">
                <input id="password" name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="••••••••" required autoComplete="current-password" />
                <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? <span className="login-spinner" /> : "Ingresar"}
            </button>

            {error && <p className="login-error">{error}</p>}
          </form>

          <div className="login-register">
            <p>Aun no tienes cuenta?</p>
            <button className="register-link-btn" onClick={() => navigate("/register")}>
              Registrate gratis
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Login