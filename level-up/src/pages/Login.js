import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import bg from '../assets/images/login-bg.svg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Por favor completa el/los campos vacíos.');
      return;
    }
    const storedPassword = localStorage.getItem(email);
    if (storedPassword && storedPassword === password) {
      alert('Sesión iniciada correctamente.');
      navigate('/'); 
    } else {
      alert('Correo o clave inválidos.');
    }
  };

  return (
    // Use GIF from public/images/Login.gif as primary background for faster serving;
    // fall back to the bundled SVG (`bg`) if the GIF is not present.
    <div
      className="login-page"
      style={{ backgroundImage: `url('/images/Login.gif'), url(${bg})` }}
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
            <Link to="/recuperar-contrasena" className="medium">¿Olvidaste tu contraseña?</Link>
          </div>
          <div>
            <Link to="/registro" className="medium">Registrarse</Link>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-2">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
