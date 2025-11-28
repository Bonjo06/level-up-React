import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import axiosInstance from '../config/axiosConfig';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = React.useState(null); 

  const buyOrder = searchParams.get('buyOrder');
  const amount = searchParams.get('amount');
  const authCode = searchParams.get('authCode');

  useEffect(() => {
    // Limpiar el carrito después de un pago exitoso y actualizar estado de orden
    if (buyOrder && amount) {
      // Obtener el orderId desde localStorage
      const pendingOrderId = localStorage.getItem('pendingOrderId');
      const purchasedProducts = JSON.parse(localStorage.getItem('purchasedProducts') || '[]');
      
      if (pendingOrderId) {
        // Actualizar el estado de la orden a PAID
        axiosInstance.patch(`/purchase-orders/${pendingOrderId}/status?status=PAID`)
        .then(response => {
          localStorage.removeItem('pendingOrderId');
          localStorage.removeItem('purchasedProducts');
          
          // limpiar el carrito
          clearCart();
        })
        .catch(error => {
          console.error('❌ Error al procesar orden:', error);
        });
      }
      
      // Mostrar los productos que fueron comprados 
      if (purchasedProducts.length > 0) {
        setOrderDetails({
          items: purchasedProducts.map(item => ({
            productTitle: item.itemTitle,
            quantity: item.cantidad,
            unitPrice: item.itemPrice
          }))
        });
      }
    }
  }, [buyOrder, amount, authCode]);

  return (
    <div className="container my-5">
      <motion.div
        className="row justify-content-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="col-lg-6">
          <div className="card bg-dark border-success shadow-lg">
            <div className="card-body text-center p-5">
              {/* Ícono de éxito */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <div className="text-success mb-4" style={{ fontSize: '80px' }}>
                  ✓
                </div>
              </motion.div>

              <h2 className="text-success mb-3">¡Pago Exitoso!</h2>
              <p className="text-white lead mb-4">
                Tu compra ha sido procesada correctamente
              </p>

              {/* Detalles de la transacción */}
              <div className="bg-secondary bg-opacity-25 rounded p-4 mb-4">
                <div className="row text-start">
                  <div className="col-12 mb-3">
                    <small className="text-secondary">Orden de compra</small>
                    <p className="text-white mb-0 fw-bold">{buyOrder}</p>
                  </div>
                  <div className="col-12 mb-3">
                    <small className="text-secondary">Productos Comprados</small>
                    <div className="text-white mb-0 fw-bold">
                      {orderDetails && orderDetails.items && orderDetails.items.length > 0 ? (
                        <ul className="list-unstyled mb-0">
                          {orderDetails.items.map((item, i) => (
                            <li key={i}>
                              {item.productTitle} x{item.quantity} - ${item.unitPrice.toLocaleString('es-CL')} CLP
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-secondary">Cargando productos...</span>
                      )}
                    </div>
                  </div>
                  <div className="col-12 mb-3">
                    <small className="text-secondary">Monto pagado</small>
                    <p className="text-white mb-0 fw-bold">
                      ${parseInt(amount || 0).toLocaleString('es-CL')} CLP
                    </p>
                  </div>
                  {authCode && (
                    <div className="col-12">
                      <small className="text-secondary">Código de autorización</small>
                      <p className="text-white mb-0 fw-bold">{authCode}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4 text-white">
                <small>
                  Muchas gracias por tu compra. Recibirás un correo con los detalles de la compra.
                </small>
              </div>

              {/* Botones */}
              <div className="d-grid gap-2">
                <motion.button
                  className="btn btn-success btn-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/')}
                >
                  Volver al inicio
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PaymentSuccess;
