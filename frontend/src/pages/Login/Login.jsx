import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import "./Login.css"; 

const Login = () => {
  // Estados para manejar los datos del formulario y el estado de la aplicación
  const [cedula, setCedula] = useState(''); // Estado para el campo de cédula
  const [contrasena, setContrasena] = useState(''); // Estado para el campo de contraseña
  const [error, setError] = useState(''); // Estado para mensajes de error
  const [isLoading, setIsLoading] = useState(false); // Estado para indicar carga
  const navigate = useNavigate(); // Hook para navegación programática

  // Función para verificar si localStorage está disponible en el navegador
  const isLocalStorageAvailable = () => {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false; // Retorna falso si hay error (modo incógnito o cookies deshabilitadas)
    }
  };

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento predeterminado del formulario
    setIsLoading(true); // Activa el indicador de carga
    setError(''); // Limpia errores previos

    try {
      // 1. Validación de campos
      if (!cedula || !contrasena) {
        throw new Error('Todos los campos son obligatorios');
      }

      if (isNaN(parseInt(cedula))) {
        throw new Error('La cédula debe ser un número');
      }

      // 2. Verificar localStorage
      if (!isLocalStorageAvailable()) {
        throw new Error('El navegador no permite almacenamiento local');
      }

      // 3. Petición al backend para autenticar
      const response = await fetch('http://localhost:8000/clientes/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cedula: parseInt(cedula), // Convierte la cédula a número
          contrasena: contrasena
        }),
      });
      
      const data = await response.json(); // Procesa la respuesta JSON
      
      // Verifica si la respuesta no fue exitosa
      if (!response.ok) {
        throw new Error(data.detail || 'Error de autenticación');
      }

      // 4. Verificación del token recibido
      if (!data.access_token) {
        throw new Error('El servidor no devolvió un token válido');
      }

      // 5. Guardado seguro en localStorage
      try {
        localStorage.setItem('authToken', data.access_token); // Guarda el token
        console.log('Token guardado:', localStorage.getItem('authToken')); // Para depuración
        
        // Esperar breve momento para asegurar escritura
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Disparar eventos de autenticación para notificar a otros componentes
        window.dispatchEvent(new Event('auth-change'));
        window.dispatchEvent(new StorageEvent('storage', { 
          key: 'authToken',
          newValue: data.access_token
        }));
        
        // Redirección a la página principal tras login exitoso
        navigate('/');
      } catch (storageError) {
        throw new Error('Error al guardar la sesión');
      }

    } catch (error) {
      console.error('Error en login:', error);
      setError(error.message); // Establece el mensaje de error
      setContrasena(''); // Limpia el campo de contraseña por seguridad
      // Limpiar token en caso de error
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false); // Desactiva el indicador de carga
    }
  };

  // Renderizado del componente
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Iniciar Sesión</h2>
        
        {/* Muestra mensajes de error si existen */}
        {error && (
          <div className="error-message">
            {error}
            {/* Muestra ayuda adicional para errores de localStorage */}
            {error.includes('almacenamiento local') && (
              <p className="storage-help">
                Prueba en modo normal (no incógnito) o con otro navegador
              </p>
            )}
          </div>
        )}
        
        {/* Campo para ingresar la cédula */}
        <div className="form-group">
          <label className="form-label">Cédula</label>
          <input
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            className="form-input"
            placeholder="Ingresa tu número de cédula"
            required
          />
        </div>
        
        {/* Campo para ingresar la contraseña */}
        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="form-input"
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>
        
        {/* Botón de envío del formulario */}
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading} // Deshabilita el botón durante la carga
        >
          {isLoading ? 'Cargando...' : 'Entrar'}
        </button>
        
        {/* Enlaces a otras páginas de registro y recuperar contrase */}
        <div className="register-link">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </div>
        <div className="forgot-password-link">
          ¿Olvidaste tu contraseña? <Link to="/recuperar-contrasena">Recuperar</Link>
        </div>
      </form>
    </div>
  );
};

export default Login; 
