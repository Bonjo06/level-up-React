import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import Breadcrumbs from '../components/Breadcrumbs';
import ScrollToTop from '../components/ScrollToTop';

function Cart() {

  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  // Calcula el total
  const total = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.precio.replace(/[^0-9,-]+/g, "").replace(",", "."));
    return acc + (price * item.cantidad);
  }, 0);

  return (
    <div className="container my-5">
      <Breadcrumbs items={[{ label: 'Carrito', path: '/carrito' }]} />

      {/* Header animado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <h2 className="text-white">
          🛒 Tu Carrito de Compras
          {cartItems.length > 0 && (
            <span className="badge bg-primary ms-3">{cartItems.length}</span>
          )}
        </h2>
      </motion.div>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-5"
        >
          <div className="mb-4" style={{ fontSize: '4rem' }}>🛒</div>
          <p className="text-secondary lead">Tu carrito está vacío.</p>
          <motion.a 
            href="/"
            className="btn btn-primary mt-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explorar productos
          </motion.a>
        </motion.div>
      ) : (
        <>
        <motion.div 
          className="card bg-dark text-white border-secondary shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ul className="list-group list-group-flush">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item, index) => (
                <motion.li
                  key={item.titulo}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center py-3"
                >
                  {/* info producto */}
                  <div className="d-flex align-items-center">
                    <img 
                      src={item.imagen} 
                      alt={item.titulo} 
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        objectFit: 'cover', 
                        marginRight: '20px',
                        borderRadius: '8px'
                      }} 
                    />
                    <div>
                      <h6 className="mb-1">{item.titulo}</h6>
                      <small className="text-secondary">{item.precio}</small>
                      <div className="text-primary small mt-1">
                        Subtotal: ${new Intl.NumberFormat('es-CL').format(
                          parseFloat(item.precio.replace(/[^0-9,-]+/g, "").replace(",", ".")) * item.cantidad
                        )} CLP
                      </div>
                    </div>
                  </div>

                  {/* Controles */}
                  <div className="d-flex align-items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updateQuantity(item.titulo, item.cantidad - 1)}
                    >
                      -
                    </motion.button>

                    <span className="mx-3 fw-bold">{item.cantidad}</span>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updateQuantity(item.titulo, item.cantidad + 1)}
                    >
                      +
                    </motion.button>
                  
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: '#dc3545' }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => removeFromCart(item.titulo)}
                    >
                      🗑️ Eliminar
                    </motion.button>
                  </div>

                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {/* Footer con total */}
          <motion.div 
            className="card-footer border-secondary d-flex justify-content-between align-items-center py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h5 className="mb-0">Total:</h5>
            <h5 className="mb-0 text-primary fw-bold">
              ${new Intl.NumberFormat('es-CL').format(total)} CLP
            </h5>
          </motion.div>
        </motion.div>

        {/* Botones de acción */}
        <motion.div 
          className="d-flex justify-content-between mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-outline-danger"
            onClick={clearCart}
          >
            🗑️ Limpiar Carrito
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary btn-lg"
            onClick={() => alert('Funcionalidad de pago próximamente')}
          >
            Proceder al pago →
          </motion.button>
        </motion.div>
        </>
      )}

      <ScrollToTop />
    </div>
  );
}

export default Cart;