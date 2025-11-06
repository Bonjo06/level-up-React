import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      alert('Completa todos los campos.');
      return;
    }
    if (newPassword.length < 4 || newPassword.length > 12) {
      alert('La nueva contraseña debe tener entre 4 y 12 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no son iguales.');
      return;
    }
    if (!localStorage.getItem(email)) {
      alert('El correo no está registrado.');
      return;
    }

    localStorage.setItem(email, newPassword);
    alert('Su contraseña se actualizó con éxito.');
    navigate('/iniciarsesion');
  };

  return (

    
    <div className="bg-light d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 rounded-4" style={{ width: '22rem' }}>
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
