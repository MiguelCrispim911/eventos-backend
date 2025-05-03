import React, { useEffect, useState } from "react";

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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Listado de Funciones</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {funciones.length === 0 ? (
        <p>No hay funciones disponibles.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Hora de Inicio</th>
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
                <td>{funcion.fecha}</td>
                <td>{funcion.hora_inicio}</td>
                <td>{funcion.id_evento}</td>
                <td>{funcion.id_ubicacion}</td>
                <td>{funcion.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListarFunciones;