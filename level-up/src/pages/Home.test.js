import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
// Se eliminó import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

describe('Componente Home', () => {
  it('renderiza el título y la sección "Sobre nosotros"', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText('Level-Up Gamer')).toBeDefined();
    expect(screen.getByText(/Level-Up Gamer es una tienda online/)).toBeDefined();
    expect(screen.getByText('Juegos de mesa:')).toBeDefined();
  });

  it('muestra el modal con información al hacer clic en una tarjeta de producto', async () => { // Añadido async
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const cardCatan = screen.getByText(/Catán/i).closest('.producto-card');
    expect(cardCatan).toBeDefined();

    await fireEvent.click(cardCatan); // Añadido await

    // Busca el modal por su contenido una vez que aparece
    const modalTitle = await screen.findByRole('heading', { name: 'Catán' }); // Usar findByRole para esperar
    const modalContent = modalTitle.closest('.modal-content');

    expect(modalTitle).toBeDefined();
    expect(modalContent).toBeDefined();

    // Busca dentro del modal
    expect(within(modalContent).getByText(/\$35\.990 clp/)).toBeDefined();
    expect(within(modalContent).getByText(/El clásico juego de estrategia/)).toBeDefined();
  });

  it('cierra el modal al hacer clic en el botón de cerrar', async () => { // Añadido async
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const cardCatan = screen.getByText(/Catán/i).closest('.producto-card');
    await fireEvent.click(cardCatan); // Abrir modal

    const tituloModal = await screen.findByRole('heading', { name: 'Catán' }); // Esperar a que aparezca
    expect(tituloModal).toBeDefined();

    // Encontrar el botón de cerrar DENTRO del modal para ser más específicos
    const modalContent = tituloModal.closest('.modal-content');
    const botonCerrar = within(modalContent).getByText('×');
    await fireEvent.click(botonCerrar); // Cerrar modal

    // queryBy... no necesita await, verifica que ya no está
    expect(screen.queryByRole('heading', { name: 'Catán' })).toBeNull();
  });
});