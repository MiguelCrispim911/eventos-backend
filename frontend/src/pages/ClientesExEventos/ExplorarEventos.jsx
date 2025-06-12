/* Estilos para la página de Explorar Eventos */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ExplorarEventos.css";

const ExplorarEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const eventosPorPagina = 8;

  useEffect(() => { // Función para obtener eventos cargandolos desde la API
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

  const siguienteEvento = () => {
    if (currentIndex + eventosPorPagina < eventos.length) {
      setCurrentIndex(currentIndex + eventosPorPagina);
    }
  };

  const anteriorEvento = () => {
    if (currentIndex - eventosPorPagina >= 0) {
      setCurrentIndex(currentIndex - eventosPorPagina);
    }
  };

  return (// Componente principal
    <div className="eventos-container">
      {/* Mostrar el mensaje de error si existe */}
      {error && <div className="error-message">Error: {error}</div>}

      <h2 className="eventos-title">Eventos</h2>
      <div className="carousel">
        <button
          onClick={anteriorEvento}
          className="carousel-button left"
          disabled={currentIndex === 0}
        >
          &#8592;
        </button>
        <div className="eventos-grid">
          {eventos.length > 0 ? (
            eventos
              .slice(currentIndex, currentIndex + eventosPorPagina)
              .map((evento) => (
                <div
                  key={evento.id_evento}
                  className="evento-card"
                >
                  <div className="evento-card-header">
                    <img
                      src={evento.foto_principal}
                      alt={evento.nombre}
                      className="evento-card-img"
                    />
                    <span
                      className={`evento-status ${
                        evento.estado === 1 ? "activo" : "inactivo"
                      }`}
                    >
                      {evento.estado === 1 ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className="evento-card-body">
                    <h3 className="evento-card-title">{evento.nombre}</h3>
                    <p className="evento-card-description">
                      {evento.descripcion}
                    </p>
                    <button
                      className={`btn-comprar-boletos${
                        evento.estado !== 1 ? " btn-comprar-boletos--disabled" : ""
                      }`}
                      onClick={() => navigate(`/funciones/${evento.id_evento}`)}
                      disabled={evento.estado !== 1}
                    >
                      {evento.estado === 1 ? "Comprar boletos" : "No disponible"}
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <p className="no-eventos-message">No hay eventos disponibles.</p>
          )}
        </div>
        <button
          onClick={siguienteEvento}
          className="carousel-button right"
          disabled={currentIndex + eventosPorPagina >= eventos.length}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}; 

export default ExplorarEventos;
