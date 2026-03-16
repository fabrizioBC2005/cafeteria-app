import { useCart } from "../../Context/CartContext"
import "./CartSidebar.css"

interface CartSidebarProps {
  setPage: (page: string) => void
}

function CartSidebar({ setPage }: CartSidebarProps) {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCart()

  const handleCheckout = () => {
    closeCart()
    setPage("checkout")
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? "open" : ""}`}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <aside className={`cart-sidebar ${isOpen ? "open" : ""}`}>

        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-left">
            <h2 className="cart-title">Tu Pedido</h2>
            {count > 0 && (
              <span className="cart-count-badge">{count} ítem{count !== 1 ? "s" : ""}</span>
            )}
          </div>
          <button className="cart-close-btn" onClick={closeCart} aria-label="Cerrar carrito">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty-icon">☕</span>
              <p>Tu carrito está vacío</p>
              <button className="cart-browse-btn" onClick={() => { closeCart(); setPage("menu") }}>
                Ver menú →
              </button>
            </div>
          ) : (
            items.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.img} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">S/ {(item.price * item.quantity).toFixed(2)}</p>
                  <div className="cart-item-qty">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeItem(item.id)}
                  aria-label="Eliminar"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
            <div className="cart-delivery-note">
              🏪 Recojo en tienda o delivery disponible
            </div>
            <button className="cart-checkout-btn" onClick={handleCheckout}>
              Ir al pago — S/ {total.toFixed(2)}
            </button>
            <button className="cart-continue-btn" onClick={closeCart}>
              Seguir comprando
            </button>
          </div>
        )}

      </aside>
    </>
  )
}

export default CartSidebar
