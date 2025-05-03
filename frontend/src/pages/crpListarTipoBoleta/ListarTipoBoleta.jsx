import React, { useEffect, useState } from "react";

const ListarTipoBoleta = () => {
  const [boletas, setBoletas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerBoletas = async () => {
      try {
        const response = await fetch("http://localhost:8000/tiposboletas/");
        if (!response.ok) {
          throw new Error("Error al obtener los tipos de boleta");
        }
        const data = await response.json();
        setBoletas(data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      }
    };

    obtenerBoletas();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Listado de Tipos de Boleta</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {boletas.length === 0 ? (
        <p>No hay tipos de boleta disponibles.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Localización</th>
              <th>Precio</th>
              <th>Cupo Máximo</th>
              <th>Disponibles</th>
              <th>ID Función</th>
            </tr>
          </thead>
          <tbody>
            {boletas.map((boleta) => (
              <tr key={boleta.id_tipoboleta}>
                <td>{boleta.id_tipoboleta}</td>
                <td>{boleta.nombre}</td>
                <td>{boleta.localizacion}</td>
                <td>{boleta.precio}</td>
                <td>{boleta.cupo_maximo}</td>
                <td>{boleta.disponibles}</td>
                <td>{boleta.id_funcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListarTipoBoleta;