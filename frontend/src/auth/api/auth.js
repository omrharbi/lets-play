import axios from 'axios'
import api from '../../api/api'

// const api = axios.create({
//   baseURL: 'https://localhost:8080'
// })

export const login = (data) => api.post('/api/auth/login', data)
export const register = (data) => api.post('/api/auth/register', data)