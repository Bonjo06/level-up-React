import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Navbar from './components/NavBar';
import Footer from './components/Footer';


import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PasswordReset from './pages/PasswordReset'; 
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import PaymentError from './pages/PaymentError';
import Administration from './pages/Administration';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { initializeAdmin } from './utils/initializeAdmin';

function AppContent() {
  return (
    <>
      {<Navbar />}
      
      {/* Rutas de la aplicación */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/iniciarsesion" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar-contrasena" element={<PasswordReset />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/acerca-de" element={<AboutUs />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />
          <Route path="/payment/error" element={<PaymentError />} />
          <Route 
            path="/administracion" 
            element={
              <ProtectedRoute>
                <Administration />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      
      {<Footer />}
    </>
  );
}

function App() {
  useEffect(() => {
    // Inicializar usuario administrador al cargar la aplicación
    const setupAdmin = async () => {
      try {
        await initializeAdmin();
      } catch (error) {
        console.error('Error al inicializar administrador:', error);
      }
    };
    
    setupAdmin();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
