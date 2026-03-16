import { useState } from "react"
import "./Members.css"

interface MembersProps {
  setPage: (page: string) => void
}

const PLANS = [
  {
    id: "classic",
    name: "Classic",
    price: "S/ 19",
    period: "/ mes",
    color: "#7a6a5a",
    gradient: "linear-gradient(135deg, #7a6a5a 0%, #5a4a3a 100%)",
    badge: null,
    benefits: [
      "Tarjeta digital de cliente",
      "Código QR personalizado",
      "Descuento 10% en consumo",
      "1 café gratis cada 10 compras",
      "Acceso a newsletter exclusivo",
    ],
    notIncluded: [
      "Reservas prioritarias",
      "Acceso a productos especiales",
      "Eventos privados",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: "S/ 39",
    period: "/ mes",
    color: "#4e6b38",
    gradient: "linear-gradient(135deg, #6a8f50 0%, #3a5029 100%)",
    badge: "MÁS POPULAR",
    benefits: [
      "Todo lo de Classic",
      "Reservas prioritarias",
      "Acceso a productos especiales",
      "Descuento 15% en consumo",
      "1 café gratis cada 8 compras",
      "Invitaciones a catas y eventos",
    ],
    notIncluded: [
      "Eventos privados VIP",
    ],
  },
  {
    id: "black",
    name: "Black",
    price: "S/ 69",
    period: "/ mes",
    color: "#111111",
    gradient: "linear-gradient(135deg, #2a2a2a 0%, #111 100%)",
    badge: "PREMIUM",
    benefits: [
      "Todo lo de Gold",
      "Descuento 20% en consumo",
      "1 café gratis cada 5 compras",
      "Eventos privados VIP",
      "Envío a domicilio prioritario",
      "Acceso anticipado a lotes nuevos",
      "Atención personalizada",
    ],
    notIncluded: [],
  },
]

const BENEFITS_GLOBAL = [
  { icon: "💰", title: "Descuento 10%", desc: "En todos tus consumos dentro del local desde el primer día." },
  { icon: "☕", title: "Café gratis", desc: "Acumula 1 punto por compra. Al llegar a 10 canjeás un café gratis." },
  { icon: "📅", title: "Reservas prioritarias", desc: "Tu mesa siempre disponible. Prioridad sobre clientes sin membresía." },
  { icon: "🌿", title: "Productos especiales", desc: "Acceso a lotes de edición limitada antes que el público general." },
]

// QR simulado como SVG de puntos
function QRCode({ value }: { value: string }) {
  const size = 9
  const pattern = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => {
      const hash = ((i * 7 + j * 13 + value.charCodeAt(i % value.length)) % 3)
      return hash !== 0
    })
  )
  // Esquinas fijas del QR
  const corners = [
    [0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2],
    [0,6],[0,7],[0,8],[1,6],[1,8],[2,6],[2,7],[2,8],
    [6,0],[6,1],[6,2],[7,0],[7,2],[8,0],[8,1],[8,2],
  ]
  const isCorner = (r: number, c: number) =>
    corners.some(([cr, cc]) => cr === r && cc === c)

  return (
    <svg viewBox="0 0 90 90" className="qr-svg" xmlns="http://www.w3.org/2000/svg">
      {pattern.map((row, r) =>
        row.map((cell, c) =>
          (cell || isCorner(r, c)) ? (
            <rect
              key={`${r}-${c}`}
              x={c * 10}
              y={r * 10}
              width="9"
              height="9"
              rx="1.5"
              fill="currentColor"
            />
          ) : null
        )
      )}
    </svg>
  )
}

function Members({ setPage }: MembersProps) {
  const [selectedPlan, setSelectedPlan] = useState("gold")
  const [showCard, setShowCard]         = useState(false)
  const [flipped, setFlipped]           = useState(false)

  const plan = PLANS.find(p => p.id === selectedPlan)!
  const memberCode = "LC-" + selectedPlan.toUpperCase() + "-2025-00847"

  return (
    <div className="members-page">

      {/* ── HERO ── */}
      <div className="members-hero">
        <div className="members-hero-bg" />
        <div className="members-hero-content">
          <p className="members-eyebrow">LOCAFE / MEMBRESÍA</p>
          <h1 className="members-title">
            COFFEE<br /><span>MEMBERS</span>
          </h1>
          <p className="members-sub">
            Únete al club de los verdaderos amantes del café. Beneficios exclusivos,
            tu tarjeta digital personalizada y mucho más.
          </p>
          <div className="members-hero-btns">
            <button className="members-cta-btn" onClick={() => setShowCard(true)}>
              Ver mi tarjeta digital
            </button>
            <button className="members-secondary-btn" onClick={() => setPage("register")}>
              Crear cuenta gratis →
            </button>
          </div>
        </div>
        {/* Tarjeta flotante decorativa */}
        <div className="hero-card-float">
          <div className="hero-card" style={{ background: plan.gradient }}>
            <div className="hero-card-top">
              <span className="hero-card-brand">LOCAFE</span>
              <span className="hero-card-plan">{plan.name}</span>
            </div>
            <div className="hero-card-chip">
              <div className="chip-lines">
                <span /><span /><span /><span />
              </div>
            </div>
            <div className="hero-card-bottom">
              <span className="hero-card-name">COFFEE MEMBER</span>
              <span className="hero-card-num">•••• •••• 0847</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BENEFICIOS GLOBALES ── */}
      <div className="members-benefits-section">
        <div className="members-benefits-inner">
          <p className="section-eyebrow">POR QUÉ UNIRSE</p>
          <h2 className="section-title">Beneficios de ser<br /><span>Coffee Member</span></h2>
          <div className="benefits-grid">
            {BENEFITS_GLOBAL.map((b) => (
              <div className="benefit-card" key={b.title}>
                <span className="benefit-icon">{b.icon}</span>
                <h3 className="benefit-title">{b.title}</h3>
                <p className="benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PLANES ── */}
      <div className="members-plans-section">
        <div className="members-plans-inner">
          <p className="section-eyebrow">ELIGE TU PLAN</p>
          <h2 className="section-title">Tarjetas <span>digitales</span></h2>
          <p className="section-sub">Todas incluyen tarjeta digital con QR y código de cliente único.</p>

          <div className="plans-grid">
            {PLANS.map((p) => (
              <div
                key={p.id}
                className={`plan-card ${selectedPlan === p.id ? "selected" : ""}`}
                onClick={() => setSelectedPlan(p.id)}
              >
                {p.badge && <span className="plan-badge">{p.badge}</span>}

                {/* Mini tarjeta */}
                <div className="plan-mini-card" style={{ background: p.gradient }}>
                  <span className="mini-card-brand">LOCAFE</span>
                  <span className="mini-card-plan">{p.name}</span>
                  <div className="mini-card-dots">
                    <span /><span /><span /><span className="last" />
                  </div>
                </div>

                <div className="plan-info">
                  <h3 className="plan-name">{p.name}</h3>
                  <div className="plan-price">
                    <span className="price-amount">{p.price}</span>
                    <span className="price-period">{p.period}</span>
                  </div>

                  <ul className="plan-benefits">
                    {p.benefits.map((b) => (
                      <li key={b} className="plan-benefit-item included">
                        <span className="check">✓</span>{b}
                      </li>
                    ))}
                    {p.notIncluded.map((b) => (
                      <li key={b} className="plan-benefit-item excluded">
                        <span className="cross">✕</span>{b}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="plan-select-btn"
                    style={selectedPlan === p.id ? { background: p.color, borderColor: p.color, color: "#fff" } : {}}
                    onClick={() => { setSelectedPlan(p.id); setShowCard(true) }}
                  >
                    {selectedPlan === p.id ? "✓ Seleccionado" : "Elegir plan"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TARJETA DIGITAL SECTION ── */}
      <div className="members-digital-section">
        <div className="members-digital-inner">
          <div className="digital-text">
            <p className="section-eyebrow">TARJETA DIGITAL</p>
            <h2 className="digital-title">Tu membresía<br /><span>en tu bolsillo</span></h2>
            <p className="digital-desc">
              Cada miembro recibe una tarjeta digital única con su código QR y número de cliente.
              Preséntala en caja para aplicar tus descuentos y acumular puntos automáticamente.
            </p>
            <ul className="digital-features">
              {[
                "📱 Disponible en tu perfil siempre",
                "🔒 Código único e intransferible",
                "⚡ Validación instantánea en caja",
                "🔄 Se actualiza con cada compra",
              ].map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          {/* Tarjeta interactiva con flip */}
          <div className="digital-card-demo">
            <div className={`card-flip-wrap ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
              {/* FRENTE */}
              <div className="card-face card-front" style={{ background: plan.gradient }}>
                <div className="card-face-top">
                  <span className="card-face-brand">LOCAFE</span>
                  <span className="card-face-plan">{plan.name.toUpperCase()} MEMBER</span>
                </div>
                <div className="card-face-chip">
                  <div className="chip-inner"><span /><span /><span /><span /></div>
                </div>
                <div className="card-face-bottom">
                  <div>
                    <p className="card-face-label">TITULAR</p>
                    <p className="card-face-value">COFFEE MEMBER</p>
                  </div>
                  <div>
                    <p className="card-face-label">VÁLIDO</p>
                    <p className="card-face-value">12/27</p>
                  </div>
                </div>
                <p className="card-hint">Toca para ver QR →</p>
              </div>

              {/* REVERSO */}
              <div className="card-face card-back" style={{ background: plan.gradient }}>
                <p className="card-back-title">CÓDIGO DE ACCESO</p>
                <div className="card-qr-wrap">
                  <QRCode value={memberCode} />
                </div>
                <p className="card-member-code">{memberCode}</p>
                <p className="card-hint">Toca para volver ←</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA FINAL ── */}
      <div className="members-cta-section">
        <div className="members-cta-inner">
          <h2 className="cta-title">¿Listo para unirte?</h2>
          <p className="cta-sub">Crea tu cuenta gratis y elige tu membresía en minutos.</p>
          <div className="cta-btns">
            <button className="members-cta-btn" onClick={() => setPage("register")}>
              Crear cuenta →
            </button>
            <button className="members-secondary-btn white" onClick={() => setPage("login")}>
              Ya tengo cuenta
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Members
