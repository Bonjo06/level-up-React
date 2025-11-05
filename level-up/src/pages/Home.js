// 1. Añadimos useRef
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// 2. Añadimos useLocation y useNavigate
import { useLocation, useNavigate } from "react-router-dom"; 
import ProductCarousel from "../components/CarruselProducts";
import productsData from "../data/ProductsData";
import { useCart } from '../context/CartContext';

function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 3. Añadimos los hooks para leer la ubicación
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // --- INICIO DE LAS FUNCIONES QUE FALTABAN ---

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const featuredProducts = Object.values(productsData).flat().slice(0, 6);

  const handleAddToCart = (product) => {
    addToCart(product);
    closeModal(); // Cierra el modal después de añadir
  };

  // --- FIN DE LAS FUNCIONES QUE FALTABAN ---


  // --- ARREGLO DOBLE ALERTA ---
  // 4. Añadimos la referencia
  const hasShownAlertRef = useRef(false);

  // 5. Este 'useEffect' recibe el mensaje
  useEffect(() => {
    const message = location.state?.message;

    // 6. Comprobamos si hay mensaje Y si NO se ha mostrado ya
    if (message && !hasShownAlertRef.current) {
      // Marcamos como mostrado ANTES de la alerta
      hasShownAlertRef.current = true; 
      alert(message); // Muestra "Sesión iniciada correctamente"
      
      // Limpia el estado
      navigate(location.pathname, { replace: true, state: {} });
    }
    
    // 7. Si no hay mensaje, reseteamos el ref para la próxima vez
    if (!message) {
      hasShownAlertRef.current = false;
    }
    
  }, [location, navigate]); // El array de dependencias está bien
  // --- FIN ARREGLO DOBLE ALERTA ---


  return (
    <div className="bg-dark text-white min-vh-100">

      {/* (Tu Navbar se renderiza desde App.js, lo cual es correcto) */}

      <ProductCarousel featured={featuredProducts} onProductClick={handleCardClick} />

      <div className="container my-5">
        {Object.entries(productsData).map(([category, products]) => (
          <section key={category} className="mb-5">
            <h2 className="mb-4 text-info">{category}</h2>
            <div className="row g-4">
              {products.map((product) => (
                <motion.div
                  key={product.titulo}
                  className="col-12 col-md-6 col-lg-3"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div
                    className="card bg-dark border-secondary h-100 shadow producto-card"
                    onClick={() => handleCardClick(product)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={product.imagen}
                      className="card-img-top"
                      alt={product.titulo}
                      style={{ 
                        height: "230px", 
                        objectFit: "contain", 
                        backgroundColor: "white" 
                      }}
                    />
                    
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-white">{product.titulo}</h5>
                      <p className="text-light small">
                        {product.descripcion.substring(0, 100)}...
                      </p>
                      <p className="fw-bold text-white mt-auto">{product.precio}</p>
                    </div>

                    <div className="producto-overlay">
                      <div className="overlay-texto">
                        Más información
                      </div>
                    </div>
                    
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>

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

      {/* (Tu Footer se renderiza desde App.js, lo cual es correcto) */}
    </div>
  );
}

export default Home;