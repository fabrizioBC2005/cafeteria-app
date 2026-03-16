import "./ProductCard.css"

function ProductCard({ product }) {
  return (
    <div className="product-card">
      {product.badge && (
        <span className="product-badge">{product.badge}</span>
      )}
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} className="product-img" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button className="btn-add">+ Añadir</button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard