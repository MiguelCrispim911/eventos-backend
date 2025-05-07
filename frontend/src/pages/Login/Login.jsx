import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./Login.css";

const Login = () => {
  const [cedula, setCedula] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validación de cédula numérica
      if (isNaN(parseInt(cedula))) {
        throw new Error('La cédula debe ser un número');
      }
  
      // Petición al backend
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
      
      
      localStorage.setItem('authToken', data.access_token);  

      
      // Dispara eventos para actualizar el Navbar
      window.dispatchEvent(new Event('auth-change'));
      window.dispatchEvent(new StorageEvent('storage', { key: 'authToken' }));
      // ---------------------------------------------
  
      navigate('/');
  
    } catch (error) {
      setError(error.message);
      setContrasena('');
    }
  };

  // Renderizado (se mantiene igual)
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Iniciar Sesión</h2>
        
        {error && <div className="error-message">{error}</div>}
        
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
        
        <button type="submit" className="submit-button">
          Entrar
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