const express = require("express")
const { verifyToken, requireAdmin } = require("../middleware/auth")

const router = express.Router()

/* ── BASE DE DATOS EN MEMORIA ── */
let products = [
  { id: 1, name: "Espresso Intenso",   price: 15.00, category: "espresso",       stock: 42, badge: "Más vendido",  active: true,  image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&q=80",  description: "Tostado oscuro con notas de chocolate amargo y caramelo." },
  { id: 2, name: "Arabica Suave",      price: 18.00, category: "single-origin",  stock: 18, badge: "Single Origin",active: true,  image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80", description: "Origen Etiopía. Notas florales con acidez cítrica." },
  { id: 3, name: "Mezcla de la Casa",  price: 20.00, category: "blend",          stock: 30, badge: "Exclusivo",    active: true,  image: "https://images.unsplash.com/photo-1501492673258-2af7d42e4efd?w=500&q=80", description: "Blend exclusivo de tres orígenes." },
  { id: 4, name: "Cold Brew Premium",  price: 22.00, category: "cold",           stock: 10, badge: "Nuevo",        active: true,  image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80", description: "Maceración en frío por 18 horas." },
  { id: 5, name: "Latte de Temporada", price: 17.00, category: "leche",          stock: 25, badge: null,           active: true,  image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&q=80", description: "Espresso doble con leche vaporizada y sirope de vainilla." },
  { id: 6, name: "Robusta Intenso",    price: 14.00, category: "espresso",       stock: 55, badge: null,           active: true,  image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80", description: "Tostado muy oscuro, ideal para amantes del café fuerte." },
]
let nextId = 7

/* ── GET /api/menu ── público */
router.get("/", (req, res) => {
  const { category, search } = req.query
  let result = products.filter(p => p.active)

  if (category && category !== "all") {
    result = result.filter(p => p.category === category)
  }
  if (search) {
    result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
  }
  res.json({ ok: true, data: result, total: result.length })
})

/* ── GET /api/menu/:id ── público */
router.get("/:id", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id))
  if (!product) return res.status(404).json({ ok: false, message: "Producto no encontrado" })
  res.json({ ok: true, data: product })
})

/* ── POST /api/menu ── solo admin */
router.post("/", verifyToken, requireAdmin, (req, res) => {
  const { name, price, category, stock, badge, image, description } = req.body
  if (!name || !price || !category) {
    return res.status(400).json({ ok: false, message: "Nombre, precio y categoría son requeridos" })
  }
  const newProduct = {
    id: nextId++,
    name, price: parseFloat(price), category,
    stock: parseInt(stock) || 0,
    badge: badge || null,
    image: image || "",
    description: description || "",
    active: true,
  }
  products.push(newProduct)
  res.status(201).json({ ok: true, data: newProduct, message: "Producto creado" })
})

/* ── PUT /api/menu/:id ── solo admin */
router.put("/:id", verifyToken, requireAdmin, (req, res) => {
  const idx = products.findIndex(p => p.id === parseInt(req.params.id))
  if (idx === -1) return res.status(404).json({ ok: false, message: "Producto no encontrado" })

  products[idx] = {
    ...products[idx],
    ...req.body,
    id: products[idx].id,
    price: parseFloat(req.body.price) || products[idx].price,
    stock: parseInt(req.body.stock) ?? products[idx].stock,
  }
  res.json({ ok: true, data: products[idx], message: "Producto actualizado" })
})

/* ── DELETE /api/menu/:id ── solo admin */
router.delete("/:id", verifyToken, requireAdmin, (req, res) => {
  const idx = products.findIndex(p => p.id === parseInt(req.params.id))
  if (idx === -1) return res.status(404).json({ ok: false, message: "Producto no encontrado" })
  products.splice(idx, 1)
  res.json({ ok: true, message: "Producto eliminado" })
})

module.exports = router