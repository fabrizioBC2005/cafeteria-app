import { useState } from "react"
import "./Navbar.css"
import { useCart } from "../../Context/CartContext"



function Navbar({ currentPage, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, openCart } = useCart()

  const navigate = (page) => {
    setPage(page)
    setMenuOpen(false)
  }

  const navItems = [
    { page: "home", label: "Inicio" },
    { page: "menu", label: "Menú" },
    { page: "reservas", label: "Reservas" },
    { page: "blog", label: "Blog" },
    { page: "galeria", label: "Galería" },
    { page: "contact", label: "Contacto" },
  ]

  return (
    <>
      <nav className="navbar">

        {/* LOGO */}
        <div className="navbar-logo" onClick={() => navigate("home")}>
          <img
            src="https://i.pinimg.com/1200x/f8/ef/d9/f8efd9caac201bb39588238dab435650.jpg"
            alt="Locafe"
            className="logo-img"
          />
          <span className="logo-text">LOCA<span className="logo-accent">CAFE</span></span>
        </div>

        {/* LINKS desktop */}
        <ul className="navbar-links">
          {navItems.map(({ page, label }) => (
            <li key={page}>
              <button
                className={`nav-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => navigate(page)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* ACTIONS desktop */}
        <div className="navbar-actions">
          <button className="navbar-cta" onClick={() => navigate("members")}>
            ☕ Coffee Members
          </button>

          {/* CARRITO */}
          <button
            className="navbar-cart-btn"
            onClick={openCart}
            aria-label="Carrito"
            title="Ver carrito"
          >
            🛒
            {count > 0 && (
              <span className="cart-bubble">{count}</span>
            )}
          </button>

          {/* USUARIO */}
          <button
            className={`navbar-user-btn ${currentPage === "login" ? "active" : ""}`}
            onClick={() => navigate("login")}
            aria-label="Iniciar sesión"
            title="Iniciar sesión"
          >
            👤
          </button>
        </div>


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
        <div className="mobile-logo">
          <img
            src="https://i.pinimg.com/1200x/f8/ef/d9/f8efd9caac201bb39588238dab435650.jpg"
            alt="Locafe"
            className="mobile-logo-img"
          />
        </div>

        {navItems.map(({ page, label }) => (
          <button
            key={page}
            className={`mobile-nav-btn ${currentPage === page ? "active" : ""}`}
            onClick={() => navigate(page)}
          >
            {label}
          </button>
        ))}

        <button className="mobile-cta" onClick={() => navigate("members")}>
          ☕ Coffee Members →
        </button>
        <button className="mobile-login-btn" onClick={() => navigate("login")}>
          👤 Iniciar sesión
        </button>
      </div>
    </>
  )
}

export default Navbar