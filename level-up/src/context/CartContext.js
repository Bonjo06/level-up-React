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
  
  // Estados para notificaciones del carrito
  const [cartNotification, setCartNotification] = useState({
    show: false,
    message: '',
    type: 'info'
  });

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
  
  // Función para mostrar notificación
  const showNotification = (message, type = 'info') => {
    setCartNotification({ show: true, message, type });
    setTimeout(() => {
      setCartNotification({ show: false, message: '', type: 'info' });
    }, 5000);
  };

  // Función para añadir productos al carrito
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.itemTitle === product.itemTitle);
      
      // Obtener el stock del producto (ahora es itemQuantity)
      const stockNumber = parseInt(product.itemQuantity) || 0;
      
      if (existingItem) {
        // Validar que no supere el stock
        if (existingItem.cantidad >= stockNumber) {
          showNotification(`No hay más stock disponible. Stock máximo: ${stockNumber} unidades`, 'warning');
          return prevItems;
        }
        
        // Producto añadido exitosamente (cantidad incrementada)
        showNotification(`Producto añadido al carrito`, 'success');
        
        return prevItems.map(item =>
          item.itemTitle === product.itemTitle
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
        );
      } else {
        // Primera vez que se añade el producto
        if (stockNumber < 1) {
          showNotification('Producto sin stock disponible', 'warning');
          return prevItems;
        }
        
        // Producto añadido exitosamente (primera vez)
        showNotification(`Producto añadido al carrito`, 'success');
        
        return [...prevItems, { ...product, cantidad: 1 }];
      }
    });
  };

  //Funcion para botones de añadir y quitar productos
  const updateQuantity = (productItemTitle, newQuantity) => {
    setCartItems(prevItems => {
      if (newQuantity < 1) {
        showNotification("Producto eliminado del carrito", 'info');
        return prevItems.filter(item => item.itemTitle !== productItemTitle);
      }

      // Validar stock antes de actualizar
      const product = prevItems.find(item => item.itemTitle === productItemTitle);
      if (product) {
        const stockNumber = parseInt(product.itemQuantity) || 0;
        
        if (newQuantity > stockNumber) {
          showNotification(`No puedes añadir más de ${stockNumber} unidades. Stock máximo alcanzado.`, 'warning');
          return prevItems;
        }
      }

      return prevItems.map(item =>
        item.itemTitle === productItemTitle
        ? { ...item, cantidad: newQuantity }
        : item
      );
    });
  };

  //Funcion para vaciar el carrito
  const clearCart = () => {
    setCartItems([]);
  }

  // Función para eliminar productos
  const removeFromCart = (productItemTitle) => {
    showNotification("Producto eliminado del carrito", 'info');
    setCartItems(prevItems => {
      return prevItems.filter(item => item.itemTitle !== productItemTitle);
    });
  };

  // 4. Compartimos el estado y las funciones con todos los "children"
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartNotification
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};