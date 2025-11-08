import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Creamos el Contexto
const CartContext = createContext();

// 2. Creamos un "Hook" personalizado para usar el contexto fácilmente
export const useCart = () => {
  return useContext(CartContext);
};

// --- MODIFICACIÓN: Función para obtener la clave del carrito según el usuario ---
const getCartKey = () => {
  const userEmail = localStorage.getItem('UsuarioLogeado');
  return userEmail ? `carrito_${userEmail}` : 'carrito_invitado';
};

// --- MODIFICACIÓN: Función para cargar el carrito del usuario actual ---
const getInitialCart = () => {
  const cartKey = getCartKey();
  const savedCart = localStorage.getItem(cartKey);
  return savedCart ? JSON.parse(savedCart) : [];
};

// 3. Creamos el Proveedor (Provider) que manejará la lógica
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getInitialCart()); 

  // --- MODIFICACIÓN: Guardar en localStorage con clave específica del usuario ---
  useEffect(() => {
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems]);

  // --- MODIFICACIÓN: Recargar carrito cuando cambia el usuario ---
  useEffect(() => {
    const handleStorageChange = () => {
      setCartItems(getInitialCart());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // También escuchar cambios de sesión (login/logout)
    const interval = setInterval(() => {
      const currentCartKey = getCartKey();
      const expectedCart = localStorage.getItem(currentCartKey);
      const currentCart = JSON.stringify(cartItems);
      
      if (expectedCart !== currentCart) {
        setCartItems(getInitialCart());
      }
    }, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [cartItems]);

  // Función para añadir productos al carrito
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.titulo === product.titulo);
      
      // Extraer número del stock (ej: "10 unidades" -> 10)
      const stockNumber = parseInt(product.stock.match(/\d+/)?.[0] || 0);
      
      if (existingItem) {
        // Validar que no supere el stock
        if (existingItem.cantidad >= stockNumber) {
          alert(`No hay más stock disponible. Stock máximo: ${stockNumber} unidades`);
          return prevItems;
        }
        
        return prevItems.map(item =>
          item.titulo === product.titulo
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
        );
      } else {
        // Primera vez que se añade el producto
        if (stockNumber < 1) {
          alert('Producto sin stock disponible');
          return prevItems;
        }
        return [...prevItems, { ...product, cantidad: 1 }];
      }
    });
  };

  //Funcion para botones de añadir y quitar productos
  const updateQuantity = (productTitulo, newQuantity) => {
    setCartItems(prevItems => {
      if (newQuantity < 1) {
        alert("Producto eliminado del carrito");
        return prevItems.filter(item => item.titulo !== productTitulo);
      }

      // Validar stock antes de actualizar
      const product = prevItems.find(item => item.titulo === productTitulo);
      if (product) {
        const stockNumber = parseInt(product.stock.match(/\d+/)?.[0] || 0);
        
        if (newQuantity > stockNumber) {
          alert(`No puedes añadir más de ${stockNumber} unidades. Stock máximo alcanzado.`);
          return prevItems;
        }
      }

      return prevItems.map(item =>
        item.titulo === productTitulo
        ? { ...item, cantidad: newQuantity }
        : item
      );
    });
  };

  //Funcion para vaciar el carrito
  const clearCart = () => {
    if(window.confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
      setCartItems([]);
    }
  }

  // Función para eliminar productos
  const removeFromCart = (productTitulo) => {
    alert("Producto eliminado del carrito");
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