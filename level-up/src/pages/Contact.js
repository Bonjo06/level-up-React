import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Breadcrumbs from '../components/Breadcrumbs';
import ScrollToTop from '../components/ScrollToTop';
import { MailIcon, PhoneIcon, ClockIcon } from '../components/FeatureIcons';
import Toast from '../components/Toast';
import axiosInstance from '../config/axiosConfig';

function Contact() {
  // Estados para cada campo del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  
  // Estados para el Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); 
  
  // Verificar si hay un usuario logueado al cargar (para pre-llenar el email)
  useEffect(() => {
    const loggedUserEmail = localStorage.getItem('UsuarioLogeado');
    if (loggedUserEmail) {
      setEmail(loggedUserEmail); 
    }
  }, []);

  // Validación mejorada
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

    if (!subject.trim()) {
      newErrors.subject = 'El asunto es requerido';
    }
    
    if (!message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función que se ejecuta al presionar "Enviar"
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Obtener el usuario autenticado desde localStorage (ajusta si usas Context)
      const userRaw = localStorage.getItem('usuarioAutenticado') || localStorage.getItem('UsuarioLogeado');
      let userId = null;
      if (userRaw) {
        try {
          const userObj = JSON.parse(userRaw);
          if (userObj && userObj.id) userId = Number(userObj.id);
        } catch (e) {
          if (!isNaN(userRaw)) userId = Number(userRaw);
        }
      }

      // Log para depuración
      console.log('userId enviado:', userId, 'typeof:', typeof userId);
      // Obtiene el email del usuario logueado
      let userEmail = email;
      if (userRaw) {
        try {
          const userObj = JSON.parse(userRaw);
          if (userObj && userObj.email) userEmail = userObj.email;
        } catch (e) {
          if (typeof userRaw === 'string' && userRaw.includes('@')) userEmail = userRaw;
        }
      }

      // Construye el body, incluye user_email para que el backend lo asocie
      const response = await axiosInstance.post(
      '/api/contact-messages',
      {
        name: name,
        email: email,
        subject: subject,
        message: message
      },
      {
        params: { userEmail: userEmail } // aquí va el email del usuario logueado
      }
      );

      console.log('Respuesta del servidor:', response); 
      
      // Mostrar toast de éxito
      setToastMessage('¡Mensaje enviado correctamente! Te responderemos pronto.');
      setToastType('success');
      setShowToast(true);
      
      // Limpiar el formulario
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setErrors({});
      
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      
      // Mostrar toast de error
      if (error.response) {
        setToastMessage(error.response.data.message || 'Error al enviar el mensaje.');
      } else if (error.request) {
        setToastMessage('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
      } else {
        setToastMessage('Error al enviar el mensaje. Intenta nuevamente.');
      }
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
    <div className="container my-5">
      <style>{`
        .contact-input::placeholder,
        .contact-textarea::placeholder {
          color: #9ca3af !important;
          opacity: 1 !important;
        }
      `}</style>
      
      <Breadcrumbs items={[{ label: 'Contacto', path: '/contacto' }]} />

      {/* Toast Component */}
      <Toast 
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />

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
                    Nombre
                  </label>
                  <input
                    type="text"
                    className={`form-control bg-dark text-white border-secondary contact-input ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    placeholder="Tu nombre"
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
                    className={`form-control bg-dark text-white border-secondary contact-input ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Asunto */}
                <div className="mb-4">
                  <label htmlFor="subject" className="form-label fw-semibold">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Asunto
                  </label>
                  <input
                    type="text"
                    className={`form-control bg-dark text-white border-secondary contact-input ${errors.subject ? 'is-invalid' : ''}`}
                    id="subject"
                    placeholder="Asunto"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                  {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
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
                    className={`form-control bg-dark text-white border-secondary contact-textarea ${errors.message ? 'is-invalid' : ''}`}
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
                <div className="text-primary mb-2 d-flex justify-content-center">
                  <MailIcon size={36} color="#0d6efd" />
                </div>
                <small className="text-secondary">Email</small>
                <p className="mb-0 text-white small">info@levelupgamer.cl</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-dark border-secondary text-center p-3">
                <div className="text-primary mb-2 d-flex justify-content-center">
                  <PhoneIcon size={36} color="#198754" />
                </div>
                <small className="text-secondary">Teléfono</small>
                <p className="mb-0 text-white small">+56 9 1234 5678</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-dark border-secondary text-center p-3">
                <div className="text-primary mb-2 d-flex justify-content-center">
                  <ClockIcon size={36} color="#ffc107" />
                </div>
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