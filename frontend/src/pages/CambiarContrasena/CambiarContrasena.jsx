import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './CambiarContrasena.module.css';

const CambiarContrasena = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    contrasenaActual: '',
    nuevaContrasena: '',
    confirmarNuevaContrasena: ''
  });
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const decodedToken = jwtDecode(token);
        const cedula = decodedToken.cedula || decodedToken.id_usuario;
        
        setUserData({ cedula });
      } catch (err) {
        console.error('Error al obtener datos del usuario:', err);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

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
    
    // Validaciones
    if (!formData.contrasenaActual || !formData.nuevaContrasena || !formData.confirmarNuevaContrasena) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    if (formData.nuevaContrasena !== formData.confirmarNuevaContrasena) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }
    
    if (formData.nuevaContrasena.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Verificar la contraseña actual
      const verifyResponse = await fetch('http://localhost:8000/clientes/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cedula: userData.cedula,
          password: formData.contrasenaActual
        }),
      });
      
      if (!verifyResponse.ok) {
        setError('La contraseña actual es incorrecta');
        setLoading(false);
        return;
      }
      
      // Actualizar la contraseña
      const updateResponse = await fetch(`http://localhost:8000/clientes/${userData.cedula}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contrasena: formData.nuevaContrasena
        }),
      });
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.detail || 'Error al actualizar la contraseña');
      }
      
      setSuccess('¡Contraseña actualizada con éxito!');
      setFormData({
        contrasenaActual: '',
        nuevaContrasena: '',
        confirmarNuevaContrasena: ''
      });
      
      // Redirigir después de un breve retraso
      setTimeout(() => {
        navigate('/perfil');
      }, 2000);
      
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      setError(err.message || 'Error al cambiar la contraseña. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.cambiarContrasenaContainer}>
      <h2 className={styles.title}>Cambiar Contraseña</h2>
      
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Contraseña Actual:</label>
          <input
            type="password"
            name="contrasenaActual"
            value={formData.contrasenaActual}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Nueva Contraseña:</label>
          <input
            type="password"
            name="nuevaContrasena"
            value={formData.nuevaContrasena}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <span className={styles.helpText}>La contraseña debe tener al menos 6 caracteres</span>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Confirmar Nueva Contraseña:</label>
          <input
            type="password"
            name="confirmarNuevaContrasena"
            value={formData.confirmarNuevaContrasena}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.buttonsContainer}>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={() => navigate('/perfil')}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className={styles.saveButton}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CambiarContrasena;