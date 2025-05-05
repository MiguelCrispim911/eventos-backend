
import clienteService from "../services/clienteService.js";

export async function loginUser({ cedula, password }) {
  // Convertir la cédula a número para asegurar que coincida con lo que espera el backend
  const cedulaNum = parseInt(cedula, 10);
  
  const response = await clienteService.post('/clientes/login', {
    cedula: cedulaNum,
    contrasena: password
  });
  
  // Después del login exitoso, obtener los datos completos del usuario
  const userResponse = await clienteService.get(`/clientes/${cedulaNum}`);
  
  // Devolver los datos completos del usuario
  return userResponse.data;
}

export async function getUserProfile(cedula) {
  const response = await clienteService.get(`/clientes/${cedula}`);
  return response.data;
}

export async function logout() {
  // Si tienes un endpoint de logout en el backend, llámalo aquí
  return true;
}

