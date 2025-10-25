import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

import PasswordReset from './PasswordReset';

// Mocks (iguales que en los otros tests)
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

describe('Componente PasswordReset', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
    global.alert.mockClear();
    localStorageMock.clear();
    // Pre-registramos un usuario para las pruebas
    localStorageMock.setItem('usuario@existente.com', 'viejaPassword');
  });

  test('renderiza el formulario correctamente', () => {
    render(
      <BrowserRouter>
        <PasswordReset />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: 'Recuperar Contraseña' })).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Ingrese nueva contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText('Vuelva a ingresar la nueva contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recuperar Contraseña' })).toBeInTheDocument();
  });

  test('muestra alerta si las contraseñas no coinciden', () => {
    render(
      <BrowserRouter>
        <PasswordReset />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText('Correo electrónico');
    const newPasswordInput = screen.getByLabelText('Ingrese nueva contraseña');
    const confirmPasswordInput = screen.getByLabelText('Vuelva a ingresar la nueva contraseña');
    const submitButton = screen.getByRole('button', { name: 'Recuperar Contraseña' });

    fireEvent.change(emailInput, { target: { value: 'usuario@existente.com' } });
    fireEvent.change(newPasswordInput, { target: { value: 'nuevaPass1' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'nuevaPass2' } }); // Diferente
    fireEvent.click(submitButton);

    expect(global.alert).toHaveBeenCalledWith('Las contraseñas no son iguales.');
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  test('muestra alerta si el correo no está registrado', () => {
     render(
      <BrowserRouter>
        <PasswordReset />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText('Correo electrónico');
    const newPasswordInput = screen.getByLabelText('Ingrese nueva contraseña');
    const confirmPasswordInput = screen.getByLabelText('Vuelva a ingresar la nueva contraseña');
    const submitButton = screen.getByRole('button', { name: 'Recuperar Contraseña' });

    fireEvent.change(emailInput, { target: { value: 'noexiste@example.com' } }); // Correo no registrado
    fireEvent.change(newPasswordInput, { target: { value: 'nuevaPassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'nuevaPassword' } });
    fireEvent.click(submitButton);

    expect(global.alert).toHaveBeenCalledWith('El correo no está registrado.');
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  test('actualiza la contraseña y navega a /iniciarsesion si los datos son válidos', () => {
     render(
      <BrowserRouter>
        <PasswordReset />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText('Correo electrónico');
    const newPasswordInput = screen.getByLabelText('Ingrese nueva contraseña');
    const confirmPasswordInput = screen.getByLabelText('Vuelva a ingresar la nueva contraseña');
    const submitButton = screen.getByRole('button', { name: 'Recuperar Contraseña' });
    const userEmail = 'usuario@existente.com';
    const newPassword = 'nuevaPasswordValida';

    fireEvent.change(emailInput, { target: { value: userEmail } });
    fireEvent.change(newPasswordInput, { target: { value: newPassword } });
    fireEvent.change(confirmPasswordInput, { target: { value: newPassword } });
    fireEvent.click(submitButton);

    expect(global.alert).toHaveBeenCalledWith('Su contraseña se actualizó con éxito.');
    // Verificamos que la contraseña en localStorage se actualizó
    expect(localStorageMock.getItem(userEmail)).toBe(newPassword);
    expect(mockedNavigate).toHaveBeenCalledWith('/iniciarsesion');
  });
});