import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

// Importamos el componente
import Login from './Login';

// Mock (simulación) del hook useNavigate de react-router-dom
const mockedNavigate = jest.fn(); // Creamos una función espía
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Mantenemos las otras exportaciones reales
  useNavigate: () => mockedNavigate, // Sobrescribimos useNavigate para usar nuestro espía
}));

// Mock de window.alert para poder espiarlo
global.alert = jest.fn();

// Mock de localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key) => {
      delete store[key];
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });


describe('Componente Login', () => {
  // Limpiamos los mocks antes de cada prueba
  beforeEach(() => {
    mockedNavigate.mockClear();
    global.alert.mockClear();
    localStorageMock.clear();
  });

  test('renderiza el formulario de inicio de sesión correctamente', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument();
  });

  test('permite al usuario escribir en los campos', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('muestra alerta si se envía el formulario con campos vacíos', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const submitButton = screen.getByRole('button', { name: 'Ingresar' });
    fireEvent.click(submitButton);

    expect(global.alert).toHaveBeenCalledWith('Por favor completa el/los campos vacíos.');
    expect(mockedNavigate).not.toHaveBeenCalled(); // No debe navegar
  });

  test('muestra alerta si el correo o contraseña son inválidos', () => {
     // Guardamos un usuario válido para asegurarnos de que no coincida
    localStorageMock.setItem('usuario@correcto.com', 'passCorrecta');

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: 'Ingresar' });

    fireEvent.change(emailInput, { target: { value: 'test@incorrecto.com' } }); // Correo no registrado
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(global.alert).toHaveBeenCalledWith('Correo o clave inválidos.');
    expect(mockedNavigate).not.toHaveBeenCalled();

    // Ahora probamos con correo correcto pero contraseña incorrecta
    fireEvent.change(emailInput, { target: { value: 'usuario@correcto.com' } });
    fireEvent.change(passwordInput, { target: { value: 'passIncorrecta' } });
    fireEvent.click(submitButton);

    expect(global.alert).toHaveBeenCalledWith('Correo o clave inválidos.');
    expect(mockedNavigate).not.toHaveBeenCalled();
  });


  test('inicia sesión y navega a "/" si las credenciales son correctas', () => {
    // Configuramos localStorage con un usuario válido
    const userEmail = 'usuario@registrado.com';
    const userPassword = 'passwordCorrecta';
    localStorageMock.setItem(userEmail, userPassword);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: 'Ingresar' });

    // Ingresamos las credenciales correctas
    fireEvent.change(emailInput, { target: { value: userEmail } });
    fireEvent.change(passwordInput, { target: { value: userPassword } });
    fireEvent.click(submitButton);

    // Verificamos que se mostró la alerta de éxito
    expect(global.alert).toHaveBeenCalledWith('Sesión iniciada correctamente.');
    // Verificamos que se llamó a navigate para ir a la página principal
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });
});