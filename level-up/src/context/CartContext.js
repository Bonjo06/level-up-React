import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Creamos el Contexto
const CartContext = createContext();

// 2. Creamos un "Hook" personalizado para usar el contexto fácilmente
export const useCart = () => {
  return useContext(CartContext);
};

// --- MODIFICACIÓN 1: Función para cargar el estado inicial ---
// Lee el carrito guardado en localStorage al iniciar
const getInitialCart = () => {
  const savedCart = localStorage.getItem('cartItems');
  return savedCart ? JSON.parse(savedCart) : [];
};

// 3. Creamos el Proveedor (Provider) que manejará la lógica
export const CartProvider = ({ children }) => {
  // --- MODIFICACIÓN 2: Usa la función de estado inicial ---
  const [cartItems, setCartItems] = useState(getInitialCart()); 

  // --- MODIFICACIÓN 3: Guardar en localStorage ---
  // Este efecto se ejecuta cada vez que 'cartItems' cambia
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

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