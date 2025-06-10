import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditarAdministrador.css';

const EditarAdministrador = () => {
  const [searchCedula, setSearchCedula] = useState('');
  const [admin, setAdmin] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [currentDepartment, setCurrentDepartment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    cedula_adm: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    estado: '',
    id_municipio: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:8000/departamentos');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error al cargar departamentos:', error);
      setError('Error al cargar departamentos');
    }
  };

  const fetchMunicipalities = async (departmentId) => {
    try {
      const response = await axios.get(`http://localhost:8000/departamentos/${departmentId}/municipios`);
      setMunicipalities(response.data);
    } catch (error) {
      setError('Error al cargar municipios');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.nombres.length > 50) {
      newErrors.nombres = "El nombre no puede exceder los 50 caracteres";
    }

    if (formData.apellidos.length > 50) {
      newErrors.apellidos = "Los apellidos no pueden exceder los 50 caracteres";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.telefono.match(/^\d{10}$/)) {
      newErrors.telefono = "El teléfono debe tener 10 dígitos";
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
    setAdmin(null);
    setIsEditing(false);
    setErrors({});
    
    try {
      const response = await axios.get(`http://localhost:8000/administradores/${searchCedula}`);
      const adminData = response.data;
      setAdmin(adminData);

      const municipioResponse = await axios.get(`http://localhost:8000/municipios/${adminData.id_municipio}`);
      const municipioData = municipioResponse.data;

      setCurrentDepartment(municipioData.id_departamento);
      await fetchMunicipalities(municipioData.id_departamento);

      setFormData({
        cedula_adm: adminData.cedula_adm,
        nombres: adminData.nombres,
        apellidos: adminData.apellidos,
        email: adminData.email,
        telefono: adminData.telefono,
        estado: parseInt(adminData.estado),
        id_municipio: adminData.id_municipio
      });
    } catch (error) {
      console.error("Error al buscar administrador:", error);
      setError('Administrador no encontrado');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "estado" ? parseInt(value) : value
    }));
    
    // Limpiar error del campo que se está editando
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
      await axios.patch(`http://localhost:8000/administradores/${formData.cedula_adm}`, formData);

      const response = await axios.get(`http://localhost:8000/administradores/${formData.cedula_adm}`);
      const updatedAdmin = response.data;

      setAdmin(updatedAdmin);
      setFormData({
        cedula_adm: updatedAdmin.cedula_adm,
        nombres: updatedAdmin.nombres,
        apellidos: updatedAdmin.apellidos,
        email: updatedAdmin.email,
        telefono: updatedAdmin.telefono,
        estado: parseInt(updatedAdmin.estado),
        id_municipio: updatedAdmin.id_municipio
      });

      setMessage('Administrador actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar:', error);
      setError('Error al actualizar el administrador');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setMessage('');
    setErrors({});
    if (admin) {
      setFormData({
        cedula_adm: admin.cedula_adm,
        nombres: admin.nombres,
        apellidos: admin.apellidos,
        email: admin.email,
        telefono: admin.telefono,
        estado: parseInt(admin.estado),
        id_municipio: admin.id_municipio
      });

      const fetchOriginalData = async () => {
        try {
          const municipioResponse = await axios.get(`http://localhost:8000/municipios/${admin.id_municipio}`);
          const municipioData = municipioResponse.data;
          setCurrentDepartment(municipioData.id_departamento);
          await fetchMunicipalities(municipioData.id_departamento);
        } catch (error) {
          console.error('Error al restaurar datos:', error);
        }
      };
      fetchOriginalData();
    }
  };

  const handleDepartmentChange = (e) => {
    const { value } = e.target;
    setCurrentDepartment(value);
    setFormData(prev => ({
      ...prev,
      id_municipio: '', // Reset municipio when department changes
    }));

    if (value) {
      fetchMunicipalities(value);
    } else {
      setMunicipalities([]);
    }
  };

  return (
    <div className="editar-admin-container">
      <h3>Buscar/Editar Administrador</h3>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-group">
          <input
            type="text"
            placeholder="Ingrese cédula del administrador"
            value={searchCedula}
            onChange={(e) => setSearchCedula(e.target.value)}
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

      {admin && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Cédula:</label>
            <input
              type="text"
              name="cedula_adm"
              value={formData.cedula_adm}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Nombres:</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className={errors.nombres ? 'error' : ''}
              maxLength={50}
            />
            {errors.nombres && <span className="error-message">{errors.nombres}</span>}
          </div>

          <div className="form-group">
            <label>Apellidos:</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className={errors.apellidos ? 'error' : ''}
              maxLength={50}
            />
            {errors.apellidos && <span className="error-message">{errors.apellidos}</span>}
          </div>

          <div className="form-group">
            <label>Correo:</label>
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
            <label>Teléfono:</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className={errors.telefono ? 'error' : ''}
              maxLength={10}
            />
            {errors.telefono && <span className="error-message">{errors.telefono}</span>}
          </div>

          <div className="form-group">
            <label>Departamento:</label>
            <select
              name="departamento"
              value={currentDepartment}
              onChange={handleDepartmentChange}
              disabled={!isEditing}
              required
            >
              <option value="">Seleccione un departamento</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Municipio:</label>
            <select
              name="id_municipio"
              value={formData.id_municipio}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
              className={errors.id_municipio ? 'error' : ''}
            >
              <option value="">Seleccione un municipio</option>
              {municipalities.map(mun => (
                <option key={mun.id} value={mun.id}>{mun.nombre}</option>
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

export default EditarAdministrador;