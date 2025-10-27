import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom'; // REMOVED: Incompatible con Jasmine
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

// --- Mocks ---
const mockedNavigate = jasmine.createSpy('navigate'); // Spy de Jasmine

// REMOVED: jest.mock(...) bloque eliminado porque 'jest' no está definido aquí

// Mock global de alert con Jasmine
global.alert = jasmine.createSpy('alert');

// Mock de localStorage (sin cambios)
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
// --- Fin Mocks ---

describe('Componente Login', () => {
    beforeEach(() => {
        global.alert.calls.reset();
        mockedNavigate.calls.reset();
        localStorageMock.clear();
    });

    it('renderiza el formulario de inicio de sesión correctamente', () => {
        render(<BrowserRouter><Login /></BrowserRouter>);
        // Cambio: Usar toBeDefined() en lugar de toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeDefined();
        expect(screen.getByLabelText('Correo electrónico')).toBeDefined();
        expect(screen.getByLabelText('Contraseña')).toBeDefined();
        expect(screen.getByRole('button', { name: 'Ingresar' })).toBeDefined();
    });

    it('permite al usuario escribir en los campos', () => {
        render(<BrowserRouter><Login /></BrowserRouter>);
        const emailInput = screen.getByLabelText('Correo electrónico');
        const passwordInput = screen.getByLabelText('Contraseña');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // Usamos .toEqual() de Jasmine (ya estaba correcto)
        expect(emailInput.value).toEqual('test@example.com');
        expect(passwordInput.value).toEqual('password123');
    });

    it('muestra alerta si se envía el formulario con campos vacíos', () => {
        render(<BrowserRouter><Login /></BrowserRouter>);
        const submitButton = screen.getByRole('button', { name: 'Ingresar' });
        fireEvent.click(submitButton);

        // Usamos toHaveBeenCalledWith de Jasmine (ya estaba correcto)
        expect(global.alert).toHaveBeenCalledWith('Por favor completa el/los campos vacíos.');
        expect(mockedNavigate).not.toHaveBeenCalled(); // Correcto para Jasmine
    });

    it('muestra alerta si el correo o contraseña son inválidos', () => {
        localStorageMock.setItem('usuario@correcto.com', 'passCorrecta');
        render(<BrowserRouter><Login /></BrowserRouter>);
        const emailInput = screen.getByLabelText('Correo electrónico');
        const passwordInput = screen.getByLabelText('Contraseña');
        const submitButton = screen.getByRole('button', { name: 'Ingresar' });

        fireEvent.change(emailInput, { target: { value: 'test@incorrecto.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        expect(global.alert).toHaveBeenCalledWith('Correo o clave inválidos.');
        expect(mockedNavigate).not.toHaveBeenCalled();

        global.alert.calls.reset();

        fireEvent.change(emailInput, { target: { value: 'usuario@correcto.com' } });
        fireEvent.change(passwordInput, { target: { value: 'passIncorrecta' } });
        fireEvent.click(submitButton);

        expect(global.alert).toHaveBeenCalledWith('Correo o clave inválidos.');
        expect(mockedNavigate).not.toHaveBeenCalled();
    });

    it('inicia sesión y navega a "/" si las credenciales son correctas', () => {
        const userEmail = 'usuario@registrado.com';
        const userPassword = 'passwordCorrecta';
        localStorageMock.setItem(userEmail, userPassword);

        render(<BrowserRouter><Login /></BrowserRouter>);
        const emailInput = screen.getByLabelText('Correo electrónico');
        const passwordInput = screen.getByLabelText('Contraseña');
        const submitButton = screen.getByRole('button', { name: 'Ingresar' });

        fireEvent.change(emailInput, { target: { value: userEmail } });
        fireEvent.change(passwordInput, { target: { value: userPassword } });
        fireEvent.click(submitButton);

        expect(global.alert).toHaveBeenCalledWith('Sesión iniciada correctamente.');
        expect(mockedNavigate).toHaveBeenCalledWith('/'); // Correcto para Jasmine
    });
});