import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom'; // REMOVED
import { BrowserRouter } from 'react-router-dom';
import PasswordReset from './PasswordReset';

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

describe('Componente PasswordReset', () => {
    beforeEach(() => {
        global.alert.calls.reset();
        mockedNavigate.calls.reset();
        localStorageMock.clear();
        localStorageMock.setItem('usuario@existente.com', 'viejaPassword');
    });

    it('renderiza el formulario correctamente', () => {
        render(<BrowserRouter><PasswordReset /></BrowserRouter>);
        // Cambio: Usar toBeDefined()
        expect(screen.getByRole('heading', { name: 'Recuperar Contraseña' })).toBeDefined();
        expect(screen.getByLabelText('Correo electrónico')).toBeDefined();
        expect(screen.getByLabelText('Ingrese nueva contraseña')).toBeDefined();
        expect(screen.getByLabelText('Vuelva a ingresar la nueva contraseña')).toBeDefined();
        expect(screen.getByRole('button', { name: 'Recuperar Contraseña' })).toBeDefined();
    });

    it('muestra alerta si las contraseñas no coinciden', () => {
        render(<BrowserRouter><PasswordReset /></BrowserRouter>);
        const emailInput = screen.getByLabelText('Correo electrónico');
        const newPasswordInput = screen.getByLabelText('Ingrese nueva contraseña');
        const confirmPasswordInput = screen.getByLabelText('Vuelva a ingresar la nueva contraseña');
        const submitButton = screen.getByRole('button', { name: 'Recuperar Contraseña' });

        fireEvent.change(emailInput, { target: { value: 'usuario@existente.com' } });
        fireEvent.change(newPasswordInput, { target: { value: 'nuevaPass1' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'nuevaPass2' } });
        fireEvent.click(submitButton);

        expect(global.alert).toHaveBeenCalledWith('Las contraseñas no son iguales.'); // Correcto para Jasmine
        expect(mockedNavigate).not.toHaveBeenCalled(); // Correcto para Jasmine
    });

     it('muestra alerta si el correo no está registrado', () => {
        render(<BrowserRouter><PasswordReset /></BrowserRouter>);
        const emailInput = screen.getByLabelText('Correo electrónico');
        const newPasswordInput = screen.getByLabelText('Ingrese nueva contraseña');
        const confirmPasswordInput = screen.getByLabelText('Vuelva a ingresar la nueva contraseña');
        const submitButton = screen.getByRole('button', { name: 'Recuperar Contraseña' });

        fireEvent.change(emailInput, { target: { value: 'noexiste@example.com' } });
        fireEvent.change(newPasswordInput, { target: { value: 'nuevaPassword' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'nuevaPassword' } });
        fireEvent.click(submitButton);

        expect(global.alert).toHaveBeenCalledWith('El correo no está registrado.');
        expect(mockedNavigate).not.toHaveBeenCalled();
    });

    it('actualiza la contraseña y navega a /iniciarsesion si los datos son válidos', () => {
        render(<BrowserRouter><PasswordReset /></BrowserRouter>);
        const emailInput = screen.getByLabelText('Correo electrónico');
        const newPasswordInput = screen.getByLabelText('Ingrese nueva contraseña');
        const confirmPasswordInput = screen.getByLabelText('Vuelva a ingresar la nueva contraseña');
        const submitButton = screen.getByRole('button', { name: 'Recuperar Contraseña' });
        const userEmail = 'usuario@existente.com';
        const newPassword = 'passValida';

        fireEvent.change(emailInput, { target: { value: userEmail } });
        fireEvent.change(newPasswordInput, { target: { value: newPassword } });
        fireEvent.change(confirmPasswordInput, { target: { value: newPassword } });
        fireEvent.click(submitButton);

        expect(global.alert).toHaveBeenCalledWith('Su contraseña se actualizó con éxito.');
        // Cambio: Usar toBe() de Jasmine para comparar valores primitivos
        expect(localStorageMock.getItem(userEmail)).toBe(newPassword);
        expect(mockedNavigate).toHaveBeenCalledWith('/iniciarsesion'); // Correcto para Jasmine
    });

    it('muestra alerta si la nueva contraseña no cumple la longitud requerida', () => {
        render(<BrowserRouter><PasswordReset /></BrowserRouter>);
        const emailInput = screen.getByLabelText('Correo electrónico');
        const newPasswordInput = screen.getByLabelText('Ingrese nueva contraseña');
        const confirmPasswordInput = screen.getByLabelText('Vuelva a ingresar la nueva contraseña');
        const submitButton = screen.getByRole('button', { name: 'Recuperar Contraseña' });

        fireEvent.change(emailInput, { target: { value: 'usuario@existente.com' } });

        // Corta
        fireEvent.change(newPasswordInput, { target: { value: '123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: '123' } });
        fireEvent.click(submitButton);
        expect(global.alert).toHaveBeenCalledWith('La nueva contraseña debe tener entre 4 y 12 caracteres.');
        expect(mockedNavigate).not.toHaveBeenCalled();

        global.alert.calls.reset();

        // Larga
        fireEvent.change(newPasswordInput, { target: { value: '1234567890123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: '1234567890123' } });
        fireEvent.click(submitButton);
        expect(global.alert).toHaveBeenCalledWith('La nueva contraseña debe tener entre 4 y 12 caracteres.');
        expect(mockedNavigate).not.toHaveBeenCalled();
    });

    it('muestra alerta si falta algún campo', () => {
        render(<BrowserRouter><PasswordReset /></BrowserRouter>);
        const submitButton = screen.getByRole('button', { name: 'Recuperar Contraseña' });
        fireEvent.click(submitButton);

        expect(global.alert).toHaveBeenCalledWith('Completa todos los campos.');
        expect(mockedNavigate).not.toHaveBeenCalled();
    });
});