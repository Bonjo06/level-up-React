import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import Breadcrumbs from '../components/Breadcrumbs';
import ScrollToTop from '../components/ScrollToTop';
import { ShoppingCartIcon } from '../components/FeatureIcons';
import Toast from '../components/Toast';

function Cart() {

  const { cartItems, removeFromCart, updateQuantity, clearCart, cartNotification } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados para el Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // Estado para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Sincronizar las notificaciones del carrito con el Toast
  useEffect(() => {
    if (cartNotification.show) {
      setToastMessage(cartNotification.message);
      setToastType(cartNotification.type);
      setShowToast(true);
    }
  }, [cartNotification]);
  
  // Función para confirmar limpieza del carrito
  const handleClearCartClick = () => {
    setShowConfirmModal(true);
  };
  
  const confirmClearCart = () => {
    clearCart();
    setShowConfirmModal(false);
    setToastMessage('Carrito limpiado correctamente.');
    setToastType('success');
    setShowToast(true);
  };
  
  const cancelClearCart = () => {
    setShowConfirmModal(false);
  };

  // Calcula el total
  const total = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.itemPrice) || 0;
    return acc + (price * item.cantidad);
  }, 0);

  // Función para procesar el pago con Transbank
  const handleProceedToPayment = async () => {
    // Verificar que haya un usuario logueado
    const userEmail = localStorage.getItem('UsuarioLogeado');
    if (!userEmail) {
      setToastMessage('Debes iniciar sesión para realizar una compra.');
      setToastType('warning');
      setShowToast(true);
      setTimeout(() => {
        window.location.href = '/iniciarsesion';
      }, 2000);
      return;
    }

    if (cartItems.length === 0) {
      setToastMessage('Tu carrito está vacío.');
      setToastType('warning');
      setShowToast(true);
      return;
    }

    setIsProcessing(true);

    try {
      // PASO 1: Crear la orden en la base de datos
      console.log('📝 Creando orden en la base de datos...');
      console.log('📋 Items en el carrito:', cartItems);
      
      // Preparar los items de la orden
      const orderItems = cartItems.map(item => {
        console.log('🔍 Item:', item);
        return {
          productId: item.itemId, // ID del producto en la tabla inventario
          productTitle: item.itemTitle,
          unitPrice: parseFloat(item.itemPrice),
          quantity: item.cantidad
        };
      });
      
      // Preparar datos de la orden
      const orderData = {
        userEmail: userEmail,
        total: parseFloat(total),
        shippingAddress: "Dirección de envío", // Puedes agregar un campo para esto después
        items: orderItems
      };
      
      console.log('📦 Datos de la orden a enviar:', orderData);
      
      // Crear la orden en Spring Boot
      const orderResponse = await fetch('http://localhost:8080/purchase-orders/create-from-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      
      const orderResult = await orderResponse.json();
      
      if (!orderResult.success) {
        throw new Error(orderResult.message || 'Error al crear la orden');
      }
      
      console.log('✅ Orden creada:', orderResult);
      
      // Guardar el orderId en localStorage para usarlo después
      localStorage.setItem('pendingOrderId', orderResult.orderId);
      
      // PASO 2: Crear la transacción de pago con Transbank
      console.log('💳 Iniciando transacción con Transbank...');
      
      const buyOrder = orderResult.orderNumber; // Usar el número de orden generado
      
      const paymentData = {
        amount: Math.round(total),
        buyOrder: buyOrder,
        sessionId: userEmail
      };

      console.log('📦 Datos de pago:', paymentData);

      // Llamar al backend de Transbank
      const response = await fetch('http://localhost:5000/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Transacción creada:', data);
        
        // NO limpiar el carrito aquí - se limpiará después del pago exitoso
        // clearCart(); // COMENTADO - se limpia en PaymentSuccess.js
        
        // ⭐ GUARDAR los productos del carrito en localStorage antes de redirigir
        localStorage.setItem('purchasedProducts', JSON.stringify(cartItems));
        
        // Crear un formulario oculto para redirigir a Transbank
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.url;

        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = 'token_ws';
        tokenInput.value = data.token;

        form.appendChild(tokenInput);
        document.body.appendChild(form);
        
        // Redirigir a Transbank
        form.submit();
      } else {
        throw new Error(data.error || 'Error al crear la transacción de pago');
      }

    } catch (error) {
      console.error('❌ Error al procesar pago:', error);
      setToastMessage(error.message || 'Error al procesar el pago. Por favor intenta nuevamente.');
      setToastType('error');
      setShowToast(true);
      setIsProcessing(false);
    }
  };

  return (
    <div className="container my-5">
      
      {/* Toast Component */}
      <Toast 
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
      
      {/* Modal de Confirmación Animado */}
      <AnimatePresence>
        {showConfirmModal && (
          <>
            {/* Backdrop semi-transparente */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="position-fixed top-0 start-0 w-100 h-100"
              style={{ 
                zIndex: 1050,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(2px)'
              }}
              onClick={cancelClearCart}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.3, type: "spring", damping: 20 }}
              className="position-fixed top-50 start-50 translate-middle"
              style={{ zIndex: 1051, maxWidth: '400px', width: '90%' }}
            >
              <div className="card bg-dark text-white border-danger shadow-lg">
                <div className="card-header bg-danger text-white d-flex align-items-center">
                  <span className="fs-4 me-2">⚠️</span>
                  <h5 className="mb-0">Confirmar Acción</h5>
                </div>
                <div className="card-body">
                  <p className="mb-0">¿Estás seguro de que deseas limpiar el carrito?</p>
                  <p className="text-secondary small mt-2">Todos los productos serán eliminados.</p>
                </div>
                <div className="card-footer bg-dark border-secondary d-flex justify-content-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-secondary"
                    onClick={cancelClearCart}
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#dc3545' }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-danger"
                    onClick={confirmClearCart}
                  >
                    Sí, limpiar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <Breadcrumbs items={[{ label: 'Carrito', path: '/carrito' }]} />

      {/* Header animado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <h2 className="text-white d-flex align-items-center">
          <ShoppingCartIcon size={36} color="#0d6efd" />
          <span className="ms-2">Tu Carrito de Compras</span>
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
          <div className="mb-4 d-flex justify-content-center">
            <ShoppingCartIcon size={96} color="#6c757d" />
          </div>
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
                  key={item.itemTitle}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center py-3"
                >
                  {/* info producto */}
                  <div className="d-flex align-items-center">
                    <img 
                      src={item.itemImageLink} 
                      alt={item.itemTitle} 
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        objectFit: 'cover', 
                        marginRight: '20px',
                        borderRadius: '8px'
                      }} 
                    />
                    <div>
                      <h6 className="mb-1">{item.itemTitle}</h6>
                      <small className="text-secondary">${item.itemPrice?.toLocaleString('es-CL')}</small>
                      <div className="text-primary small mt-1">
                        Subtotal: ${new Intl.NumberFormat('es-CL').format(
                          (item.itemPrice || 0) * item.cantidad
                        )} CLP
                      </div>
                      {/* Indicador de stock */}
                      {(() => {
                        const stockNumber = parseInt(item.itemQuantity) || 0;
                        const isMaxStock = item.cantidad >= stockNumber;
                        return (
                          <small className={`d-block mt-1 ${isMaxStock ? 'text-warning' : 'text-secondary'}`}>
                            {isMaxStock ? '⚠️ Stock máximo alcanzado' : `Stock disponible: ${stockNumber}`}
                          </small>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Controles */}
                  <div className="d-flex align-items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updateQuantity(item.itemTitle, item.cantidad - 1)}
                    >
                      -
                    </motion.button>

                    <span className="mx-3 fw-bold">{item.cantidad}</span>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updateQuantity(item.itemTitle, item.cantidad + 1)}
                      disabled={(() => {
                        const stockNumber = parseInt(item.itemQuantity) || 0;
                        return item.cantidad >= stockNumber;
                      })()}
                      style={(() => {
                        const stockNumber = parseInt(item.itemQuantity) || 0;
                        return item.cantidad >= stockNumber ? { opacity: 0.5, cursor: 'not-allowed' } : {};
                      })()}
                    >
                      +
                    </motion.button>
                  
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: '#dc3545' }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => removeFromCart(item.itemTitle)}
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
            onClick={handleClearCartClick}
          >
            🗑️ Limpiar Carrito
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary btn-lg"
            onClick={handleProceedToPayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Procesando...
              </>
            ) : (
              '💳 Proceder al pago'
            )}
          </motion.button>
        </motion.div>
        </>
      )}

      <ScrollToTop />
    </div>
  );
}

export default Cart;