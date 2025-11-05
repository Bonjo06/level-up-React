import React from 'react';
import { useCart } from '../context/CartContext'; // 1. Importa el hook

function Cart() {
  // 2. Obtén los items y la función de eliminar desde el contexto
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  // Calcula el total (asumiendo que el precio es un string "$XX.XXX clp")
  const total = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.precio.replace(/[^0-9,-]+/g, "").replace(",", "."));
    return acc + (price * item.cantidad);
  }, 0);

  return (
    <div className="container my-5">
      <h2 className="text-white mb-4">Tu Carrito de Compras</h2>

      {cartItems.length === 0 ? (
        <p className="text-secondary">Tu carrito está vacío.</p>
      ) : (
        <>
        <div className="card bg-dark text-white border-secondary">
          <ul className="list-group list-group-flush">
            {cartItems.map(item => (
              <li key={item.titulo} className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">
                {/* info producto */}
                <div className="d-flex align-items-center">
                  <img src={item.imagen} alt={item.titulo} style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }} />
                  <div>
                    <h6 className="mb-0">{item.titulo}</h6>
                    <small className="text-secondary">{item.precio}</small>
                  </div>
                </div>

                {/* Boton eliminar producto (de uno en uno) */}
                <div className ="d-flex align-items-center" style={{ marginBottom: '10px' }}>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQuantity(item.titulo, item.cantidad - 1)}
                  >
                    -
                  </button>

                {/* cantidad producto */}
                  <span className="mx-3">{item.cantidad}</span>

                {/* Boton sumar producto (de uno en uno) */}
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQuantity(item.titulo, item.cantidad + 1)}
                  >
                    +
                  </button>
                
                {/* Boton eliminar producto */}
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeFromCart(item.titulo)}
                  >
                    Eliminar
                  </button>
                </div>

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

        {/* Boton limpiar carrito */}
        <div className="d-flex justify-content-end">
          <button 
            className="btn btn-outline-danger" 
            onClick={clearCart}>
            Limpiar Carrito
          </button>
        </div>
        </>
      )}
    </div>
  );
}

export default Cart;