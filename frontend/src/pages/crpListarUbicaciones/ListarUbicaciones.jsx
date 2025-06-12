import React, { useEffect, useState } from "react";
import "./ListarUbicaciones.css";

// Componente principal para listar ubicaciones
const ListarUbicaciones = () => {
  // Estado para almacenar las ubicaciones obtenidas del backend
  const [ubicaciones, setUbicaciones] = useState([]);
  // Estado para manejar errores en la obtención de datos
  const [error, setError] = useState(null);

  // useEffect para obtener las ubicaciones al montar el componente
  useEffect(() => {
    const obtenerUbicaciones = async () => {
      try {
        // Llama a la API para obtener las ubicaciones
        const response = await fetch("http://localhost:8000/ubicaciones/");
        if (!response.ok) {
          // Si la respuesta no es exitosa, lanza un error
          throw new Error("Error al obtener las ubicaciones");
        }
        // Convierte la respuesta a JSON y actualiza el estado
        const data = await response.json();
        setUbicaciones(data);
      } catch (err) {
        // Maneja errores y los guarda en el estado
        console.error("Error:", err);
        setError(err.message);
      }
    };

    // Llama a la función para obtener ubicaciones
    obtenerUbicaciones();
  }, []);

  // Función auxiliar para asignar clases según el estado (activo/inactivo)
  const getEstadoClass = (estado) => {
    return estado === 1 ? 'activo' : 'inactivo';
  };

  return (
    <div className="ubicaciones-container">
      <h2 className="ubicaciones-title">Listado de Ubicaciones</h2>
      {/* Muestra un mensaje de error si existe */}
      {error && <p className="ubicaciones-error">{error}</p>}
      {/* Si no hay ubicaciones, muestra un mensaje */}
      {ubicaciones.length === 0 ? (
        <p className="ubicaciones-empty">No hay ubicaciones disponibles.</p>
      ) : (
        // Tabla para mostrar las ubicaciones
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
              {/* Mapea cada ubicación a una fila de la tabla */}
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
                    {/* Indicador visual del estado */}
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