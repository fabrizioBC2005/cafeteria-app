import { useState, useEffect, useCallback } from "react"
import "./Admin.css"
import { adminService, productosService, pedidosService, reservasService } from "../../services/api.ts"
import { useNavigate } from "react-router-dom"

/* ── CONSTANTES ── */
const STATUS_COLORS = {
  entregado:   { bg: "#0d2e1a", text: "#4ade80", border: "#16a34a" },
  confirmado:  { bg: "#0d2e1a", text: "#4ade80", border: "#16a34a" },
  "en camino": { bg: "#1a2040", text: "#60a5fa", border: "#2563eb" },
  pendiente:   { bg: "#2e2008", text: "#fbbf24", border: "#d97706" },
  preparando:  { bg: "#1e1428", text: "#c084fc", border: "#9333ea" },
  cancelado:   { bg: "#2e0d0d", text: "#f87171", border: "#dc2626" },
  cancelada:   { bg: "#2e0d0d", text: "#f87171", border: "#dc2626" },
  listo:       { bg: "#1a2040", text: "#60a5fa", border: "#2563eb" },
  confirmada:  { bg: "#0d2e1a", text: "#4ade80", border: "#16a34a" },
  completada:  { bg: "#0d2e1a", text: "#4ade80", border: "#16a34a" },
}

const EMPTY_PRODUCT = {
  nombre: "", precio: "", categoria_id: "", stock: "", imagen: "",
  descripcion: "", origen: "", peso: "", destacado: false, activo: true
}

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

function ProductModal({ product, categorias, onSave, onClose }) {
  const [form, setForm] = useState(product || EMPTY_PRODUCT)
  const isNew = !product?.id

  const handle = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? checked : value })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isNew ? "Nuevo producto" : "Editar producto"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {form.imagen && <img src={form.imagen} alt="preview" className="modal-preview" />}
          <div className="modal-grid">
            <div className="modal-field modal-field--full">
              <label>Nombre *</label>
              <input name="nombre" value={form.nombre} onChange={handle} placeholder="Nombre del producto" />
            </div>
            <div className="modal-field">
              <label>Precio (S/) *</label>
              <input name="precio" type="number" value={form.precio} onChange={handle} placeholder="0.00" />
            </div>
            <div className="modal-field">
              <label>Stock *</label>
              <input name="stock" type="number" value={form.stock} onChange={handle} placeholder="0" />
            </div>
            <div className="modal-field">
              <label>Categoria</label>
              <select name="categoria_id" value={form.categoria_id || ""} onChange={handle}>
                <option value="">Sin categoria</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div className="modal-field">
              <label>Origen</label>
              <input name="origen" value={form.origen || ""} onChange={handle} placeholder="Colombia, Peru..." />
            </div>
            <div className="modal-field">
              <label>Peso</label>
              <input name="peso" value={form.peso || ""} onChange={handle} placeholder="250g, 500ml..." />
            </div>
            <div className="modal-field modal-field--full">
              <label>Descripcion</label>
              <input name="descripcion" value={form.descripcion || ""} onChange={handle} placeholder="Descripcion breve..." />
            </div>
            <div className="modal-field modal-field--full">
              <label>URL imagen</label>
              <input name="imagen" value={form.imagen || ""} onChange={handle} placeholder="https://..." />
            </div>
            <div className="modal-field">
              <label>Estado</label>
              <select name="activo" value={String(form.activo)} onChange={e => setForm({ ...form, activo: e.target.value === "true" })}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
            <div className="modal-field">
              <label>Destacado</label>
              <select name="destacado" value={String(form.destacado)} onChange={e => setForm({ ...form, destacado: e.target.value === "true" })}>
                <option value="true">Si</option>
                <option value="false">No</option>
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

function Admin() {
  const navigate = useNavigate()
  const [tab, setTab]           = useState("dashboard")
  const [loading, setLoading]   = useState(true)
  const [toast, setToast]       = useState(null)

  const [stats, setStats]           = useState(null)
  const [products, setProducts]     = useState([])
  const [categorias, setCategorias] = useState([])
  const [orders, setOrders]         = useState([])
  const [reservas, setReservas]     = useState([])
  const [usuarios, setUsuarios]     = useState([])

  const [editProduct, setEditProduct] = useState(null)
  const [searchProd,  setSearchProd]  = useState("")
  const [searchOrd,   setSearchOrd]   = useState("")
  const [filterOrd,   setFilterOrd]   = useState("todos")

  const showToast = (msg, type = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2800)
  }

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [statsRes, prodsRes, catsRes, ordsRes, resRes, usersRes] = await Promise.all([
        adminService.getStats(),
        productosService.getAll({ limit: 100 }),
        productosService.getCategorias(),
        pedidosService.getAll({ limit: 50 }),
        reservasService.getAll(),
        adminService.getUsuarios(),
      ])
      setStats(statsRes.data)
      setProducts(prodsRes.data.productos)
      setCategorias(catsRes.data.filter(c => c.slug !== "all"))
      setOrders(ordsRes.data)
      setReservas(resRes.data)
      setUsuarios(usersRes.data)
    } catch (err) {
      console.error("Error cargando datos admin:", err)
      showToast("Error al cargar datos", "danger")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const saveProduct = async (form) => {
    try {
      if (!editProduct?.id) {
        await productosService.create(form)
        showToast("Producto creado")
      } else {
        await productosService.update(editProduct.id, form)
        showToast("Producto actualizado")
      }
      setEditProduct(null)
      const res = await productosService.getAll({ limit: 100 })
      setProducts(res.data.productos)
    } catch {
      showToast("Error al guardar producto", "danger")
    }
  }

  const deleteProduct = async (id) => {
    if (!confirm("Eliminar este producto?")) return
    try {
      await productosService.delete(id)
      setProducts(p => p.filter(x => x.id !== id))
      showToast("Producto eliminado", "danger")
    } catch {
      showToast("Error al eliminar", "danger")
    }
  }

  const toggleProduct = async (prod) => {
    try {
      await productosService.update(prod.id, { ...prod, activo: !prod.activo })
      setProducts(p => p.map(x => x.id === prod.id ? { ...x, activo: !x.activo } : x))
    } catch {
      showToast("Error al actualizar", "danger")
    }
  }

  const updateOrderStatus = async (id, estado) => {
    try {
      await pedidosService.updateEstado(id, estado)
      setOrders(o => o.map(x => x.id === id ? { ...x, estado } : x))
      showToast("Pedido actualizado")
    } catch {
      showToast("Error al actualizar pedido", "danger")
    }
  }

  const updateReservaStatus = async (id, estado) => {
    try {
      await reservasService.updateEstado(id, estado)
      setReservas(r => r.map(x => x.id === id ? { ...x, estado } : x))
      showToast("Reserva actualizada")
    } catch {
      showToast("Error al actualizar reserva", "danger")
    }
  }

  const toggleUsuario = async (id) => {
    try {
      const { data } = await adminService.toggleUsuario(id)
      setUsuarios(u => u.map(x => x.id === id ? { ...x, activo: data.activo } : x))
      showToast(`Usuario ${data.activo ? "activado" : "desactivado"}`)
    } catch {
      showToast("Error al actualizar usuario", "danger")
    }
  }

  const deleteUsuario = async (id, nombre) => {
    if (!confirm(`Eliminar al usuario "${nombre}"?`)) return
    try {
      await adminService.deleteUsuario(id)
      setUsuarios(u => u.filter(x => x.id !== id))
      showToast("Usuario eliminado", "danger")
    } catch {
      showToast("Error al eliminar usuario", "danger")
    }
  }

  const filteredProds = products.filter(p =>
    p.nombre.toLowerCase().includes(searchProd.toLowerCase())
  )

  const filteredOrds = orders.filter(o => {
    const matchSearch = o.numero?.toLowerCase().includes(searchOrd.toLowerCase()) ||
                        o.nombre_cliente?.toLowerCase().includes(searchOrd.toLowerCase())
    const matchFilter = filterOrd === "todos" || o.estado === filterOrd
    return matchSearch && matchFilter
  })

  const pedidosPend = orders.filter(o => ["pendiente","preparando","listo"].includes(o.estado)).length
  const resPend     = reservas.filter(r => r.estado === "pendiente").length

  if (loading) {
    return (
      <div className="admin-page" style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#555" }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>☕</p>
          <p>Cargando panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      <aside className="admin-sidebar">
        <div className="admin-brand" onClick={() => navigate("/")}>
          <span className="admin-brand-logo">LC</span>
          <div>
            <p className="admin-brand-name">LOCAFE</p>
            <p className="admin-brand-sub">Admin Panel</p>
          </div>
        </div>

        <nav className="admin-nav">
          {[
            { id: "dashboard", icon: "▦", label: "Dashboard" },
            { id: "productos", icon: "◈", label: "Productos"  },
            { id: "pedidos",   icon: "⊞", label: "Pedidos"   },
            { id: "reservas",  icon: "▣", label: "Reservas"  },
            { id: "usuarios",  icon: "👤", label: "Usuarios"  },
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

        <button className="admin-back-btn" onClick={() => navigate("/")}>
          Volver al sitio
        </button>
      </aside>

      <main className="admin-main">
        {tab === "dashboard" && (
          <div className="admin-section">
            <div className="admin-page-header">
              <div>
                <p className="admin-eyebrow">LOCAFE / ADMIN</p>
                <h1 className="admin-title">Dashboard</h1>
              </div>
              <p className="admin-date">
                {new Date().toLocaleDateString("es-PE", { weekday:"long", day:"numeric", month:"long" })}
              </p>
            </div>
            <div className="stats-grid">
              <StatCard icon="💰" label="Ventas del mes"      value={`S/ ${stats?.ingresos_mes?.toFixed(2) || "0.00"}`} sub="Pedidos confirmados"  color="#4ade80" />
              <StatCard icon="📦" label="Pedidos activos"     value={pedidosPend}                                       sub="pendiente/preparando" color="#60a5fa" />
              <StatCard icon="☕" label="Productos activos"   value={products.filter(p => p.activo).length}             sub={`de ${products.length} totales`} color="#fbbf24" />
              <StatCard icon="📅" label="Reservas pendientes" value={resPend}                                           sub="por confirmar"         color="#c084fc" />
            </div>
            <div className="dash-section">
              <div className="dash-section-header">
                <h2>Ultimos pedidos</h2>
                <button onClick={() => setTab("pedidos")} className="dash-link">Ver todos</button>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Orden</th><th>Cliente</th><th>Total</th><th>Estado</th></tr>
                  </thead>
                  <tbody>
                    {orders.slice(0,4).map(o => (
                      <tr key={o.id}>
                        <td className="order-id">{o.numero}</td>
                        <td>{o.nombre_cliente}</td>
                        <td>S/ {parseFloat(o.total).toFixed(2)}</td>
                        <td><StatusBadge status={o.estado} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="dash-section">
              <div className="dash-section-header">
                <h2>Reservas recientes</h2>
                <button onClick={() => setTab("reservas")} className="dash-link">Ver todas</button>
              </div>
              <div className="reservas-list">
                {reservas.slice(0,3).map(r => (
                  <div key={r.id} className="reserva-row">
                    <div className="reserva-row-left">
                      <span className="reserva-time">{r.hora?.slice(0,5)}</span>
                      <div>
                        <p className="reserva-name">{r.nombre}</p>
                        <p className="reserva-detail">Mesa {r.mesa_id} · {r.zona} · {r.personas} personas</p>
                      </div>
                    </div>
                    <div className="reserva-row-right">
                      <span className="reserva-occasion">{r.ocasion}</span>
                      <StatusBadge status={r.estado} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "productos" && (
          <div className="admin-section">
            <div className="admin-page-header">
              <div>
                <p className="admin-eyebrow">LOCAFE / ADMIN</p>
                <h1 className="admin-title">Productos</h1>
              </div>
              <button className="admin-add-btn" onClick={() => setEditProduct({})}>
                + Nuevo producto
              </button>
            </div>
            <div className="admin-toolbar">
              <input className="admin-search" placeholder="Buscar producto..." value={searchProd} onChange={e => setSearchProd(e.target.value)} />
              <span className="admin-count">{filteredProds.length} productos</span>
            </div>
            <div className="products-admin-grid">
              {filteredProds.map(p => (
                <div key={p.id} className={`prod-admin-card ${!p.activo ? "inactive" : ""}`}>
                  <div className="prod-admin-img-wrap">
                    <img src={p.imagen} alt={p.nombre} className="prod-admin-img" />
                    {!p.activo && <div className="prod-inactive-overlay">INACTIVO</div>}
                    {p.destacado && <span className="prod-admin-badge">Destacado</span>}
                  </div>
                  <div className="prod-admin-info">
                    <p className="prod-admin-cat">{p.categoria_nombre}</p>
                    <h3 className="prod-admin-name">{p.nombre}</h3>
                    <div className="prod-admin-meta">
                      <span className="prod-admin-price">S/ {parseFloat(p.precio).toFixed(2)}</span>
                      <span className={`prod-admin-stock ${p.stock < 15 ? "low" : ""}`}>Stock: {p.stock}</span>
                    </div>
                  </div>
                  <div className="prod-admin-actions">
                    <button className="prod-action-btn edit"   onClick={() => setEditProduct(p)}   title="Editar">✎</button>
                    <button className="prod-action-btn toggle" onClick={() => toggleProduct(p)}    title={p.activo ? "Desactivar" : "Activar"}>{p.activo ? "●" : "○"}</button>
                    <button className="prod-action-btn delete" onClick={() => deleteProduct(p.id)} title="Eliminar">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "pedidos" && (
          <div className="admin-section">
            <div className="admin-page-header">
              <div>
                <p className="admin-eyebrow">LOCAFE / ADMIN</p>
                <h1 className="admin-title">Pedidos</h1>
              </div>
            </div>
            <div className="admin-toolbar">
              <input className="admin-search" placeholder="Buscar orden o cliente..." value={searchOrd} onChange={e => setSearchOrd(e.target.value)} />
              <div className="filter-tabs">
                {["todos","pendiente","confirmado","preparando","listo","entregado","cancelado"].map(f => (
                  <button key={f} className={`filter-tab ${filterOrd === f ? "active" : ""}`} onClick={() => setFilterOrd(f)}>{f}</button>
                ))}
              </div>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table orders-table">
                <thead>
                  <tr><th>Orden</th><th>Cliente</th><th>Total</th><th>Pago</th><th>Estado</th><th>Accion</th></tr>
                </thead>
                <tbody>
                  {filteredOrds.map(o => (
                    <tr key={o.id}>
                      <td className="order-id">{o.numero}</td>
                      <td>
                        <p className="order-customer">{o.nombre_cliente}</p>
                        <p className="order-phone">{o.telefono_cliente}</p>
                      </td>
                      <td>S/ {parseFloat(o.total).toFixed(2)}</td>
                      <td><span className="pay-chip">{o.metodo_pago}</span></td>
                      <td><StatusBadge status={o.estado} /></td>
                      <td>
                        <select className="status-select" value={o.estado} onChange={e => updateOrderStatus(o.id, e.target.value)}>
                          {["pendiente","confirmado","preparando","listo","entregado","cancelado"].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredOrds.length === 0 && <div className="admin-empty"><p>No hay pedidos con ese filtro</p></div>}
          </div>
        )}

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
                      <span className="res-time">{r.hora?.slice(0,5)}</span>
                      <span className="res-date">{r.fecha}</span>
                    </div>
                    <div className="reserva-admin-info">
                      <p className="res-id">RES-{String(r.id).padStart(3,"0")}</p>
                      <h3 className="res-customer">{r.nombre}</h3>
                      <p className="res-phone">{r.telefono}</p>
                    </div>
                  </div>
                  <div className="reserva-admin-mid">
                    <div className="res-detail-chips">
                      <span className="res-chip">Mesa {r.mesa_id}</span>
                      <span className="res-chip">Zona {r.zona}</span>
                      <span className="res-chip">{r.personas} personas</span>
                    </div>
                    <span className="res-occasion">{r.ocasion}</span>
                  </div>
                  <div className="reserva-admin-right">
                    <StatusBadge status={r.estado} />
                    <div className="res-actions">
                      <button className="res-action-btn confirm" onClick={() => updateReservaStatus(r.id, "confirmada")} disabled={r.estado === "confirmada"}>Confirmar</button>
                      <button className="res-action-btn cancel"  onClick={() => updateReservaStatus(r.id, "cancelada")}  disabled={r.estado === "cancelada"}>Cancelar</button>
                    </div>
                  </div>
                </div>
              ))}
              {reservas.length === 0 && <div className="admin-empty"><p>No hay reservas registradas</p></div>}
            </div>
          </div>
        )}

        {tab === "usuarios" && (
          <div className="admin-section">
            <div className="admin-page-header">
              <div>
                <p className="admin-eyebrow">LOCAFE / ADMIN</p>
                <h1 className="admin-title">Usuarios</h1>
              </div>
              <span className="admin-count">{usuarios.length} usuarios</span>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Membresia</th><th>Estado</th><th>Accion</th></tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:30, height:30, borderRadius:"50%", background:"#8BC34A", color:"#0d0d0d", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, flexShrink:0 }}>
                            {u.nombre?.charAt(0).toUpperCase()}
                          </div>
                          <span className="order-customer">{u.nombre}</span>
                        </div>
                      </td>
                      <td style={{ color:"#666", fontSize:12 }}>{u.email}</td>
                      <td><span className="pay-chip" style={{ color: u.rol === "admin" ? "#fbbf24" : "#888" }}>{u.rol}</span></td>
                      <td>
                        {u.membresia_plan
                          ? <StatusBadge status={u.membresia_activa ? "confirmada" : "cancelada"} />
                          : <span style={{ color:"#444", fontSize:12 }}>Sin membresia</span>}
                      </td>
                      <td><StatusBadge status={u.activo ? "confirmado" : "cancelado"} /></td>
                      <td>
                        {u.rol !== "admin" && (
                          <div style={{ display:"flex", gap:8 }}>
                            <button className={`res-action-btn ${u.activo ? "cancel" : "confirm"}`} style={{ fontSize:11, padding:"5px 12px" }} onClick={() => toggleUsuario(u.id)}>
                              {u.activo ? "Desactivar" : "Activar"}
                            </button>
                            <button className="res-action-btn cancel" style={{ fontSize:11, padding:"5px 12px" }} onClick={() => deleteUsuario(u.id, u.nombre)}>
                              Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {editProduct !== null && (
        <ProductModal
          product={editProduct?.id ? editProduct : null}
          categorias={categorias}
          onSave={saveProduct}
          onClose={() => setEditProduct(null)}
        />
      )}
    </div>
  )
}

export default Admin