import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from '../context/CartContext';
import { ShoppingCartIcon } from './FeatureIcons';
import productsData from '../data/ProductsData';

function Navbar() {

  // Estado para saber quién es el usuario
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();

  const location = useLocation();

  // Estados para la búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Estados para el modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  // Función para buscar productos en tiempo real
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const allProducts = Object.values(productsData).flat();
    const filtered = allProducts.filter(product =>
      product.titulo.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5); // Limitar a 5 resultados

    setSearchResults(filtered);
    setShowResults(filtered.length > 0);
  }, [searchQuery]);

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Función para manejar el "Cerrar Sesión"
  const handleLogout = () => {
    localStorage.removeItem('UsuarioLogeado');
    setCurrentUser(null);
    navigate('/iniciarsesion', { state: { message: 'Sesión cerrada exitosamente' } });
  };

  // Función para manejar el clic en un resultado
  const handleResultClick = (product) => {
    setSearchQuery('');
    setShowResults(false);
    setSelectedProduct(product);
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  // Función para añadir al carrito desde el modal
  const handleAddToCart = (product) => {
    addToCart(product);
    closeModal();
  };

  return (
    <motion.nav
      className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <Link className="nav-link" to="/">
          <h3>Level-up Gamer</h3>
        </Link>

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
            <li className="nav-item ms-lg-2 my-2 my-lg-0 position-relative" ref={searchRef}>
              <form 
                className="d-flex" 
                role="search"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  className="form-control form-control-sm me-2"
                  type="search"
                  placeholder="Buscar producto..."
                  aria-label="Buscar"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                />
              </form>

              {/* Resultados de búsqueda */}
              <AnimatePresence>
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="position-absolute bg-dark border border-secondary rounded shadow-lg"
                    style={{
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1050,
                      maxHeight: '400px',
                      overflowY: 'auto',
                      marginTop: '5px',
                      minWidth: '350px'
                    }}
                  >
                    {searchResults.map((product, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center p-2 border-bottom border-secondary"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleResultClick(product)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <img
                          src={product.imagen}
                          alt={product.titulo}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            marginRight: '12px'
                          }}
                        />
                        <div className="flex-grow-1">
                          <p className="text-white mb-1 small fw-semibold" style={{ fontSize: '0.875rem' }}>
                            {product.titulo}
                          </p>
                          <p className="text-primary mb-0" style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                            {product.precio}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="p-2 text-center border-top border-secondary">
                      <small className="text-secondary">
                        {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}
                      </small>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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

      {/* Modal de producto */}
      <AnimatePresence>
              {modalVisible && selectedProduct && (
                <motion.div
                  className="modal fade show d-block bg-dark bg-opacity-75"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeModal}
                >
                  <motion.div
                    className="modal-dialog modal-dialog-centered"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="modal-content bg-dark text-white border-secondary">
                      <div className="modal-header border-secondary">
                        <h5 className="modal-title">{selectedProduct.titulo}</h5>
                        <button
                          className="btn-close btn-close-white"
                          onClick={closeModal}
                        ></button>
                      </div>
                      <div className="modal-body text-center">
                        <img
                          src={selectedProduct.imagen}
                          alt={selectedProduct.titulo}
                          className="img-fluid rounded mb-3"
                          style={{ maxHeight: "300px", objectFit: "cover" }}
                        />
                        <p>{selectedProduct.descripcion}</p>
                        <p className="fw-bold">{selectedProduct.precio}</p>
                        <p className="text-secondary">Stock: {selectedProduct.stock}</p>
                        <button 
                          className="btn btn-primary w-100 mt-2"
                          onClick={() => handleAddToCart(selectedProduct)}
                        >
                          Añadir al carro
                      </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;