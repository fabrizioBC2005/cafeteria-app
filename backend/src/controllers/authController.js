const pool   = require("../config/db")
const bcrypt = require("bcryptjs")
const jwt    = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")
const { sendWelcome } = require("../utils/emailService")

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  )

// ── REGISTER ──
const register = async (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Nombre, email y contraseña son requeridos" })
    }

    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [email])
    if (exists.rows[0]) {
      return res.status(409).json({ error: "El correo ya está registrado" })
    }

    const hash = await bcrypt.hash(password, 10)
    const { rows } = await pool.query(
      `INSERT INTO users (nombre, email, password, telefono)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, rol, created_at`,
      [nombre, email, hash, telefono || null]
    )

    const user  = rows[0]
    const token = generateToken(user)

    // Email de bienvenida (no bloqueante)
    sendWelcome({ nombre: user.nombre, email: user.email }).catch(console.error)

    res.status(201).json({ user, token })
  } catch (err) {
    console.error("register error:", err.message)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

// ── LOGIN ──
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña requeridos" })
    }

    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND activo = true",
      [email]
    )

    const user = rows[0]
    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: "Credenciales incorrectas" })
    }

    const token = generateToken(user)
    const { password: _, ...safeUser } = user

    res.json({ user: safeUser, token })
  } catch (err) {
    console.error("login error:", err)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

// ── PERFIL ──
const getProfile = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.telefono, u.rol, u.avatar, u.created_at,
              m.plan, m.codigo, m.puntos, m.compras_count, m.activo as membresia_activa
       FROM users u
       LEFT JOIN membresias m ON m.user_id = u.id
       WHERE u.id = $1`,
      [req.user.id]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: "Error al obtener perfil" })
  }
}

// ── UPDATE PERFIL ──
const updateProfile = async (req, res) => {
  try {
    const { nombre, telefono } = req.body
    const { rows } = await pool.query(
      `UPDATE users SET nombre=$1, telefono=$2, updated_at=NOW()
       WHERE id=$3
       RETURNING id, nombre, email, telefono, rol`,
      [nombre, telefono, req.user.id]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar perfil" })
  }
}

module.exports = { register, login, getProfile, updateProfile }