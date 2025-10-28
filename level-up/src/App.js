import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PasswordReset from './pages/PasswordReset'; 

function App() {
  return (
    <Router>
      {}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/iniciarsesion" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/recuperar-contrasena" element={<PasswordReset />} />
      </Routes>
      {}
    </Router>
  );
}

export default App;
