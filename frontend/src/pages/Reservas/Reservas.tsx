import { useState } from "react"
import "./Reservas.css"

/* ── TIPOS ── */
interface Table {
  id: number
  x: number
  y: number
  seats: number
  zone: string
}

interface FormData {
  nombre: string
  email: string
  telefono: string
  fecha: string
  hora: string
  personas: string
  ocasion: string
  notas: string
}

interface Ocasion {
  value: string
  label: string
}

interface Horario {
  dia: string
  hora: string
}

interface Politica {
  icon: string
  title: string
  desc: string
}

/* ── DATA ── */
const TABLES: Table[] = [
  { id: 1,  x: 18, y: 15, seats: 2, zone: "Ventana" },
  { id: 2,  x: 38, y: 15, seats: 2, zone: "Ventana" },
  { id: 3,  x: 58, y: 15, seats: 4, zone: "Ventana" },
  { id: 4,  x: 78, y: 15, seats: 2, zone: "Ventana" },
  { id: 5,  x: 18, y: 45, seats: 4, zone: "Central" },
  { id: 6,  x: 42, y: 42, seats: 6, zone: "Central" },
  { id: 7,  x: 68, y: 45, seats: 4, zone: "Central" },
  { id: 8,  x: 20, y: 75, seats: 2, zone: "Barra"   },
  { id: 9,  x: 50, y: 78, seats: 4, zone: "Barra"   },
  { id: 10, x: 78, y: 75, seats: 2, zone: "Barra"   },
]

const OCCUPIED: number[] = [3, 7]

const OCASIONES: Ocasion[] = [
  { value: "casual",    label: "☕ Visita casual"       },
  { value: "romantico", label: "🌹 Momento romántico"   },
  { value: "cumple",    label: "🎂 Cumpleaños"          },
  { value: "reunion",   label: "💼 Reunión de trabajo"  },
  { value: "amigos",    label: "🥂 Salida con amigos"   },
  { value: "familia",   label: "👨‍👩‍👧 Familia"             },
]

const HORARIOS: Horario[] = [
  { dia: "Lunes – Viernes", hora: "7:00 am – 9:00 pm"  },
  { dia: "Sábado",          hora: "8:00 am – 10:00 pm" },
  { dia: "Domingo",         hora: "9:00 am – 7:00 pm"  },
]

const POLITICAS: Politica[] = [
  { icon: "⏱", title: "Puntualidad",        desc: "La reserva se mantiene por 15 minutos. Después se libera la mesa." },
  { icon: "📅", title: "Cancelaciones",      desc: "Cancela con al menos 2 horas de anticipación para no perder tu espacio." },
  { icon: "👥", title: "Grupos grandes",     desc: "Para grupos de 8 o más personas escríbenos directamente por WhatsApp." },
  { icon: "🎂", title: "Ocasiones especiales", desc: "Para decoraciones o tortas avísanos con 24 horas de anticipación." },
]

/* ── COMPONENTE ── */
function Reservas() {
  const [selected, setSelected] = useState<Table | null>(null)
  const [step, setStep]         = useState<number>(1)
  const [form, setForm]         = useState<FormData>({
    nombre: "", email: "", telefono: "",
    fecha: "", hora: "", personas: "2", ocasion: "casual", notas: "",
  })

  const today = new Date().toISOString().split("T")[0]

  const handleTable = (table: Table): void => {
    if (OCCUPIED.includes(table.id)) return
    setSelected(table)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setStep(3)
  }

  const reset = (): void => {
    setSelected(null)
    setStep(1)
    setForm({ nombre:"", email:"", telefono:"", fecha:"", hora:"", personas:"2", ocasion:"casual", notas:"" })
  }

  return (
    <div className="res-page">

      {/* ── HEADER ── */}
      <div className="res-header">
        <p className="res-eyebrow">LOCAFE / RESERVAS</p>
        <h1 className="res-title">RESERVA TU<br /><span>MESA</span></h1>
        <p className="res-sub">Elige tu lugar favorito y asegura tu momento perfecto.</p>
      </div>

      {/* ── STEPS ── */}
      <div className="res-steps">
        {["Elige tu mesa", "Tus datos", "Confirmación"].map((s, i) => (
          <div key={i} className={`res-step ${step === i + 1 ? "active" : ""} ${step > i + 1 ? "done" : ""}`}>
            <span className="res-step-num">{step > i + 1 ? "✓" : i + 1}</span>
            <span className="res-step-label">{s}</span>
          </div>
        ))}
      </div>

      {/* ══ STEP 1 — MAPA ══ */}
      {step === 1 && (
        <div className="res-map-section">
          <div className="res-map-legend">
            <span className="legend-item"><span className="leg-dot free" />Disponible</span>
            <span className="legend-item"><span className="leg-dot occupied" />Ocupada</span>
            <span className="legend-item"><span className="leg-dot sel" />Seleccionada</span>
          </div>

          <div className="res-floor-wrap">
            <div className="res-floor">
              <span className="zone-label zone-ventana">🪟 Ventana</span>
              <span className="zone-label zone-central">☕ Central</span>
              <span className="zone-label zone-barra">🎵 Barra</span>
              <div className="floor-entrance">ENTRADA</div>

              {TABLES.map((t) => {
                const isOccupied = OCCUPIED.includes(t.id)
                const isSelected = selected?.id === t.id
                const size = t.seats <= 2 ? 70 : t.seats <= 4 ? 82 : 98
                return (
                  <div
                    key={t.id}
                    className={`floor-table ${isOccupied ? "occupied" : "free"} ${isSelected ? "selected" : ""}`}
                    style={{ left: `${t.x}%`, top: `${t.y}%`, width: size, height: size + 20, marginLeft: -(size / 2), marginTop: -(size / 2) }}
                    onClick={() => handleTable(t)}
                    title={isOccupied ? "Mesa ocupada" : `Mesa ${t.id} · ${t.seats} personas`}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/3979/3979630.png"
                      alt={`Mesa ${t.id}`}
                      className="table-icon"
                      style={{ width: size, height: size }}
                    />
                    <span className="table-badge">{t.id}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {selected ? (
            <div className="res-selected-panel">
              <div className="panel-info">
                <p className="panel-tag">MESA SELECCIONADA</p>
                <h3>Mesa {selected.id} <span>· Zona {selected.zone}</span></h3>
                <p className="panel-seats">👥 Capacidad: {selected.seats} personas</p>
              </div>
              <button className="btn-primary res-next-btn" onClick={() => setStep(2)}>
                Continuar →
              </button>
            </div>
          ) : (
            <p className="res-hint">← Haz clic en una mesa disponible para seleccionarla</p>
          )}
        </div>
      )}

      {/* ══ STEP 2 — FORMULARIO ══ */}
      {step === 2 && (
        <div className="res-form-section">
          <div className="res-form-card">
            <div className="form-card-header">
              <div>
                <p className="panel-tag">MESA {selected?.id} · ZONA {selected?.zone?.toUpperCase()}</p>
                <h2 className="form-title">Completa tu reserva</h2>
              </div>
              <button className="btn-back" onClick={() => setStep(1)}>← Cambiar mesa</button>
            </div>

            <form onSubmit={handleSubmit} className="res-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre completo *</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" required />
                </div>
                <div className="form-group">
                  <label>Teléfono *</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="+51 999 999 999" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Correo electrónico *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@correo.com" required />
                </div>
                <div className="form-group">
                  <label>Número de personas *</label>
                  <select name="personas" value={form.personas} onChange={handleChange}>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} persona{n > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha *</label>
                  <input
                    name="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Hora *</label>
                  <input
                    name="hora"
                    type="time"
                    value={form.hora}
                    onChange={handleChange}
                    min="07:00"
                    max="21:30"
                    step="1800"
                    required
                  />
                  <span style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
                    Horario: 7:00 am – 9:30 pm
                  </span>
                </div>
              </div>

              <div className="form-group form-group--full">
                <label>¿Cuál es la ocasión?</label>
                <div className="ocasion-grid">
                  {OCASIONES.map((o) => (
                    <button
                      type="button"
                      key={o.value}
                      className={`ocasion-btn ${form.ocasion === o.value ? "active" : ""}`}
                      onClick={() => setForm({ ...form, ocasion: o.value })}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group form-group--full">
                <label>Notas adicionales</label>
                <textarea name="notas" value={form.notas} onChange={handleChange} placeholder="Alergias, decoraciones especiales, peticiones..." rows={3} />
              </div>

              <button type="submit" className="btn-primary res-submit-btn">
                Confirmar Reserva ✓
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══ STEP 3 — CONFIRMACIÓN ══ */}
      {step === 3 && (
        <div className="res-confirm-section">
          <div className="confirm-card">
            <div className="confirm-icon">✓</div>
            <p className="confirm-eyebrow">¡RESERVA CONFIRMADA!</p>
            <h2 className="confirm-title">
              Te esperamos,<br /><span>{form.nombre || "Cliente"}</span>
            </h2>

            <div className="confirm-details">
              <div className="confirm-row">
                <span>📍 Mesa</span>
                <strong>Mesa {selected?.id} · Zona {selected?.zone}</strong>
              </div>
              <div className="confirm-row">
                <span>📅 Fecha</span>
                <strong>{form.fecha}</strong>
              </div>
              <div className="confirm-row">
                <span>🕐 Hora</span>
                <strong>{form.hora}</strong>
              </div>
              <div className="confirm-row">
                <span>👥 Personas</span>
                <strong>{form.personas}</strong>
              </div>
              <div className="confirm-row">
                <span>🎉 Ocasión</span>
                <strong>{OCASIONES.find((o) => o.value === form.ocasion)?.label}</strong>
              </div>
            </div>

            <p className="confirm-note">
              Enviaremos la confirmación a <strong>{form.email}</strong>.<br />
              Recuerda llegar con 5 minutos de anticipación.
            </p>

            <button className="btn-primary confirm-btn" onClick={reset}>
              Hacer otra reserva
            </button>
          </div>
        </div>
      )}

      {/* ── HORARIOS & POLÍTICAS ── */}
      <div className="res-info-section">
        <div className="res-info-grid">
          <div className="res-info-block">
            <h3 className="info-block-title">🕐 Horarios</h3>
            <div className="horarios-list">
              {HORARIOS.map((h) => (
                <div className="horario-row" key={h.dia}>
                  <span>{h.dia}</span>
                  <span className="horario-hora">{h.hora}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="res-info-block">
            <h3 className="info-block-title">📋 Políticas de Reserva</h3>
            <div className="politicas-list">
              {POLITICAS.map((p) => (
                <div className="politica-item" key={p.title}>
                  <span className="politica-icon">{p.icon}</span>
                  <div>
                    <strong>{p.title}</strong>
                    <p>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Reservas
