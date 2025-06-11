import React, { useState } from 'react';
import './RecuperarContrasena.css';

const preguntas = [
  "¿En qué ciudad naciste?",
  "¿Cuál es el nombre de tu mascota?"
];

const RecuperarContrasena = () => {
  const [cedula, setCedula] = useState('');
  const [preguntaSeguridad, setPreguntaSeguridad] = useState('');
  const [respuestaSeguridad, setRespuestaSeguridad] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!cedula || !preguntaSeguridad || !respuestaSeguridad || !nuevaContrasena || !confirmarContrasena) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (nuevaContrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/clientes/recuperar-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cedula: parseInt(cedula),
          preguntaSeguridad,
          respuestaSeguridad,
          nuevaContrasena
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'No se pudo cambiar la contraseña');
      }
      setSuccess('¡Contraseña cambiada exitosamente! Ahora puedes iniciar sesión.');
      setCedula('');
      setPreguntaSeguridad('');
      setRespuestaSeguridad('');
      setNuevaContrasena('');
      setConfirmarContrasena('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recuperar-container">
      <form className="recuperar-form" onSubmit={handleSubmit}>
        <h2>Recuperar Contraseña</h2>
        <div className="recuperar-note">
          <b>Nota:</b> La pregunta y respuesta de seguridad son las que registraste al crear tu cuenta.
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <div className="form-group">
          <label className="form-label">Cédula</label>
          <input
            type="text"
            value={cedula}
            onChange={e => setCedula(e.target.value)}
            className="recuperar-form-input"
            placeholder="Ingresa tu cédula"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Pregunta de Seguridad</label>
          <select
            value={preguntaSeguridad}
            onChange={e => setPreguntaSeguridad(e.target.value)}
            className="recuperar-form-input"
            required
          >
            <option value="">Selecciona una pregunta</option>
            {preguntas.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Respuesta de Seguridad</label>
          <input
            type="text"
            value={respuestaSeguridad}
            onChange={e => setRespuestaSeguridad(e.target.value)}
            className="recuperar-form-input"
            placeholder="Ingresa tu respuesta"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Nueva Contraseña</label>
          <input
            type="password"
            value={nuevaContrasena}
            onChange={e => setNuevaContrasena(e.target.value)}
            className="recuperar-form-input"
            placeholder="Nueva contraseña"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            value={confirmarContrasena}
            onChange={e => setConfirmarContrasena(e.target.value)}
            className="recuperar-form-input"
            placeholder="Confirma la nueva contraseña"
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Procesando...' : 'Cambiar Contraseña'}
        </button>
      </form>
    </div>
  );
};

export default RecuperarContrasena;