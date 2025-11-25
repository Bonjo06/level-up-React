import React from 'react';
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

function App() {
  return (
    <Router>
      {/*Navbar*/}
      <Navbar /> 
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
        </Routes>
      </main>
      {/* Footer */}
      <Footer />
    </Router>
  );
}

export default App;
