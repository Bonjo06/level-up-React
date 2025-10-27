import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom'; // REMOVED
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';

// --- Mocks ---
const mockedNavigate = jasmine.createSpy('navigate'); // Spy de Jasmine

// REMOVED: jest.mock(...) bloque eliminado

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

describe('Componente Register', () => {
    beforeEach(() => {
        global.alert.calls.reset();
        mockedNavigate.calls.reset();
        localStorageMock.clear();
    });

    it('renderiza el formulario de registro correctamente', () => {
        render(<BrowserRouter><Register /></BrowserRouter>);
        // Cambio: Usar toBeDefined()
        expect(screen.getByRole('heading', { name: 'Registrarse' })).toBeDefined();
        expect(screen.getByLabelText('Correo electrónico')).toBeDefined();
        expect(screen.getByLabelText('Contraseña')).toBeDefined();
        expect(screen.getByRole('button', { name: 'Registrarse' })).toBeDefined();
    });

    it('muestra alerta si la contraseña no cumple la longitud requerida', () => {
        render(<BrowserRouter><Register /></BrowserRouter>);
        const emailInput = screen.getByLabelText('Correo electrónico');
        const passwordInput = screen.getByLabelText('Contraseña');
        const submitButton = screen.getByRole('button', { name: 'Registrarse' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '123' } }); // Corta
        fireEvent.click(submitButton);

        expect(global.alert).toHaveBeenCalledWith('La contraseña debe tener entre 4 y 12 caracteres.'); // Correcto para Jasmine
        expect(mockedNavigate).not.toHaveBeenCalled(); // Correcto para Jasmine

        global.alert.calls.reset();

        fireEvent.change(passwordInput, { target: { value: '1234567890123' } }); // Larga
        fireEvent.click(submitButton);

        expect(global.alert).toHaveBeenCalledWith('La contraseña debe tener entre 4 y 12 caracteres.');
        expect(mockedNavigate).not.toHaveBeenCalled();
    });

    it('muestra alerta si el correo ya está registrado', () => {
        localStorageMock.setItem('existente@example.com', 'password123');
        render(<BrowserRouter><Register /></BrowserRouter>);
        const emailInput = screen.getByLabelText('Correo electrónico');
        const passwordInput = screen.getByLabelText('Contraseña');
        const submitButton = screen.getByRole('button', { name: 'Registrarse' });

        fireEvent.change(emailInput, { target: { value: 'existente@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'passValida' } });
        fireEvent.click(submitButton);

        expect(global.alert).toHaveBeenCalledWith('Este correo ya se encuentra registrado.');
        expect(mockedNavigate).not.toHaveBeenCalled();
    });

    it('registra al usuario y navega a /iniciarsesion si los datos son válidos', () => {
        render(<BrowserRouter><Register /></BrowserRouter>);
        const emailInput = screen.getByLabelText('Correo electrónico');
        const passwordInput = screen.getByLabelText('Contraseña');
        const submitButton = screen.getByRole('button', { name: 'Registrarse' });
        const newUserEmail = 'nuevo@example.com';
        const newUserPassword = 'passValida';

        fireEvent.change(emailInput, { target: { value: newUserEmail } });
        fireEvent.change(passwordInput, { target: { value: newUserPassword } });
        fireEvent.click(submitButton);

        expect(global.alert).toHaveBeenCalledWith('Su cuenta se ha registrado exitosamente.');
        // Cambio: Usar toBe() de Jasmine
        expect(localStorageMock.getItem(newUserEmail)).toBe(newUserPassword);
        expect(mockedNavigate).toHaveBeenCalledWith('/iniciarsesion'); // Correcto para Jasmine
    });
});