import React, { useEffect, useState } from "react";
import "./ListarTipoBoleta.css";

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
    <div className="boletas-container">
      <h2 className="boletas-title">Listado de Tipos de Boleta</h2>
      {error && <p className="boletas-error">{error}</p>}
      {boletas.length === 0 ? (
        <p className="boletas-empty">No hay tipos de boleta disponibles.</p>
      ) : (
        <div className="table-responsive">
          <table className="boletas-table">
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
                  <td>${boleta.precio.toLocaleString()}</td>
                  <td>{boleta.cupo_maximo}</td>
                  <td>{boleta.disponibles}</td>
                  <td>{boleta.id_funcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListarTipoBoleta;