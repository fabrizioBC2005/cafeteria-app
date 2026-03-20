const express = require("express")
const bcrypt  = require("bcryptjs")
const jwt     = require("jsonwebtoken")
const { verifyToken, JWT_SECRET } = require("../middleware/auth")
const db = require("../db")

const router = express.Router()

function generateTokens(user) {
  const payload = { id: user.id, email: user.email, name: user.name, role: user.role }
  const accessToken  = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" })
  const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET + "_refresh", { expiresIn: "7d" })
  return { accessToken, refreshToken }
}

function safeUser(user) {
  const { passwordHash, ...safe } = user
  return safe
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ ok: false, message: "Nombre, email y contrasena son requeridos" })
    if (password.length < 6)
      return res.status(400).json({ ok: false, message: "La contrasena debe tener al menos 6 caracteres" })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ ok: false, message: "Email invalido" })
    const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (exists)
      return res.status(409).json({ ok: false, message: "Ya existe una cuenta con ese email" })
    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = {
      id: db.incrementId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: "user",
      createdAt: new Date().toISOString(),
    }
    db.users.push(newUser)
    const { accessToken, refreshToken } = generateTokens(newUser)
    res.status(201).json({ ok: true, message: "Cuenta creada exitosamente", user: safeUser(newUser), accessToken, refreshToken })
  } catch (err) {
    console.error("Error en registro:", err)
    res.status(500).json({ ok: false, message: "Error al crear la cuenta" })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ ok: false, message: "Email y contrasena requeridos" })
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user)
      return res.status(401).json({ ok: false, message: "Credenciales incorrectas" })
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid)
      return res.status(401).json({ ok: false, message: "Credenciales incorrectas" })
    const { accessToken, refreshToken } = generateTokens(user)
    res.json({ ok: true, message: "Sesion iniciada", user: safeUser(user), accessToken, refreshToken })
  } catch (err) {
    console.error("Error en login:", err)
    res.status(500).json({ ok: false, message: "Error al iniciar sesion" })
  }
})

router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken)
    return res.status(400).json({ ok: false, message: "Refresh token requerido" })
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET + "_refresh")
    const user = db.users.find(u => u.id === decoded.id)
    if (!user)
      return res.status(401).json({ ok: false, message: "Usuario no encontrado" })
    const { accessToken, refreshToken: newRefresh } = generateTokens(user)
    res.json({ ok: true, accessToken, refreshToken: newRefresh })
  } catch {
    res.status(401).json({ ok: false, message: "Refresh token invalido o expirado" })
  }
})

router.get("/me", verifyToken, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id)
  if (!user)
    return res.status(404).json({ ok: false, message: "Usuario no encontrado" })
  res.json({ ok: true, user: safeUser(user) })
})

router.post("/logout", verifyToken, (_req, res) => {
  res.json({ ok: true, message: "Sesion cerrada" })
})

module.exports = router