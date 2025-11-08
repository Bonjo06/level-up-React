// 1. Añadimos useRef
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// 2. Añadimos useLocation y useNavigate
import { useLocation, useNavigate } from "react-router-dom"; 
import ProductCarousel from "../components/CarruselProducts";
import productsData from "../data/ProductsData";
import { useCart } from '../context/CartContext';
import ScrollToTop from '../components/ScrollToTop';

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
        {Object.entries(productsData).map(([category, products], categoryIndex) => (
          <motion.section 
            key={category} 
            className="mb-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            style={{ overflow: 'visible' }}
          >
            {/* Título de la categoría */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-info mb-0">{category}</h2>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    const container = document.getElementById(`carousel-${categoryIndex}`);
                    container.scrollBy({ left: -450, behavior: 'smooth' });
                  }}
                >
                  ◀
                </button>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    const container = document.getElementById(`carousel-${categoryIndex}`);
                    container.scrollBy({ left: 450, behavior: 'smooth' });
                  }}
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Carrusel horizontal de productos */}
            <div 
              id={`carousel-${categoryIndex}`}
              className="d-flex gap-3"
              style={{
                overflowX: 'auto',
                overflowY: 'visible',
                scrollbarWidth: 'thin',
                scrollbarColor: '#6c757d #212529',
                scrollBehavior: 'smooth',
                padding: '10px 5px 20px 5px'
              }}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.titulo}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  style={{ minWidth: '300px', maxWidth: '300px', flexShrink: 0 }}
                >
                  <div
                    className="card bg-dark border-secondary shadow producto-card"
                    onClick={() => handleCardClick(product)}
                    style={{ 
                      cursor: "pointer",
                      height: "520px",
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <img
                      src={product.imagen}
                      className="card-img-top"
                      alt={product.titulo}
                      style={{ 
                        height: "300px", 
                        objectFit: "contain", 
                        backgroundColor: "white",
                        flexShrink: 0
                      }}
                    />
                    
                    <div className="card-body d-flex flex-column" style={{ overflow: "hidden", flex: "1" }}>
                      <h5 className="card-title text-white" style={{ 
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        minHeight: "3rem"
                      }}>
                        {product.titulo}
                      </h5>
                      <p className="text-light small" style={{ 
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        flexGrow: 1
                      }}>
                        {product.descripcion}
                      </p>
                      <p className="fw-bold text-white mt-auto mb-0">{product.precio}</p>
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
          </motion.section>
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

      <ScrollToTop />

      {/* (Tu Footer se renderiza desde App.js, lo cual es correcto) */}
    </div>
  );
}

export default Home;