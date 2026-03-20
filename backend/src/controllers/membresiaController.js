const pool   = require("../config/db")
const QRCode = require("qrcode")
const { sendMembresiaActivada } = require("../utils/emailService")

const PLANES = {
  classic: { descuento: 10, cafes_cada: 10, precio: 19 },
  gold:    { descuento: 15, cafes_cada: 8,  precio: 39 },
  black:   { descuento: 20, cafes_cada: 5,  precio: 69 },
}

const generateCodigo = (userId, plan) => {
  const rand = Math.floor(10000 + Math.random() * 90000)
  return `LC-${plan.toUpperCase()}-${rand}`
}

// ── GET MI MEMBRESÍA ──
const getMiMembresia = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT m.*, u.nombre, u.email FROM membresias m
       JOIN users u ON u.id = m.user_id
       WHERE m.user_id = $1`,
      [req.user.id]
    )
    if (!rows[0]) return res.status(404).json({ error: "No tienes membresía activa" })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: "Error al obtener membresía" })
  }
}

// ── CREAR / ACTUALIZAR MEMBRESÍA ──
const suscribir = async (req, res) => {
  try {
    const { plan } = req.body

    if (!PLANES[plan]) {
      return res.status(400).json({ error: "Plan no válido" })
    }

    const codigo = generateCodigo(req.user.id, plan)

    // Generar QR
    const qrData = JSON.stringify({ codigo, user: req.user.id, plan })
    const qrUrl  = await QRCode.toDataURL(qrData)

    // Fecha fin: 1 mes
    const fechaFin = new Date()
    fechaFin.setMonth(fechaFin.getMonth() + 1)

    const { rows } = await pool.query(
      `INSERT INTO membresias (user_id, plan, codigo, qr_url, fecha_fin)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (user_id) DO UPDATE SET
         plan=$2, codigo=$3, qr_url=$4,
         fecha_fin=$5, activo=true, updated_at=NOW()
       RETURNING *`,
      [req.user.id, plan, codigo, qrUrl, fechaFin.toISOString().split("T")[0]]
    )

    // Email de activación (no bloqueante)
    const { rows: userRows } = await pool.query(
      "SELECT nombre, email FROM users WHERE id=$1", [req.user.id]
    )
    if (userRows[0]) {
      sendMembresiaActivada({
        nombre:    userRows[0].nombre,
        email:     userRows[0].email,
        membresia: rows[0],
      }).catch(console.error)
    }

    res.status(201).json(rows[0])
  } catch (err) {
    console.error("suscribir error:", err.message)
    res.status(500).json({ error: "Error al crear membresía" })
  }
}

// ── CANCELAR MEMBRESÍA ──
const cancelarMembresia = async (req, res) => {
  try {
    await pool.query(
      "UPDATE membresias SET activo=false, updated_at=NOW() WHERE user_id=$1",
      [req.user.id]
    )
    res.json({ message: "Membresía cancelada" })
  } catch (err) {
    res.status(500).json({ error: "Error al cancelar membresía" })
  }
}

// ── ADMIN: TODAS LAS MEMBRESÍAS ──
const getAllMembresias = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT m.*, u.nombre, u.email, u.telefono FROM membresias m
       JOIN users u ON u.id = m.user_id
       ORDER BY m.created_at DESC`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: "Error al obtener membresías" })
  }
}

// ── VALIDAR QR (staff en caja) ──
const validarQR = async (req, res) => {
  try {
    const { codigo } = req.params
    const { rows } = await pool.query(
      `SELECT m.*, u.nombre, u.email FROM membresias m
       JOIN users u ON u.id = m.user_id
       WHERE m.codigo = $1`,
      [codigo]
    )
    if (!rows[0]) return res.status(404).json({ error: "Código no encontrado" })

    const m = rows[0]
    const plan = PLANES[m.plan]
    const cafesGratis = Math.floor(m.compras_count / plan.cafes_cada)

    res.json({
      valido: m.activo,
      nombre: m.nombre,
      plan: m.plan,
      codigo: m.codigo,
      descuento: plan.descuento,
      puntos: m.puntos,
      compras: m.compras_count,
      cafes_gratis_acumulados: cafesGratis,
    })
  } catch (err) {
    res.status(500).json({ error: "Error al validar código" })
  }
}

module.exports = {
  getMiMembresia, suscribir, cancelarMembresia,
  getAllMembresias, validarQR
}