const express = require("express")
const router  = express.Router()
const {
  getProductos, getProducto, createProducto,
  updateProducto, deleteProducto, getCategorias
} = require("../controllers/productosController")
const { auth, adminOnly } = require("../middleware/auth")

router.get("/",               getProductos)
router.get("/categorias",     getCategorias)
router.get("/:id",            getProducto)
router.post("/",              auth, adminOnly, createProducto)
router.put("/:id",            auth, adminOnly, updateProducto)
router.delete("/:id",         auth, adminOnly, deleteProducto)

module.exports = router