import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from '../context/CartContext';

function Navbar() {

  // Estado para saber quién es el usuario
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // useEffect se ejecuta cuando el Navbar se carga
  useEffect(() => {
    // Revisa si existe "UsuarioLogeado" en localStorage
    const userEmail = localStorage.getItem('UsuarioLogeado'); 
    if (userEmail) {
      setCurrentUser(userEmail);
    }

    // Listener para sincronizar entre pestañas
    const handleStorageChange = () => {
      const userEmail = localStorage.getItem('UsuarioLogeado');
      setCurrentUser(userEmail);
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // El array vacío [] significa que esto se ejecuta solo una vez (al montar)

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
              <Link className="nav-link" to="/Cart">
                Carrito
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Contact">
                Contacto
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/AboutUs">
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
              <Link className="nav-link" to="/cart">
                🛒
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
