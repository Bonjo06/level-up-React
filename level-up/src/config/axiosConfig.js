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
    // Buscar primero el token de admin, luego el token regular
    const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Enviando petición con Authorization header:', config.method.toUpperCase(), config.url);
      console.log('Token (primeros 30 caracteres):', token.substring(0, 30));
    } else {
      console.warn('⚠️ No hay token disponible para:', config.method.toUpperCase(), config.url);
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
      
      // Verificar si el usuario es administrador (no redirigir)
      const isAdmin = localStorage.getItem('adminToken');

      // Limpiamos token local si corresponde (solo si no es admin)
      if (!isAdmin) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('UsuarioLogeado');
        localStorage.removeItem('UsuarioNombre');
      }

      if (!isAuthEndpoint && !isAdmin) {
        window.location.href = '/iniciarsesion';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
