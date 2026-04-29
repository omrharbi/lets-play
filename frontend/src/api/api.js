// src/api/api.js
import axios from 'axios'
import { isLoggedIn } from '../jwt/jwt'

const api = axios.create({
  baseURL: 'https://localhost:8080'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token && !isLoggedIn()) {
    localStorage.removeItem("token")
    location.href='/login'
    return Promise.reject("token expired")
  }

   if (token ) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
export default api