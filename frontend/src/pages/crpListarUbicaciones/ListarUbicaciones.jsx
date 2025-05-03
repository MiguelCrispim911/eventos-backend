import React, { useEffect, useState } from "react";

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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Listado de Ubicaciones</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {ubicaciones.length === 0 ? (
        <p>No hay ubicaciones disponibles.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
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
                <td>{ubicacion.municipio}</td>
                <td>{ubicacion.departamento}</td>
                <td>{ubicacion.email}</td>
                <td>{ubicacion.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListarUbicaciones;