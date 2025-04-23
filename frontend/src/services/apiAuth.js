import axios from 'axios';

const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
});

/**
 * Inicia sesión de usuario
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise}
 */
export const loginUser = async (credentials) => {
  const response = await apiAuth.post('/login', credentials);
  return response.data;
};

/**
 * Registra un nuevo usuario (cliente)
 * @param {{ nombres: string, apellidos: string, email: string, password: string }} data
 * @returns {Promise}
 */
export const registerUser = async (data) => {
  const response = await apiAuth.post('/registro', data);
  return response.data;
};
