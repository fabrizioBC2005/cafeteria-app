import { useState, useEffect } from "react"
import ProductCard from "../../components/ProductCard/ProductCard"
import { productosService } from "../../services/api.ts"
import "./Menu.css"

function Menu() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState("")

  // Cargar categorías
  useEffect(() => {
    productosService.getCategorias().then(({ data }) => {
      setCategories(data)
    }).catch(console.error)
  }, [])

  // Cargar productos cuando cambia la categoría
  useEffect(() => {
    setLoading(true)
    const params = {}
    if (activeCategory !== "all") params.categoria = activeCategory
    if (search) params.search = search

    productosService.getAll(params).then(({ data }) => {
      setProducts(data.productos)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [activeCategory, search])

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

      {/* BUSCADOR */}
      <div className="menu-search-wrap">
        <input
          className="menu-search"
          placeholder="🔍 Buscar producto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* FILTROS */}
      <div className="menu-filters">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`filter-btn ${activeCategory === cat.slug ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.slug)}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="menu-loading">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className="product-card-skeleton" />
          ))}
        </div>
      )}

      {/* GRID */}
      {!loading && (
        <div className="menu-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <p className="menu-empty">No hay productos en esta categoría.</p>
      )}

    </main>
  )
}

export default Menu
