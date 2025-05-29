import React, { useEffect, useState } from "react";
import "./ListarEventos.css";

// Componente principal para listar eventos
const ListarEventos = () => {
  // Estado para almacenar los eventos
  const [eventos, setEventos] = useState([]);
  // Estado para manejar errores
  const [error, setError] = useState(null);

  // useEffect para obtener los eventos al montar el componente
  useEffect(() => {
    const obtenerEventos = async () => {
      try {
        // Petición a la API para obtener los eventos
        const response = await fetch("http://localhost:8000/eventos/");
        if (!response.ok) {
          throw new Error("Error al obtener los eventos");
        }
        const data = await response.json();
        setEventos(data); // Guardar eventos en el estado
      } catch (err) {
        console.error("Error:", err);
        setError(err.message); // Guardar mensaje de error
      }
    };

    obtenerEventos();
  }, []);

  // Función para asignar clase según el estado del evento
  const getEstadoClass = (estado) => {
    return estado === 1 ? 'activo' : 'inactivo';
  };

  return (
    <div className="eventos-container">
      <h2 className="eventos-title">Listado de Eventos</h2>
      {/* Mostrar error si existe */}
      {error && <p className="eventos-error">{error}</p>}
      {/* Mostrar mensaje si no hay eventos */}
      {eventos.length === 0 ? (
        <p className="eventos-empty">No hay eventos disponibles.</p>
      ) : (
        <div className="table-responsive">
          <table className="eventos-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Foto Principal</th>
                <th>Foto Secundaria</th>
                <th>Cédula Adm</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {/* Mapear y mostrar cada evento en una fila */}
              {eventos.map((evento) => (
                <tr key={evento.id_evento}>
                  <td>{evento.id_evento}</td>
                  <td>{evento.nombre}</td>
                  <td>{evento.descripcion}</td>
                  <td>
                    <img
                      src={evento.foto_principal}
                      alt="Foto principal"
                      className="evento-img"
                    />
                  </td>
                  <td>
                    <img
                      src={evento.foto_secundaria}
                      alt="Foto secundaria"
                      className="evento-img"
                    />
                  </td>
                  <td>{evento.cedula_adm}</td>
                  <td>
                    {/* Indicador visual del estado */}
                    <span className={`status-indicator ${getEstadoClass(evento.estado)}`}></span>
                    {evento.estado === 1 ? 'Activo' : 'Inactivo'}
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

export default ListarEventos;