const express = require("express")
const router  = express.Router()
const {
  getMiMembresia, suscribir, cancelarMembresia,
  getAllMembresias, validarQR
} = require("../controllers/membresiaController")
const { auth, adminOnly, staffOrAdmin } = require("../middleware/auth")

router.get("/mi-membresia",        auth, getMiMembresia)
router.post("/suscribir",          auth, suscribir)
router.put("/cancelar",            auth, cancelarMembresia)
router.get("/",                    auth, adminOnly, getAllMembresias)
router.get("/validar/:codigo",     auth, staffOrAdmin, validarQR)

module.exports = router