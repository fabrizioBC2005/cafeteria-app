import { useState, useEffect } from "react"
import { CartProvider } from "./Context/CartContext"
import { AuthProvider, useAuth } from "./Context/AuthContext"
import Navbar from "./components/Navbar/Navbar"
import CartSidebar from "./components/CartSidebar/CartSidebar"
import Footer from "./components/Footer/Footer"
import Home from "./pages/Home/Home"
import Menu from "./pages/Menu/Menu"
import Contact from "./pages/Contact/Contact"
import Blog from "./pages/Blog/Blog"
import Galeria from "./pages/Galeria/Galeria"
import Reservas from "./pages/Reservas/Reservas"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import Members from "./pages/Members/Members"
import Checkout from "./pages/Checkout/Checkout"
import Admin from "./pages/Admin/Admin"

// Páginas válidas
const VALID_PAGES = ["home", "menu", "reservas", "blog", "galeria", "contact", "login", "register", "members", "checkout", "admin"]

// Lee la página desde la URL al cargar
const getInitialPage = () => {
  const path = window.location.pathname.replace("/", "").toLowerCase()
  return VALID_PAGES.includes(path) ? path : "home"
}

function AppInner() {
  const [currentPage, setCurrentPage] = useState(getInitialPage)
  const { isAdmin } = useAuth()

  // Scroll al inicio al cambiar de página
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage])

  // Actualiza la URL al cambiar de página
  useEffect(() => {
    window.history.pushState(
      { page: currentPage },
      "",
      `/${currentPage === "home" ? "" : currentPage}`
    )
  }, [currentPage])

  // Maneja el botón retroceso/avance del navegador
  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state?.page) {
        setCurrentPage(e.state.page)
      } else {
        const path = window.location.pathname.replace("/", "").toLowerCase()
        setCurrentPage(VALID_PAGES.includes(path) ? path : "home")
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case "home":     return <Home setPage={setCurrentPage} />
      case "menu":     return <Menu />
      case "reservas": return <Reservas />
      case "blog":     return <Blog />
      case "galeria":  return <Galeria setPage={setCurrentPage} />
      case "contact":  return <Contact />
      case "login":    return <Login setPage={setCurrentPage} />
      case "register": return <Register setPage={setCurrentPage} />
      case "members":  return <Members setPage={setCurrentPage} />
      case "checkout": return <Checkout setPage={setCurrentPage} />
      case "admin":
        return isAdmin
          ? <Admin setPage={setCurrentPage} />
          : <Login setPage={setCurrentPage} />
      default: return <Home setPage={setCurrentPage} />
    }
  }

  const noFooter = ["reservas", "checkout", "admin"]

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh" }}>
      <Navbar currentPage={currentPage} setPage={setCurrentPage} />
      <CartSidebar setPage={setCurrentPage} />
      {renderPage()}
      {!noFooter.includes(currentPage) && <Footer setPage={setCurrentPage} />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AuthProvider>
  )
}

export default App