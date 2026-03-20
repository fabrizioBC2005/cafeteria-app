const express = require("express")
const { verifyToken, requireAdmin } = require("../middleware/auth")

const router = express.Router()

/* ── BASE DE DATOS EN MEMORIA ── */
let orders = [
  {
    id: "LOC-28471", userId: null, customer: { name: "María García", phone: "+51 987 654 321", address: "Av. Lima 123", reference: "Frente al parque" },
    items: [{ productId: 1, name: "Espresso Intenso", price: 15.00, quantity: 2 }, { productId: 3, name: "Mezcla de la Casa", price: 20.00, quantity: 1 }],
    subtotal: 50.00, delivery: 5.00, total: 55.00,
    method: "Tarjeta", status: "entregado", date: "2025-07-14T10:30:00Z",
  },
  {
    id: "LOC-28472", userId: null, customer: { name: "Carlos Mendoza", phone: "+51 976 543 210", address: "Jr. Cusco 456", reference: "Piso 2" },
    items: [{ productId: 4, name: "Cold Brew Premium", price: 22.00, quantity: 1 }],
    subtotal: 22.00, delivery: 5.00, total: 27.00,
    method: "Yape", status: "en camino", date: "2025-07-14T11:00:00Z",
  },
]
let orderCounter = 28473

function generateOrderId() {
  return `LOC-${orderCounter++}`
}

/* ── GET /api/orders ── admin ve todos, usuario ve los suyos */
router.get("/", verifyToken, (req, res) => {
  const { status, page = 1, limit = 20 } = req.query

  let result = req.user.role === "admin"
    ? [...orders]
    : orders.filter(o => o.userId === req.user.id)

  if (status && status !== "todos") {
    result = result.filter(o => o.status === status)
  }

  // Paginación simple
  const start = (parseInt(page) - 1) * parseInt(limit)
  const paginated = result.slice(start, start + parseInt(limit))

  res.json({ ok: true, data: paginated, total: result.length, page: parseInt(page) })
})

/* ── GET /api/orders/:id ── */
router.get("/:id", verifyToken, (req, res) => {
  const order = orders.find(o => o.id === req.params.id)
  if (!order) return res.status(404).json({ ok: false, message: "Pedido no encontrado" })

  // Usuario solo puede ver sus propios pedidos
  if (req.user.role !== "admin" && order.userId !== req.user.id) {
    return res.status(403).json({ ok: false, message: "Acceso denegado" })
  }
  res.json({ ok: true, data: order })
})

/* ── POST /api/orders ── crear pedido (autenticado o no) */
router.post("/", (req, res) => {
  const { customer, items, method } = req.body

  if (!customer?.name || !customer?.phone || !customer?.address) {
    return res.status(400).json({ ok: false, message: "Datos de contacto incompletos" })
  }
  if (!items || items.length === 0) {
    return res.status(400).json({ ok: false, message: "El pedido no tiene productos" })
  }
  if (!method) {
    return res.status(400).json({ ok: false, message: "Método de pago requerido" })
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const delivery = 5.00
  const total    = subtotal + delivery

  // Obtener userId si viene token (opcional)
  let userId = null
  const authHeader = req.headers["authorization"]
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const jwt = require("jsonwebtoken")
      const { JWT_SECRET } = require("../middleware/auth")
      const decoded = jwt.verify(authHeader.split(" ")[1], JWT_SECRET)
      userId = decoded.id
    } catch { /* token inválido, pedido anónimo */ }
  }

  const newOrder = {
    id: generateOrderId(),
    userId,
    customer,
    items,
    subtotal: parseFloat(subtotal.toFixed(2)),
    delivery,
    total: parseFloat(total.toFixed(2)),
    method,
    status: "pendiente",
    date: new Date().toISOString(),
  }

  orders.push(newOrder)
  res.status(201).json({ ok: true, data: newOrder, message: "Pedido creado exitosamente" })
})

/* ── PATCH /api/orders/:id/status ── solo admin */
router.patch("/:id/status", verifyToken, requireAdmin, (req, res) => {
  const { status } = req.body
  const validStatuses = ["pendiente", "preparando", "en camino", "entregado", "cancelado"]

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ ok: false, message: "Estado inválido" })
  }

  const order = orders.find(o => o.id === req.params.id)
  if (!order) return res.status(404).json({ ok: false, message: "Pedido no encontrado" })

  order.status = status
  res.json({ ok: true, data: order, message: `Pedido actualizado a: ${status}` })
})

/* ── DELETE /api/orders/:id ── solo admin */
router.delete("/:id", verifyToken, requireAdmin, (req, res) => {
  const idx = orders.findIndex(o => o.id === req.params.id)
  if (idx === -1) return res.status(404).json({ ok: false, message: "Pedido no encontrado" })
  orders.splice(idx, 1)
  res.json({ ok: true, message: "Pedido eliminado" })
})

module.exports = router