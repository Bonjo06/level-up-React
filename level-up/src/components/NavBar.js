import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from '../context/CartContext';
import { ShoppingCartIcon } from './FeatureIcons';

function Navbar() {

  // Estado para saber quién es el usuario
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const location = useLocation();

  // useEffect se ejecuta cuando el Navbar se carga
  useEffect(() => {
    // Revisa si existe "UsuarioLogeado" en localStorage
    const userEmail = localStorage.getItem('UsuarioLogeado'); 
    if (userEmail) {
      // Obtener usuarios registrados
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      // Buscar el usuario por email
      const usuario = usuarios.find(user => user.email === userEmail);
      // Si existe el usuario, usamos su nombre; si no, usamos el email
      setCurrentUser(usuario ? usuario.name : userEmail);
    } else {
      // Asegúrate de limpiar el estado si no hay usuario
      setCurrentUser(null);
    }

    // Listener para sincronizar entre pestañas
    const handleStorageChange = () => {
      const userEmail = localStorage.getItem('UsuarioLogeado');
      if (userEmail) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuario = usuarios.find(user => user.email === userEmail);
        setCurrentUser(usuario ? usuario.name : userEmail);
      } else {
        setCurrentUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  // ----- MODIFICACIÓN AQUÍ -----
  // Cambiamos '[]' por '[location]'
  }, [location]); 

  // --- MODIFICACIÓN AQUÍ ---
  // Función para manejar el "Cerrar Sesión"
  const handleLogout = () => {
    localStorage.removeItem('UsuarioLogeado'); // Limpia la variable
    setCurrentUser(null); // Actualiza el estado
    
    // Redirige al login Y pasa el mensaje de estado
    navigate('/iniciarsesion', { state: { message: 'Sesión cerrada exitosamente' } });
  };
  // --- FIN DE LA MODIFICACIÓN ---

  return (
    <motion.nav
      className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <h3>Level-up Gamer</h3>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">
                Contacto
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/acerca-de">
                Sobre nosotros
              </Link>
            </li>

            {/* --- BARRA DE BÚSQUEDA --- */}
            <li className="nav-item ms-lg-2 my-2 my-lg-0">
              <form className="d-flex" role="search">
                <input
                  className="form-control form-control-sm me-2"
                  type="search"
                  placeholder="Buscar producto..."
                  aria-label="Buscar"
                />
                <button className="btn btn-outline-primary btn-sm" type="submit">
                  Buscar
                </button>
              </form>
            </li>

            <li className="nav-item ms-lg-2">
              <Link className="nav-link d-flex align-items-center" to="/carrito">
                <ShoppingCartIcon size={20} color="#0d6efd" />
                <span className="ms-1">Carrito</span>
                {/* Muestra un contador si hay items */}
                {cartItems.length > 0 && (
                  <span className="badge rounded-pill bg-primary ms-1">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </li>
            {/* --- FIN BARRA DE BÚSQUEDA --- */}

            {/* Lógica condicional (esta ya la tenías bien) */}
            {currentUser ? (
              // Si hay un usuario logueado
              <>
                <li className="nav-item ms-lg-3">
                  <span className="navbar-text text-light">
                    Bienvenido, {currentUser}
                  </span>
                </li>
                <li className="nav-item ms-lg-2">
                  <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              // Si NO hay usuario (invitado)
              <li className="nav-item">
                <Link className="btn btn-primary ms-lg-3" to="/iniciarsesion">
                  Iniciar sesión
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;