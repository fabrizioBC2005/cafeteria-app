const pool = require("../config/db")
const { sendOrderConfirmation } = require("../utils/emailService")

const generateNumero = () => {
  const now = new Date()
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `LOC-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${rand}`
}

// ── CREAR PEDIDO ──
const createPedido = async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const { items, metodo_pago, nombre_cliente, telefono_cliente,
            direccion, referencia, notas } = req.body

    if (!items?.length) {
      return res.status(400).json({ error: "El pedido debe tener al menos un ítem" })
    }

    // Calcular totales y verificar stock
    let subtotal = 0
    const itemsValidos = []

    for (const item of items) {
      const { rows } = await client.query(
        "SELECT id, nombre, precio, stock FROM productos WHERE id=$1 AND activo=true",
        [item.id]
      )
      const producto = rows[0]
      if (!producto) throw new Error(`Producto ${item.id} no encontrado`)
      if (producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para ${producto.nombre}`)
      }
      const itemSubtotal = parseFloat(producto.precio) * item.cantidad
      subtotal += itemSubtotal
      itemsValidos.push({ ...producto, cantidad: item.cantidad, subtotal: itemSubtotal })
    }

    const delivery = 5.00
    const total = subtotal + delivery
    const numero = generateNumero()

    // Crear pedido
    const { rows: pedidoRows } = await client.query(
      `INSERT INTO pedidos
        (user_id, numero, metodo_pago, subtotal, delivery, total,
         nombre_cliente, telefono_cliente, direccion, referencia, notas)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [req.user?.id || null, numero, metodo_pago, subtotal, delivery, total,
       nombre_cliente, telefono_cliente, direccion, referencia, notas]
    )

    const pedido = pedidoRows[0]

    // Insertar ítems y actualizar stock
    for (const item of itemsValidos) {
      await client.query(
        `INSERT INTO pedido_items (pedido_id, producto_id, nombre, precio, cantidad, subtotal)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [pedido.id, item.id, item.nombre, item.precio, item.cantidad, item.subtotal]
      )
      await client.query(
        "UPDATE productos SET stock = stock - $1 WHERE id = $2",
        [item.cantidad, item.id]
      )
    }

    // Sumar puntos si tiene membresía
    if (req.user?.id) {
      await client.query(
        `UPDATE membresias SET
          puntos = puntos + $1,
          compras_count = compras_count + 1,
          updated_at = NOW()
         WHERE user_id = $2`,
        [Math.floor(total), req.user.id]
      )
    }

    await client.query("COMMIT")

    // Email de confirmación (no bloqueante)
    if (req.user?.email) {
      sendOrderConfirmation({
        nombre: req.user.nombre,
        email:  req.user.email,
        pedido,
        items:  itemsValidos,
      }).catch(console.error)
    }

    res.status(201).json({ pedido, items: itemsValidos })
  } catch (err) {
    await client.query("ROLLBACK")
    console.error("createPedido error:", err.message)
    res.status(400).json({ error: err.message })
  } finally {
    client.release()
  }
}

// ── MIS PEDIDOS ──
const getMisPedidos = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, 
        json_agg(json_build_object(
          'nombre', pi.nombre, 'cantidad', pi.cantidad,
          'precio', pi.precio, 'subtotal', pi.subtotal
        )) as items
       FROM pedidos p
       LEFT JOIN pedido_items pi ON pi.pedido_id = p.id
       WHERE p.user_id = $1
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: "Error al obtener pedidos" })
  }
}

// ── ADMIN: TODOS LOS PEDIDOS ──
const getAllPedidos = async (req, res) => {
  try {
    const { estado, page = 1, limit = 20 } = req.query
    const offset = (page - 1) * limit
    const params = []
    const conditions = []

    if (estado) {
      params.push(estado)
      conditions.push(`p.estado = $${params.length}`)
    }

    const where = conditions.length ? "WHERE " + conditions.join(" AND ") : ""
    params.push(limit, offset)

    const { rows } = await pool.query(
      `SELECT p.*, u.nombre as usuario_nombre, u.email as usuario_email,
        json_agg(json_build_object(
          'nombre', pi.nombre, 'cantidad', pi.cantidad, 'subtotal', pi.subtotal
        )) as items
       FROM pedidos p
       LEFT JOIN users u ON u.id = p.user_id
       LEFT JOIN pedido_items pi ON pi.pedido_id = p.id
       ${where}
       GROUP BY p.id, u.nombre, u.email
       ORDER BY p.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: "Error al obtener pedidos" })
  }
}

// ── ACTUALIZAR ESTADO ──
const updateEstado = async (req, res) => {
  try {
    const { estado } = req.body
    const { rows } = await pool.query(
      `UPDATE pedidos SET estado=$1, updated_at=NOW()
       WHERE id=$2 RETURNING *`,
      [estado, req.params.id]
    )
    if (!rows[0]) return res.status(404).json({ error: "Pedido no encontrado" })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar estado" })
  }
}

module.exports = { createPedido, getMisPedidos, getAllPedidos, updateEstado }