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
  const [formData, setFormData] = useState({
    cedula_adm: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    estado: '',
    id_municipio: ''
  });
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setAdmin(null);
    setIsEditing(false);
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

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setCurrentDepartment(departmentId);
    setFormData(prev => ({
      ...prev,
      id_municipio: ''
    }));
    fetchMunicipalities(departmentId);
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

      // Salir del modo edición después de guardar exitosamente
      setIsEditing(false);
      // Mostrar mensaje de éxito solo después de una actualización exitosa
      setMessage('Administrador actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar:', error);
      setError('Error al actualizar el administrador');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    // Forzar limpieza completa del mensaje
    setMessage('');
    setTimeout(() => setMessage(''), 0);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    // Forzar limpieza completa del mensaje
    setMessage('');
    setTimeout(() => setMessage(''), 0);
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

  const handleFinishEditing = () => {
    setIsEditing(false);
    setError('');
    // Forzar limpieza completa del mensaje
    setMessage('');
    setTimeout(() => setMessage(''), 0);
  };

  return (
    <div className="editar-admin-container">
      <h2>Buscar/Editar Administrador</h2>
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
      {message && !isEditing && <div className="success-message">{message}</div>}

      {admin && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Cédula:</label>
            <input type="text" name="cedula_adm" value={formData.cedula_adm} disabled />
          </div>

          <div className="form-group">
            <label>Nombres:</label>
            <input type="text" name="nombres" value={formData.nombres} onChange={handleInputChange} disabled={!isEditing} required />
          </div>

          <div className="form-group">
            <label>Apellidos:</label>
            <input type="text" name="apellidos" value={formData.apellidos} onChange={handleInputChange} disabled={!isEditing} required />
          </div>

          <div className="form-group">
            <label>Correo:</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} required />
          </div>

          <div className="form-group">
            <label>Teléfono:</label>
            <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} disabled={!isEditing} required />
          </div>

          <div className="form-group">
            <label>Departamento:</label>
            <select name="departamento" value={currentDepartment} onChange={handleDepartmentChange} disabled={!isEditing} required>
              <option value="">Seleccione un departamento</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Municipio:</label>
            <select name="id_municipio" value={formData.id_municipio} onChange={handleInputChange} disabled={!isEditing} required>
              <option value="">Seleccione un municipio</option>
              {municipalities.map(mun => (
                <option key={mun.id} value={mun.id}>{mun.nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Estado:</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="estado" value="1" checked={formData.estado === 1} onChange={handleInputChange} disabled={!isEditing} />
                Activo
              </label>
              <label>
                <input type="radio" name="estado" value="0" checked={formData.estado === 0} onChange={handleInputChange} disabled={!isEditing} />
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
                <button type="button" onClick={handleFinishEditing}>Finalizar edición</button>
              </>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default EditarAdministrador;