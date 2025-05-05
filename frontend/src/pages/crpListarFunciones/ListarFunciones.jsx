import React, { useEffect, useState } from "react";
import "./ListarFunciones.css";

const ListarFunciones = () => {
  const [funciones, setFunciones] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerFunciones = async () => {
      try {
        const response = await fetch("http://localhost:8000/funciones/");
        if (!response.ok) {
          throw new Error("Error al obtener las funciones");
        }
        const data = await response.json();
        setFunciones(data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      }
    };

    obtenerFunciones();
  }, []);

  const getEstadoClass = (estado) => {
    return estado === 1 ? 'activo' : 'inactivo';
  };

  return (
    <div className="funciones-container">
      <h2 className="funciones-title">Listado de Funciones</h2>
      {error && <p className="funciones-error">{error}</p>}
      {funciones.length === 0 ? (
        <p className="funciones-empty">No hay funciones disponibles.</p>
      ) : (
        <div className="table-responsive">
          <table className="funciones-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Hora Inicio</th>
                <th>ID Evento</th>
                <th>ID Ubicación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {funciones.map((funcion) => (
                <tr key={funcion.id_funcion}>
                  <td>{funcion.id_funcion}</td>
                  <td>{funcion.nombre}</td>
                  <td>{funcion.descripcion}</td>
                  <td>{new Date(funcion.fecha).toLocaleDateString()}</td>
                  <td>{funcion.hora_inicio}</td>
                  <td>{funcion.id_evento}</td>
                  <td>{funcion.id_ubicacion}</td>
                  <td>
                    <span className={`status-indicator ${getEstadoClass(funcion.estado)}`}></span>
                    {funcion.estado === 1 ? 'Activo' : 'Inactivo'}
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

export default ListarFunciones;