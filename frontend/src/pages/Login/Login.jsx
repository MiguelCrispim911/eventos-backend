import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./Login.css";

const Login = () => {
  const [cedula, setCedula] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Función para verificar si localStorage está disponible
  const isLocalStorageAvailable = () => {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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

      // 3. Petición al backend
      const response = await fetch('http://localhost:8000/clientes/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cedula: parseInt(cedula),
          contrasena: contrasena
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Error de autenticación');
      }

      // 4. Verificación del token
      if (!data.access_token) {
        throw new Error('El servidor no devolvió un token válido');
      }

      // 5. Guardado seguro en localStorage
      try {
        localStorage.setItem('authToken', data.access_token);
        console.log('Token guardado:', localStorage.getItem('authToken')); // Para depuración
        
        // Esperar breve momento para asegurar escritura
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Disparar eventos de autenticación
        window.dispatchEvent(new Event('auth-change'));
        window.dispatchEvent(new StorageEvent('storage', { 
          key: 'authToken',
          newValue: data.access_token
        }));
        
        // Redirección
        navigate('/');
      } catch (storageError) {
        throw new Error('Error al guardar la sesión');
      }

    } catch (error) {
      console.error('Error en login:', error);
      setError(error.message);
      setContrasena('');
      // Limpiar token en caso de error
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Iniciar Sesión</h2>
        
        {error && (
          <div className="error-message">
            {error}
            {error.includes('almacenamiento local') && (
              <p className="storage-help">
                Prueba en modo normal (no incógnito) o con otro navegador
              </p>
            )}
          </div>
        )}
        
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
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Entrar'}
        </button>
        
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