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
    confirmarContrasena: '' // Solo mantenemos un campo para confirmar la contraseña actual
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
          confirmarContrasena: '' // Inicializar vacío
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
    
    // Validar que se haya proporcionado la contraseña para confirmar
    if (!formData.confirmarContrasena) {
      setError('Debe ingresar su contraseña actual para confirmar los cambios');
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Primero verificar la contraseña actual
      const verifyResponse = await fetch('http://localhost:8000/clientes/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cedula: formData.cedula,
          password: formData.confirmarContrasena
        }),
      });
      
      if (!verifyResponse.ok) {
        setError('Contraseña incorrecta. No se pueden guardar los cambios.');
        return;
      }
      
      // Si la contraseña es correcta, proceder con la actualización
      // IMPORTANTE: No incluimos la contraseña en los datos de actualización
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
      
      console.log('Datos a enviar:', updateData);
      
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
        console.error('Error del servidor:', errorData);
        
        if (errorData.detail) {
          throw new Error(errorData.detail);
        } else if (typeof errorData === 'object') {
          // Si es un objeto de validación de Pydantic, mostrar el primer error
          const firstError = Object.values(errorData)[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            throw new Error(firstError[0].msg || 'Error de validación');
          }
        }
        
        throw new Error('Error al actualizar perfil');
      }
      
      const data = await response.json();
      console.log('Perfil actualizado:', data);
      
      setSuccess('¡Perfil actualizado con éxito!');
      
      // Limpiar campo de contraseña
      setFormData(prev => ({
        ...prev,
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
          <h3>Confirmar cambios</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Ingrese su contraseña actual:</label>
            <input
              type="password"
              name="confirmarContrasena"
              value={formData.confirmarContrasena}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Ingrese su contraseña para confirmar los cambios"
            />
            <span className={styles.helpText}>Debe ingresar su contraseña actual para guardar los cambios</span>
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



