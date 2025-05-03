import React, { useEffect, useState } from "react";

const ListarEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerEventos = async () => {
      try {
        const response = await fetch("http://localhost:8000/eventos/");
        if (!response.ok) {
          throw new Error("Error al obtener los eventos");
        }
        const data = await response.json();
        setEventos(data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      }
    };

    obtenerEventos();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Listado de Eventos</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {eventos.length === 0 ? (
        <p>No hay eventos disponibles.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
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
            {eventos.map((evento) => (
              <tr key={evento.id_evento}>
                <td>{evento.id_evento}</td>
                <td>{evento.nombre}</td>
                <td>{evento.descripcion}</td>
                <td>
                  <img
                    src={evento.foto_principal}
                    alt="Foto principal"
                    width="100"
                  />
                </td>
                <td>
                  <img
                    src={evento.foto_secundaria}
                    alt="Foto secundaria"
                    width="100"
                  />
                </td>
                <td>{evento.cedula_adm}</td>
                <td>{evento.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListarEventos;