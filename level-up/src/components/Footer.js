import React from "react";

function Footer() {
  return (
    <footer className="bg-black text-secondary py-5 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row">
          {/* Columna 1: Nombre */}
          <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
            <h5 className="text-primary fw-bold">🎮 Level-Up Gamer</h5>
            <p className="small">
              Tu destino gamer: consolas, periféricos y más.
            </p>
          </div>

          {/* Columna 2: Contacto */}
          <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
            <h6 className="text-white text-uppercase">Contacto</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-1">
                <p className="text-secondary text-decoration-none">
                  contacto@levelup.com
                </p>
              </li>
              <li>
                <p className="text-secondary text-decoration-none">
                  +56 9 1234 5678
                </p>
              </li>
            </ul>
          </div>

          {/* Columna 3: Horario */}
          <div className="col-lg-4 col-md-12 mb-4 mb-lg-0">
            <h6 className="text-white text-uppercase">Horario de Atención</h6>
            <p className="small mb-0">
              Lunes a Viernes: 09:00 - 18:00 hrs.
            </p>
            <p className="small mb-0">Sábado: 10:00 - 14:00 hrs.</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center border-top border-secondary pt-4 mt-4">
          <p className="mb-0 small">
             Level-Up Gamer Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;