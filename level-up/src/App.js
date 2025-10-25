// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa tus componentes de página
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PasswordReset from './pages/PasswordReset'; // Aún no lo hemos creado, pero lo importamos

function App() {
  return (
    <Router>
      {/* El header podría ir aquí si quieres que se muestre en todas las páginas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/iniciarsesion" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/recuperar-contrasena" element={<PasswordReset />} />
      </Routes>
      {/* El footer podría ir aquí */}
    </Router>
  );
}

export default App;
