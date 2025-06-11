import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./Registro.css";

const Registro = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    direccion: '',
    departamento: '',
    municipio: '',
    email: '',
    telefono: '',
    contrasena: '',
    confirmarContrasena: '',
    preguntaSeguridad: '',
    respuestaSeguridad: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    // Validaciones básicas
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    
    if (isNaN(parseInt(formData.cedula, 10))) {
      setError('La cédula debe ser un número');
      setLoading(false);
      return;
    }
    
    if (formData.contrasena.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      setLoading(false);
      return;
    }
    
    try {
      // Preparar datos para enviar al servidor
      const clienteData = {
        cedula: parseInt(formData.cedula, 10),
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        direccion: formData.direccion,
        departamento: formData.departamento,
        municipio: formData.municipio,
        email: formData.email,
        telefono: formData.telefono,
        contrasena: formData.contrasena,
        preguntaSeguridad: formData.preguntaSeguridad,
        respuestaSeguridad: formData.respuestaSeguridad,
        estado: 1 // Activo por defecto
      };
      
      // Enviar datos al servidor usando fetch
      const response = await fetch('http://localhost:8000/clientes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error al registrar usuario');
      }
      
      setSuccess('¡Registro exitoso! Redirigiendo al inicio de sesión...');
      
      // Redirigir después de un breve retraso
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Error de registro:', err);
      
      if (err.message.includes('409')) {
        setError('Ya existe un usuario con esta cédula');
      } else {
        setError(err.message || 'Error al registrar usuario. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="registro-container">
      <form onSubmit={handleSubmit} className="registro-form">
        <h2 className="registro-title">Crear Cuenta</h2>
        
        <div className="registro-explanation">
          <p>Complete todos los campos para registrarse como cliente. Los campos marcados con * son obligatorios.</p>
        </div>
        
        {error && <div className="registro-error-message">{error}</div>}
        {success && <div className="registro-success-message">{success}</div>}
        
        <div className="registro-columns">
          <div className="registro-column">
            <div className="registro-form-group">
              <label className="registro-form-label">Cédula *</label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                className="registro-form-input"
                placeholder="Ingrese su número de cédula"
                required
              />
            </div>
            
            <div className="registro-form-group">
              <label className="registro-form-label">Nombres *</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                className="registro-form-input"
                placeholder="Ingrese sus nombres"
                required
              />
            </div>
            
            <div className="registro-form-group">
              <label className="registro-form-label">Apellidos *</label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className="registro-form-input"
                placeholder="Ingrese sus apellidos"
                required
              />
            </div>
            
            <div className="registro-form-group">
              <label className="registro-form-label">Dirección *</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="registro-form-input"
                placeholder="Ingrese su dirección"
                required
              />
            </div>
            
            <div className="registro-form-group">
              <label className="registro-form-label">Departamento *</label>
              <input
                type="text"
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                className="registro-form-input"
                placeholder="Ingrese su departamento"
                required
              />
            </div>
          </div>
          
          <div className="registro-column">
            <div className="registro-form-group">
              <label className="registro-form-label">Municipio *</label>
              <input
                type="text"
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                className="registro-form-input"
                placeholder="Ingrese su municipio"
                required
              />
            </div>
            
            <div className="registro-form-group">
              <label className="registro-form-label">Correo Electrónico *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="registro-form-input"
                placeholder="Ingrese su correo electrónico"
                required
              />
            </div>
            
            <div className="registro-form-group">
              <label className="registro-form-label">Teléfono *</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="registro-form-input"
                placeholder="Ingrese su número de teléfono"
                required
              />
            </div>
            
            <div className="registro-form-group">
              <label className="registro-form-label">Contraseña *</label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                className="registro-form-input"
                placeholder="Cree una contraseña"
                required
              />
            </div>
            
            <div className="registro-form-group">
              <label className="registro-form-label">Confirmar Contraseña *</label>
              <input
                type="password"
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                className="registro-form-input"
                placeholder="Confirme su contraseña"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="registro-form-group">
          <label className="registro-form-label">Pregunta de Seguridad *</label>
          <select
            name="preguntaSeguridad"
            value={formData.preguntaSeguridad || ''}
            onChange={handleChange}
            className="registro-form-input"
            required
          >
            <option value="">Seleccione una pregunta</option>
            <option value="¿En qué ciudad naciste?">¿En qué ciudad naciste?</option>
            <option value="¿Cuál es el nombre de tu mascota?">¿Cuál es el nombre de tu mascota?</option>
          </select>
        </div>
        <div className="registro-form-group">
          <label className="registro-form-label">Respuesta de Seguridad *</label>
          <input
            type="text"
            name="respuestaSeguridad"
            value={formData.respuestaSeguridad || ''}
            onChange={handleChange}
            className="registro-form-input"
            placeholder="Ingrese su respuesta"
            required
          />
        </div>
        <div className="registro-note">
          <small>
            <b>Nota:</b> La pregunta y respuesta de seguridad te ayudarán a recuperar tu cuenta si olvidas tu contraseña.
          </small>
        </div>
        
        <div className="registro-actions">
          <button 
            type="submit" 
            className={`registro-submit-button${loading ? ' loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
          
          <div className="registro-login-link">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Registro;