import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Importamos los componentes de Layout
import Navbar from './components/NavBar';
import Footer from './components/Footer';

// 2. Importamos las páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PasswordReset from './pages/PasswordReset'; 
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <Router>
      {/* 3. El Navbar va ANTES de las rutas */}
      <Navbar /> 
      
      {/* 4. Usamos <main> para el contenido principal */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/iniciarsesion" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar-contrasena" element={<PasswordReset />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/acerca-de" element={<AboutUs />} />
          {/* Tus otras rutas (productos, contacto) irían aquí */}
        </Routes>
      </main>

      {/* 5. El Footer va DESPUÉS de las rutas */}
      <Footer />
    </Router>
  );
}

export default App;
