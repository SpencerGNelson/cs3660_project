import axios from 'axios'
import { appSettings } from './setup'

// Create axios instance with base URL pointing to Flask backend
const axiosInstance = axios.create({
    baseURL: appSettings.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add request interceptor to include JWT token in Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage (AuthContext keeps it in sync)
        const token = localStorage.getItem('jwt_token')
        if (token) {
            config.headers.Authorization = token
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default axiosInstance
