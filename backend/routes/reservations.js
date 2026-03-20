const express = require("express")
const { verifyToken, requireAdmin } = require("../middleware/auth")

const router = express.Router()

/* ── BASE DE DATOS EN MEMORIA ── */
let reservations = [
  { id: "RES-001", userId: null, name: "Sofía Herrera",  email: "sofia@mail.com",   phone: "+51 987 111 222", tableId: 6, zone: "Central", date: "2025-07-15", time: "19:00", guests: 4, occasion: "romantico", notes: "",        status: "confirmada", createdAt: "2025-07-13T10:00:00Z" },
  { id: "RES-002", userId: null, name: "Javier Soto",    email: "javier@mail.com",  phone: "+51 987 333 444", tableId: 3, zone: "Ventana", date: "2025-07-15", time: "13:30", guests: 2, occasion: "reunion",   notes: "Proyector", status: "confirmada", createdAt: "2025-07-13T11:00:00Z" },
  { id: "RES-003", userId: null, name: "Camila Vega",    email: "camila@mail.com",  phone: "+51 987 555 666", tableId: 9, zone: "Barra",   date: "2025-07-15", time: "20:00", guests: 3, occasion: "amigos",    notes: "",        status: "pendiente",  createdAt: "2025-07-14T09:00:00Z" },
  { id: "RES-004", userId: null, name: "Rodrigo Paz",    email: "rodrigo@mail.com", phone: "+51 987 777 888", tableId: 5, zone: "Central", date: "2025-07-16", time: "12:00", guests: 6, occasion: "cumple",    notes: "Torta",   status: "confirmada", createdAt: "2025-07-14T10:00:00Z" },
]

// Mesas ocupadas (ids de reservas activas para el mapa)
const TOTAL_TABLES = [
  { id: 1, seats: 2, zone: "Ventana" }, { id: 2, seats: 2, zone: "Ventana" },
  { id: 3, seats: 4, zone: "Ventana" }, { id: 4, seats: 2, zone: "Ventana" },
  { id: 5, seats: 4, zone: "Central" }, { id: 6, seats: 6, zone: "Central" },
  { id: 7, seats: 4, zone: "Central" }, { id: 8, seats: 2, zone: "Barra"   },
  { id: 9, seats: 4, zone: "Barra"   }, { id: 10, seats: 2, zone: "Barra"  },
]

let resCounter = 5

function generateResId() {
  return `RES-${String(resCounter++).padStart(3, "0")}`
}

/* ── GET /api/reservations ── admin ve todas, usuario ve las suyas */
router.get("/", verifyToken, (req, res) => {
  const { status, date } = req.query

  let result = req.user.role === "admin"
    ? [...reservations]
    : reservations.filter(r => r.userId === req.user.id)

  if (status) result = result.filter(r => r.status === status)
  if (date)   result = result.filter(r => r.date === date)

  res.json({ ok: true, data: result, total: result.length })
})

/* ── GET /api/reservations/tables ── disponibilidad pública */
router.get("/tables", (req, res) => {
  const { date } = req.query

  // Mesas ocupadas en esa fecha
  const occupied = date
    ? reservations
        .filter(r => r.date === date && ["confirmada", "pendiente"].includes(r.status))
        .map(r => r.tableId)
    : []

  const tables = TOTAL_TABLES.map(t => ({
    ...t,
    available: !occupied.includes(t.id),
  }))

  res.json({ ok: true, data: tables })
})

/* ── GET /api/reservations/:id ── */
router.get("/:id", verifyToken, (req, res) => {
  const res_ = reservations.find(r => r.id === req.params.id)
  if (!res_) return res.status(404).json({ ok: false, message: "Reserva no encontrada" })

  if (req.user.role !== "admin" && res_.userId !== req.user.id) {
    return res.status(403).json({ ok: false, message: "Acceso denegado" })
  }
  res.json({ ok: true, data: res_ })
})

/* ── POST /api/reservations ── crear reserva (público) */
router.post("/", (req, res) => {
  const { name, email, phone, tableId, date, time, guests, occasion, notes } = req.body

  if (!name || !email || !phone || !tableId || !date || !time || !guests) {
    return res.status(400).json({ ok: false, message: "Faltan campos requeridos" })
  }

  // Verificar que la mesa no esté ocupada ese día
  const conflict = reservations.find(r =>
    r.tableId === parseInt(tableId) &&
    r.date === date &&
    ["confirmada", "pendiente"].includes(r.status)
  )
  if (conflict) {
    return res.status(409).json({ ok: false, message: "Esa mesa ya está reservada para esa fecha" })
  }

  const table = TOTAL_TABLES.find(t => t.id === parseInt(tableId))

  // userId opcional si viene token
  let userId = null
  const authHeader = req.headers["authorization"]
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const jwt = require("jsonwebtoken")
      const { JWT_SECRET } = require("../middleware/auth")
      const decoded = jwt.verify(authHeader.split(" ")[1], JWT_SECRET)
      userId = decoded.id
    } catch { /* anónimo */ }
  }

  const newRes = {
    id: generateResId(),
    userId,
    name, email, phone,
    tableId: parseInt(tableId),
    zone: table?.zone || "—",
    date, time,
    guests: parseInt(guests),
    occasion: occasion || "casual",
    notes: notes || "",
    status: "pendiente",
    createdAt: new Date().toISOString(),
  }

  reservations.push(newRes)
  res.status(201).json({ ok: true, data: newRes, message: "Reserva creada exitosamente" })
})

/* ── PATCH /api/reservations/:id/status ── solo admin */
router.patch("/:id/status", verifyToken, requireAdmin, (req, res) => {
  const { status } = req.body
  const valid = ["pendiente", "confirmada", "cancelada"]

  if (!valid.includes(status)) {
    return res.status(400).json({ ok: false, message: "Estado inválido" })
  }

  const res_ = reservations.find(r => r.id === req.params.id)
  if (!res_) return res.status(404).json({ ok: false, message: "Reserva no encontrada" })

  res_.status = status
  res.json({ ok: true, data: res_, message: `Reserva ${status}` })
})

/* ── DELETE /api/reservations/:id ── admin o dueño */
router.delete("/:id", verifyToken, (req, res) => {
  const idx = reservations.findIndex(r => r.id === req.params.id)
  if (idx === -1) return res.status(404).json({ ok: false, message: "Reserva no encontrada" })

  const res_ = reservations[idx]
  if (req.user.role !== "admin" && res_.userId !== req.user.id) {
    return res.status(403).json({ ok: false, message: "Acceso denegado" })
  }

  reservations.splice(idx, 1)
  res.json({ ok: true, message: "Reserva cancelada" })
})

module.exports = router