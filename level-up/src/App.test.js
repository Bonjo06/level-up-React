import React from 'react';
import { render } from '@testing-library/react'; // No necesitas screen si no buscas texto
import App from './App';

describe('Componente App', () => {
  // Cambiado el nombre de la prueba para ser más preciso
  it('renderiza el componente principal sin errores', () => {
    // Verificamos que la función render no lance ninguna excepción
    expect(() => render(<App />)).not.toThrow();
  });
});