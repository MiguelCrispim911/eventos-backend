import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import clienteService from '../../services/clienteService';
import { useAuth } from '../../context/AuthContext';
import "./Login.css";

const Login = () => {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Validar que la cédula sea un número
      const cedulaNum = parseInt(cedula, 10);
      if (isNaN(cedulaNum)) {
        throw new Error('La cédula debe ser un número');
      }
      
      // Realizar la solicitud de login
      const response = await clienteService.post('/clientes/login', {
        cedula: cedulaNum,
        contrasena: password
      });
      
      console.log('Respuesta de login:', response.data);
      
      // Extraer el token y la información del usuario
      const { token, user: userId } = response.data;
      
      if (!token) {
        throw new Error('No se recibió token de autenticación');
      }
      
      // Obtener los datos completos del usuario
      const userResponse = await clienteService.get(`/clientes/${cedulaNum}`);
      const userData = userResponse.data;
      
      // Guardar los datos del usuario y el token en el contexto
      login(userData, token);
      
      // Redirigir a la página Home
      navigate('/');
    } catch (err) {
      console.error('Error de login:', err);
      
      if (err.response && err.response.status === 401) {
        setError('Cédula o contraseña incorrecta');
      } else if (err.message === 'La cédula debe ser un número') {
        setError(err.message);
      } else {
        setError('Error al iniciar sesión. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className={`submit-button ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Iniciando sesión...' : 'Entrar'}
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
