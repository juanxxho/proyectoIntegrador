import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:80"

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para añadir el token de autenticación a todas las solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    // Solo acceder a localStorage en el cliente
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      console.log("Token en localStorage:", token);  // Depuración      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response && error.response.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
