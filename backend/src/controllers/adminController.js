const pool = require("../config/db")

// ── DASHBOARD STATS ──
const getStats = async (req, res) => {
  try {
    const [usuarios, pedidos, reservas, membresias, ingresos, topProductos] =
      await Promise.all([
        pool.query("SELECT COUNT(*) FROM users WHERE activo=true"),
        pool.query("SELECT COUNT(*), estado FROM pedidos GROUP BY estado"),
        pool.query(`SELECT COUNT(*) FROM reservas
                    WHERE fecha >= CURRENT_DATE AND estado IN ('pendiente','confirmada')`),
        pool.query("SELECT COUNT(*), plan FROM membresias WHERE activo=true GROUP BY plan"),
        pool.query(`SELECT COALESCE(SUM(total),0) as total_mes FROM pedidos
                    WHERE estado != 'cancelado'
                    AND created_at >= date_trunc('month', NOW())`),
        pool.query(`SELECT p.nombre, SUM(pi.cantidad) as vendidos, SUM(pi.subtotal) as ingresos
                    FROM pedido_items pi
                    JOIN productos p ON p.id = pi.producto_id
                    GROUP BY p.id, p.nombre
                    ORDER BY vendidos DESC LIMIT 5`),
      ])

    const pedidosObj = {}
    pedidos.rows.forEach(r => { pedidosObj[r.estado] = parseInt(r.count) })

    const membresiasObj = {}
    membresias.rows.forEach(r => { membresiasObj[r.plan] = parseInt(r.count) })

    res.json({
      usuarios:          parseInt(usuarios.rows[0].count),
      pedidos:           pedidosObj,
      reservas_proximas: parseInt(reservas.rows[0].count),
      membresias:        membresiasObj,
      ingresos_mes:      parseFloat(ingresos.rows[0].total_mes),
      top_productos:     topProductos.rows,
    })
  } catch (err) {
    console.error("getStats error:", err.message)
    res.status(500).json({ error: "Error al obtener estadísticas" })
  }
}

// ── USUARIOS ──
const getUsuarios = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query
    const offset = (page - 1) * limit
    const params = []
    const conditions = []

    if (search) {
      params.push(`%${search}%`)
      conditions.push(`(nombre ILIKE $${params.length} OR email ILIKE $${params.length})`)
    }

    const where = conditions.length ? "WHERE " + conditions.join(" AND ") : ""
    params.push(limit, offset)

    const { rows } = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.telefono, u.rol, u.activo, u.created_at,
              m.plan as membresia_plan, m.activo as membresia_activa
       FROM users u
       LEFT JOIN membresias m ON m.user_id = u.id
       ${where}
       ORDER BY u.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios" })
  }
}

// ── TOGGLE ACTIVO USUARIO ──
const toggleUsuario = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE users SET activo = NOT activo, updated_at=NOW()
       WHERE id=$1 AND rol != 'admin'
       RETURNING id, nombre, email, activo`,
      [req.params.id]
    )
    if (!rows[0]) return res.status(404).json({ error: "Usuario no encontrado" })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar usuario" })
  }
}

// ── ELIMINAR USUARIO ──
const deleteUsuario = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT rol FROM users WHERE id=$1",
      [req.params.id]
    )
    if (!rows[0]) return res.status(404).json({ error: "Usuario no encontrado" })
    if (rows[0].rol === "admin") {
      return res.status(403).json({ error: "No puedes eliminar un administrador" })
    }
    await pool.query("DELETE FROM users WHERE id=$1", [req.params.id])
    res.json({ message: "Usuario eliminado" })
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar usuario" })
  }
}

module.exports = { getStats, getUsuarios, toggleUsuario, deleteUsuario }