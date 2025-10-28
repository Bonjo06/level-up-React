// PasswordReset.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PasswordReset from './PasswordReset';

describe('Componente PasswordReset', () => {
  beforeEach(() => {
    global.alert = jasmine.createSpy('alert');

    const store = { 'usuario@existente.com': 'viejaPassword' };
    spyOn(window.localStorage, 'getItem').and.callFake((key) => store[key] || null);
    spyOn(window.localStorage, 'setItem').and.callFake((key, value) => store[key] = value);
  });

  it('renderiza el formulario correctamente', () => {
    render(<BrowserRouter><PasswordReset /></BrowserRouter>);

    expect(screen.getByLabelText('Correo electrónico')).toBeDefined();
    expect(screen.getByLabelText('Ingrese nueva contraseña')).toBeDefined();
    expect(screen.getByLabelText('Vuelva a ingresar la nueva contraseña')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Recuperar Contraseña' })).toBeDefined();
  });

  it('muestra alerta si las contraseñas no coinciden', () => {
    render(<BrowserRouter><PasswordReset /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'usuario@existente.com' } });
    fireEvent.change(screen.getByLabelText('Ingrese nueva contraseña'), { target: { value: 'pass1' } });
    fireEvent.change(screen.getByLabelText('Vuelva a ingresar la nueva contraseña'), { target: { value: 'pass2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Recuperar Contraseña' }));

    expect(global.alert).toHaveBeenCalledWith('Las contraseñas no son iguales.');
  });

  it('muestra alerta si la nueva contraseña no cumple la longitud requerida', () => {
    render(<BrowserRouter><PasswordReset /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'usuario@existente.com' } });
    fireEvent.change(screen.getByLabelText('Ingrese nueva contraseña'), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText('Vuelva a ingresar la nueva contraseña'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Recuperar Contraseña' }));

    expect(global.alert).toHaveBeenCalledWith('La nueva contraseña debe tener entre 4 y 12 caracteres.');
  });

  it('muestra alerta si el correo no está registrado', () => {
    render(<BrowserRouter><PasswordReset /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'noexiste@correo.com' } });
    fireEvent.change(screen.getByLabelText('Ingrese nueva contraseña'), { target: { value: 'passValida' } });
    fireEvent.change(screen.getByLabelText('Vuelva a ingresar la nueva contraseña'), { target: { value: 'passValida' } });
    fireEvent.click(screen.getByRole('button', { name: 'Recuperar Contraseña' }));

    expect(global.alert).toHaveBeenCalledWith('El correo no está registrado.');
  });

  it('muestra alerta si falta algún campo', () => {
    render(<BrowserRouter><PasswordReset /></BrowserRouter>);

    fireEvent.click(screen.getByRole('button', { name: 'Recuperar Contraseña' }));

    expect(global.alert).toHaveBeenCalledWith('Completa todos los campos.');
  });

  it('actualiza la contraseña si los datos son válidos', () => {
    render(<BrowserRouter><PasswordReset /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'usuario@existente.com' } });
    fireEvent.change(screen.getByLabelText('Ingrese nueva contraseña'), { target: { value: 'passValida' } });
    fireEvent.change(screen.getByLabelText('Vuelva a ingresar la nueva contraseña'), { target: { value: 'passValida' } });
    fireEvent.click(screen.getByRole('button', { name: 'Recuperar Contraseña' }));

    expect(global.alert).toHaveBeenCalledWith('Su contraseña se actualizó con éxito.');
  });
});
