import axios from 'axios'
import { appSettings } from './setup'

// Create axios instance with base URL pointing to Flask backend
const axiosInstance = axios.create({
    baseURL: appSettings.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default axiosInstance
