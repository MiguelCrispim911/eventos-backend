import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './EditarPerfil.module.css';

const EditarPerfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
    confirmarContrasena: ''
  });

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

        const response = await fetch(`http://localhost:8000/clientes/${cedula}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('No autorizado');
        }

        const data = await response.json();
        
        // Actualizar el formulario con los datos del usuario
        setFormData({
          cedula: data.cedula,
          nombres: data.nombres,
          apellidos: data.apellidos,
          direccion: data.direccion,
          departamento: data.departamento,
          municipio: data.municipio,
          email: data.email,
          telefono: data.telefono,
          contrasena: '',
          confirmarContrasena: ''
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos del usuario:', err);
        setError('No se pudo cargar la información del perfil');
        setLoading(false);
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
    
    // Validar contraseñas si se están actualizando
    if (formData.contrasena && formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Preparar datos para enviar al servidor
      const updateData = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        direccion: formData.direccion,
        departamento: formData.departamento,
        municipio: formData.municipio,
        email: formData.email,
        telefono: formData.telefono,
        estado: 1
      };
      
      // Solo incluir contraseña si se ha proporcionado una nueva
      if (formData.contrasena) {
        updateData.contrasena = formData.contrasena;
      }
      
      // Enviar datos al servidor usando fetch
      const response = await fetch(`http://localhost:8000/clientes/${formData.cedula}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar perfil');
      }
      
      const data = await response.json();
      console.log('Perfil actualizado:', data);
      
      setSuccess('¡Perfil actualizado con éxito!');
      
      // Limpiar campos de contraseña
      setFormData(prev => ({
        ...prev,
        contrasena: '',
        confirmarContrasena: ''
      }));
      
      // Redirigir después de un breve retraso
      setTimeout(() => {
        navigate('/perfil');
      }, 2000);
      
    } catch (err) {
      console.error('Error de actualización:', err);
      setError(err.message || 'Error al actualizar perfil. Intente nuevamente.');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Cargando datos del perfil...</div>;
  }

  return (
    <div className={styles.editarPerfilContainer}>
      <h2 className={styles.title}>Editar Perfil</h2>
      
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Cédula:</label>
          <input
            type="text"
            value={formData.cedula}
            className={styles.input}
            disabled
          />
          <span className={styles.helpText}>La cédula no se puede modificar</span>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nombres:</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Apellidos:</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Dirección:</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Departamento:</label>
            <input
              type="text"
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Municipio:</label>
            <input
              type="text"
              name="municipio"
              value={formData.municipio}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
        </div>
        
        <div className={styles.passwordSection}>
          <h3>Cambiar Contraseña (opcional)</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nueva Contraseña:</label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Confirmar Contraseña:</label>
              <input
                type="password"
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>
        </div>
        
        <div className={styles.buttonsContainer}>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={() => navigate('/perfil')}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.saveButton}>
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarPerfil;