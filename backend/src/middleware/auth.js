const jwt = require("jsonwebtoken")
const pool = require("../config/db")

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token requerido" })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const { rows } = await pool.query(
      "SELECT id, nombre, email, rol, activo FROM users WHERE id = $1",
      [decoded.id]
    )

    if (!rows[0] || !rows[0].activo) {
      return res.status(401).json({ error: "Usuario no autorizado" })
    }

    req.user = rows[0]
    next()
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" })
  }
}

const adminOnly = (req, res, next) => {
  if (req.user?.rol !== "admin") {
    return res.status(403).json({ error: "Acceso solo para administradores" })
  }
  next()
}

const staffOrAdmin = (req, res, next) => {
  if (!["admin", "staff"].includes(req.user?.rol)) {
    return res.status(403).json({ error: "Acceso no autorizado" })
  }
  next()
}

module.exports = { auth, adminOnly, staffOrAdmin }