import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
})

// Add CSRF token from meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
if (csrfToken) {
  api.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
}

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const activityApi = {
  getAll: (params = {}) => api.get('/activities', { params }),
  getOne: (id) => api.get(`/activities/${id}`),
  create: (data) => {
    if (data instanceof FormData) {
      return api.post('/activities', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return api.post('/activities', data)
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT')
      return api.post(`/activities/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return api.put(`/activities/${id}`, data)
  },
  delete: (id) => api.delete(`/activities/${id}`),
}

export default api
