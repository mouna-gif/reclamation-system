import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const complaintsApi = {
  getAll: async (filters = {}) => {
    const response = await api.get('/complaints', { params: filters })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/complaints/${id}`)
    return response.data
  },

  create: async (complaintData) => {
    const response = await api.post('/complaints', complaintData)
    return response.data
  },

  updateStatus: async (id, status, technicianId) => {
    const response = await api.put(`/complaints/${id}/status`, {
      status,
      technicianId
    })
    return response.data
  }
}

export const slaApi = {
  getAll: async () => {
    const response = await api.get('/sla')
    return response.data
  },

  create: async (slaData) => {
    const response = await api.post('/sla', slaData)
    return response.data
  },

  update: async (id, slaData) => {
    const response = await api.put(`/sla/${id}`, slaData)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/sla/${id}`)
    return response.data
  }
}
