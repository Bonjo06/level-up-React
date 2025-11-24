import React from 'react';
import { motion } from 'framer-motion';
import LeafletMap from '../components/LeafletMap';
import Breadcrumbs from '../components/Breadcrumbs';
import ScrollToTop from '../components/ScrollToTop';
import { GamepadIcon, LightbulbIcon, HandshakeIcon, MapPinIcon } from '../components/FeatureIcons';

function Feature({ icon, title, children, delay = 0 }) {
  return (
    <motion.div 
      className="col-md-4 mb-3"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="card h-100 bg-dark border-secondary text-white p-3">
        <div className="d-flex align-items-start">
          <div style={{ marginRight: '12px', marginTop: '4px' }}>{icon}</div>
          <div>
            <h5 className="mb-1">{title}</h5>
            <p className="text-secondary mb-0">{children}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AboutUs() {
  return (
    <div className="container my-5">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Sobre nosotros', path: '/acerca-de' }]} />

      {/* Hero - Centrado y con mejor espaciado */}
      <motion.div 
        className="row mb-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="col-lg-10 offset-lg-1">
          <div className="p-4 p-md-5 rounded bg-dark border-secondary text-center">
            <h1 className="display-5 text-white mb-3">Level-up Gamer</h1>
            <p className="lead text-secondary mb-0 mx-auto" style={{ maxWidth: '600px' }}>
              Mejoramos tu experiencia de juego con productos seleccionados, contenido útil y atención dedicada.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Features - Mejor espaciado */}
      <div className="row mb-5 g-3">
        <div className="col-lg-10 offset-lg-1">
          <div className="row g-3">
            <Feature icon={<GamepadIcon />} title="Productos de calidad" delay={0.1}>
              Hardware y accesorios probados y seleccionados para rendir al máximo.
            </Feature>
            <Feature icon={<LightbulbIcon />} title="Asesoría experta" delay={0.2}>
              Te ayudamos a encontrar el equipo perfecto según tu presupuesto y necesidades de juego.
            </Feature>
            <Feature icon={<HandshakeIcon />} title="Soporte amigable" delay={0.3}>
              Atención rápida y cercana cuando la necesitas.
            </Feature>
          </div>
        </div>
      </div>

      {/* Team - Centrado */}
      <motion.div 
        className="row mb-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="col-lg-8 offset-lg-2">
          <div className="text-center mb-4">
            <h3 className="text-white">Nuestro equipo</h3>
            <p className="text-secondary">
              Un grupo pequeño y apasionado que trabaja para ofrecer la mejor experiencia gamer.
            </p>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card bg-dark border-secondary text-white p-3">
                <div className="d-flex align-items-center">
                  <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: '#0d6efd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '1.2rem',
                    marginRight: 12,
                  }}>BM</div>
                  <div>
                    <h6 className="mb-0">Benjamín Mella</h6>
                    <small className="text-secondary">Fundador</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Location Map - Centrado con título */}
      <motion.div 
        className="row"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="col-lg-10 offset-lg-1">
          <div className="text-center mb-4">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <MapPinIcon size={48} color="#dc3545" />
              <h3 className="text-white mb-0 ms-2">Encuéntranos</h3>
            </div>
            <p className="text-secondary mb-4">
              Visítanos en Grajales 2171 Santiago, Chile. Estamos aquí para ayudarte con tus necesidades gamer.
            </p>
          </div>
          <LeafletMap 
            lat={-33.451765}
            lng={-70.665924}
            zoom={13}
            height={450}
            markerText="Level-up Gamer - Santiago"
          />
        </div>
      </motion.div>

      {/* Botón Scroll to Top */}
      <ScrollToTop />
    </div>
  );
}