// frontend/src/services/api.js
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // ok usar, mesmo que a gente use Bearer
})

// adiciona Authorization em cada request, se houver token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function authHeaders() {
  const t = localStorage.getItem('jwt');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default api
