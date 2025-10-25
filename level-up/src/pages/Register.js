import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Completa todos los campos.');
      return;
    }
    if (password.length < 4 || password.length > 12) {
      alert('La contraseña debe tener entre 4 y 12 caracteres.');
      return;
    }
    if (localStorage.getItem(email)) {
      alert('Este correo ya se encuentra registrado.');
      return;
    }
    
    localStorage.setItem(email, password);
    alert('Su cuenta se ha registrado exitosamente.');
    navigate('/iniciarsesion');
  };

  return (
    <div className="bg-light d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 rounded-4" style={{ width: '22rem' }}>
        <h3 className="text-center mb-4">Registrarse</h3>
        
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
            <Link to="/iniciarsesion" className="medium">Volver al inicio de sesión</Link>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-2">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
