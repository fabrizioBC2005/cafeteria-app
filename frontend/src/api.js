import { authFetch } from "./Context/AuthContext"

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api"

/* ══════════════════════════════════════
   API DEL MENÚ
══════════════════════════════════════ */
export const menuApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return fetch(`${API}/menu${query ? `?${query}` : ""}`).then(r => r.json())
  },

  getById: (id) =>
    fetch(`${API}/menu/${id}`).then(r => r.json()),

  create: (data) =>
    authFetch(`${API}/menu`, {
      method: "POST",
      body: JSON.stringify(data),
    }).then(r => r.json()),

  update: (id, data) =>
    authFetch(`${API}/menu/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }).then(r => r.json()),

  delete: (id) =>
    authFetch(`${API}/menu/${id}`, { method: "DELETE" }).then(r => r.json()),
}

/* ══════════════════════════════════════
   API DE PEDIDOS
══════════════════════════════════════ */
export const ordersApi = {
  create: (data) =>
    authFetch(`${API}/orders`, {
      method: "POST",
      body: JSON.stringify(data),
    }).then(r => r.json()),

  getMyOrders: () =>
    authFetch(`${API}/orders`).then(r => r.json()),

  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return authFetch(`${API}/orders${query ? `?${query}` : ""}`).then(r => r.json())
  },

  updateStatus: (id, status) =>
    authFetch(`${API}/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }).then(r => r.json()),

  delete: (id) =>
    authFetch(`${API}/orders/${id}`, { method: "DELETE" }).then(r => r.json()),
}

/* ══════════════════════════════════════
   API DE RESERVAS
══════════════════════════════════════ */
export const reservationsApi = {
  getTables: (date) => {
    const query = date ? `?date=${date}` : ""
    return fetch(`${API}/reservations/tables${query}`).then(r => r.json())
  },

  create: (data) =>
    authFetch(`${API}/reservations`, {
      method: "POST",
      body: JSON.stringify(data),
    }).then(r => r.json()),

  getMyReservations: () =>
    authFetch(`${API}/reservations`).then(r => r.json()),

  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return authFetch(`${API}/reservations${query ? `?${query}` : ""}`).then(r => r.json())
  },

  updateStatus: (id, status) =>
    authFetch(`${API}/reservations/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }).then(r => r.json()),

  cancel: (id) =>
    authFetch(`${API}/reservations/${id}`, { method: "DELETE" }).then(r => r.json()),
}

/* ══════════════════════════════════════
   API DE USUARIOS
══════════════════════════════════════ */
export const usersApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return authFetch(`${API}/users${query ? `?${query}` : ""}`).then(r => r.json())
  },

  update: (id, data) =>
    authFetch(`${API}/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }).then(r => r.json()),

  delete: (id) =>
    authFetch(`${API}/users/${id}`, { method: "DELETE" }).then(r => r.json()),
}