import { useState } from "react"
import ProductCard from "../../components/ProductCard/ProductCard"
import { products, categories } from "../../data/products"
import "./Menu.css"

function Menu() {
  const [activeCategory, setActiveCategory] = useState("all")

  const filtered = activeCategory === "all"
    ? products
    : products.filter(p => p.category === activeCategory)

  return (
    <main className="menu-page">
      {/* HEADER */}
      <div className="menu-header">
        <p className="menu-eyebrow">— Selección Artesanal —</p>
        <h1 className="menu-title">Nuestro Menú</h1>
        <p className="menu-subtitle">
          Cada taza cuenta una historia. Explora nuestros orígenes,
          blends y preparaciones especiales.
        </p>
      </div>

      {/* FILTROS */}
      <div className="menu-filters">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`filter-btn ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="menu-grid">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="menu-empty">No hay productos en esta categoría.</p>
      )}
    </main>
  )
}

export default Menu