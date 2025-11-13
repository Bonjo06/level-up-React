import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const hasShownAlertRef = useRef(false);

  useEffect(() => {
    const message = location.state?.message;
    if (message && !hasShownAlertRef.current) {
      hasShownAlertRef.current = true;
      alert(message); 
      navigate(location.pathname, { replace: true, state: {} });
    }
    if (!message) {
      hasShownAlertRef.current = false;
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Por favor completa el/los campos vacíos.');
      return;
    }

    try {
      // Llamar al backend de Spring Boot
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email,
        password: password
      });

      if (response.data.success) {
        // Guardar información del usuario en localStorage
        localStorage.setItem('UsuarioLogeado', email);
        localStorage.setItem('UsuarioNombre', response.data.user.name);  // Cambiado de "nombre" a "name"
        
        // Redirigir al home con mensaje de éxito
        navigate('/', { state: { message: 'Sesión iniciada correctamente' } });
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      if (error.response) {
        // El servidor respondió con un error
        alert(error.response.data.message || 'Correo o contraseña inválidos.');
      } else if (error.request) {
        // No se recibió respuesta del servidor
        alert('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
      } else {
        // Otro tipo de error
        alert('Error al iniciar sesión. Intenta nuevamente.');
      }
    }
  };

  return (
    // --- MODIFICACIÓN AQUÍ ---
    // Añadimos el style en línea para el 'backgroundImage' de fallback.
    // El navegador buscará esta imagen en la carpeta 'public'.
    <div className="login-page">
      
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