import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosConfig';
import './Login.css'; // Reutilizamos los estilos del video
import Toast from '../components/Toast';

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  
  // Estados para el Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      setToastMessage('Completa todos los campos.');
      setToastType('warning');
      setShowToast(true);
      return;
    }
    if (newPassword.length < 4 || newPassword.length > 12) {
      setToastMessage('La nueva contraseña debe tener entre 4 y 12 caracteres.');
      setToastType('warning');
      setShowToast(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setToastMessage('Las contraseñas no coinciden.');
      setToastType('warning');
      setShowToast(true);
      return;
    }

    try {
      // Llamar al backend de Spring Boot para resetear la contraseña
      await axiosInstance.post('/api/auth/reset-password', {
        email: email.trim(),
        newPassword: newPassword
      });

      setToastMessage('¡Contraseña actualizada exitosamente! Redirigiendo...');
      setToastType('success');
      setShowToast(true);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/iniciarsesion', { state: { message: 'Contraseña actualizada. Inicia sesión.' } });
      }, 2000);
      
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      
      let errorMessage = 'Error al actualizar la contraseña. Intenta nuevamente.';
      
      if (error.response) {
        errorMessage = error.response.data.message || 'Error al actualizar la contraseña.';
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
      
      {/* La tarjeta de recuperación */}
      <div className="card shadow-lg p-4 rounded-4 login-card" style={{ width: '22rem' }}>
        <h3 className="text-center mb-4">Recuperar Contraseña</h3>
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
            <label htmlFor="newPassUser" className="form-label">Ingrese nueva contraseña</label>
            <input
              type="password"
              className="form-control"
              id="newPassUser"
              placeholder="********"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassUser" className="form-label">Vuelva a ingresar la nueva contraseña</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassUser"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div>
            <Link to="/iniciarsesion" className="medium">Volver al inicio de sesión</Link>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-2">Recuperar Contraseña</button>
        </form>
      </div>
    </div>
  );
}

export default PasswordReset;
