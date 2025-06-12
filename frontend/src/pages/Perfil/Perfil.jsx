import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Perfil.module.css';
import { jwtDecode } from 'jwt-decode';

const Perfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
        setUserData(data);
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

  if (loading) {
    return <div className="loading">Cargando datos del perfil...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!userData) {
    return <div className="error">No se encontraron datos del usuario</div>;
  }

  return (
    <div className={styles.perfilContainer}>
      <h2>Mi Perfil</h2>

      <div className={styles.perfilInfo}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Cédula:</span>
          <span className={styles.value}>{userData.cedula}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Nombres:</span>
          <span className={styles.value}>{userData.nombres}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Apellidos:</span>
          <span className={styles.value}>{userData.apellidos}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Email:</span>
          <span className={styles.value}>{userData.email}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Teléfono:</span>
          <span className={styles.value}>{userData.telefono}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Dirección:</span>
          <span className={styles.value}>{userData.direccion}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Departamento:</span>
          <span className={styles.value}>{userData.departamento}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Municipio:</span>
          <span className={styles.value}>{userData.municipio}</span>
        </div>
      </div>

      <div className={styles.buttonsContainer}>
        <button
          className={styles.editButton}
          onClick={() => navigate('/editar-perfil')}
        >
          Editar Perfil
        </button>
        <button
          className={styles.passwordButton}
          onClick={() => navigate('/cambiar-contrasena')}
        >
          Cambiar Contraseña
        </button>
      </div>
    </div>
  );
};

export default Perfil;
