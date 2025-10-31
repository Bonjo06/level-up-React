import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
  return (
    <motion.nav
      className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          🎮 Level-Up Gamer
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/productos">Productos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>
            <li className="nav-item">
              <Link className="btn btn-primary ms-lg-3" to="/iniciarsesion">Iniciar sesión</Link>
            </li>
          </ul>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;

