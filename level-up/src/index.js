import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './index.css';
import App from './App';

// 1. Importa el Proveedor
import { CartProvider } from './context/CartContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. Envuelve <App /> con <CartProvider /> */}
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);