const express = require("express")
const router  = express.Router()
const { getStats, getUsuarios, toggleUsuario, deleteUsuario } = require("../controllers/adminController")
const { auth, adminOnly } = require("../middleware/auth")

router.get("/stats",                auth, adminOnly, getStats)
router.get("/usuarios",             auth, adminOnly, getUsuarios)
router.put("/usuarios/:id/toggle",  auth, adminOnly, toggleUsuario)
router.delete("/usuarios/:id",      auth, adminOnly, deleteUsuario)

module.exports = router