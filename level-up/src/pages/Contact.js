import React, { useState } from 'react';

import { motion } from 'framer-motion';
import Breadcrumbs from '../components/Breadcrumbs';
import ScrollToTop from '../components/ScrollToTop';

function Contact() {
  // 1. Estados para cada campo del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  
  // 2. Usamos 'navigate' para redirigir después de enviar
  

  // 3. Validación mejorada
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El correo no es válido';
    }
    
    if (!message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 4. Función que se ejecuta al presionar "Enviar"
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    
    // Guardar datos en localStorage
    const contactData = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      fecha: new Date().toLocaleString('es-CL')
    };

    const mensajes = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    mensajes.push(contactData);
    localStorage.setItem('contactSubmissions', JSON.stringify(mensajes));
    
    alert('¡Gracias por tu mensaje! Nos contactaremos contigo dentro de la brevedad.');

    setName('');
    setEmail('');
    setMessage('');
    setErrors({});
  };

  return (
    <div className="container my-5">
      <Breadcrumbs items={[{ label: 'Contacto', path: '/contacto' }]} />

      {/* Hero con animación */}
      <motion.div 
        className="row mb-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="col-lg-8 offset-lg-2 text-center">
          <h1 className="text-white mb-3 display-5">Contáctanos</h1>
          <p className="text-secondary lead mb-0">
            ¿Tienes alguna pregunta o sugerencia? Estamos aquí para ayudarte.
          </p>
        </div>
      </motion.div>

      {/* Formulario mejorado */}
      <motion.div 
        className="row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="col-lg-8 offset-lg-2">
          <div className="card bg-dark text-white border-secondary shadow-lg">
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                {/* Nombre */}
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-semibold">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    className={`form-control bg-dark text-white border-secondary ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    placeholder="Ej: Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-semibold">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className={`form-control bg-dark text-white border-secondary ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Mensaje */}
                <div className="mb-4">
                  <label htmlFor="message" className="form-label fw-semibold">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Mensaje
                  </label>
                  <textarea
                    className={`form-control bg-dark text-white border-secondary ${errors.message ? 'is-invalid' : ''}`}
                    id="message"
                    rows="5"
                    placeholder="Escribe tu mensaje aquí..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                  {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                  <small className="text-secondary">{message.length} caracteres</small>
                </div>

                {/* Botón */}
                <motion.button 
                  type="submit" 
                  className="btn btn-primary w-100 py-3 fw-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Enviar Mensaje
                </motion.button>
              </form>
            </div>
          </div>

          {/* Info adicional */}
          <motion.div 
            className="row mt-4 g-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="col-md-4">
              <div className="card bg-dark border-secondary text-center p-3">
                <div className="text-primary mb-2">📧</div>
                <small className="text-secondary">Email</small>
                <p className="mb-0 text-white small">info@levelupgamer.cl</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-dark border-secondary text-center p-3">
                <div className="text-primary mb-2">📞</div>
                <small className="text-secondary">Teléfono</small>
                <p className="mb-0 text-white small">+56 9 1234 5678</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-dark border-secondary text-center p-3">
                <div className="text-primary mb-2">⏰</div>
                <small className="text-secondary">Horario</small>
                <p className="mb-0 text-white small">Lun-Vie 9:00-18:00</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <ScrollToTop />
    </div>
  );
}

export default Contact;