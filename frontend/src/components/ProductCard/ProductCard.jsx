import { useState } from "react"
import { useCart } from "../../Context/CartContext"
import "./ProductCard.css"

function ProductCard({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem({
      id:    product.id,
      name:  product.nombre,
      price: parseFloat(product.precio),
      img:   product.imagen,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const precioOferta = product.precio_oferta
    ? parseFloat(product.precio_oferta)
    : null
  const precio = parseFloat(product.precio)

  return (
    <div className="product-card">

      {/* Badge destacado o categoria */}
      {product.destacado && (
        <span className="product-badge">Destacado</span>
      )}

      {/* Stock bajo */}
      {product.stock < 10 && product.stock > 0 && (
        <span className="product-badge low-stock">Últimas {product.stock} unidades</span>
      )}

      {product.stock === 0 && (
        <span className="product-badge out-stock">Agotado</span>
      )}

      <div className="product-image-wrapper">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="product-img"
        />
        {product.origen && (
          <span className="product-origin">📍 {product.origen}</span>
        )}
      </div>

      <div className="product-info">
        <p className="product-category">{product.categoria_nombre}</p>
        <h3 className="product-name">{product.nombre}</h3>
        <p className="product-desc">{product.descripcion}</p>

        {product.peso && (
          <p className="product-weight">⚖️ {product.peso}</p>
        )}

        <div className="product-footer">
          <div className="product-prices">
            {precioOferta ? (
              <>
                <span className="product-price">S/ {precioOferta.toFixed(2)}</span>
                <span className="product-price-original">S/ {precio.toFixed(2)}</span>
              </>
            ) : (
              <span className="product-price">S/ {precio.toFixed(2)}</span>
            )}
          </div>

          <button
            className={`btn-add ${added ? "added" : ""} ${product.stock === 0 ? "disabled" : ""}`}
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            {added ? "✓ Añadido" : product.stock === 0 ? "Agotado" : "+ Añadir"}
          </button>
        </div>
      </div>

    </div>
  )
}

export default ProductCard
