import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosConfig';
import './Login.css'; 
import Toast from '../components/Toast';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  
  const navigate = useNavigate();
  
  // Estados para el Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmedPassword) {
      setToastMessage('Completa todos los campos.');
      setToastType('warning');
      setShowToast(true);
      return;
    }
    if (password.length < 4 || password.length > 12) {
      setToastMessage('La contraseña debe tener entre 4 y 12 caracteres.');
      setToastType('warning');
      setShowToast(true);
      return;
    }
    if (password !== confirmedPassword) {
      setToastMessage('Las contraseñas no coinciden.');
      setToastType('warning');
      setShowToast(true);
      return;
    }

    try {
      // Llamar al backend de Spring Boot
      const response = await axiosInstance.post('/api/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password: password
      });

      console.log('Respuesta del servidor:', response.data);

      if (response.data.success) {
        // Guardar el token JWT
        localStorage.setItem('authToken', response.data.token);
        
        // Guardar información del usuario
        localStorage.setItem('UsuarioLogeado', response.data.user.email);
        localStorage.setItem('UsuarioNombre', response.data.user.name);

        setToastMessage('¡Cuenta registrada exitosamente! Bienvenido.');
        setToastType('success');
        setShowToast(true);
        
        // Redirigir después de 1.5 segundos
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error al registrar:', error);
      
      let errorMessage = 'Error al registrar. Intenta nuevamente.';
      
      if (error.response) {
        errorMessage = error.response.data.message || 'Error al registrar usuario.';
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
      
      {/* La tarjeta de registro */}
      <div className="card shadow-lg p-4 rounded-4 login-card" style={{ width: '22rem' }}>
        <h3 className="text-center mb-4">Registrarse</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nameUser" className="form-label">Nombre </label>
            <input 
              type="text" 
              className="form-control" 
              id="nameUser" 
              placeholder="Alexis Sánchez"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <div className="mb-3">
            <label htmlFor="confirmPassUser" className="form-label">Confirmar contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              id="confirmPassUser" 
              placeholder="********"
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
            />
          </div>
          <div>
            <Link to="/iniciarsesion" className="medium">Volver al inicio de sesión</Link>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-2">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
