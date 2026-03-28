if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}


console.log("🔍 DATABASE_URL:", process.env.DATABASE_URL ? "✅ existe" : "❌ NO existe")
console.log("🔍 NODE_ENV:", process.env.NODE_ENV)
console.log("🔍 PORT:", process.env.PORT)

const express = require("express")
const cors    = require("cors")
const path    = require("path")

const app = express()

// ── MIDDLEWARES ──
app.use(cors({
  origin:      process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// ── ROUTES ──
app.use("/api/auth",      require("./routes/auth"))
app.use("/api/productos", require("./routes/productos"))
app.use("/api/pedidos",   require("./routes/pedidos"))
app.use("/api/reservas",  require("./routes/reservas"))
app.use("/api/membresia", require("./routes/membresia"))
app.use("/api/admin",     require("./routes/admin"))

// ── HEALTH CHECK ──
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app:    "Locafe API",
    version: "1.0.0",
    time:   new Date().toISOString(),
  })
})

// ── 404 ──
app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.path} no encontrada` })
})

// ── ERROR HANDLER ──
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message)
  res.status(err.status || 500).json({ error: err.message || "Error interno" })
})

// ── START ──
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`🚀 Locafe API corriendo en http://localhost:${PORT}`)
  console.log(`📋 Health: http://localhost:${PORT}/api/health`)
})