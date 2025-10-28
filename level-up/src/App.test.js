import React from 'react';
import { render } from '@testing-library/react'; 
import App from './App';

describe('Componente App', () => {
  it('renderiza el componente principal sin errores', () => {
    expect(() => render(<App />)).not.toThrow();
  });
});