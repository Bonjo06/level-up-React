import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axiosInstance from '../config/axiosConfig';

// Contexto
const CartContext = createContext();

// "Hook" personalizado para usar el contexto fácilmente
export const useCart = () => {
  return useContext(CartContext);
};

// Base URL del backend
const API_BASE_URL = '/api/cart';

// Proveedor que manejará la lógica
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  // Estados para notificaciones del carrito
  const [cartNotification, setCartNotification] = useState({
    show: false,
    message: '',
    type: 'info'
  });

  // Función para obtener el email del usuario logueado
  const getUserEmail = () => {
    return localStorage.getItem('UsuarioLogeado');
  };

  // Función para cargar el carrito desde el backend
  const loadCart = useCallback(async () => {
    const userEmail = getUserEmail();
    if (!userEmail) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(API_BASE_URL);
      

      
      // El backend devuelve un objeto Cart con items dentro
      let items = [];
      
      // Intentar diferentes estructuras posibles
      if (Array.isArray(response.data)) {
        // Si la respuesta es un array, tomar el primer elemento
        items = response.data[0]?.items || [];
      } else if (response.data.items) {
        // Si items está directamente en el objeto
        items = response.data.items;
      } else if (response.data._embedded?.items) {
        items = response.data._embedded.items;
      }
      

      
      if (!Array.isArray(items)) {
        console.error('⚠️ Items no es un array:', items);
        items = [];
      }
      
      const transformedItems = items.map(item => {
        return {
          itemId: item.product?.id || item.product?.itemId,
          itemTitle: item.productTitle,
          itemPrice: item.unitPrice,
          itemQuantity: item.product?.itemQuantity || 999,
          itemImageLink: item.product?.itemImageLink || item.product?.itemImage, 
          cantidad: item.quantity
        };
      });
      
      setCartItems(transformedItems);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      // Si el usuario no tiene carrito aún, inicializar vacío
      if (error.response?.status === 404 || error.response?.status === 400) {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar carrito al montar y cuando cambia el usuario
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Detectar cambios en el usuario logueado (login/logout)
  useEffect(() => {
    let previousEmail = getUserEmail();

    const checkUserChange = setInterval(() => {
      const currentEmail = getUserEmail();
      
      // Si el email cambió (login, logout o cambio de cuenta)
      if (currentEmail !== previousEmail) {
        previousEmail = currentEmail;
        loadCart(); // Recargar carrito del nuevo usuario
      }
    }, 500); 
    
    return () => clearInterval(checkUserChange);
  }, [loadCart]);
  
  // Función para mostrar notificación
  const showNotification = (message, type = 'info') => {
    setCartNotification({ show: true, message, type });
    setTimeout(() => {
      setCartNotification({ show: false, message: '', type: 'info' });
    }, 5000);
  };

  // Función para añadir productos al carrito
  const addToCart = async (product) => {
    const userEmail = getUserEmail();
    if (!userEmail) {
      showNotification('Debes iniciar sesión para añadir productos al carrito', 'warning');
      return;
    }

    try {
      setLoading(true);
      
      // Obtener el ID del producto 
      const productId = product.id || product.itemId;
      
      if (!productId) {
        console.error('Producto sin ID:', product);
        showNotification('Error: El producto no tiene ID válido', 'error');
        setLoading(false);
        return;
      }
      
      const stockNumber = parseInt(product.itemQuantity) || 0;
      const existingItem = cartItems.find(item => item.itemTitle === product.itemTitle);
      
      if (existingItem && existingItem.cantidad >= stockNumber) {
        showNotification(`No hay más stock disponible. Stock máximo: ${stockNumber} unidades`, 'warning');
        setLoading(false);
        return;
      }

      if (!existingItem && stockNumber < 1) {
        showNotification('Producto sin stock disponible', 'warning');
        setLoading(false);
        return;
      }


      // Llamar al backend para añadir el producto
      await axiosInstance.post(`${API_BASE_URL}/add`, {
        productId: productId,
        quantity: 1
      });

      showNotification('Producto añadido al carrito', 'success');
      
      // Recargar el carrito desde el backend
      await loadCart();
    } catch (error) {
      console.error('Error al añadir producto:', error);
      showNotification('Error al añadir el producto al carrito', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Función para botones de añadir y quitar productos
  const updateQuantity = async (productItemTitle, newQuantity) => {
    const userEmail = getUserEmail();
    if (!userEmail) {
      showNotification('Debes iniciar sesión', 'warning');
      return;
    }

    try {
      setLoading(true);

      // Encontrar el producto en el carrito
      const product = cartItems.find(item => item.itemTitle === productItemTitle);
      if (!product) {
        setLoading(false);
        return;
      }

      if (newQuantity < 1) {
        // Eliminar el producto
        await axiosInstance.delete(
          `${API_BASE_URL}/remove?productId=${product.itemId}`
        );
        showNotification('Producto eliminado del carrito', 'info');
      } else {
        // Validar stock
        const stockNumber = parseInt(product.itemQuantity) || 0;
        
        if (newQuantity > stockNumber) {
          showNotification(`No puedes añadir más de ${stockNumber} unidades. Stock máximo alcanzado.`, 'warning');
          setLoading(false);
          return;
        }

        // Actualizar cantidad
        await axiosInstance.patch(
          `${API_BASE_URL}/update?productId=${product.itemId}&quantity=${newQuantity}`
        );
      }

      // Recargar el carrito desde el backend
      await loadCart();
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      showNotification('Error al actualizar el carrito', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Función para vaciar el carrito
  const clearCart = async () => {
    const userEmail = getUserEmail();
    if (!userEmail) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.delete(`${API_BASE_URL}/clear`);
      setCartItems([]);
      showNotification('Carrito vaciado', 'info');
    } catch (error) {
      console.error('Error al vaciar carrito:', error);
      showNotification('Error al vaciar el carrito', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar productos
  const removeFromCart = async (productItemTitle) => {
    const userEmail = getUserEmail();
    if (!userEmail) {
      showNotification('Debes iniciar sesión', 'warning');
      return;
    }

    try {
      setLoading(true);

      // Encontrar el producto en el carrito
      const product = cartItems.find(item => item.itemTitle === productItemTitle);
      if (!product) {
        setLoading(false);
        return;
      }

      await axiosInstance.delete(
        `${API_BASE_URL}/remove?productId=${product.itemId}`
      );
      
      showNotification('Producto eliminado del carrito', 'info');
      
      // Recargar el carrito desde el backend
      await loadCart();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      showNotification('Error al eliminar el producto', 'error');
    } finally {
      setLoading(false);
    }
  };

  // estado y funciones con todos los "children"
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartNotification,
    loading,
    loadCart 
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};