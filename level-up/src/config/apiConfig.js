// Centralizar las direcciones base de los servicios API.

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://34.201.202.181:8080';
export const PAYMENT_BASE_URL = process.env.REACT_APP_PAYMENT_URL || 'http://34.201.202.181:5000';

export default {
  API_BASE_URL,
  PAYMENT_BASE_URL,
};
