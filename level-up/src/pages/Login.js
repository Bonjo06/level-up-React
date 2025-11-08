import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
// Ya no importamos 'bg' de 'assets'

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Por favor completa el/los campos vacíos.');
      return;
    }

    // Obtener usuarios registrados
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // Buscar usuario por email y contraseña
    const usuario = usuarios.find(user => user.email === email && user.password === password);
    
    if (usuario) {
      localStorage.setItem('UsuarioLogeado', email);
      navigate('/', { state: { message: 'Sesión iniciada correctamente' } }); 
    } else {
      alert('Correo o clave inválidos.');
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