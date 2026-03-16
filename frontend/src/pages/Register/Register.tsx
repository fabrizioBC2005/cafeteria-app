import { useState } from "react"
import "./Register.css"

interface RegisterProps {
  setPage: (page: string) => void
}

function Register({ setPage }: RegisterProps) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirm: "",
  })
  const [showPass, setShowPass]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [done, setDone]               = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (form.password !== form.confirm) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setDone(true)
    }, 1800)
  }

  const passwordMatch = form.confirm === "" || form.password === form.confirm
  const passwordStrength =
    form.password.length === 0 ? 0 :
    form.password.length < 6   ? 1 :
    form.password.length < 10  ? 2 : 3

  const strengthLabel = ["", "Débil", "Regular", "Fuerte"]
  const strengthColor = ["", "#e74c3c", "#f39c12", "#4e6b38"]

  return (
    <div className="register-page">

      {/* ── LADO IZQUIERDO ── */}
      <div className="register-left">
        <div className="register-left-bg" />
        <div className="register-left-content">
          <p className="register-eyebrow">LOCAFE / REGISTRO</p>
          <h2 className="register-left-title">ÚNETE A<br /><span>COFFEE MEMBERS</span></h2>
          <p className="register-left-sub">
            Crea tu cuenta y empieza a disfrutar de una experiencia de café única.
            Reservas, pedidos y beneficios exclusivos en un solo lugar.
          </p>
          <div className="register-steps-preview">
            {[
              { num: "01", label: "Crea tu cuenta" },
              { num: "02", label: "Completa tu perfil" },
              { num: "03", label: "Empieza a disfrutar" },
            ].map((s) => (
              <div className="step-preview" key={s.num}>
                <span className="step-preview-num">{s.num}</span>
                <span className="step-preview-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LADO DERECHO ── */}
      <div className="register-right">
        <div className="register-card">

          {/* Logo */}
          <div className="register-logo" onClick={() => setPage("home")}>
            <span className="register-logo-text">LOCA<span className="register-logo-accent">CAFE</span></span>
          </div>

          {/* ── CONFIRMACIÓN ── */}
          {done ? (
            <div className="register-success">
              <div className="success-icon">✓</div>
              <h2 className="success-title">¡Cuenta creada!</h2>
              <p className="success-sub">
                Bienvenido a Locafe, <strong>{form.nombre}</strong>. Tu cuenta ha sido creada exitosamente.
              </p>
              <button className="register-submit-btn" onClick={() => setPage("home")}>
                Ir al inicio →
              </button>
              <button className="login-link-btn" onClick={() => setPage("login")}>
                Iniciar sesión
              </button>
            </div>
          ) : (
            <>
              <div className="register-card-header">
                <h1 className="register-card-title">Crear cuenta</h1>
                <p className="register-card-sub">Completa los datos para registrarte</p>
              </div>

              {/* Google */}
              <button className="google-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Registrarse con Google
              </button>

              <div className="register-divider">
                <span /><p>o crea tu cuenta con correo</p><span />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="register-form">

                <div className="register-field">
                  <label htmlFor="nombre">Nombre completo</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="register-field">
                  <label htmlFor="reg-email">Correo electrónico</label>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tu@correo.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="register-field">
                  <label htmlFor="reg-password">Contraseña</label>
                  <div className="password-wrap">
                    <input
                      id="reg-password"
                      name="password"
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="toggle-pass"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {form.password.length > 0 && (
                    <div className="strength-wrap">
                      <div className="strength-bar">
                        {[1, 2, 3].map((n) => (
                          <div
                            key={n}
                            className="strength-segment"
                            style={{
                              background: n <= passwordStrength
                                ? strengthColor[passwordStrength]
                                : "#e8e8e8"
                            }}
                          />
                        ))}
                      </div>
                      <span
                        className="strength-label"
                        style={{ color: strengthColor[passwordStrength] }}
                      >
                        {strengthLabel[passwordStrength]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="register-field">
                  <label htmlFor="confirm">Confirmar contraseña</label>
                  <div className="password-wrap">
                    <input
                      id="confirm"
                      name="confirm"
                      type={showConfirm ? "text" : "password"}
                      value={form.confirm}
                      onChange={handleChange}
                      placeholder="Repite tu contraseña"
                      required
                      autoComplete="new-password"
                      className={!passwordMatch ? "input-error" : ""}
                    />
                    <button
                      type="button"
                      className="toggle-pass"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {!passwordMatch && (
                    <span className="field-error">Las contraseñas no coinciden</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="register-submit-btn"
                  disabled={loading || !passwordMatch}
                >
                  {loading ? <span className="register-spinner" /> : "Crear cuenta →"}
                </button>

              </form>

              {/* Login link */}
              <div className="register-login">
                <p>¿Ya tienes cuenta?</p>
                <button className="login-link-btn" onClick={() => setPage("login")}>
                  Inicia sesión →
                </button>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  )
}

export default Register
