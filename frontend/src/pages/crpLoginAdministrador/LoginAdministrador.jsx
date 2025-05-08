import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginAdministrador.css';

const LoginAdministrador = () => {
  // Estados para manejar los datos del formulario
  const [cedula, setCedula] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que el formulario se recargue
    
    try {
      // 1. Realiza la petición al servidor
      const response = await fetch('http://localhost:8000/administradores/login/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cedula_adm: parseInt(cedula), // Convierte la cédula a número
          contrasena: contrasena
        }),
      });
      
      // 2. Procesa la respuesta
      const data = await response.json();
      
      // 3. Si la respuesta no es exitosa, lanza un error
      if (!response.ok) {
        throw new Error(data.detail || 'Error de autenticación');
      }
      
      // 4. Almacena los datos en localStorage
      localStorage.setItem('adminToken', data.access_token); // Guarda el token JWT
      localStorage.setItem('adminData', JSON.stringify(data.admin)); // Guarda datos del admin
      
      // 5. Redirige al dashboard
      navigate('/administrador/dashboard');
      
    } catch (error) {
      // Manejo de errores
      setError(error.message); // Muestra el mensaje de error
      setContrasena(''); // Limpia el campo de contraseña
    }
  };

  // Función para hacer peticiones a rutas protegidas
  const fetchProtectedData = async () => {
    try {
      // 1. Obtiene el token del localStorage
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      // 2. Realiza la petición con el token en los headers
      const response = await fetch('http://localhost:8000/administrador/perfil/', {
        headers: {
          'Authorization': `Bearer ${token}` // Envía el token en el header
        }
      });
      
      // 3. Verifica si la respuesta es exitosa
      if (!response.ok) {
        throw new Error('Error al obtener datos protegidos');
      }
      
      // 4. Procesa los datos
      const protectedData = await response.json();
      console.log('Datos protegidos:', protectedData);
      return protectedData;
      
    } catch (error) {
      console.error('Error:', error);
      // Opcional: redirigir al login si el token es inválido
      if (error.message.includes('autenticación')) {
        navigate('/login');
      }
      throw error;
    }
  };

  // Renderizado del formulario
  return (
    <div className="admin-login-container">
      <h2 className="admin-login-title">Iniciar Sesión Administrador</h2>
      
      {/* Muestra errores si existen */}
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
