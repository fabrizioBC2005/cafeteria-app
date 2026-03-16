import { useState } from "react"
import "./Navbar.css"

function Navbar({ currentPage, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = (page) => {
    setPage(page)
    setMenuOpen(false)
  }

  return (
    <>
      <nav className="navbar">
        {/* LOGO */}
        <div className="navbar-logo" onClick={() => navigate("home")}>
          <span className="logo-icon">☕</span>
          <span className="logo-text">CAFÉ<span className="logo-accent">ORIGEN</span></span>
        </div>

        {/* LINKS desktop */}
        <ul className="navbar-links">
          {["home", "menu", "contact"].map((page) => (
            <li key={page}>
              <button
                className={`nav-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => navigate(page)}
              >
                {page === "home" ? "Inicio" : page === "menu" ? "Menú" : "Contacto"}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA desktop */}
        <button className="navbar-cta" onClick={() => navigate("menu")}>
          Ver Catálogo
        </button>

        {/* HAMBURGER mobile */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* MOBILE MENU overlay */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {[
          { page: "home",    label: "Inicio" },
          { page: "menu",    label: "Menú" },
          { page: "contact", label: "Contacto" },
        ].map(({ page, label }) => (
          <button
            key={page}
            className={`mobile-nav-btn ${currentPage === page ? "active" : ""}`}
            onClick={() => navigate(page)}
          >
            {label}
          </button>
        ))}
        <button className="mobile-cta" onClick={() => navigate("menu")}>
          Ver Catálogo →
        </button>
      </div>
    </>
  )
}

export default Navbar