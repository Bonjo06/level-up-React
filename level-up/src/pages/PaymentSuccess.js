import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const buyOrder = searchParams.get('buyOrder');
  const amount = searchParams.get('amount');
  const authCode = searchParams.get('authCode');

  useEffect(() => {
    // Limpiar el carrito después de un pago exitoso
    if (buyOrder && amount) {
      // Guardamos el pedido en localStorage para historial
      const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
      pedidos.push({
        ordenCompra: buyOrder,
        monto: amount,
        codigoAutorizacion: authCode,
        fecha: new Date().toLocaleString('es-CL'),
        estado: 'Aprobado'
      });
      localStorage.setItem('pedidos', JSON.stringify(pedidos));
      
      // Limpiar el carrito sin confirmación
      localStorage.setItem(
        localStorage.getItem('UsuarioLogeado') 
          ? `carrito_${localStorage.getItem('UsuarioLogeado')}` 
          : 'carrito_invitado',
        '[]'
      );
    }
  }, [buyOrder, amount, authCode, clearCart]);

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

                {/* boton para cuando tenga historial de pedidos si es q lo hago */}
                {/* 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/mis-pedidos')}
                >
                  Ver mi historial de pedidos
                </button>*/}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PaymentSuccess;
