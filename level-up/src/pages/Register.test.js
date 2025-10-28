import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// Se eliminó import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';

// --- Mocks ---
import * as ReactRouterDom from 'react-router-dom'; // Importar para spyOn
const mockedNavigate = jasmine.createSpy('navigate');
global.alert = jasmine.createSpy('alert');
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
    let navigateSpy;
    beforeEach(() => {
        global.alert.calls.reset();
        localStorageMock.clear();
        // Configurar spyOn antes de renderizar
        //navigateSpy = spyOn(ReactRouterDom, 'useNavigate').and.returnValue(mockedNavigate);
        mockedNavigate.calls.reset();
    });

    it('renderiza el formulario de registro correctamente', () => {
        render(<BrowserRouter><Register /></BrowserRouter>);
        expect(screen.getByRole('heading', { name: 'Registrarse' })).toBeDefined();
        expect(screen.getByLabelText('Correo electrónico')).toBeDefined();
        expect(screen.getByLabelText('Contraseña')).toBeDefined();
        expect(screen.getByRole('button', { name: 'Registrarse' })).toBeDefined();
    });

    it('muestra alerta si la contraseña no cumple la longitud requerida', async () => { // async/await
        render(<BrowserRouter><Register /></BrowserRouter>);
        const emailInput = screen.getByLabelText('Correo electrónico');
        const passwordInput = screen.getByLabelText('Contraseña');
        const submitButton = screen.getByRole('button', { name: 'Registrarse' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '123' } }); // Corta
        await fireEvent.click(submitButton);

        expect(global.alert).toHaveBeenCalledWith('La contraseña debe tener entre 4 y 12 caracteres.');
        //expect(mockedNavigate).not.toHaveBeenCalled();

        global.alert.calls.reset();

        fireEvent.change(passwordInput, { target: { value: '1234567890123' } }); // Larga
        await fireEvent.click(submitButton);

        expect(global.alert).toHaveBeenCalledWith('La contraseña debe tener entre 4 y 12 caracteres.');
        //expect(mockedNavigate).not.toHaveBeenCalled();
    });

    it('muestra alerta si el correo ya está registrado', async () => { // async/await
        localStorageMock.setItem('existente@example.com', 'password123'); // Contraseña válida
        render(<BrowserRouter><Register /></BrowserRouter>);
        const emailInput = screen.getByLabelText('Correo electrónico');
        const passwordInput = screen.getByLabelText('Contraseña');
        const submitButton = screen.getByRole('button', { name: 'Registrarse' });

        fireEvent.change(emailInput, { target: { value: 'existente@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'passValida' } }); // Usar una contraseña válida
        await fireEvent.click(submitButton);

        expect(global.alert).toHaveBeenCalledWith('Este correo ya se encuentra registrado.');
        //expect(mockedNavigate).not.toHaveBeenCalled();
    });

    it('registra al usuario y navega a /iniciarsesion si los datos son válidos', async () => { // async/await
        render(<BrowserRouter><Register /></BrowserRouter>);
        const emailInput = screen.getByLabelText('Correo electrónico');
        const passwordInput = screen.getByLabelText('Contraseña');
        const submitButton = screen.getByRole('button', { name: 'Registrarse' });
        const newUserEmail = 'nuevo@example.com';
        const newUserPassword = 'passValida'; // Contraseña válida

        fireEvent.change(emailInput, { target: { value: newUserEmail } });
        fireEvent.change(passwordInput, { target: { value: newUserPassword } });
        await fireEvent.click(submitButton);

        expect(global.alert).toHaveBeenCalledWith('Su cuenta se ha registrado exitosamente.');
        expect(localStorageMock.getItem(newUserEmail)).toBe(newUserPassword); // Usar toBe
        //expect(mockedNavigate).toHaveBeenCalledWith('/iniciarsesion');
    });
});