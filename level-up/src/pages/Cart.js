import React from 'react';
import { useCart } from '../context/CartContext'; // 1. Importa el hook

function Cart() {
  // 2. Obtén los items y la función de eliminar desde el contexto
  const { cartItems, removeFromCart } = useCart();

  // Calcula el total (asumiendo que el precio es un string "$XX.XXX clp")
  const total = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.precio.replace(/[^0-9,-]+/g, "").replace(",", "."));
    return acc + price * item.quantity;
  }, 0);

  return (
    <div className="container my-5">
      <h2 className="text-white mb-4">Tu Carrito de Compras</h2>

      {cartItems.length === 0 ? (
        <p className="text-secondary">Tu carrito está vacío.</p>
      ) : (
        <div className="card bg-dark text-white border-secondary">
          <ul className="list-group list-group-flush">
            {cartItems.map(item => (
              <li key={item.titulo} className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <img src={item.imagen} alt={item.titulo} style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }} />
                  <div>
                    <h6 className="mb-0">{item.titulo}</h6>
                    <small className="text-secondary">{item.precio}</small>
                  </div>
                </div>
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeFromCart(item.titulo)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <div className="card-footer border-secondary d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Total:</h5>
            <h5 className="mb-0 text-primary fw-bold">
              ${new Intl.NumberFormat('es-CL').format(total)} clp
            </h5>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;