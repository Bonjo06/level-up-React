import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react'; // Importa 'within'
// QUITA ESTA LÍNEA: import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

describe('Componente Home', () => {
  it('renderiza el título y la sección "Sobre nosotros"', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Verificamos elementos usando expect(...) y matchers de Jasmine
    expect(screen.getByText('Level-Up Gamer')).toBeDefined();
    expect(screen.getByText(/Level-Up Gamer es una tienda online/)).toBeDefined();
    expect(screen.getByText('Juegos de mesa:')).toBeDefined();
  });

  it('muestra el modal con información al hacer clic en una tarjeta de producto', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const cardCatan = screen.getByText(/Catán/i).closest('.producto-card');
    expect(cardCatan).toBeDefined();

    fireEvent.click(cardCatan);

    // -- CORRECCIÓN AQUÍ --
    // Primero, encuentra el modal. Usaremos el título como referencia.
    const modalTitle = screen.getByRole('heading', { name: 'Catán' });
    const modalContent = modalTitle.closest('.modal-content'); // Encuentra el contenedor del modal

    // Verifica que el modal está presente
    expect(modalTitle).toBeDefined();
    expect(modalContent).toBeDefined();

    // Ahora busca el precio DENTRO del modal usando 'within'
    // Esto asegura que no seleccionemos el precio de la tarjeta.
    expect(within(modalContent).getByText(/\$35\.990 clp/)).toBeDefined();
    expect(within(modalContent).getByText(/El clásico juego de estrategia/)).toBeDefined();
    // -- FIN CORRECCIÓN --
  });

  it('cierra el modal al hacer clic en el botón de cerrar', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const cardCatan = screen.getByText(/Catán/i).closest('.producto-card');
    fireEvent.click(cardCatan);

    const tituloModal = screen.getByRole('heading', { name: 'Catán' });
    expect(tituloModal).toBeDefined();

    const botonCerrar = screen.getByText('×');
    fireEvent.click(botonCerrar);

    // Verificamos que ya no está usando queryBy... y toBeNull()
    expect(screen.queryByRole('heading', { name: 'Catán' })).toBeNull();
  });
});