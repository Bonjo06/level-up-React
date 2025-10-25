import React from 'react';
// Importa las utilidades de RTL y jest-dom
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
// Necesitamos BrowserRouter porque Home usa <Link>
import { BrowserRouter } from 'react-router-dom';

// Importa tu componente
import Home from './Home';

// Agrupamos las pruebas para Home
describe('Componente Home', () => {
  // Prueba 1: Renderizado básico
  test('renderiza el título y la sección "Sobre nosotros"', () => {
    // Renderizamos Home dentro de un Router
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Verificamos que el título principal esté presente (como en Ejemplo 7)
    expect(screen.getByText('Level-Up Gamer')).toBeInTheDocument();
    // Verificamos un texto de la sección "Sobre nosotros"
    expect(screen.getByText(/Level-Up Gamer es una tienda online/)).toBeInTheDocument();
    // Verificamos que se renderiza al menos una categoría de producto
    expect(screen.getByText('Juegos de mesa:')).toBeInTheDocument();
  });

  // Prueba 2: Funcionalidad del modal al hacer clic
  test('muestra el modal con información al hacer clic en una tarjeta de producto', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Buscamos la tarjeta del primer producto (Catán) por su título o texto
    // Usamos 'getByText' con una expresión regular para ser flexibles
    const cardCatan = screen.getByText(/Catán/i).closest('.producto-card'); // Encuentra el ancestro con la clase

    // Verificamos que la tarjeta existe antes de hacer clic
    expect(cardCatan).toBeInTheDocument();

    // Simulamos el clic en la tarjeta (como en Ejemplo 10)
    fireEvent.click(cardCatan);

    // Verificamos que el modal ahora es visible y muestra datos de Catán (como en Ejemplo 9)
    // Buscamos el modal por un elemento que DEBERÍA estar visible ahora
    expect(screen.getByRole('heading', { name: 'Catán' })).toBeInTheDocument(); // Busca un H2 con el texto 'Catán'
    expect(screen.getByText(/\$35\.990 clp/)).toBeInTheDocument(); // Busca el precio
    expect(screen.getByText(/El clásico juego de estrategia/)).toBeInTheDocument(); // Busca parte de la descripción larga
  });

  // Prueba 3: Cerrar el modal
  test('cierra el modal al hacer clic en el botón de cerrar', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    // Abrimos el modal primero
    const cardCatan = screen.getByText(/Catán/i).closest('.producto-card');
    fireEvent.click(cardCatan);

    // Verificamos que el modal está abierto
    const tituloModal = screen.getByRole('heading', { name: 'Catán' });
    expect(tituloModal).toBeInTheDocument();

    // Buscamos y hacemos clic en el botón de cerrar (el span con la '×')
    const botonCerrar = screen.getByText('×'); // El texto literal del botón de cerrar
    fireEvent.click(botonCerrar);

    // Verificamos que el título del modal (y por ende el modal) ya no está en el DOM
    // Usamos queryByRole porque esperamos que NO exista
    expect(screen.queryByRole('heading', { name: 'Catán' })).not.toBeInTheDocument();
  });
});