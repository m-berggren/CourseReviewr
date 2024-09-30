import axios from 'axios'
import { token } from './token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000/api/v1'
})

api.interceptors.request.use(
  (config) => {
    const accessToken = token.getToken()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const Api = api
