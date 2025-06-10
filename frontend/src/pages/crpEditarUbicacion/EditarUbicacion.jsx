import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditarUbicacion.css';

const EditarUbicacion = () => {
  const [searchId, setSearchId] = useState('');
  const [ubicacion, setUbicacion] = useState(null);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    persona_contacto: '',
    telefono: '',
    direccion: '',
    id_municipio: '',
    id_departamento: '',
    email: '',
    estado: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Cargar departamentos cuando el componente se monte
    const fetchDepartamentos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/departamentos/');
        setDepartamentos(response.data);
      } catch (error) {
        console.error('Error al cargar departamentos:', error);
        setError('Error al cargar departamentos');
      }
    };

    fetchDepartamentos();
  }, []);

  useEffect(() => {
    // Cargar municipios cuando cambie el departamento
    if (formData.id_departamento) {
      const fetchMunicipios = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/departamentos/${formData.id_departamento}/municipios`);
          setMunicipios(response.data);
        } catch (error) {
          console.error('Error al cargar municipios:', error);
          setError('Error al cargar municipios');
        }
      };

      fetchMunicipios();
    } else {
      setMunicipios([]);
    }
  }, [formData.id_departamento]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.nombre.length > 100) {
      newErrors.nombre = "El nombre no puede exceder los 100 caracteres";
    }

    if (formData.persona_contacto.length > 100) {
      newErrors.persona_contacto = "El nombre de contacto no puede exceder los 100 caracteres";
    }

    if (formData.telefono.length > 20) {
      newErrors.telefono = "El teléfono no puede exceder los 20 caracteres";
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Email no válido";
    }

    if (!formData.id_departamento) {
      newErrors.id_departamento = "Debe seleccionar un departamento";
    }

    if (!formData.id_municipio) {
      newErrors.id_municipio = "Debe seleccionar un municipio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setUbicacion(null);
    setIsEditing(false);
    try {
      const idUbicacion = parseInt(searchId);
      if (isNaN(idUbicacion)) {
        setError('El ID debe ser un número');
        return;
      }

      const response = await axios.get(`http://localhost:8000/ubicaciones/${idUbicacion}`);
      const ubicacionData = response.data;
      setUbicacion(ubicacionData);

      // Cargar el departamento y municipios correspondientes
      const municipioResponse = await axios.get(`http://localhost:8000/municipios/${ubicacionData.id_municipio}`);
      const municipioData = municipioResponse.data;

      // Actualizar el formulario con todos los datos
      setFormData({
        nombre: ubicacionData.nombre,
        persona_contacto: ubicacionData.persona_contacto,
        telefono: ubicacionData.telefono,
        direccion: ubicacionData.direccion,
        id_municipio: ubicacionData.id_municipio,
        id_departamento: municipioData.id_departamento,
        email: ubicacionData.email,
        estado: parseInt(ubicacionData.estado)
      });

      // Cargar los municipios del departamento
      const municipiosResponse = await axios.get(`http://localhost:8000/departamentos/${municipioData.id_departamento}/municipios`);
      setMunicipios(municipiosResponse.data);

    } catch (error) {
      console.error("Error al buscar ubicación:", error);
      setError('Ubicación no encontrada');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "estado" ? parseInt(value) : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      await axios.patch(`http://localhost:8000/ubicaciones/${searchId}`, formData);

      const response = await axios.get(`http://localhost:8000/ubicaciones/${searchId}`);
      const updatedUbicacion = response.data;

      setUbicacion(updatedUbicacion);
      setMessage('Ubicación actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar:', error);
      setError('Error al actualizar la ubicación');
    }
  };
  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    // No mostramos mensaje al entrar en modo edición
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage('');
    if (ubicacion) {
      setFormData({
        nombre: ubicacion.nombre,
        persona_contacto: ubicacion.persona_contacto,
        telefono: ubicacion.telefono,
        direccion: ubicacion.direccion,
        id_municipio: ubicacion.id_municipio,
        id_departamento: formData.id_departamento, // Mantener el departamento actual
        email: ubicacion.email,
        estado: parseInt(ubicacion.estado)
      });
    }
  };

  return (
    <div className="editar-ubicacion-container">
      <h2>Buscar/Editar Ubicación</h2>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-group">
          <input
            type="text"
            placeholder="Ingrese ID de la ubicación"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            required
          />
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i>
            Buscar
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      {ubicacion && (
        <form onSubmit={handleSubmit} className="ubicacion-form">
          <div className="form-group">
            <label>ID de la Ubicación:</label>
            <input
              type="text"
              value={ubicacion.id_ubicacion}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className={errors.nombre ? 'error' : ''}
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label>Persona de Contacto:</label>
            <input
              type="text"
              name="persona_contacto"
              value={formData.persona_contacto}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className={errors.persona_contacto ? 'error' : ''}
            />
            {errors.persona_contacto && <span className="error-message">{errors.persona_contacto}</span>}
          </div>

          <div className="form-group">
            <label>Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className={errors.telefono ? 'error' : ''}
            />
            {errors.telefono && <span className="error-message">{errors.telefono}</span>}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label>Departamento:</label>
            <select
              name="id_departamento"
              value={formData.id_departamento}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className={errors.id_departamento ? 'error' : ''}
            >
              <option value="">Seleccione un departamento</option>
              {departamentos.map((depto) => (
                <option key={depto.id} value={depto.id}>
                  {depto.nombre}
                </option>
              ))}
            </select>
            {errors.id_departamento && <span className="error-message">{errors.id_departamento}</span>}
          </div>

          <div className="form-group">
            <label>Municipio:</label>
            <select
              name="id_municipio"
              value={formData.id_municipio}
              onChange={handleInputChange}
              disabled={!isEditing || !formData.id_departamento}
              required
              className={errors.id_municipio ? 'error' : ''}
            >
              <option value="">Seleccione un municipio</option>
              {municipios.map((mun) => (
                <option key={mun.id} value={mun.id}>
                  {mun.nombre}
                </option>
              ))}
            </select>
            {errors.id_municipio && <span className="error-message">{errors.id_municipio}</span>}
          </div>

          <div className="form-group">
            <label>Estado:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="estado"
                  value="1"
                  checked={formData.estado === 1}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                Activo
              </label>
              <label>
                <input
                  type="radio"
                  name="estado"
                  value="0"
                  checked={formData.estado === 0}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                Inactivo
              </label>
            </div>
          </div>

          <div className="form-buttons">
            {!isEditing ? (
              <button type="button" onClick={handleEdit}>Editar</button>
            ) : (
              <>
                <button type="submit">Guardar</button>
                <button type="button" onClick={handleCancel}>Cancelar</button>
                <button type="button" onClick={() => setIsEditing(false)}>Finalizar edición</button>
              </>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default EditarUbicacion;