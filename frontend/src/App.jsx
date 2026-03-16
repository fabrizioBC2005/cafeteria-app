import { useState } from "react"
import Navbar from "./components/Navbar/Navbar"
import Home from "./pages/Home/Home"
import Menu from "./pages/Menu/Menu"
import Contact from "./pages/Contact/Contact"

function App() {
  const [currentPage, setCurrentPage] = useState("home")

  const renderPage = () => {
    switch (currentPage) {
      case "home":    return <Home setPage={setCurrentPage} />
      case "menu":    return <Menu />
      case "contact": return <Contact />
      default:        return <Home setPage={setCurrentPage} />
    }
  }

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh" }}>
      <Navbar currentPage={currentPage} setPage={setCurrentPage} />
      {renderPage()}
    </div>
  )
}

export default App