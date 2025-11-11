import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircleIcon } from '../components/FeatureIcons';

function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reason = searchParams.get('reason');

  const getErrorMessage = (code) => {
    const messages = {
      '-1': 'Rechazo de transacción',
      '-2': 'Transacción debe reintentarse',
      '-3': 'Error en transacción',
      '-4': 'Rechazo de transacción',
      '-5': 'Rechazo por error de tasa',
      '-6': 'Excede cupo máximo mensual',
      '-7': 'Excede límite diario por transacción',
      '-8': 'Rubro no autorizado'
    };
    return messages[code] || 'Error desconocido';
  };

  return (
    <div className="container my-5">
      <motion.div
        className="row justify-content-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="col-lg-6">
          <div className="card bg-dark border-danger shadow-lg">
            <div className="card-body text-center p-5">
              {/* Ícono de error */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <div className="text-danger mb-4" style={{ fontSize: '80px' }}>
                  ✕
                </div>
              </motion.div>

              <h2 className="text-danger mb-3">Pago Rechazado</h2>
              <p className="text-white lead mb-4">
                Lo sentimos, tu pago no pudo ser procesado
              </p>

              {/* Detalle del error */}
              {reason && (
                <div className="alert alert-danger mb-4">
                  <strong>Motivo:</strong> {getErrorMessage(reason)}
                  <br />
                  <small>Código: {reason}</small>
                </div>
              )}

              <div className="bg-secondary bg-opacity-25 rounded p-4 mb-4">
                <p className="text-white mb-0">
                  <strong>Posibles razones:</strong>
                </p>
                <ul className="text-start text-secondary small mt-3">
                  <li>Fondos insuficientes</li>
                  <li>Datos de tarjeta incorrectos</li>
                  <li>Límite de compra excedido</li>
                  <li>Transacción rechazada por el banco</li>
                </ul>
              </div>

              <div className="alert alert-info mb-4">
                <small className="d-flex align-items-center justify-content-center">
                  <AlertCircleIcon size={20} color="#0dcaf0" />
                  <span className="ms-2">Puedes intentar con otra tarjeta o método de pago</span>
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
                  Volver al carrito e intentar nuevamente
                </motion.button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/')}
                >
                  Volver al inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PaymentFailed;
