import { useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom"
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

// Scroll al inicio en cada cambio de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Protege rutas de admin
const AdminRoute = () => {
  const { isAdmin } = useAuth()
  return isAdmin ? <Admin /> : <Navigate to="/login" replace />
}

const noFooterRoutes = ["/reservas", "/checkout", "/admin"]

const Layout = () => {
  const location = useLocation()
  const showFooter = !noFooterRoutes.includes(location.pathname)

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh" }}>
      <ScrollToTop />
      <Navbar />
      <CartSidebar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/menu"      element={<Menu />} />
        <Route path="/reservas"  element={<Reservas />} />
        <Route path="/blog"      element={<Blog />} />
        <Route path="/galeria"   element={<Galeria />} />
        <Route path="/contact"   element={<Contact />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/members"   element={<Members />} />
        <Route path="/checkout"  element={<Checkout />} />
        <Route path="/admin"     element={<AdminRoute />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
      {showFooter && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Layout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App