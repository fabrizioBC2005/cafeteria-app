const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET || "locafe_secret_dev_change_in_production"

/**
 * Middleware — verifica el JWT del header Authorization: Bearer <token>
 * Si es válido, inyecta req.user con { id, email, name, role }
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"]

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, message: "Token requerido" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ ok: false, message: "Token expirado, inicia sesión de nuevo" })
    }
    return res.status(401).json({ ok: false, message: "Token inválido" })
  }
}

/**
 * Middleware — solo permite acceso a usuarios con rol "admin"
 * Usar DESPUÉS de verifyToken
 */
function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ ok: false, message: "Acceso denegado — solo administradores" })
  }
  next()
}

module.exports = { verifyToken, requireAdmin, JWT_SECRET }