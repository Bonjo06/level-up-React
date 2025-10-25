import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

import Register from './Register';

// Mocks (iguales que en Login.test.js)
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));
global.alert = jest.fn();
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Componente Register', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
    global.alert.mockClear();
    localStorageMock.clear();
  });

  test('renderiza el formulario de registro correctamente', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: 'Registrarse' })).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrarse' })).toBeInTheDocument();
  });

   test('muestra alerta si la contraseña no cumple la longitud requerida', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: 'Registrarse' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } }); // Contraseña corta
    fireEvent.click(submitButton);

    expect(global.alert).toHaveBeenCalledWith('La contraseña debe tener entre 4 y 12 caracteres.');
    expect(mockedNavigate).not.toHaveBeenCalled();

    fireEvent.change(passwordInput, { target: { value: '1234567890123' } }); // Contraseña larga
    fireEvent.click(submitButton);

    expect(global.alert).toHaveBeenCalledWith('La contraseña debe tener entre 4 y 12 caracteres.');
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

   test('muestra alerta si el correo ya está registrado', () => {
    localStorageMock.setItem('existente@example.com', 'password123'); // Pre-registramos un usuario
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: 'Registrarse' });

    fireEvent.change(emailInput, { target: { value: 'existente@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'passwordValida' } });
    fireEvent.click(submitButton);

    expect(global.alert).toHaveBeenCalledWith('Este correo ya se encuentra registrado.');
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  test('registra al usuario y navega a /iniciarsesion si los datos son válidos', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: 'Registrarse' });
    const newUserEmail = 'nuevo@example.com';
    const newUserPassword = 'passwordValida';

    fireEvent.change(emailInput, { target: { value: newUserEmail } });
    fireEvent.change(passwordInput, { target: { value: newUserPassword } });
    fireEvent.click(submitButton);

    // Verificamos que se mostró el mensaje de éxito
    expect(global.alert).toHaveBeenCalledWith('Su cuenta se ha registrado exitosamente.');
    // Verificamos que el usuario se guardó en localStorage
    expect(localStorageMock.getItem(newUserEmail)).toBe(newUserPassword);
    // Verificamos que navegó a la página de login
    expect(mockedNavigate).toHaveBeenCalledWith('/iniciarsesion');
  });
});