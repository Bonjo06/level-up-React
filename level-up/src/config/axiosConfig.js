import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

// Crear instancia de axios usando la URL centralizada
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token JWT a cada request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Evitar redirección automática para endpoints de autenticación
      const requestUrl = error.config?.url || '';
      const isAuthEndpoint = requestUrl.includes('/api/auth');

      // Limpiamos token local si corresponde
      localStorage.removeItem('authToken');
      localStorage.removeItem('UsuarioLogeado');

      if (!isAuthEndpoint) {
        window.location.href = '/iniciarsesion';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
