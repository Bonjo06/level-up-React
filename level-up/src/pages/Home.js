// 1. Añadimos useRef

import React, { useState, useEffect, useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";

// 2. Añadimos useLocation y useNavigate

import { useLocation, useNavigate } from "react-router-dom";

import ProductCarousel from "../components/CarruselProducts";

//import productsData from "../data/ProductsData";

import { useCart } from '../context/CartContext';

import ScrollToTop from '../components/ScrollToTop';

import axiosInstance from '../config/axiosConfig';

import Toast from '../components/Toast';



function Home() {

  const [modalVisible, setModalVisible] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);



  // --- INICIO DE NUEVOS ESTADOS ---

  const [productsData, setProductsData] = useState({});

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);

  // --- FIN DE NUEVOS ESTADOS ---
  
  // Estados para el Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');



  const location = useLocation();

  const navigate = useNavigate();

  const { addToCart, cartNotification } = useCart();

  const hasShownAlertRef = useRef(false); // Referencia para la alerta
  
  // Sincronizar las notificaciones del carrito con el Toast local
  useEffect(() => {
    if (cartNotification.show) {
      setToastMessage(cartNotification.message);
      setToastType(cartNotification.type);
      setShowToast(true);
    }
  }, [cartNotification]);



  // --- INICIO DE LAS FUNCIONES ---



  const handleCardClick = (product) => {

    setSelectedProduct(product);

    setModalVisible(true);

  };



  const closeModal = () => {

    setModalVisible(false);

    setSelectedProduct(null);

  };



  const handleAddToCart = (product) => {

    addToCart(product);

    closeModal();

  };

  
  const groupProductsByCategory = (productsList) => {
    return productsList.reduce((acc, product) => {
      const category = product.itemCategory || 'Otros';

      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  };



  // --- FIN DE LAS FUNCIONES ---





  // --- ARREGLO DE HOOKS ---

 

  // PRIMER useEffect: Cargar productos desde la API

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        setIsLoading(true);

        const response = await axiosInstance.get('/api/inventario');

        console.log('📦 Datos recibidos del backend:', response.data);

        
        // Extraer los productos de la estructura HAL de Spring Boot
        let productsList = [];
        
        if (response.data._embedded && response.data._embedded.inventarioList) {
          // Formato HAL de Spring Data REST
          productsList = response.data._embedded.inventarioList;
        } else if (Array.isArray(response.data)) {
          // Array directo
          productsList = response.data;
        } else if (response.data.content && Array.isArray(response.data.content)) {
          // Formato paginado de Spring
          productsList = response.data.content;
        }

        console.log('Lista de productos:', productsList);

        // Agrupar productos por categoría
        const grouped = groupProductsByCategory(productsList);
        console.log('Productos agrupados:', grouped);
        
        setProductsData(grouped);
        setIsLoading(false);

      } catch (err) {

        console.error('Error al cargar productos:', err);
        console.error('Detalles:', err.response?.data);

        setError(err);

        setIsLoading(false);

      }

    };



    fetchProducts();

  }, []); // Solo se ejecuta 1 vez






  // SEGUNDO useEffect: Manejar el mensaje de alerta (Arreglo doble alerta)

  useEffect(() => {

    const message = location.state?.message;



    if (message && !hasShownAlertRef.current) {

      hasShownAlertRef.current = true;

      setToastMessage(message);
      setToastType('success');
      setShowToast(true);

      navigate(location.pathname, { replace: true, state: {} });

    }

   

    if (!message) {

      hasShownAlertRef.current = false;

    }

   

  }, [location, navigate]); // Depende de 'location' y 'navigate'



  // --- FIN ARREGLO DE HOOKS ---





  // Lógica para 'featuredProducts'.

  const featuredProducts = !isLoading && Object.keys(productsData).length > 0

    ? Object.values(productsData).flat().slice(0, 6)

    : [];





  // --- INICIO DEL JSX ---

  return (

    <div className="bg-dark text-white min-vh-100">

      {/* Toast Component */}
      <Toast 
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />

      {/* (Navbar) */}



      {/* --- INICIO: CÓDIGO AÑADIDO --- */}

      {/* Si está cargando, muestra el spinner */}

      {isLoading && (

        <div className="container text-center my-5">

          <div className="spinner-border text-info" role="status">

            <span className="visually-hidden">Cargando...</span>

          </div>

          <p className="mt-2">Cargando productos...</p>

        </div>

      )}



      {/* Si hay un error, muestra el mensaje de error */}

      {error && (

        <div className="container text-center my-5 text-danger">

          <h3>¡Ups! Algo salió mal</h3>

          <p>No se pudieron cargar los productos. Intenta recargar la página.</p>

          <small>{error.message}</small>

        </div>

      )}

      {/* --- FIN: CÓDIGO AÑADIDO --- */}





      {/* --- INICIO: CONDICIONAL AÑADIDO --- */}

      {/* Muestra el contenido principal SOLO si NO está cargando Y NO hay error */}

      {!isLoading && !error && (

        <>

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

                      key={product.itemTitle}

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

                          src={product.itemImageLink}

                          className="card-img-top"

                          alt={product.itemTitle}

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

                            {product.itemTitle}

                          </h5>

                          <p className="text-light small" style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            flexGrow: 1
                          }}>
                            {product.itemDescription}
                          </p>
                          <p className="fw-bold text-white mt-auto mb-0">${product.itemPrice?.toLocaleString('es-CL')}</p>
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
        </>
      )}



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
            <h5 className="modal-title">{selectedProduct.itemTitle}</h5>

            <button

              className="btn-close btn-close-white"
              onClick={closeModal}

            ></button>
              </div>
              <div className="modal-body text-center">

            <img
              src={selectedProduct.itemImageLink}
              alt={selectedProduct.itemTitle}
              className="img-fluid rounded mb-3"
              style={{ maxHeight: "300px", objectFit: "cover" }}

            />
            <p>{selectedProduct.itemDescription}</p>
            <p className="fw-bold">${selectedProduct.itemPrice?.toLocaleString('es-CL')}</p>
            <p className="text-secondary">Stock: {selectedProduct.itemQuantity}</p>
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
        {/* (Footer) */}
    </div>
  );
}


export default Home;
