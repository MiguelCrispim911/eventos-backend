import React, { useEffect, useState } from "react";
import "./ListarAdministradores.css";

const ListarAdministradores = () => {
  const [administradores, setAdministradores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerAdministradores = async () => {
      try {
        const response = await fetch("http://localhost:8000/administradores/");
        if (!response.ok) {
          throw new Error("Error al obtener los administradores");
        }
        const data = await response.json();
        setAdministradores(data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      }
    };

    obtenerAdministradores();
  }, []);

  const getEstadoClass = (estado) => {
    return estado === 1 ? 'activo' : 'inactivo';
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Listado de Administradores</h2>
      
      {error && <p className="admin-error">{error}</p>}
      
      {administradores.length === 0 ? (
        <p className="admin-empty">No hay administradores disponibles.</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cédula</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Municipio</th>
                <th>Departamento</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {administradores.map((admin) => (
                <tr key={admin.cedula_adm}>
                  <td>{admin.cedula_adm}</td>
                  <td>{admin.nombres}</td>
                  <td>{admin.apellidos}</td>
                  <td>{admin.municipio}</td>
                  <td>{admin.departamento}</td>
                  <td>{admin.email}</td>
                  <td>{admin.telefono}</td>
                  <td>
                    <span className={`status-indicator ${getEstadoClass(admin.estado)}`}></span>
                    {admin.estado === 1 ? 'Activo' : 'Inactivo'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListarAdministradores;