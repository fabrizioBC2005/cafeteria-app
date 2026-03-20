const express = require("express")
const bcrypt  = require("bcryptjs")
const { verifyToken, requireAdmin } = require("../middleware/auth")
const db = require("../db")

const router = express.Router()

router.get("/", verifyToken, requireAdmin, (req, res) => {
  const { search, role } = req.query
  let result = db.users.map(({ passwordHash, ...u }) => u)
  if (search) result = result.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )
  if (role) result = result.filter(u => u.role === role)
  res.json({ ok: true, data: result, total: result.length })
})

router.get("/:id", verifyToken, (req, res) => {
  const id = parseInt(req.params.id)
  if (req.user.role !== "admin" && req.user.id !== id)
    return res.status(403).json({ ok: false, message: "Acceso denegado" })
  const user = db.users.find(u => u.id === id)
  if (!user) return res.status(404).json({ ok: false, message: "Usuario no encontrado" })
  const { passwordHash, ...safe } = user
  res.json({ ok: true, data: safe })
})

router.put("/:id", verifyToken, async (req, res) => {
  const id = parseInt(req.params.id)
  if (req.user.role !== "admin" && req.user.id !== id)
    return res.status(403).json({ ok: false, message: "Acceso denegado" })
  const idx = db.users.findIndex(u => u.id === id)
  if (idx === -1) return res.status(404).json({ ok: false, message: "Usuario no encontrado" })
  const { name, email, password, role } = req.body
  const updates = {}
  if (name) updates.name = name.trim()
  if (email) {
    const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== id)
    if (exists) return res.status(409).json({ ok: false, message: "Ese email ya esta en uso" })
    updates.email = email.toLowerCase().trim()
  }
  if (password) {
    if (password.length < 6) return res.status(400).json({ ok: false, message: "Minimo 6 caracteres" })
    updates.passwordHash = await bcrypt.hash(password, 10)
  }
  if (role && req.user.role === "admin") updates.role = role
  db.users[idx] = { ...db.users[idx], ...updates }
  const { passwordHash, ...safe } = db.users[idx]
  res.json({ ok: true, data: safe, message: "Perfil actualizado" })
})

router.delete("/:id", verifyToken, requireAdmin, (req, res) => {
  const id = parseInt(req.params.id)
  if (id === req.user.id)
    return res.status(400).json({ ok: false, message: "No puedes eliminarte a ti mismo" })
  const idx = db.users.findIndex(u => u.id === id)
  if (idx === -1) return res.status(404).json({ ok: false, message: "Usuario no encontrado" })
  db.users.splice(idx, 1)
  res.json({ ok: true, message: "Usuario eliminado" })
})

module.exports = router