import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
// import '@testing-library/jest-dom'; // REMOVED: Incompatible con Jasmine

describe('Componente App', () => {
  it('renderiza el enlace "learn react"', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    // Cambio: Usar toBeDefined() en lugar de toBeInTheDocument()
    expect(linkElement).toBeDefined();
  });
});