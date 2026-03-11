import "./Navbar.css"

function Navbar() {
  return (
    <nav className="navbar">

      <div className="navbar-container">

        <div className="logo">
          <h2>CAFETERÍA</h2>
        </div>

        <ul className="menu">
          <li>Inicio</li>
          <li>Tienda</li>
          <li>Cafetería</li>
          <li>Tostaduría</li>
          <li>Historia</li>
          <li>Blog</li>
          <li>Contáctanos</li>
          <li className="sale">SALE</li>
        </ul>

        <div className="icons">
          <span>🔍</span>
          <span>🛒</span>
        </div>

      </div>

    </nav>
  )
}

export default Navbar