import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ExplorarEventos.css";

const ExplorarEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // useEffect para obtener eventos desde la base de datos
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

  const seleccionarEvento = (evento) => {
    // Redirigir a la página de funciones con el ID del evento
    navigate(`/funciones/${evento.id_evento}`);
  };

  const siguienteEvento = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= eventos.length ? 0 : nextIndex;
    });
  };

  const anteriorEvento = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + eventos.length) % eventos.length
    );
  };

  return (
    <div className="eventos-container">
      {/* Mostrar el mensaje de error si existe */}
      {error && <div className="error-message">Error: {error}</div>}

      <h2 className="eventos-title">Listado de Eventos</h2>
      <div className="carousel">
        <button onClick={anteriorEvento} className="carousel-button left">
          &#8592;
        </button>
        <div className="eventos-grid">
          {eventos.length > 0 ? (
            Array.from({ length: 4 }).map((_, index) => {
              const eventoIndex = (currentIndex + index) % eventos.length;
              const evento = eventos[eventoIndex];
              return (
                <div
                  key={evento.id_evento}
                  className="evento-card"
                  onClick={() => seleccionarEvento(evento)}
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
                    <p className="evento-card-admin">
                      Cédula Adm: {evento.cedula_adm}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-eventos-message">No hay eventos disponibles.</p>
          )}
        </div>
        <button onClick={siguienteEvento} className="carousel-button right">
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default ExplorarEventos;
