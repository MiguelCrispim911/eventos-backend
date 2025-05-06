import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clienteService from '../../services/clienteService';
import styles from './Perfil.module.css';

const Perfil = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  
  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    
    const fetchUserData = async () => {
      try {
        // Intentar obtener los datos más recientes del usuario
        const response = await clienteService.get('/clientes/me');
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos del usuario:', err);
        // Si falla, usar los datos que ya tenemos en el contexto
        setUserData(user);
        setError('');  // Limpiar error ya que usamos datos de respaldo
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [isAuthenticated, user, navigate]);
  
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
      
      <button 
        className={styles.editButton}
        onClick={() => navigate('/editar-perfil')}
      >
        Editar Perfil
      </button>
    </div>
  );
};

export default Perfil;





