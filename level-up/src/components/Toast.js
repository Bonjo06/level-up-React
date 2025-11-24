import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Toast({ show, message, type, onClose, duration = 5000 }) {
  
  // Auto-ocultar después del tiempo especificado
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      // Limpiar el timer si el componente se desmonta o show cambia
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);
  
  return (
    <div 
      className="position-fixed top-0 end-0 p-3" 
      style={{ zIndex: 9999 }}
    >
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="toast show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className={`toast-header ${type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-warning'} text-white`}>
              <strong className="me-auto">
                {type === 'success' && 'Éxito'}
                {type === 'error' && 'Error'}
                {type === 'info' && 'Información'}
                {type === 'warning' && 'Advertencia'}
              </strong>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body bg-dark text-white border-secondary">
              {message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    
  );
}

export default Toast;
