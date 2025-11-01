// 1. Importa 'useEffect' y 'useLocation'
import React, { useState, useEffect } from 'react';
// 2. Importa 'useLocation'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
// 3. Importa el SVG de fallback (esto está bien)
import bg from '../assets/images/login-bg.svg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  // 4. Obtén 'location'
  const location = useLocation();

  // 5. Este 'useEffect' recibe mensajes (ej. "Sesión cerrada")
  useEffect(() => {
    const message = location.state?.message;
    if (message) {
      alert(message); // Muestra el mensaje
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]); // Se ejecuta cada vez que la ubicación cambia

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Por favor completa el/los campos vacíos.');
      return;
    }
    const storedPassword = localStorage.getItem(email);
    if (storedPassword && storedPassword === password) {
      localStorage.setItem('UsuarioLogeado', email);
      navigate('/', { state: { message: 'Sesión iniciada correctamente' } }); 
    } else {
      alert('Correo o clave inválidos.');
    }
  };

  return (
    <div
      className="login-page"
      // 6. ESTA ES LA CORRECCIÓN:
      // Se referencia 'Login.jpg' como un string de ruta absoluta '/'.
      // El navegador lo buscará en 'public/images/Login.jpg'.
      style={{ backgroundImage: `url('/images/Login.jpg'), url(${bg})` }}
    >
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