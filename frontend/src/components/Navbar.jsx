import "./Navbar.css"

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        <h2>PUMA CAFÉ</h2>
      </div>

      <ul className="menu">
        <li>Inicio</li>
        <li className="sale">SALE</li>
        <li>Tienda</li>
        <li>Cafetería</li>
        <li>Tostaduría</li>
        <li>Contáctanos</li>
        <li>Historia</li>
        <li>Blog</li>
      </ul>

      <div className="icons">
        <span>🔍</span>
        <span>🛒</span>
      </div>

    </nav>
  )
}

export default Navbar