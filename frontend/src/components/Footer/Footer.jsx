import "./Footer.css"

function Footer({ setPage }) {
  const navItems = [
    { page: "home",     label: "Inicio" },
    { page: "menu",     label: "Menú" },
    { page: "reservas", label: "Reservas" },
    { page: "blog",     label: "Blog" },
    { page: "galeria",  label: "Galería" },
    { page: "contact",  label: "Contacto" },
  ]

  const socials = [
    { label: "Instagram", icon: "📷", url: "https://instagram.com" },
    { label: "Facebook",  icon: "📘", url: "https://facebook.com" },
    { label: "TikTok",    icon: "🎵", url: "https://tiktok.com" },
    { label: "WhatsApp",  icon: "💬", url: "https://wa.me/" },
  ]

  const horarios = [
    { dia: "Lunes – Viernes", hora: "7:00 am – 9:00 pm" },
    { dia: "Sábado",          hora: "8:00 am – 10:00 pm" },
    { dia: "Domingo",         hora: "9:00 am – 7:00 pm" },
  ]

  return (
    <footer className="footer">

      {/* ── TOP STRIP ── */}
      <div className="footer-strip">
        <span>☕ Café de especialidad · Origen directo · Tostado local</span>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="footer-main">

        {/* COLUMNA 1 — Logo + descripción */}
        <div className="footer-col footer-brand">
          <div className="footer-logo" onClick={() => setPage("home")}>
            <span className="footer-logo-text">LOCA<span className="footer-logo-accent">CAFE</span></span>
          </div>
          <p className="footer-desc">
            Café de especialidad con granos seleccionados de América Latina y Etiopía.
            Tostamos lotes pequeños cada semana para garantizar la máxima frescura en tu taza.
          </p>
          <div className="footer-socials">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                title={s.label}
              >
                {s.icon}
                <span>{s.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* COLUMNA 2 — Navegación */}
        <div className="footer-col">
          <h4 className="footer-col-title">Explorar</h4>
          <ul className="footer-nav">
            {navItems.map(({ page, label }) => (
              <li key={page}>
                <button className="footer-nav-btn" onClick={() => setPage(page)}>
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMNA 3 — Horarios */}
        <div className="footer-col">
          <h4 className="footer-col-title">Horarios</h4>
          <ul className="footer-horarios">
            {horarios.map((h) => (
              <li key={h.dia} className="footer-horario-row">
                <span className="horario-dia">{h.dia}</span>
                <span className="horario-hora">{h.hora}</span>
              </li>
            ))}
          </ul>
          <div className="footer-location">
            <span className="location-icon">📍</span>
            <span>Chimbote, Perú</span>
          </div>
        </div>

      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Locafe. Todos los derechos reservados.</span>
        <span className="footer-bottom-right">Hecho con ☕ en Chimbote</span>
      </div>

    </footer>
  )
}

export default Footer
