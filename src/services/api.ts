import axios from "axios";
import { useAuthStore } from "../features/auth/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor de peticiones: agrega el token automáticamente desde Zustand
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().user?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuestas: maneja cierre de sesión si el token expira (401)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
