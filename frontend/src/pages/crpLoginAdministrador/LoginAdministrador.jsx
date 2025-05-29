import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginAdministrador.css';

// Componente principal para el login de administrador
const LoginAdministrador = () => {
  // Estados para los campos del formulario y errores
  const [cedula, setCedula] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Maneja el envío del formulario de login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene recarga de la página

    try {
      // Realiza la petición POST al backend para autenticar
      const response = await fetch('http://localhost:8000/administradores/login/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cedula_adm: parseInt(cedula), // Convierte cédula a número
          contrasena: contrasena
        }),
      });

      // Obtiene la respuesta en formato JSON
      const data = await response.json();

      // Si la respuesta no es exitosa, lanza error
      if (!response.ok) {
        throw new Error(data.detail || 'Error de autenticación');
      }

      // Guarda el token y datos del admin en localStorage
      localStorage.setItem('adminToken', data.access_token);
      localStorage.setItem('adminData', JSON.stringify(data.admin));

      // Redirige al dashboard del administrador
      navigate('/administrador/dashboard');

    } catch (error) {
      // Muestra el mensaje de error y limpia la contraseña
      setError(error.message);
      setContrasena('');
    }
  };

  // Ejemplo de función para acceder a rutas protegidas usando el token
  const fetchProtectedData = async () => {
    try {
      // Obtiene el token almacenado
      const token = localStorage.getItem('adminToken');

      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Realiza la petición con el token en el header Authorization
      const response = await fetch('http://localhost:8000/administrador/perfil/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Si la respuesta falla, lanza error
      if (!response.ok) {
        throw new Error('Error al obtener datos protegidos');
      }

      // Procesa los datos protegidos
      const protectedData = await response.json();
      console.log('Datos protegidos:', protectedData);
      return protectedData;

    } catch (error) {
      console.error('Error:', error);
      // Si el error es de autenticación, redirige al login
      if (error.message.includes('autenticación')) {
        navigate('/login');
      }
      throw error;
    }
  };

  // Renderiza el formulario de login
  return (
    <div className="admin-login-container">
      <h2 className="admin-login-title">Iniciar Sesión Administrador</h2>
      
      {/* Muestra mensaje de error si existe */}
      {error && <p className="admin-login-error">{error}</p>}
      
      <form onSubmit={handleSubmit} className="admin-login-form">
        <div className="admin-form-group">
          <label htmlFor="cedula" className="admin-form-label">Cédula:</label>
          <input
            type="number"
            id="cedula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            className="admin-form-input"
            placeholder="Ingrese su cédula"
            required
          />
        </div>
        
        <div className="admin-form-group">
          <label htmlFor="contrasena" className="admin-form-label">Contraseña:</label>
          <input
            type="password"
            id="contrasena"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="admin-form-input"
            placeholder="Ingrese su contraseña"
            required
          />
        </div>
        
        <button type="submit" className="admin-login-button">Ingresar</button>
      </form>     
    </div>
  );
};

export default LoginAdministrador;
