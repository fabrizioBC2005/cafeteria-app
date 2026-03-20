const pool = require("../config/db")
const { sendReservaConfirmation } = require("../utils/emailService")

// ── MESAS OCUPADAS POR FECHA ──
const getMesasOcupadas = async (req, res) => {
  try {
    const { fecha } = req.query
    if (!fecha) return res.status(400).json({ error: "Fecha requerida" })

    const { rows } = await pool.query(
      `SELECT DISTINCT mesa_id FROM reservas
       WHERE fecha = $1 AND estado IN ('pendiente','confirmada')`,
      [fecha]
    )
    res.json(rows.map(r => r.mesa_id))
  } catch (err) {
    res.status(500).json({ error: "Error al obtener mesas" })
  }
}

// ── CREAR RESERVA ──
const createReserva = async (req, res) => {
  try {
    const { nombre, email, telefono, fecha, hora, personas,
            mesa_id, zona, ocasion, notas } = req.body

    if (!nombre || !email || !fecha || !hora || !mesa_id) {
      return res.status(400).json({ error: "Faltan campos requeridos" })
    }

    // Verificar disponibilidad
    const ocupada = await pool.query(
      `SELECT id FROM reservas
       WHERE mesa_id=$1 AND fecha=$2 AND estado IN ('pendiente','confirmada')`,
      [mesa_id, fecha]
    )
    if (ocupada.rows[0]) {
      return res.status(409).json({ error: "Mesa no disponible en esa fecha" })
    }

    const { rows } = await pool.query(
      `INSERT INTO reservas
        (user_id, nombre, email, telefono, fecha, hora, personas, mesa_id, zona, ocasion, notas)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [req.user?.id || null, nombre, email, telefono, fecha, hora,
       personas, mesa_id, zona, ocasion, notas]
    )

    // Email de confirmación (no bloqueante)
    sendReservaConfirmation({
      nombre,
      email,
      reserva: rows[0],
    }).catch(console.error)

    res.status(201).json(rows[0])
  } catch (err) {
    console.error("createReserva error:", err.message)
    res.status(500).json({ error: "Error al crear reserva" })
  }
}

// ── MIS RESERVAS ──
const getMisReservas = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM reservas WHERE user_id=$1 ORDER BY fecha DESC, hora DESC`,
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: "Error al obtener reservas" })
  }
}

// ── ADMIN: TODAS LAS RESERVAS ──
const getAllReservas = async (req, res) => {
  try {
    const { fecha, estado } = req.query
    const params = []
    const conditions = []

    if (fecha) {
      params.push(fecha)
      conditions.push(`r.fecha = $${params.length}`)
    }
    if (estado) {
      params.push(estado)
      conditions.push(`r.estado = $${params.length}`)
    }

    const where = conditions.length ? "WHERE " + conditions.join(" AND ") : ""

    const { rows } = await pool.query(
      `SELECT r.*, u.email as user_email FROM reservas r
       LEFT JOIN users u ON u.id = r.user_id
       ${where}
       ORDER BY r.fecha ASC, r.hora ASC`,
      params
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: "Error al obtener reservas" })
  }
}

// ── ACTUALIZAR ESTADO ──
const updateEstadoReserva = async (req, res) => {
  try {
    const { estado } = req.body
    const { rows } = await pool.query(
      `UPDATE reservas SET estado=$1, updated_at=NOW()
       WHERE id=$2 RETURNING *`,
      [estado, req.params.id]
    )
    if (!rows[0]) return res.status(404).json({ error: "Reserva no encontrada" })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar reserva" })
  }
}

// ── CANCELAR (usuario) ──
const cancelarReserva = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE reservas SET estado='cancelada', updated_at=NOW()
       WHERE id=$1 AND user_id=$2 RETURNING *`,
      [req.params.id, req.user.id]
    )
    if (!rows[0]) return res.status(404).json({ error: "Reserva no encontrada" })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: "Error al cancelar reserva" })
  }
}

module.exports = {
  getMesasOcupadas, createReserva, getMisReservas,
  getAllReservas, updateEstadoReserva, cancelarReserva
}