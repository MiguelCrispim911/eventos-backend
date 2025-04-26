
import  clienteService  from "../services/clienteService.js";

export function loginUser({ cedula, password }) {
  return clienteService.post('/login', {
    cedula,
    contraseña: password
  });
}

