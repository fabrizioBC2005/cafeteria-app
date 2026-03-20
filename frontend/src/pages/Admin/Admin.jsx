import { useState } from "react"
import "./Admin.css"

/* ── DATA SIMULADA ── */
const INITIAL_PRODUCTS = [
  { id: 1, name: "Espresso Intenso",   price: 15.00, category: "espresso",      stock: 42, badge: "Más vendido", active: true,  image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300&q=80" },
  { id: 2, name: "Arabica Suave",      price: 18.00, category: "single-origin", stock: 18, badge: "Single Origin", active: true,  image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=80" },
  { id: 3, name: "Mezcla de la Casa",  price: 20.00, category: "blend",         stock: 30, badge: "Exclusivo",   active: true,  image: "https://images.unsplash.com/photo-1501492673258-2af7d42e4efd?w=300&q=80" },
  { id: 4, name: "Cold Brew Premium",  price: 22.00, category: "cold",          stock: 10, badge: "Nuevo",       active: true,  image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80" },
  { id: 5, name: "Latte de Temporada", price: 17.00, category: "leche",         stock: 25, badge: null,          active: false, image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=300&q=80" },
  { id: 6, name: "Robusta Intenso",    price: 14.00, category: "espresso",      stock: 55, badge: null,          active: true,  image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&q=80" },
]

const ORDERS = [
  { id: "LOC-28471", customer: "María García",    items: 3, total: 62.00, method: "Tarjeta", status: "entregado",  date: "2025-07-14", phone: "+51 987 654 321" },
  { id: "LOC-28472", customer: "Carlos Mendoza",  items: 1, total: 27.00, method: "Yape",    status: "en camino",  date: "2025-07-14", phone: "+51 976 543 210" },
  { id: "LOC-28473", customer: "Lucía Torres",    items: 5, total: 95.00, method: "Efectivo", status: "pendiente", date: "2025-07-14", phone: "+51 965 432 109" },
  { id: "LOC-28474", customer: "Diego Ramírez",   items: 2, total: 38.00, method: "Tarjeta",  status: "preparando",date: "2025-07-13", phone: "+51 954 321 098" },
  { id: "LOC-28475", customer: "Ana Villanueva",  items: 4, total: 74.00, method: "Yape",    status: "entregado",  date: "2025-07-13", phone: "+51 943 210 987" },
  { id: "LOC-28476", customer: "Pedro Quispe",    items: 2, total: 33.00, method: "Efectivo", status: "cancelado", date: "2025-07-12", phone: "+51 932 109 876" },
]

const RESERVAS = [
  { id: "RES-001", name: "Sofía Herrera",   table: 6, zone: "Central", date: "2025-07-15", time: "19:00", guests: 4, occasion: "🌹 Romántico",  status: "confirmada", phone: "+51 987 111 222" },
  { id: "RES-002", name: "Javier Soto",     table: 3, zone: "Ventana", date: "2025-07-15", time: "13:30", guests: 2, occasion: "💼 Reunión",    status: "confirmada", phone: "+51 987 333 444" },
  { id: "RES-003", name: "Camila Vega",     table: 9, zone: "Barra",   date: "2025-07-15", time: "20:00", guests: 3, occasion: "🥂 Amigos",    status: "pendiente",  phone: "+51 987 555 666" },
  { id: "RES-004", name: "Rodrigo Paz",     table: 5, zone: "Central", date: "2025-07-16", time: "12:00", guests: 6, occasion: "🎂 Cumpleaños", status: "confirmada", phone: "+51 987 777 888" },
  { id: "RES-005", name: "Valentina Cruz",  table: 1, zone: "Ventana", date: "2025-07-16", time: "15:00", guests: 2, occasion: "☕ Casual",    status: "cancelada",  phone: "+51 987 999 000" },
]

const STATUS_COLORS = {
  entregado:  { bg: "#0d2e1a", text: "#4ade80", border: "#16a34a" },
  "en camino":{ bg: "#1a2040", text: "#60a5fa", border: "#2563eb" },
  pendiente:  { bg: "#2e2008", text: "#fbbf24", border: "#d97706" },
  preparando: { bg: "#1e1428", text: "#c084fc", border: "#9333ea" },
  cancelado:  { bg: "#2e0d0d", text: "#f87171", border: "#dc2626" },
  confirmada: { bg: "#0d2e1a", text: "#4ade80", border: "#16a34a" },
}

const EMPTY_PRODUCT = { name: "", price: "", category: "espresso", stock: "", badge: "", active: true, image: "" }

/* ── COMPONENTES PEQUEÑOS ── */
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="stat-card" style={{ "--accent": color }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        {sub && <p className="stat-sub">{sub}</p>}
      </div>
      <div className="stat-glow" />
    </div>
  )
}

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS["pendiente"]
  return (
    <span className="status-badge" style={{ background: s.bg, color: s.text, borderColor: s.border }}>
      {status}
    </span>
  )
}

/* ── MODAL PRODUCTO ── */
function ProductModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(product || EMPTY_PRODUCT)
  const isNew = !product?.id

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isNew ? "Nuevo producto" : "Editar producto"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {form.image && (
            <img src={form.image} alt="preview" className="modal-preview" />
          )}

          <div className="modal-grid">
            <div className="modal-field modal-field--full">
              <label>Nombre *</label>
              <input name="name" value={form.name} onChange={handle} placeholder="Nombre del producto" />
            </div>
            <div className="modal-field">
              <label>Precio (S/) *</label>
              <input name="price" type="number" value={form.price} onChange={handle} placeholder="0.00" />
            </div>
            <div className="modal-field">
              <label>Stock *</label>
              <input name="stock" type="number" value={form.stock} onChange={handle} placeholder="0" />
            </div>
            <div className="modal-field">
              <label>Categoría</label>
              <select name="category" value={form.category} onChange={handle}>
                <option value="espresso">Espresso</option>
                <option value="single-origin">Single Origin</option>
                <option value="blend">Blend</option>
                <option value="cold">Cold Brew</option>
                <option value="leche">Con Leche</option>
              </select>
            </div>
            <div className="modal-field">
              <label>Badge</label>
              <input name="badge" value={form.badge || ""} onChange={handle} placeholder="Ej: Nuevo, Exclusivo..." />
            </div>
            <div className="modal-field modal-field--full">
              <label>URL imagen</label>
              <input name="image" value={form.image || ""} onChange={handle} placeholder="https://..." />
            </div>
            <div className="modal-field">
              <label>Estado</label>
              <select name="active" value={form.active} onChange={e => setForm({ ...form, active: e.target.value === "true" })}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-cancel" onClick={onClose}>Cancelar</button>
          <button className="modal-save" onClick={() => onSave(form)}>
            {isNew ? "Crear producto" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════ */
function Admin({ setPage }) {
  const [tab, setTab]             = useState("dashboard")
  const [products, setProducts]   = useState(INITIAL_PRODUCTS)
  const [orders, setOrders]       = useState(ORDERS)
  const [reservas, setReservas]   = useState(RESERVAS)
  const [editProduct, setEditProduct] = useState(null)   // null | "new" | product obj
  const [searchProd, setSearchProd]   = useState("")
  const [searchOrd,  setSearchOrd]    = useState("")
  const [filterOrd,  setFilterOrd]    = useState("todos")
  const [toast, setToast]         = useState(null)

  /* helpers */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2800)
  }

  /* ── PRODUCTOS ── */
  const saveProduct = (form) => {
    if (editProduct === "new") {
      const newP = { ...form, id: Date.now(), price: parseFloat(form.price), stock: parseInt(form.stock) }
      setProducts(p => [...p, newP])
      showToast("Producto creado ✓")
    } else {
      setProducts(p => p.map(x => x.id === form.id ? { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) } : x))
      showToast("Producto actualizado ✓")
    }
    setEditProduct(null)
  }

  const deleteProduct = (id) => {
    setProducts(p => p.filter(x => x.id !== id))
    showToast("Producto eliminado", "danger")
  }

  const toggleProduct = (id) => {
    setProducts(p => p.map(x => x.id === id ? { ...x, active: !x.active } : x))
  }

  /* ── PEDIDOS ── */
  const updateOrderStatus = (id, status) => {
    setOrders(o => o.map(x => x.id === id ? { ...x, status } : x))
    showToast(`Pedido ${id} → ${status}`)
  }

  /* ── RESERVAS ── */
  const updateReservaStatus = (id, status) => {
    setReservas(r => r.map(x => x.id === id ? { ...x, status } : x))
    showToast(`Reserva ${id} → ${status}`)
  }

  /* ── STATS ── */
  const totalVentas  = orders.filter(o => o.status === "entregado").reduce((s, o) => s + o.total, 0)
  const pedidosPend  = orders.filter(o => ["pendiente","preparando","en camino"].includes(o.status)).length
  const activeProds  = products.filter(p => p.active).length
  const resPend      = reservas.filter(r => r.status === "pendiente").length

  const filteredProds = products.filter(p =>
    p.name.toLowerCase().includes(searchProd.toLowerCase())
  )

  const filteredOrds = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(searchOrd.toLowerCase()) ||
                        o.customer.toLowerCase().includes(searchOrd.toLowerCase())
    const matchFilter = filterOrd === "todos" || o.status === filterOrd
    return matchSearch && matchFilter
  })

  /* ── RENDER ── */
  return (
    <div className="admin-page">

      {/* TOAST */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand" onClick={() => setPage("home")}>
          <span className="admin-brand-logo">LC</span>
          <div>
            <p className="admin-brand-name">LOCAFE</p>
            <p className="admin-brand-sub">Admin Panel</p>
          </div>
        </div>

        <nav className="admin-nav">
          {[
            { id: "dashboard", icon: "▦", label: "Dashboard"  },
            { id: "productos", icon: "◈",  label: "Productos"  },
            { id: "pedidos",   icon: "⊞",  label: "Pedidos"    },
            { id: "reservas",  icon: "▣",  label: "Reservas"   },
          ].map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${tab === item.id ? "active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === "pedidos"  && pedidosPend > 0 && <span className="nav-badge">{pedidosPend}</span>}
              {item.id === "reservas" && resPend > 0     && <span className="nav-badge">{resPend}</span>}
            </button>
          ))}
        </nav>

        <button className="admin-back-btn" onClick={() => setPage("home")}>
          ← Volver al sitio
        </button>
      </aside>

      {/* MAIN */}
      <main className="admin-main">

        {/* ══ DASHBOARD ══ */}
        {tab === "dashboard" && (
          <div className="admin-section">
            <div className="admin-page-header">
              <div>
                <p className="admin-eyebrow">LOCAFE / ADMIN</p>
                <h1 className="admin-title">Dashboard</h1>
              </div>
              <p className="admin-date">{new Date().toLocaleDateString("es-PE", { weekday:"long", day:"numeric", month:"long" })}</p>
            </div>

            <div className="stats-grid">
              <StatCard icon="💰" label="Ventas del mes"    value={`S/ ${totalVentas.toFixed(2)}`}  sub="Pedidos entregados"    color="#4ade80" />
              <StatCard icon="📦" label="Pedidos activos"   value={pedidosPend}                      sub="pendiente/preparando"  color="#60a5fa" />
              <StatCard icon="☕" label="Productos activos" value={activeProds}                      sub={`de ${products.length} totales`} color="#fbbf24" />
              <StatCard icon="📅" label="Reservas pendientes" value={resPend}                        sub="por confirmar"         color="#c084fc" />
            </div>

            {/* Últimos pedidos */}
            <div className="dash-section">
              <div className="dash-section-header">
                <h2>Últimos pedidos</h2>
                <button onClick={() => setTab("pedidos")} className="dash-link">Ver todos →</button>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Orden</th><th>Cliente</th><th>Total</th><th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0,4).map(o => (
                      <tr key={o.id}>
                        <td className="order-id">{o.id}</td>
                        <td>{o.customer}</td>
                        <td>S/ {o.total.toFixed(2)}</td>
                        <td><StatusBadge status={o.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reservas hoy */}
            <div className="dash-section">
              <div className="dash-section-header">
                <h2>Reservas de hoy</h2>
                <button onClick={() => setTab("reservas")} className="dash-link">Ver todas →</button>
              </div>
              <div className="reservas-list">
                {reservas.slice(0,3).map(r => (
                  <div key={r.id} className="reserva-row">
                    <div className="reserva-row-left">
                      <span className="reserva-time">{r.time}</span>
                      <div>
                        <p className="reserva-name">{r.name}</p>
                        <p className="reserva-detail">Mesa {r.table} · {r.zone} · {r.guests} personas</p>
                      </div>
                    </div>
                    <div className="reserva-row-right">
                      <span className="reserva-occasion">{r.occasion}</span>
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ PRODUCTOS ══ */}
        {tab === "productos" && (
          <div className="admin-section">
            <div className="admin-page-header">
              <div>
                <p className="admin-eyebrow">LOCAFE / ADMIN</p>
                <h1 className="admin-title">Productos</h1>
              </div>
              <button className="admin-add-btn" onClick={() => setEditProduct("new")}>
                + Nuevo producto
              </button>
            </div>

            <div className="admin-toolbar">
              <input
                className="admin-search"
                placeholder="Buscar producto..."
                value={searchProd}
                onChange={e => setSearchProd(e.target.value)}
              />
              <span className="admin-count">{filteredProds.length} productos</span>
            </div>

            <div className="products-admin-grid">
              {filteredProds.map(p => (
                <div key={p.id} className={`prod-admin-card ${!p.active ? "inactive" : ""}`}>
                  <div className="prod-admin-img-wrap">
                    <img src={p.image} alt={p.name} className="prod-admin-img" />
                    {!p.active && <div className="prod-inactive-overlay">INACTIVO</div>}
                    {p.badge && <span className="prod-admin-badge">{p.badge}</span>}
                  </div>
                  <div className="prod-admin-info">
                    <p className="prod-admin-cat">{p.category}</p>
                    <h3 className="prod-admin-name">{p.name}</h3>
                    <div className="prod-admin-meta">
                      <span className="prod-admin-price">S/ {p.price.toFixed(2)}</span>
                      <span className={`prod-admin-stock ${p.stock < 15 ? "low" : ""}`}>
                        Stock: {p.stock}
                      </span>
                    </div>
                  </div>
                  <div className="prod-admin-actions">
                    <button className="prod-action-btn edit" onClick={() => setEditProduct(p)} title="Editar">✎</button>
                    <button className="prod-action-btn toggle" onClick={() => toggleProduct(p.id)} title={p.active ? "Desactivar" : "Activar"}>
                      {p.active ? "●" : "○"}
                    </button>
                    <button className="prod-action-btn delete" onClick={() => deleteProduct(p.id)} title="Eliminar">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ PEDIDOS ══ */}
        {tab === "pedidos" && (
          <div className="admin-section">
            <div className="admin-page-header">
              <div>
                <p className="admin-eyebrow">LOCAFE / ADMIN</p>
                <h1 className="admin-title">Pedidos</h1>
              </div>
            </div>

            <div className="admin-toolbar">
              <input
                className="admin-search"
                placeholder="Buscar orden o cliente..."
                value={searchOrd}
                onChange={e => setSearchOrd(e.target.value)}
              />
              <div className="filter-tabs">
                {["todos","pendiente","preparando","en camino","entregado","cancelado"].map(f => (
                  <button
                    key={f}
                    className={`filter-tab ${filterOrd === f ? "active" : ""}`}
                    onClick={() => setFilterOrd(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table orders-table">
                <thead>
                  <tr>
                    <th>Orden</th>
                    <th>Cliente</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Pago</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrds.map(o => (
                    <tr key={o.id}>
                      <td className="order-id">{o.id}</td>
                      <td>
                        <p className="order-customer">{o.customer}</p>
                        <p className="order-phone">{o.phone}</p>
                      </td>
                      <td>{o.items}</td>
                      <td>S/ {o.total.toFixed(2)}</td>
                      <td><span className="pay-chip">{o.method}</span></td>
                      <td><StatusBadge status={o.status} /></td>
                      <td>
                        <select
                          className="status-select"
                          value={o.status}
                          onChange={e => updateOrderStatus(o.id, e.target.value)}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="preparando">Preparando</option>
                          <option value="en camino">En camino</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrds.length === 0 && (
              <div className="admin-empty">
                <p>No hay pedidos con ese filtro</p>
              </div>
            )}
          </div>
        )}

        {/* ══ RESERVAS ══ */}
        {tab === "reservas" && (
          <div className="admin-section">
            <div className="admin-page-header">
              <div>
                <p className="admin-eyebrow">LOCAFE / ADMIN</p>
                <h1 className="admin-title">Reservas</h1>
              </div>
            </div>

            <div className="reservas-admin-list">
              {reservas.map(r => (
                <div key={r.id} className="reserva-admin-card">
                  <div className="reserva-admin-left">
                    <div className="reserva-time-block">
                      <span className="res-time">{r.time}</span>
                      <span className="res-date">{r.date}</span>
                    </div>
                    <div className="reserva-admin-info">
                      <p className="res-id">{r.id}</p>
                      <h3 className="res-customer">{r.name}</h3>
                      <p className="res-phone">{r.phone}</p>
                    </div>
                  </div>

                  <div className="reserva-admin-mid">
                    <div className="res-detail-chips">
                      <span className="res-chip">Mesa {r.table}</span>
                      <span className="res-chip">Zona {r.zone}</span>
                      <span className="res-chip">{r.guests} personas</span>
                    </div>
                    <span className="res-occasion">{r.occasion}</span>
                  </div>

                  <div className="reserva-admin-right">
                    <StatusBadge status={r.status} />
                    <div className="res-actions">
                      <button
                        className="res-action-btn confirm"
                        onClick={() => updateReservaStatus(r.id, "confirmada")}
                        disabled={r.status === "confirmada"}
                      >
                        ✓ Confirmar
                      </button>
                      <button
                        className="res-action-btn cancel"
                        onClick={() => updateReservaStatus(r.id, "cancelada")}
                        disabled={r.status === "cancelada"}
                      >
                        ✕ Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODAL */}
      {editProduct && (
        <ProductModal
          product={editProduct === "new" ? null : editProduct}
          onSave={saveProduct}
          onClose={() => setEditProduct(null)}
        />
      )}
    </div>
  )
}

export default Admin