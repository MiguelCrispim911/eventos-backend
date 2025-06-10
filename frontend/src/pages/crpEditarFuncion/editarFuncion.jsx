import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditarFuncion.css';

const EditarFuncion = () => {
  const [searchId, setSearchId] = useState('');
  const [funcion, setFuncion] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha: '',
    hora_inicio: '',
    id_evento: '',
    id_ubicacion: '',
    estado: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Cargar eventos y ubicaciones cuando el componente se monte
    const fetchData = async () => {
      try {
        // Cargar eventos
        const eventosRes = await axios.get("http://localhost:8000/eventos/");
        setEventos(eventosRes.data);

        // Cargar ubicaciones
        const ubicacionesRes = await axios.get("http://localhost:8000/ubicaciones/");
        setUbicaciones(ubicacionesRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError('Error al cargar eventos o ubicaciones');
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.nombre.length > 50) {
      newErrors.nombre = "El nombre no puede exceder los 50 caracteres";
    }
    
    if (formData.descripcion.length > 250) {
      newErrors.descripcion = "La descripción no puede exceder los 250 caracteres";
    }

    if (!formData.id_evento) {
      newErrors.id_evento = "Debe seleccionar un evento";
    }

    if (!formData.id_ubicacion) {
      newErrors.id_ubicacion = "Debe seleccionar una ubicación";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  
    const handleSearch = async (e) => {
    console.log("✅ Entrando a handleSearch"); // ✅ TEST
    e.preventDefault();
    setError('');
    setMessage('');
    setFuncion(null);
    setIsEditing(false);

    try {
        const idFuncion = parseInt(searchId);
        console.log("✅ ID recibido:", searchId); // ✅ TEST
        if (isNaN(idFuncion)) {
        console.log("❌ El ID no es un número"); // ✅ TEST
        setError('El ID debe ser un número');
        return;
        }

        const url = `http://localhost:8000/funciones/${idFuncion}`;
        console.log('🔍 Haciendo solicitud GET a:', url); // ✅ TEST
        const response = await axios.get(url);

        console.log('✅ Respuesta recibida:', response.data); // ✅ TEST
        const funcionData = response.data;

        setFuncion(funcionData);
        setFormData({
        nombre: funcionData.nombre,
        descripcion: funcionData.descripcion,
        fecha: funcionData.fecha,
        hora_inicio: funcionData.hora_inicio,
        id_evento: funcionData.id_evento,
        id_ubicacion: funcionData.id_ubicacion,
        estado: parseInt(funcionData.estado)
        });

    } catch (error) {
        console.error("❌ Error al buscar función:", error); // ✅ TEST
        if (error.response) {
        console.log("🛑 Respuesta del servidor:", error.response.data); // ✅ TEST
        }
        setError('Función no encontrada');
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
    console.log("Entrando a handleSearch"); // <--- Test apra verificar si entra!!!
    e.preventDefault();
    console.log("Entrando a handleSearch"); // <--- Test apra verificar si entra!!!
    setMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      await axios.patch(`http://localhost:8000/funciones/${searchId}`, formData);

      const response = await axios.get(`http://localhost:8000/funciones/${searchId}`);
      const updatedFuncion = response.data;

      setFuncion(updatedFuncion);
      setFormData({
        nombre: updatedFuncion.nombre,
        descripcion: updatedFuncion.descripcion,
        fecha: updatedFuncion.fecha,
        hora_inicio: updatedFuncion.hora_inicio,
        id_evento: updatedFuncion.id_evento,
        id_ubicacion: updatedFuncion.id_ubicacion,
        estado: parseInt(updatedFuncion.estado)
      });

      setMessage('Función actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar:', error);
      setError('Error al actualizar la función');
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
    if (funcion) {
      setFormData({
        nombre: funcion.nombre,
        descripcion: funcion.descripcion,
        fecha: funcion.fecha,
        hora_inicio: funcion.hora_inicio,
        id_evento: funcion.id_evento,
        id_ubicacion: funcion.id_ubicacion,
        estado: parseInt(funcion.estado)
      });
    }
  };

  return (
    <div className="editar-funcion-container">
      <h2>Buscar/Editar Función</h2>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-group">
          <input
            type="text"
            placeholder="Ingrese ID de la función"
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

      {funcion && (
        <form onSubmit={handleSubmit} className="funcion-form">
          <div className="form-group">
            <label>ID de la Función:</label>
            <input
              type="text"
              value={funcion.id_funcion}
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
            <label>Descripción:</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className={errors.descripcion ? 'error' : ''}
            />
            {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
          </div>

          <div className="form-group">
            <label>Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label>Hora de Inicio:</label>
            <input
              type="time"
              name="hora_inicio"
              value={formData.hora_inicio}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label>Evento:</label>
            <select
              name="id_evento"
              value={formData.id_evento}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className={errors.id_evento ? 'error' : ''}
            >
              <option value="">Seleccione un evento</option>
              {eventos.map((evento) => (
                <option key={evento.id_evento} value={evento.id_evento}>
                  {evento.id_evento} - {evento.nombre}
                </option>
              ))}
            </select>
            {errors.id_evento && <span className="error-message">{errors.id_evento}</span>}
          </div>

          <div className="form-group">
            <label>Ubicación:</label>
            <select
              name="id_ubicacion"
              value={formData.id_ubicacion}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className={errors.id_ubicacion ? 'error' : ''}
            >
              <option value="">Seleccione una ubicación</option>
              {ubicaciones.map((ubicacion) => (
                <option key={ubicacion.id_ubicacion} value={ubicacion.id_ubicacion}>
                  {ubicacion.id_ubicacion} - {ubicacion.nombre}
                </option>
              ))}
            </select>
            {errors.id_ubicacion && <span className="error-message">{errors.id_ubicacion}</span>}
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

export default EditarFuncion;