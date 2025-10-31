import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/NavBar";
import ProductCarousel from "../components/CarruselProducts";
import productsData from "../data/ProductsData";

function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const featuredProducts = Object.values(productsData).flat().slice(0, 6);

  return (
    <div className="bg-dark text-white min-vh-100">
      <Navbar />

      <section className="text-center py-5 bg-primary bg-gradient">
        <motion.h1
          className="display-4 fw-bold mb-3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Bienvenido a <span className="text-warning">Level-Up Gamer</span>
        </motion.h1>
        <p className="lead">Tu destino gamer: consolas, periféricos y más.</p>
      </section>

      <ProductCarousel featured={featuredProducts} />

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
                    className="card bg-dark border-secondary h-100 shadow"
                    onClick={() => handleCardClick(product)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={product.imagen}
                      className="card-img-top"
                      alt={product.titulo}
                      style={{ height: "230px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.titulo}</h5>
                      <p className="text-muted small">
                        {product.descripcion.substring(0, 50)}...
                      </p>
                      <p className="fw-bold">{product.precio}</p>
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
                  <button className="btn btn-primary w-100 mt-2">
                    Añadir al carro
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-black text-center py-4 mt-5 border-top border-secondary">
        <p className="mb-0 text-secondary">
          © 2025 Level-Up Gamer — Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
}

export default Home;
