import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import axiosInstance from '../config/axiosConfig';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const hasShownAlertRef = useRef(false);
  const { loginAsAdmin, setIsAuthenticated, setUser } = useAuth();
  
  // Estados para el Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const message = location.state?.message;
    if (message && !hasShownAlertRef.current) {
      hasShownAlertRef.current = true;
      // Usar toast en lugar de alert
      setToastMessage(message);
      setToastType('success');
      setShowToast(true);
      
      navigate(location.pathname, { replace: true, state: {} });
    }
    if (!message) {
      hasShownAlertRef.current = false;
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToastMessage('Por favor completa todos los campos.');
      setToastType('warning');
      setShowToast(true);
      return;
    }

    try {
      // Intentar login contra el backend primero
      const response = await axiosInstance.post('/api/auth/login', {
        email: email,
        password: password
      });


      if (response.data.success) {
        // Guardar el token JWT
        localStorage.setItem('authToken', response.data.token);
        
        // Guardar información del usuario en localStorage
        localStorage.setItem('UsuarioLogeado', response.data.user.email);
        localStorage.setItem('UsuarioNombre', response.data.user.name);
        
        // Verificar si el usuario tiene rol ADMIN desde el backend
        if (response.data.user.role === 'ADMIN') {
          const adminData = {
            email: response.data.user.email,
            name: response.data.user.name,
            role: 'admin'
          };
          
          // Pasar el token JWT real al contexto
          loginAsAdmin(adminData, response.data.token);
          
          setToastMessage('¡Bienvenido Administrador!');
          setToastType('success');
          setShowToast(true);
          
          setTimeout(() => {
            navigate('/administracion');
          }, 1000);
          return;
        }
        
        // Usuario normal
        setIsAuthenticated(true);
        setUser(response.data.user);
        
        // Mostrar toast de éxito
        setToastMessage(`¡Bienvenido ${response.data.user.name}!`);
        setToastType('success');
        setShowToast(true);
        
        // Redirigir después de 1 segundo
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } 
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      let errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
      
      if (error.response) {
        errorMessage = error.response.data.message || 'Correo o contraseña inválidos.';
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
      }
      
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
    <div className="login-page">

      {/* Toast Component */}
      <Toast 
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
      
      {/* El video de fondo */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="login-video-bg"
      >
        <source src="/images/Fondo.mp4" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>
      
      {/* El overlay oscuro */}
      <div className="login-fallback-overlay"></div>
      
      {/* La tarjeta de login */}
      <div className="card shadow-lg p-4 rounded-4 login-card" style={{ width: '22rem' }}>
        <h3 className="text-center mb-4">Iniciar sesión</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="emailUser" className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              id="emailUser"
              placeholder="usuario@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="passUser" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="passUser"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <span>¿Olvidaste tu contraseña? </span>
            <Link to="/recuperar-contrasena" className="medium">Recupérala aquí</Link>
          </div>
          <div>
            <span>¿No tienes una cuenta? </span>
            <Link to="/registro" className="medium">Registrate aquí</Link>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-2">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;