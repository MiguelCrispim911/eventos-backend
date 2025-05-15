/* Estilos para la página de Explorar Eventos */
import React, { useState, useEffect } from "react";
import "./ExplorarEventos.css";

const ExplorarEventos = () => {
  const [eventos, setEventos] = useState([]);// Estado para almacenar los eventos
  const [currentIndex, setCurrentIndex] = useState(0);// Estado para el índice actual del carrusel
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);// Estado para almacenar el evento seleccionado
  const [error, setError] = useState(null);// Estado para manejar errores

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

  const seleccionarEvento = (evento) => {// Seleccionar un evento para mostrar su detalle
    setEventoSeleccionado(evento);
  };

  const cerrarDetalle = () => {// Cerrar el detalle del evento
    setEventoSeleccionado(null);
  };

  const siguienteEvento = () => {// Cambiar a la siguiente tarjeta
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= eventos.length ? 0 : nextIndex;
    });
  };

  const anteriorEvento = () => { // Cambiar a la tarjeta anterior
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + eventos.length) % eventos.length
    );
  };

  return (// Componente principal
    <div className="eventos-container">
      {/* Mostrar el mensaje de error si existe */}
      {error && <div className="error-message">Error: {error}</div>}

      {eventoSeleccionado && (
        <div className="evento-detalle">
          <div className="detalle-contenido">
            <img
              src={eventoSeleccionado.foto_principal}
              alt={eventoSeleccionado.nombre}
              className="detalle-img"
            />
            <h3>{eventoSeleccionado.nombre}</h3>
            <p>{eventoSeleccionado.descripcion}</p>
            <p>
              Estado:{" "}
              <span
                className={`evento-status ${
                  eventoSeleccionado.estado === 1 ? "activo" : "inactivo"
                }`}
              >
                {eventoSeleccionado.estado === 1 ? "Activo" : "Inactivo"}
              </span>
            </p>
            <div className="detalle-botones">
              <button className="boton-comprar">Comprar Entrada</button>
              <button className="boton-cerrar" onClick={cerrarDetalle}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
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
