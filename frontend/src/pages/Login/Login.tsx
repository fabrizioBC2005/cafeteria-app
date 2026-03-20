import { useState } from "react"
import { useAuth } from "../../Context/AuthContext"
import "./Login.css"

interface LoginProps {
  setPage: (page: string) => void
}

function Login({ setPage }: LoginProps) {
  const { login } = useAuth()

  const [form,     setForm]     = useState({ email: "", password: "" })
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await login(form.email, form.password)

    setLoading(false)

    if (result.ok) {
      setPage("home")   // redirige al inicio tras login exitoso
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="login-page">

      {/* ── LADO IZQUIERDO — decorativo ── */}
      <div className="login-left">
        <div className="login-left-content">
          <p className="login-left-eyebrow">LOCAFE / ACCESO</p>
          <h2 className="login-left-title">TU CAFÉ,<br /><span>TU CUENTA</span></h2>
          <p className="login-left-sub">
            Accede para gestionar tus reservas, revisar tu historial de pedidos
            y disfrutar de los beneficios exclusivos de Coffee Members.
          </p>
          <div className="login-perks">
            {[
              { icon: "☕", text: "Acumula puntos con cada pedido" },
              { icon: "📅", text: "Administra tus reservas fácilmente" },
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
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80"
            alt="Café Locafe"
          />
        </div>
      </div>

      {/* ── LADO DERECHO — formulario ── */}
      <div className="login-right">
        <div className="login-card">

          {/* Header */}
          <div className="login-card-header">
            <div className="login-logo" onClick={() => setPage("home")}>
              <span className="login-logo-text">LOCA<span className="login-logo-accent">CAFE</span></span>
            </div>
            <h1 className="login-card-title">Iniciar sesión</h1>
            <p className="login-card-sub">Bienvenido de vuelta ☕</p>
          </div>

          {/* Error global */}
          {error && (
            <div className="login-error">
              <span>⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@correo.com"
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="login-field">
              <div className="field-label-row">
                <label htmlFor="password">Contraseña</label>
                <button type="button" className="forgot-btn">¿Olvidaste tu contraseña?</button>
              </div>
              <div className="password-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? <span className="login-spinner" /> : "Ingresar →"}
            </button>
          </form>

          {/* Registro */}
          <div className="login-register">
            <p>¿Aún no tienes cuenta?</p>
            <button className="register-link-btn" onClick={() => setPage("register")}>
              Regístrate gratis →
            </button>
          </div>

          {/* Credenciales de prueba */}
          <div className="login-demo">
            <p className="demo-label">Cuenta de prueba</p>
            <p className="demo-creds">admin@locafe.com / admin123</p>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Login
