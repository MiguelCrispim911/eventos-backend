import React, { useEffect, useState } from "react";
import "./ListarFunciones.css";

// Componente principal para listar funciones
const ListarFunciones = () => {
  // Estado para almacenar las funciones obtenidas del backend
  const [funciones, setFunciones] = useState([]);
  // Estado para manejar errores en la obtención de datos
  const [error, setError] = useState(null);

  // Hook useEffect para obtener las funciones al montar el componente
  useEffect(() => {
    const obtenerFunciones = async () => {
      try {
        // Petición al backend para obtener las funciones
        const response = await fetch("http://localhost:8000/funciones/");
        if (!response.ok) {
          throw new Error("Error al obtener las funciones");
        }
        const data = await response.json();
        setFunciones(data); // Guardar funciones en el estado
      } catch (err) {
        console.error("Error:", err);
        setError(err.message); // Guardar mensaje de error en el estado
      }
    };

    obtenerFunciones();
  }, []);

  // Función para asignar clase CSS según el estado de la función
  const getEstadoClass = (estado) => {
    return estado === 1 ? 'activo' : 'inactivo';
  };

  return (
    <div className="funciones-container">
      <h2 className="funciones-title">Listado de Funciones</h2>
      {/* Mostrar mensaje de error si existe */}
      {error && <p className="funciones-error">{error}</p>}
      {/* Mostrar mensaje si no hay funciones */}
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
              {/* Recorrer y mostrar cada función en una fila */}
              {funciones.map((funcion) => (
                <tr key={funcion.id_funcion}>
                  <td>{funcion.id_funcion}</td>
                  <td>{funcion.nombre}</td>
                  <td>{funcion.descripcion}</td>
                  {/* Formatear la fecha a formato local */}
                  <td>{new Date(funcion.fecha).toLocaleDateString()}</td>
                  <td>{funcion.hora_inicio}</td>
                  <td>{funcion.id_evento}</td>
                  <td>{funcion.id_ubicacion}</td>
                  <td>
                    {/* Indicador visual del estado */}
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