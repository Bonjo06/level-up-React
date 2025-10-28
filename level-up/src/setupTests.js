// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';


import * as ReactRouterDom from 'react-router-dom';

// Evitar redefinir varias veces
if (!ReactRouterDom.__mockedNavigatePatched) {
  const mockedNavigate = jasmine.createSpy('navigate');
  Object.defineProperty(ReactRouterDom, 'useNavigate', {
    value: () => mockedNavigate,
    writable: true,
    configurable: true,
  });
  ReactRouterDom.__mockedNavigatePatched = true;
  global.mockedNavigate = mockedNavigate;
}

// Mock global de alert
global.alert = jasmine.createSpy('alert');

// Mock global de localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });