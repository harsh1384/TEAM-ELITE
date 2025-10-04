import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Custom hook to get authenticated axios instance
export const useAuthenticatedApi = () => {
  const { getToken } = useAuth()

  // Add auth interceptor
  api.interceptors.request.use(
    async (config) => {
      const token = await getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  return api
}

export default api