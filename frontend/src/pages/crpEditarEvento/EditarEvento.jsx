import React, { useState } from 'react';
import axios from 'axios';
import './EditarEvento.css';

const EditarEvento = () => {
  const [searchId, setSearchId] = useState('');
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    foto_principal: '',
    foto_secundaria: '',
    cedula_adm: '',
    estado: ''
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setEvent(null);
    setIsEditing(false);
    try {
      const response = await axios.get(`http://localhost:8000/eventos/${searchId}`);
      const eventData = response.data;
      setEvent(eventData);
      setFormData({
        nombre: eventData.nombre,
        descripcion: eventData.descripcion,
        foto_principal: eventData.foto_principal,
        foto_secundaria: eventData.foto_secundaria,
        cedula_adm: eventData.cedula_adm,
        estado: parseInt(eventData.estado)
      });
    } catch (error) {
      console.error("Error al buscar evento:", error);
      setError('Evento no encontrado');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "estado" ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await axios.patch(`http://localhost:8000/eventos/${searchId}`, formData);

      const response = await axios.get(`http://localhost:8000/eventos/${searchId}`);
      const updatedEvent = response.data;

      setEvent(updatedEvent);
      setFormData({
        nombre: updatedEvent.nombre,
        descripcion: updatedEvent.descripcion,
        foto_principal: updatedEvent.foto_principal,
        foto_secundaria: updatedEvent.foto_secundaria,
        cedula_adm: updatedEvent.cedula_adm,
        estado: parseInt(updatedEvent.estado)
      });

      setMessage('Evento actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar:', error);
      setError('Error al actualizar el evento');
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
    if (event) {
      setFormData({
        nombre: event.nombre,
        descripcion: event.descripcion,
        foto_principal: event.foto_principal,
        foto_secundaria: event.foto_secundaria,
        cedula_adm: event.cedula_adm,
        estado: parseInt(event.estado)
      });
    }
  };

  return (
    <div className="editar-evento-container">
      <h2>Buscar/Editar Evento</h2>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-group">
          <input
            type="text"
            placeholder="Ingrese ID del evento"
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

      {event && (
        <form onSubmit={handleSubmit} className="evento-form">
          <div className="form-group">
            <label>ID del Evento:</label>
            <input
              type="text"
              value={event.id_evento}
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
            />
          </div>

          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label>Foto Principal:</label>
            <input
              type="text"
              name="foto_principal"
              value={formData.foto_principal}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label>Foto Secundaria:</label>
            <input
              type="text"
              name="foto_secundaria"
              value={formData.foto_secundaria}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label>Cédula del Administrador:</label>
            <input
              type="text"
              name="cedula_adm"
              value={formData.cedula_adm}
              disabled
            />
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

export default EditarEvento;