import { useState } from "react"
import { useAuth } from "../../Context/AuthContext"
import "./Register.css"

interface RegisterProps {
  setPage: (page: string) => void
}

function Register({ setPage }: RegisterProps) {
  const { register } = useAuth()

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirm: ""
  })
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError("")
    if (fieldErr[e.target.name]) {
      setFieldErr(prev => { const n = {...prev}; delete n[e.target.name]; return n })
    }
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim())         errs.name    = "El nombre es requerido"
    if (!form.email.trim())        errs.email   = "El email es requerido"
    if (form.password.length < 6)  errs.password = "Mínimo 6 caracteres"
    if (form.password !== form.confirm) errs.confirm = "Las contraseñas no coinciden"
    setFieldErr(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setError("")

    const result = await register(form.name, form.email, form.password)

    setLoading(false)

    if (result.ok) {
      setPage("home")
    } else {
      setError(result.message)
    }
  }

  const strength = form.password.length === 0 ? 0
    : form.password.length < 6  ? 1
    : form.password.length < 10 ? 2
    : 3

  const strengthLabel = ["", "Débil", "Regular", "Fuerte"]
  const strengthColor = ["", "#f87171", "#fbbf24", "#4ade80"]

  return (
    <div className="register-page">

      {/* ── LADO IZQUIERDO ── */}
      <div className="register-left">
        <div className="register-left-content">
          <p className="register-eyebrow">LOCAFE / REGISTRO</p>
          <h2 className="register-title">ÚNETE AL<br /><span>CLUB</span></h2>
          <p className="register-sub">
            Crea tu cuenta gratis y accede a beneficios exclusivos,
            reservas prioritarias y mucho más.
          </p>
          <div className="register-steps">
            {[
              { num: "01", text: "Crea tu cuenta en 1 minuto" },
              { num: "02", text: "Elige tu membresía Coffee Members" },
              { num: "03", text: "Empieza a acumular puntos" },
            ].map(s => (
              <div className="reg-step" key={s.num}>
                <span className="reg-step-num">{s.num}</span>
                <span>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="register-left-img">
          <img
            src="https://images.unsplash.com/photo-1501492673258-2af7d42e4efd?w=800&q=80"
            alt="Locafe café"
          />
        </div>
      </div>

      {/* ── LADO DERECHO ── */}
      <div className="register-right">
        <div className="register-card">

          <div className="register-card-header">
            <div className="register-logo" onClick={() => setPage("home")}>
              <span className="register-logo-text">LOCA<span className="register-logo-accent">CAFE</span></span>
            </div>
            <h1 className="register-card-title">Crear cuenta</h1>
            <p className="register-card-sub">Gratis · Sin tarjeta requerida</p>
          </div>

          {/* Error global */}
          {error && (
            <div className="register-error">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">

            <div className={`register-field ${fieldErr.name ? "has-error" : ""}`}>
              <label htmlFor="name">Nombre completo *</label>
              <input
                id="name" name="name" type="text"
                value={form.name} onChange={handleChange}
                placeholder="Tu nombre" required disabled={loading}
                autoComplete="name"
              />
              {fieldErr.name && <p className="field-error">{fieldErr.name}</p>}
            </div>

            <div className={`register-field ${fieldErr.email ? "has-error" : ""}`}>
              <label htmlFor="reg-email">Correo electrónico *</label>
              <input
                id="reg-email" name="email" type="email"
                value={form.email} onChange={handleChange}
                placeholder="tu@correo.com" required disabled={loading}
                autoComplete="email"
              />
              {fieldErr.email && <p className="field-error">{fieldErr.email}</p>}
            </div>

            <div className={`register-field ${fieldErr.password ? "has-error" : ""}`}>
              <label htmlFor="reg-password">Contraseña *</label>
              <div className="password-wrap">
                <input
                  id="reg-password" name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password} onChange={handleChange}
                  placeholder="Mínimo 6 caracteres" required disabled={loading}
                  autoComplete="new-password"
                />
                <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {/* Indicador de fuerza */}
              {form.password.length > 0 && (
                <div className="strength-bar">
                  <div className="strength-track">
                    {[1,2,3].map(n => (
                      <div
                        key={n}
                        className="strength-seg"
                        style={{ background: n <= strength ? strengthColor[strength] : "#2a2a2a" }}
                      />
                    ))}
                  </div>
                  <span style={{ color: strengthColor[strength], fontSize: "11px" }}>
                    {strengthLabel[strength]}
                  </span>
                </div>
              )}
              {fieldErr.password && <p className="field-error">{fieldErr.password}</p>}
            </div>

            <div className={`register-field ${fieldErr.confirm ? "has-error" : ""}`}>
              <label htmlFor="confirm">Confirmar contraseña *</label>
              <input
                id="confirm" name="confirm"
                type={showPass ? "text" : "password"}
                value={form.confirm} onChange={handleChange}
                placeholder="Repite tu contraseña" required disabled={loading}
                autoComplete="new-password"
              />
              {fieldErr.confirm && <p className="field-error">{fieldErr.confirm}</p>}
            </div>

            <button type="submit" className="register-submit-btn" disabled={loading}>
              {loading ? <span className="login-spinner" /> : "Crear cuenta →"}
            </button>
          </form>

          <div className="register-login">
            <p>¿Ya tienes cuenta?</p>
            <button className="login-link-btn" onClick={() => setPage("login")}>
              Inicia sesión →
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Register
