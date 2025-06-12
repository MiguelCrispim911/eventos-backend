import React, { useEffect, useState } from "react";
import "./ListarTipoBoleta.css";

// Componente principal para listar los tipos de boleta
const ListarTipoBoleta = () => {
  // Estado para almacenar las boletas obtenidas
  const [boletas, setBoletas] = useState([]);
  // Estado para manejar errores en la obtención de datos
  const [error, setError] = useState(null);

  // useEffect para obtener los datos al montar el componente
  useEffect(() => {
    // Función asíncrona para obtener los tipos de boleta desde la API
    const obtenerBoletas = async () => {
      try {
        const response = await fetch("http://localhost:8000/tiposboletas/");
        if (!response.ok) {
          throw new Error("Error al obtener los tipos de boleta");
        }
        const data = await response.json();
        setBoletas(data); // Guardar los datos en el estado
      } catch (err) {
        console.error("Error:", err);
        setError(err.message); // Guardar el mensaje de error en el estado
      }
    };

    obtenerBoletas(); // Llamar a la función al montar el componente
  }, []);

  return (
    <div className="boletas-container">
      <h2 className="boletas-title">Listado de Tipos de Boleta</h2>
      {/* Mostrar mensaje de error si existe */}
      {error && <p className="boletas-error">{error}</p>}
      {/* Mostrar mensaje si no hay boletas */}
      {boletas.length === 0 ? (
        <p className="boletas-empty">No hay tipos de boleta disponibles.</p>
      ) : (
        // Tabla para mostrar los tipos de boleta
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
              {/* Mapear cada boleta a una fila de la tabla */}
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