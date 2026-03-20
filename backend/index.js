const express       = require("express")
const cors          = require("cors")
const dotenv        = require("dotenv")
const authRoutes    = require("./routes/auth")
const menuRoutes    = require("./routes/menu")
const orderRoutes   = require("./routes/orders")
const resRoutes     = require("./routes/reservations")
const userRoutes    = require("./routes/users")
const { verifyToken } = require("./middleware/auth")

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 4000

/* ── MIDDLEWARES ── */
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
  ],
  credentials: true,
}))
app.use(express.json())

/* ── RUTAS ── */
app.use("/api/auth",         authRoutes)
app.use("/api/menu",         menuRoutes)
app.use("/api/orders",       orderRoutes)
app.use("/api/reservations", resRoutes)
app.use("/api/users",        userRoutes)

/* ── RUTA PROTEGIDA DE PERFIL ── */
app.get("/api/me", verifyToken, (req, res) => {
  res.json({ ok: true, user: req.user })
})

/* ── HEALTH CHECK ── */
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    routes: ["/api/auth", "/api/menu", "/api/orders", "/api/reservations", "/api/users"],
  })
})

/* ── 404 ── */
app.use((_req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" })
})

/* ── MANEJO DE ERRORES ── */
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ ok: false, message: "Error interno del servidor" })
})

const server = app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`)
  console.log(`📋 Rutas disponibles:`)
  console.log(`   POST   /api/auth/register`)
  console.log(`   POST   /api/auth/login`)
  console.log(`   GET    /api/menu`)
  console.log(`   POST   /api/orders`)
  console.log(`   GET    /api/reservations/tables?date=YYYY-MM-DD`)
  console.log(`   POST   /api/reservations`)
})

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Puerto ${PORT} ocupado. Cambia PORT en .env`)
  } else {
    console.error("Error servidor:", err)
  }
})

process.on("uncaughtException", (err) => {
  console.error("Error no capturado:", err)
})