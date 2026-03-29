import { useState } from "react"
import { useCart } from "../../Context/CartContext"
import { pedidosService } from "../../services/api.ts"
import "./Checkout.css"
import { useNavigate } from "react-router-dom"

type PayMethod = "card" | "yape" | "cash"

interface CardForm {
  name: string
  number: string
  expiry: string
  cvv: string
}

function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [payMethod, setPayMethod] = useState<PayMethod>("card")
  const [loading, setLoading]     = useState(false)
  const [done, setDone]           = useState(false)
  const [orderNum, setOrderNum]   = useState("")
  const [error, setError]         = useState("")

  const [card, setCard] = useState<CardForm>({
    name: "", number: "", expiry: "", cvv: ""
  })

  const [address, setAddress] = useState({
    nombre: "", telefono: "", direccion: "", referencia: ""
  })

  const delivery   = 5.00
  const orderTotal = total + delivery

  const formatCard = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()

  const formatExpiry = (val: string) =>
    val.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const { data } = await pedidosService.create({
        items: items.map(i => ({ id: i.id, cantidad: i.quantity })),
        metodo_pago:      payMethod,
        nombre_cliente:   address.nombre,
        telefono_cliente: address.telefono,
        direccion:        address.direccion,
        referencia:       address.referencia,
      })
      setOrderNum(data.pedido.numero)
      clearCart()
      setDone(true)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error || "Error al procesar el pedido"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <div className="success-ring">
            <div className="success-check">✓</div>
          </div>
          <p className="success-eyebrow">PEDIDO CONFIRMADO</p>
          <h1 className="success-title">Gracias por<br />tu compra!</h1>
          <p className="success-order">Orden <strong>{orderNum}</strong></p>
          <p className="success-desc">
            Recibiras una confirmacion pronto.{" "}
            {payMethod === "cash"
              ? "Recuerda traer el monto exacto al recoger."
              : payMethod === "yape"
              ? "Tu pago por Yape/Plin esta siendo verificado."
              : "Tu pago fue procesado exitosamente."}
          </p>
          <div className="success-summary">
            {items.length > 0
              ? items.map(i => (
                  <div className="success-item" key={i.id}>
                    <span>{i.name} x {i.quantity}</span>
                    <span>S/ {(i.price * i.quantity).toFixed(2)}</span>
                  </div>
                ))
              : <p className="success-item-empty">Pedido procesado</p>
            }
            <div className="success-total">
              <span>Total pagado</span>
              <strong>S/ {orderTotal.toFixed(2)}</strong>
            </div>
          </div>
          <div className="success-btns">
            <button className="checkout-submit-btn" onClick={() => navigate("/")}>
              Volver al inicio
            </button>
            <button className="checkout-back-btn" onClick={() => navigate("/menu")}>
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <span>🛒</span>
          <h2>Tu carrito esta vacio</h2>
          <button className="checkout-submit-btn" onClick={() => navigate("/menu")}>
            Ver menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <button className="checkout-back-link" onClick={() => navigate("/menu")}>
          Seguir comprando
        </button>
        <p className="checkout-eyebrow">LOCAFE / CHECKOUT</p>
        <h1 className="checkout-title">Finalizar <span>pedido</span></h1>
      </div>

      <div className="checkout-body">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-section">
            <h2 className="checkout-section-title">
              <span className="section-num">01</span> Datos de contacto
            </h2>
            <div className="checkout-fields">
              <div className="checkout-field">
                <label>Nombre completo *</label>
                <input value={address.nombre} onChange={e => setAddress({...address, nombre: e.target.value})} placeholder="Tu nombre" required />
              </div>
              <div className="checkout-field">
                <label>Telefono *</label>
                <input value={address.telefono} onChange={e => setAddress({...address, telefono: e.target.value})} placeholder="+51 999 999 999" required />
              </div>
              <div className="checkout-field checkout-field--full">
                <label>Direccion de entrega *</label>
                <input value={address.direccion} onChange={e => setAddress({...address, direccion: e.target.value})} placeholder="Av. ejemplo 123, Lima" required />
              </div>
              <div className="checkout-field checkout-field--full">
                <label>Referencia</label>
                <input value={address.referencia} onChange={e => setAddress({...address, referencia: e.target.value})} placeholder="Frente al parque, piso 3..." />
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h2 className="checkout-section-title">
              <span className="section-num">02</span> Metodo de pago
            </h2>
            <div className="pay-methods">
              <div className={`pay-method-tab ${payMethod === "card" ? "active" : ""}`} onClick={() => setPayMethod("card")}>
                <span className="pay-method-icon">💳</span>
                <span>Tarjeta</span>
              </div>
              <div className={`pay-method-tab ${payMethod === "yape" ? "active" : ""}`} onClick={() => setPayMethod("yape")}>
                <span className="pay-method-icon">📱</span>
                <span>Yape / Plin</span>
              </div>
              <div className={`pay-method-tab ${payMethod === "cash" ? "active" : ""}`} onClick={() => setPayMethod("cash")}>
                <span className="pay-method-icon">💵</span>
                <span>Efectivo</span>
              </div>
            </div>

            {payMethod === "card" && (
              <div className="pay-card-form">
                <div className="card-preview">
                  <div className="card-preview-inner">
                    <span className="card-preview-brand">LOCAFE</span>
                    <div className="card-preview-number">{card.number || "•••• •••• •••• ••••"}</div>
                    <div className="card-preview-bottom">
                      <div>
                        <p className="card-preview-label">TITULAR</p>
                        <p className="card-preview-value">{card.name || "TU NOMBRE"}</p>
                      </div>
                      <div>
                        <p className="card-preview-label">VENCE</p>
                        <p className="card-preview-value">{card.expiry || "MM/AA"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="checkout-fields">
                  <div className="checkout-field checkout-field--full">
                    <label>Nombre en la tarjeta *</label>
                    <input value={card.name} onChange={e => setCard({...card, name: e.target.value.toUpperCase()})} placeholder="NOMBRE APELLIDO" required={payMethod === "card"} />
                  </div>
                  <div className="checkout-field checkout-field--full">
                    <label>Numero de tarjeta *</label>
                    <input value={card.number} onChange={e => setCard({...card, number: formatCard(e.target.value)})} placeholder="0000 0000 0000 0000" maxLength={19} required={payMethod === "card"} />
                  </div>
                  <div className="checkout-field">
                    <label>Vencimiento *</label>
                    <input value={card.expiry} onChange={e => setCard({...card, expiry: formatExpiry(e.target.value)})} placeholder="MM/AA" maxLength={5} required={payMethod === "card"} />
                  </div>
                  <div className="checkout-field">
                    <label>CVV *</label>
                    <input value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value.replace(/\D/g,"").slice(0,4)})} placeholder="•••" maxLength={4} type="password" required={payMethod === "card"} />
                  </div>
                </div>
              </div>
            )}

            {payMethod === "yape" && (
              <div className="pay-yape">
                <div className="yape-qr-wrap">
                  <div className="yape-qr-box">
                    <svg viewBox="0 0 90 90" className="yape-qr-svg" xmlns="http://www.w3.org/2000/svg">
                      {Array.from({length:9},(_,r)=>Array.from({length:9},(_,c)=>{
                        const corners=[[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2],[0,6],[0,7],[0,8],[1,6],[1,8],[2,6],[2,7],[2,8],[6,0],[6,1],[6,2],[7,0],[7,2],[8,0],[8,1],[8,2]]
                        const isC=corners.some(([cr,cc])=>cr===r&&cc===c)
                        const cell=isC||((r*11+c*7+3)%3!==0)
                        return cell?<rect key={`${r}-${c}`} x={c*10} y={r*10} width="9" height="9" rx="1.5" fill="#6c3f9e"/>:null
                      }))}
                    </svg>
                    <p className="yape-qr-label">Escanea con Yape o Plin</p>
                  </div>
                  <div className="yape-info">
                    <div className="yape-info-row"><span>Numero</span><strong>+51 987 654 321</strong></div>
                    <div className="yape-info-row"><span>A nombre de</span><strong>Locafe S.A.C.</strong></div>
                    <div className="yape-info-row"><span>Monto a pagar</span><strong className="yape-amount">S/ {orderTotal.toFixed(2)}</strong></div>
                    <p className="yape-note">Toma captura de tu pago. Lo verificaremos antes de confirmar tu pedido.</p>
                  </div>
                </div>
              </div>
            )}

            {payMethod === "cash" && (
              <div className="pay-cash">
                <div className="cash-icon">💵</div>
                <h3 className="cash-title">Pago en tienda</h3>
                <p className="cash-desc">Realiza tu pedido ahora y paga cuando vengas a recogerlo. Ten el monto exacto listo para agilizar el proceso.</p>
                <div className="cash-amount">
                  <span>Monto a pagar</span>
                  <strong>S/ {orderTotal.toFixed(2)}</strong>
                </div>
                <p className="cash-note">Tu pedido se reserva por <strong>30 minutos</strong> desde la confirmacion.</p>
              </div>
            )}
          </div>

          <button type="submit" className="checkout-submit-btn" disabled={loading}>
            {loading
              ? <><span className="checkout-spinner" /> Procesando...</>
              : `Confirmar pedido - S/ ${orderTotal.toFixed(2)}`
            }
          </button>

          {error && <p className="login-error">{error}</p>}
        </form>

        <div className="checkout-summary">
          <h2 className="summary-title">Resumen</h2>
          <div className="summary-items">
            {items.map(item => (
              <div className="summary-item" key={item.id}>
                <img src={item.img} alt={item.name} />
                <div className="summary-item-info">
                  <p>{item.name}</p>
                  <span>x {item.quantity}</span>
                </div>
                <p className="summary-item-price">S/ {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="summary-row"><span>Subtotal</span><span>S/ {total.toFixed(2)}</span></div>
            <div className="summary-row"><span>Delivery</span><span>S/ {delivery.toFixed(2)}</span></div>
            <div className="summary-row summary-total"><span>Total</span><strong>S/ {orderTotal.toFixed(2)}</strong></div>
          </div>
          <div className="summary-badge">Pago seguro y encriptado</div>
        </div>
      </div>
    </div>
  )
}

export default Checkout