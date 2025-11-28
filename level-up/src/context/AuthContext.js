import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un admin logueado al cargar la aplicación
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    
    if (adminToken && adminData) {
      setIsAdmin(true);
      setUser(JSON.parse(adminData));
      setLoading(false);
      return; 
    }
    // Si es admin, no necesitamos verificar usuario normal

    // Verificar si hay un usuario normal logueado
    const authToken = localStorage.getItem('authToken');
    const userName = localStorage.getItem('UsuarioNombre');
    
    if (authToken && userName) {
      setIsAuthenticated(true);
      setUser({ name: userName });
    }
    
    setLoading(false);
    
  }, []); 

  const loginAsAdmin = (adminData, token) => {
    setIsAdmin(true);
    setUser(adminData);
    // Guardar el token JWT real del backend
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminData', JSON.stringify(adminData));
  };

  const logout = () => {
    setIsAdmin(false);
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    localStorage.removeItem('authToken');
    localStorage.removeItem('UsuarioLogeado');
    localStorage.removeItem('UsuarioNombre');
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        isAuthenticated,
        user,
        loading,
        loginAsAdmin,
        logout,
        setIsAuthenticated,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
