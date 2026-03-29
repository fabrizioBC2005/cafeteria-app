import "./Footer.css"
import { useNavigate } from "react-router-dom"

function Footer() {
  const navigate = useNavigate()

  const navItems = [
    { path: "/", label: "Inicio" },
    { path: "/menu", label: "Menu" },
    { path: "/reservas", label: "Reservas" },
    { path: "/blog", label: "Blog" },
    { path: "/galeria", label: "Galeria" },
    { path: "/contact", label: "Contacto" },
  ]

  const socials = [
    { label: "Instagram", url: "https://instagram.com" },
    { label: "Facebook", url: "https://facebook.com" },
    { label: "TikTok", url: "https://tiktok.com" },
    { label: "WhatsApp", url: "https://wa.me/" },
  ]

  const horarios = [
    { dia: "Lunes - Viernes", hora: "7:00 am - 9:00 pm" },
    { dia: "Sabado", hora: "8:00 am - 10:00 pm" },
    { dia: "Domingo", hora: "9:00 am - 7:00 pm" },
  ]

  return (
    <footer className="footer">
      <div className="footer-strip">
        <span>Cafe de especialidad - Origen directo - Tostado local</span>
      </div>

      <div className="footer-main">
        <div className="footer-col footer-brand">
          <div className="footer-logo" onClick={() => navigate("/")}>
            <span className="footer-logo-text">
              LOCA<span className="footer-logo-accent">CAFE</span>
            </span>
          </div>
          <p className="footer-desc">
            Cafe de especialidad con granos seleccionados de America Latina y Etiopia.
            Tostamos lotes pequeños cada semana para garantizar la maxima frescura en tu taza.
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
                <span>{s.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Explorar</h4>
          <ul className="footer-nav">
            {navItems.map(({ path, label }) => (
              <li key={path}>
                <button className="footer-nav-btn" onClick={() => navigate(path)}>
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

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
            <span>Chimbote, Peru</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>2025 Locafe. Todos los derechos reservados.</span>
        <span className="footer-bottom-right">Hecho con amor en Chimbote</span>
      </div>
    </footer>
  )
}

export default Footer
