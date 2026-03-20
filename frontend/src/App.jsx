import { useState } from "react"
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

function AppInner() {
  const [currentPage, setCurrentPage] = useState("home")
  const { isAdmin } = useAuth()

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
        // Solo accesible si es admin
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
