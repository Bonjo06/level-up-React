import React, { createContext, useState, useContext } from 'react';

// 1. Creamos el Contexto
const CartContext = createContext();

// 2. Creamos un "Hook" personalizado para usar el contexto fácilmente
export const useCart = () => {
  return useContext(CartContext);
};

// 3. Creamos el Proveedor (Provider) que manejará la lógica
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // Estado que guarda los productos

  // Función para añadir productos al carrito
  const addToCart = (product) => {
    // Revisa si el producto ya existe
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.titulo === product.titulo);
      
      if (existingItem) {
        // Si existe, actualiza la cantidad (opcional, por ahora solo lo añadimos)
        // O podrías simplemente no hacer nada o mostrar un alert
        alert("¡Este producto ya está en tu carrito!");
        return prevItems;
      } else {
        // Si no existe, lo añade al array (con cantidad 1)
        alert("Producto añadido al carrito");
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Función para eliminar productos (la necesitarás en Cart.js)
  const removeFromCart = (productTitulo) => {
    setCartItems(prevItems => {
      return prevItems.filter(item => item.titulo !== productTitulo);
    });
  };

  // 4. Compartimos el estado y las funciones con todos los "children"
  const value = {
    cartItems,
    addToCart,
    removeFromCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};