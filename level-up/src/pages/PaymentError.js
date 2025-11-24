import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ZapIcon } from '../components/FeatureIcons';

function PaymentError() {
  const navigate = useNavigate();

  return (
    <div className="container my-5">
      <motion.div
        className="row justify-content-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="col-lg-6">
          <div className="card bg-dark border-warning shadow-lg">
            <div className="card-body text-center p-5">
              {/* Ícono de advertencia */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <div className="text-warning mb-4" style={{ fontSize: '80px' }}>
                  ⚠
                </div>
              </motion.div>

              <h2 className="text-warning mb-3">Error en la Transacción</h2>
              <p className="text-white lead mb-4">
                Ocurrió un problema al procesar tu pago
              </p>

              <div className="bg-secondary bg-opacity-25 rounded p-4 mb-4">
                <p className="text-white">
                  No se pudo completar la transacción debido a un error técnico.
                </p>
                <p className="text-secondary small mb-0">
                  Si el problema persiste, por favor contacta a nuestro soporte.
                </p>
              </div>

              <div className="alert alert-warning mb-4">
                <small className="d-flex align-items-center justify-content-center">
                  <ZapIcon size={20} color="#ffc107" />
                  <span className="ms-2">No se ha realizado ningún cargo a tu tarjeta</span>
                </small>
              </div>

              {/* Botones */}
              <div className="d-grid gap-2">
                <motion.button
                  className="btn btn-primary btn-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/carrito')}
                >
                  Volver al carrito
                </motion.button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/contacto')}
                >
                  Contactar soporte
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PaymentError;
