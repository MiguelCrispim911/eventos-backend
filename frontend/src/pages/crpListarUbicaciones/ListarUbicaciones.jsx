import React, { useEffect, useState } from "react";
import "./ListarUbicaciones.css";

const ListarUbicaciones = () => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerUbicaciones = async () => {
      try {
        const response = await fetch("http://localhost:8000/ubicaciones/");
        if (!response.ok) {
          throw new Error("Error al obtener las ubicaciones");
        }
        const data = await response.json();
        setUbicaciones(data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      }
    };

    obtenerUbicaciones();
  }, []);

  const getEstadoClass = (estado) => {
    return estado === 1 ? 'activo' : 'inactivo';
  };

  return (
    <div className="ubicaciones-container">
      <h2 className="ubicaciones-title">Listado de Ubicaciones</h2>
      {error && <p className="ubicaciones-error">{error}</p>}
      {ubicaciones.length === 0 ? (
        <p className="ubicaciones-empty">No hay ubicaciones disponibles.</p>
      ) : (
        <div className="table-responsive">
          <table className="ubicaciones-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Persona Contacto</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Municipio</th>
                <th>Departamento</th>
                <th>Email</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {ubicaciones.map((ubicacion) => (
                <tr key={ubicacion.id_ubicacion}>
                  <td>{ubicacion.id_ubicacion}</td>
                  <td>{ubicacion.nombre}</td>
                  <td>{ubicacion.persona_contacto}</td>
                  <td>{ubicacion.telefono}</td>
                  <td>{ubicacion.direccion}</td>
                  <td>{ubicacion.nombre_municipio}</td>
                  <td>{ubicacion.nombre_departamento}</td>
                  <td>{ubicacion.email}</td>
                  <td>
                    <span className={`status-indicator ${getEstadoClass(ubicacion.estado)}`}></span>
                    {ubicacion.estado === 1 ? 'Activo' : 'Inactivo'}
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

export default ListarUbicaciones;