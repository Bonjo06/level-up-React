import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Breadcrumbs - Navegación de ruta
 * @param {Array} items - Array de objetos {label: string, path: string}
 */
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="breadcrumb mb-0">
        <li className="breadcrumb-item">
          <Link to="/" className="text-decoration-none text-primary">
            Inicio
          </Link>
        </li>
        {items.map((item, index) => (
          <li 
            key={index} 
            className={`breadcrumb-item ${index === items.length - 1 ? 'active text-secondary' : ''}`}
            aria-current={index === items.length - 1 ? 'page' : undefined}
          >
            {index === items.length - 1 ? (
              item.label
            ) : (
              <Link to={item.path} className="text-decoration-none text-primary">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
