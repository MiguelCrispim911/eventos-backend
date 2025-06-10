import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditarTipoBoleta.css';

const EditarTipoBoleta = () => {
  const [searchId, setSearchId] = useState('');
  const [tipoBoleta, setTipoBoleta] = useState(null);
  const [funciones, setFunciones] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    localizacion: '',
    precio: '',
    descripcion: '',
    cupo_maximo: '',
    disponibles: '',
    id_funcion: '',
    estado: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchFunciones = async () => {
      try {
        const response = await axios.get("http://localhost:8000/funciones/");
        setFunciones(response.data);
      } catch (error) {
        console.error("Error al cargar funciones:", error);
        setError('Error al cargar la lista de funciones');
      }
    };

    fetchFunciones();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.nombre.length > 50) {
      newErrors.nombre = "El nombre no puede exceder los 50 caracteres";
    }

    if (formData.localizacion.length > 50) {
      newErrors.localizacion = "La localización no puede exceder los 50 caracteres";
    }

    if (formData.descripcion.length > 200) {
      newErrors.descripcion = "La descripción no puede exceder los 200 caracteres";
    }

    if (parseInt(formData.precio) <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
    }

    if (parseInt(formData.cupo_maximo) <= 0) {
      newErrors.cupo_maximo = "El cupo máximo debe ser mayor a 0";
    }

    if (!formData.id_funcion) {
      newErrors.id_funcion = "Debe seleccionar una función";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setTipoBoleta(null);
    setIsEditing(false);
    try {
      const idTipoBoleta = parseInt(searchId);
      if (isNaN(idTipoBoleta)) {
        setError('El ID debe ser un número');
        return;
      }

      const response = await axios.get(`http://localhost:8000/tiposboletas/${idTipoBoleta}`);
      const tipoBoletaData = response.data;
      setTipoBoleta(tipoBoletaData);
      setFormData({
        nombre: tipoBoletaData.nombre,
        localizacion: tipoBoletaData.localizacion,
        precio: tipoBoletaData.precio,
        descripcion: tipoBoletaData.descripcion,
        cupo_maximo: tipoBoletaData.cupo_maximo,
        disponibles: tipoBoletaData.disponibles,
        id_funcion: tipoBoletaData.id_funcion,
        estado: parseInt(tipoBoletaData.estado)
      });
    } catch (error) {
      console.error("Error al buscar tipo de boleta:", error);
      setError('Tipo de boleta no encontrado');
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
      const dataToUpdate = {
        ...formData,
        precio: parseInt(formData.precio),
        cupo_maximo: parseInt(formData.cupo_maximo),
        disponibles: parseInt(formData.disponibles),
        id_funcion: parseInt(formData.id_funcion),
        estado: parseInt(formData.estado)
      };

      await axios.patch(`http://localhost:8000/tiposboletas/${searchId}`, dataToUpdate);

      const response = await axios.get(`http://localhost:8000/tiposboletas/${searchId}`);
      const updatedTipoBoleta = response.data;

      setTipoBoleta(updatedTipoBoleta);
      setFormData({
        nombre: updatedTipoBoleta.nombre,
        localizacion: updatedTipoBoleta.localizacion,
        precio: updatedTipoBoleta.precio,
        descripcion: updatedTipoBoleta.descripcion,
        cupo_maximo: updatedTipoBoleta.cupo_maximo,
        disponibles: updatedTipoBoleta.disponibles,
        id_funcion: updatedTipoBoleta.id_funcion,
        estado: parseInt(updatedTipoBoleta.estado)
      });

      setMessage('Tipo de boleta actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar:', error);
      setError('Error al actualizar el tipo de boleta');
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
    if (tipoBoleta) {
      setFormData({
        nombre: tipoBoleta.nombre,
        localizacion: tipoBoleta.localizacion,
        precio: tipoBoleta.precio,
        descripcion: tipoBoleta.descripcion,
        cupo_maximo: tipoBoleta.cupo_maximo,
        disponibles: tipoBoleta.disponibles,
        id_funcion: tipoBoleta.id_funcion,
        estado: parseInt(tipoBoleta.estado)
      });
    }
  };

  return (
    <div className="editar-tipo-boleta-container">
      <h2>Buscar/Editar Tipo de Boleta</h2>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-group">
          <input
            type="text"
            placeholder="Ingrese ID del tipo de boleta"
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

      {tipoBoleta && (
        <form onSubmit={handleSubmit} className="tipo-boleta-form">
          <div className="form-group">
            <label>ID del Tipo de Boleta:</label>
            <input
              type="text"
              value={tipoBoleta.id_tipoboleta}
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
              maxLength={50}
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label>Localización:</label>
            <input
              type="text"
              name="localizacion"
              value={formData.localizacion}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className={errors.localizacion ? 'error' : ''}
              maxLength={50}
            />
            {errors.localizacion && <span className="error-message">{errors.localizacion}</span>}
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
              maxLength={200}
              rows={3}
            />
            {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
          </div>

          <div className="form-group">
            <label>Precio:</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className={errors.precio ? 'error' : ''}
              min="1"
            />
            {errors.precio && <span className="error-message">{errors.precio}</span>}
          </div>

          <div className="form-group">
            <label>Cupo Máximo:</label>
            <input
              type="number"
              name="cupo_maximo"
              value={formData.cupo_maximo}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className={errors.cupo_maximo ? 'error' : ''}
              min="1"
            />
            {errors.cupo_maximo && <span className="error-message">{errors.cupo_maximo}</span>}
          </div>

          <div className="form-group">
            <label>Disponibles:</label>
            <input
              type="number"
              name="disponibles"
              value={formData.disponibles}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              min="0"
              max={formData.cupo_maximo}
            />
          </div>

          <div className="form-group">
            <label>Función:</label>
            <select
              name="id_funcion"
              value={formData.id_funcion}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className={errors.id_funcion ? 'error' : ''}
            >
              <option value="">Seleccione una función</option>
              {funciones.map((funcion) => (
                <option key={funcion.id_funcion} value={funcion.id_funcion}>
                  {funcion.id_funcion} - {funcion.nombre}
                </option>
              ))}
            </select>
            {errors.id_funcion && <span className="error-message">{errors.id_funcion}</span>}
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

export default EditarTipoBoleta;