import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Reutilizamos los estilos del video

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmedPassword) {
      alert('Completa todos los campos.');
      return;
    }
    if (password.length < 4 || password.length > 12) {
      alert('La contraseña debe tener entre 4 y 12 caracteres.');
      return;
    }
    if (password !== confirmedPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    // Obtener usuarios existentes
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // Verificar si el email ya está registrado
    if (usuarios.find(user => user.email === email)) {
      alert('Este correo ya se encuentra registrado.');
      return;
    }
    
    // Agregar nuevo usuario
    usuarios.push({
      name: name.trim(),
      email: email.trim(),
      password: password,
      fechaRegistro: new Date().toLocaleString('es-CL')
    });
    
    // Guardar array actualizado
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    alert('Su cuenta se ha registrado exitosamente.');
    navigate('/iniciarsesion');
  };

  return (
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
