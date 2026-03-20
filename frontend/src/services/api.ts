import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
})

// ── Interceptor: agrega el token automáticamente ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("locafe_token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Interceptor: maneja errores globales ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("locafe_token")
      localStorage.removeItem("locafe_user")
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

// ══════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════
export const authService = {
  register: (data: { nombre: string; email: string; password: string; telefono?: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  profile: () =>
    api.get("/auth/profile"),
  update: (data: { nombre?: string; telefono?: string }) =>
    api.put("/auth/profile", data),
}

// ══════════════════════════════════════════
// PRODUCTOS
// ══════════════════════════════════════════
export const productosService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    api.get("/productos", { params }),
  getOne: (id: number) =>
    api.get(`/productos/${id}`),
  getCategorias: () =>
    api.get("/productos/categorias"),
  create: (data: Record<string, unknown>) =>
    api.post("/productos", data),
  update: (id: number, data: Record<string, unknown>) =>
    api.put(`/productos/${id}`, data),
  delete: (id: number) =>
    api.delete(`/productos/${id}`),
}

// ══════════════════════════════════════════
// PEDIDOS
// ══════════════════════════════════════════
export const pedidosService = {
  create: (data: Record<string, unknown>) =>
    api.post("/pedidos", data),
  getMios: () =>
    api.get("/pedidos/mis-pedidos"),
  getAll: (params?: Record<string, string | number>) =>
    api.get("/pedidos", { params }),
  updateEstado: (id: number, estado: string) =>
    api.put(`/pedidos/${id}/estado`, { estado }),
}

// ══════════════════════════════════════════
// RESERVAS
// ══════════════════════════════════════════
export const reservasService = {
  getMesasOcupadas: (fecha: string) =>
    api.get("/reservas/mesas-ocupadas", { params: { fecha } }),
  create: (data: Record<string, unknown>) =>
    api.post("/reservas", data),
  getMias: () =>
    api.get("/reservas/mis-reservas"),
  getAll: (params?: Record<string, string>) =>
    api.get("/reservas", { params }),
  updateEstado: (id: number, estado: string) =>
    api.put(`/reservas/${id}/estado`, { estado }),
  cancelar: (id: number) =>
    api.put(`/reservas/${id}/cancelar`),
}

// ══════════════════════════════════════════
// MEMBRESÍA
// ══════════════════════════════════════════
export const membresiaService = {
  getMia: () =>
    api.get("/membresia/mi-membresia"),
  suscribir: (plan: string) =>
    api.post("/membresia/suscribir", { plan }),
  cancelar: () =>
    api.put("/membresia/cancelar"),
  getAll: () =>
    api.get("/membresia"),
  validarQR: (codigo: string) =>
    api.get(`/membresia/validar/${codigo}`),
}

// ══════════════════════════════════════════
// ADMIN
// ══════════════════════════════════════════
export const adminService = {
  getStats: () =>
    api.get("/admin/stats"),
  getUsuarios: (params?: Record<string, string | number>) =>
    api.get("/admin/usuarios", { params }),
  toggleUsuario: (id: number) =>
    api.put(`/admin/usuarios/${id}/toggle`),
  deleteUsuario: (id: number) =>
    api.delete(`/admin/usuarios/${id}`),
}

export default api