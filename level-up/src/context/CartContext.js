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
       return prevItems.map(item =>
          item.titulo === product.titulo
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
       );
      } else {
        return [...prevItems, { ...product, cantidad: 1 }];
      }
    });
  };

  //Funcion para botones de añadir y quitar productos
  const updateQuantity = (productTitulo, newQuanteity) => {
    setCartItemns(prevItems => {
      if (newQuantity < 1) {
        return prevItems.filter(item => item.titulo !== productTitulo);
      }

      return prevItems.map(item =>
        item.titulo === productTitulo
        ? { ...item, cantidad: newQuantity }
        : item
      )
    })
  }

  //Funcion ppara vaciar el carrito
  const clearCart = () => {
    if(window.confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
      setCartItems([]);
    }
  }

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
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};