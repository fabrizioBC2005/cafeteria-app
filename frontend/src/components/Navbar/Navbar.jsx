import { useState } from "react"
import "./Navbar.css"
import { useCart } from "../../Context/CartContext"
import { useAuth } from "../../Context/AuthContext"

function Navbar({ currentPage, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, openCart } = useCart()
  const { user, logout, isAdmin } = useAuth()

  const navigate = (page) => {
    setPage(page)
    setMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate("home")
  }

  const navItems = [
    { page: "home",     label: "Inicio"   },
    { page: "menu",     label: "Menú"     },
    { page: "reservas", label: "Reservas" },
    { page: "blog",     label: "Blog"     },
    { page: "galeria",  label: "Galería"  },
    { page: "contact",  label: "Contacto" },
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

          {/* Admin solo visible para admins */}
          {isAdmin && (
            <button
              className="navbar-cta"
              style={{ background: "transparent", border: "1px solid #2a2a2a", color: "#888", marginLeft: "4px" }}
              onClick={() => navigate("admin")}
            >
              ⚙ Admin
            </button>
          )}

          {/* CARRITO */}
          <button
            className="navbar-cart-btn"
            onClick={openCart}
            aria-label="Carrito"
          >
            🛒
            {count > 0 && <span className="cart-bubble">{count}</span>}
          </button>

          {/* USUARIO — muestra avatar si está logueado, sino botón login */}
          {user ? (
            <div className="navbar-user-menu">
              <button className="navbar-avatar-btn" title={user.name}>
                {user.name.charAt(0).toUpperCase()}
              </button>
              <div className="navbar-dropdown">
                <p className="dropdown-name">{user.name}</p>
                <p className="dropdown-email">{user.email}</p>
                <hr className="dropdown-divider" />
                {isAdmin && (
                  <button className="dropdown-item" onClick={() => navigate("admin")}>
                    ⚙ Panel Admin
                  </button>
                )}
                <button className="dropdown-item" onClick={() => navigate("members")}>
                  ☕ Mi membresía
                </button>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <button
              className={`navbar-user-btn ${currentPage === "login" ? "active" : ""}`}
              onClick={() => navigate("login")}
              aria-label="Iniciar sesión"
            >
              👤
            </button>
          )}
        </div>

        {/* HAMBURGER mobile */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-logo">
          <img
            src="https://i.pinimg.com/1200x/f8/ef/d9/f8efd9caac201bb39588238dab435650.jpg"
            alt="Locafe"
            className="mobile-logo-img"
          />
        </div>

        {user && (
          <div className="mobile-user-info">
            <span className="mobile-avatar">{user.name.charAt(0).toUpperCase()}</span>
            <div>
              <p className="mobile-user-name">{user.name}</p>
              <p className="mobile-user-email">{user.email}</p>
            </div>
          </div>
        )}

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

        {user ? (
          <button className="mobile-login-btn" style={{ color: "#f87171" }} onClick={handleLogout}>
            Cerrar sesión
          </button>
        ) : (
          <button className="mobile-login-btn" onClick={() => navigate("login")}>
            👤 Iniciar sesión
          </button>
        )}
      </div>
    </>
  )
}

export default Navbar
