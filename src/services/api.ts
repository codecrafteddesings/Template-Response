import axios from 'axios'

// Fallback helpers cuando el módulo del store de auth no está disponible
function getUserToken(): string | undefined {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return undefined
    const user = JSON.parse(raw)
    return user?.token
  } catch {
    return undefined
  }
}

function handleLogoutRedirect() {
  try {
    localStorage.removeItem('user')
  } catch (error) {
    console.error('No se pudo eliminar el usuario del localStorage', error)
  }
  window.location.href = '/login'
}

// Registro para depuración: verifica esto en la consola de tu navegador
console.log('URL de la API configurada:', import.meta.env.VITE_API_URL)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Interceptor de peticiones: agrega el token automáticamente
api.interceptors.request.use((config) => {
  const token = getUserToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Interceptor de respuestas: maneja el cierre de sesión si el token expira (401)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      handleLogoutRedirect()
    }
    return Promise.reject(error)
  }
)

export default api
