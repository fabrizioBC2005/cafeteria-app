const express  = require("express")
const router   = express.Router()
const { createPedido, getMisPedidos, getAllPedidos, updateEstado } = require("../controllers/pedidosController")
const { auth, adminOnly, staffOrAdmin } = require("../middleware/auth")

router.post("/",              auth, createPedido)
router.get("/mis-pedidos",    auth, getMisPedidos)
router.get("/",               auth, staffOrAdmin, getAllPedidos)
router.put("/:id/estado",     auth, staffOrAdmin, updateEstado)

module.exports = router