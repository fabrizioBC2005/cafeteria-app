import { useState } from "react"
import Navbar from "./components/Navbar/Navbar"
import Footer from "./components/Footer/Footer"
import Home from "./pages/Home/Home"
import Menu from "./pages/Menu/Menu"
import Contact from "./pages/Contact/Contact"
import Blog from "./pages/Blog/Blog"
import Galeria from "./pages/Galeria/Galeria"
import Reservas from "./pages/Reservas/Reservas"

function App() {
  const [currentPage, setCurrentPage] = useState("home")

  const renderPage = () => {
    switch (currentPage) {
      case "home":     return <Home setPage={setCurrentPage} />
      case "menu":     return <Menu />
      case "reservas": return <Reservas />
      case "blog":     return <Blog />
      case "galeria":  return <Galeria setPage={setCurrentPage} />
      case "contact":  return <Contact />
      default:         return <Home setPage={setCurrentPage} />
    }
  }

  const showFooter = currentPage !== "reservas"

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh" }}>
      <Navbar currentPage={currentPage} setPage={setCurrentPage} />
      {renderPage()}
      {showFooter && <Footer setPage={setCurrentPage} />}
    </div>
  )
}

export default App
