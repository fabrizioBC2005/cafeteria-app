const express = require("express")
const router  = express.Router()
const {
  getMesasOcupadas, createReserva, getMisReservas,
  getAllReservas, updateEstadoReserva, cancelarReserva
} = require("../controllers/reservasController")
const { auth, staffOrAdmin } = require("../middleware/auth")

router.get("/mesas-ocupadas",   getMesasOcupadas)
router.post("/",                createReserva)
router.get("/mis-reservas",     auth, getMisReservas)
router.get("/",                 auth, staffOrAdmin, getAllReservas)
router.put("/:id/estado",       auth, staffOrAdmin, updateEstadoReserva)
router.put("/:id/cancelar",     auth, cancelarReserva)

module.exports = router