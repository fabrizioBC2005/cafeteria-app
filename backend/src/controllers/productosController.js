const pool = require("../config/db")

// ── GET ALL ──
const getProductos = async (req, res) => {
  try {
    const { categoria, search, destacado, page = 1, limit = 20 } = req.query
    const offset = (page - 1) * limit
    const params = []
    const conditions = ["p.activo = true"]

    if (categoria && categoria !== "all") {
      params.push(categoria)
      conditions.push(`c.slug = $${params.length}`)
    }

    if (search) {
      params.push(`%${search}%`)
      conditions.push(`(p.nombre ILIKE $${params.length} OR p.descripcion ILIKE $${params.length})`)
    }

    if (destacado === "true") {
      conditions.push("p.destacado = true")
    }

    const where = conditions.length ? "WHERE " + conditions.join(" AND ") : ""

    params.push(limit, offset)
    const { rows } = await pool.query(
      `SELECT p.*, c.nombre as categoria_nombre, c.slug as categoria_slug
       FROM productos p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       ${where}
       ORDER BY p.destacado DESC, p.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    )

    const countParams = params.slice(0, -2)
    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) FROM productos p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       ${where}`,
      countParams
    )

    res.json({
      productos: rows,
      total: parseInt(countRows[0].count),
      page: parseInt(page),
      pages: Math.ceil(countRows[0].count / limit),
    })
  } catch (err) {
    console.error("getProductos error:", err.message)
    res.status(500).json({ error: "Error al obtener productos" })
  }
}

// ── GET ONE ──
const getProducto = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, c.nombre as categoria_nombre, c.slug as categoria_slug
       FROM productos p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       WHERE p.id = $1 AND p.activo = true`,
      [req.params.id]
    )
    if (!rows[0]) return res.status(404).json({ error: "Producto no encontrado" })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: "Error al obtener producto" })
  }
}

// ── CREATE ──
const createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, precio_oferta, stock, imagen,
            categoria_id, origen, peso, destacado } = req.body

    const slug = nombre.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    const { rows } = await pool.query(
      `INSERT INTO productos (nombre, slug, descripcion, precio, precio_oferta,
        stock, imagen, categoria_id, origen, peso, destacado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [nombre, slug, descripcion, precio, precio_oferta || null,
       stock || 0, imagen, categoria_id || null, origen, peso, destacado || false]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error("createProducto error:", err.message)
    res.status(500).json({ error: "Error al crear producto" })
  }
}

// ── UPDATE ──
const updateProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, precio_oferta, stock,
            imagen, categoria_id, origen, peso, destacado, activo } = req.body

    const { rows } = await pool.query(
      `UPDATE productos SET
        nombre=$1, descripcion=$2, precio=$3, precio_oferta=$4, stock=$5,
        imagen=$6, categoria_id=$7, origen=$8, peso=$9,
        destacado=$10, activo=$11, updated_at=NOW()
       WHERE id=$12 RETURNING *`,
      [nombre, descripcion, precio, precio_oferta || null, stock,
       imagen, categoria_id || null, origen, peso, destacado, activo, req.params.id]
    )
    if (!rows[0]) return res.status(404).json({ error: "Producto no encontrado" })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar producto" })
  }
}

// ── DELETE ──
const deleteProducto = async (req, res) => {
  try {
    await pool.query(
      "UPDATE productos SET activo=false, updated_at=NOW() WHERE id=$1",
      [req.params.id]
    )
    res.json({ message: "Producto eliminado" })
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar producto" })
  }
}

// ── CATEGORÍAS ──
const getCategorias = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM categorias WHERE activo=true ORDER BY orden ASC"
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: "Error al obtener categorías" })
  }
}

module.exports = {
  getProductos, getProducto, createProducto,
  updateProducto, deleteProducto, getCategorias
}