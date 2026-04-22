import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080'
})

export const login = (data) => api.post('/api/auth/login', data)
export const register = (data) => api.post('/api/auth/register', data)