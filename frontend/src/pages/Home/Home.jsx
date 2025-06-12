import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CardEvento from "../../components/CardEvento/CardEvento";
import "./Home.css";

//Componente principal de la página de inicio. Muestra la sección hero y un carrusel de eventos destacados.

const Home = () => {
  const [eventos, setEventos] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Estado para controlar el índice del primer evento mostrado en el carrusel
  const eventsPerPage = 3; // Número de eventos a mostrar a la vez
  
  // Función para ir al siguiente grupo de eventos
  const nextEvents = () => {
    if (currentIndex + eventsPerPage < eventos.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  // Función para ir al grupo anterior de eventos
  const prevEvents = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  // Calcular eventos visibles actualmente
  const visibleEvents = eventos.slice(
    currentIndex, 
    currentIndex + eventsPerPage
  );
  
  // Verificar si hay eventos anteriores o siguientes
  const hasPrevEvents = currentIndex > 0;
  const hasNextEvents = currentIndex + eventsPerPage < eventos.length;

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
        setError(err.message);
      }
    };
    obtenerEventos();
  }, []);


  //seccion hero que correponde a la seccion de bienvenida con fondo azul degradado, nos presentra al usuario botones para poder explorar y buscar eventos
  // esta seccion permite navegar entre grupos de eventos destacados mediante botones y puntos indicadores, 
  return ( 
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="badge">🎟️ ¡La mejor plataforma de eventos!</span>
          <h2>
            Vive momentos <span className="highlight">inolvidables</span> en los mejores{" "}
            <span className="highlight-2">eventos</span>
          </h2>
          <p>Encuentra y compra boletos para festivales, conciertos y mucho más. ¡No te pierdas ni un solo momento!</p>
          <div className="buttons">
            <Link to="/eventos" className="explore">🎫 Explorar eventos</Link>
            <Link to="/buscar" className="search">🔍 Buscar eventos</Link>
          </div>
        </div>
        
        <div className="hero-featured-events">
          <div className="container">
            <h2 className="home-featured-title">Eventos Destacados</h2>
            
            <div className="events-carousel">
              {hasPrevEvents && (
                <button 
                  className="carousel-arrow carousel-arrow-prev" 
                  onClick={prevEvents}
                  aria-label="Ver eventos anteriores"
                >
                  &#10094;
                </button>
              )}
              
              <div className="events-grid">
                {visibleEvents.map(evento => (
                  <CardEvento
                    key={evento.id_evento}
                    id={evento.id_evento}
                    nombre={evento.nombre}
                    descripcion={evento.descripcion}
                    imagen={evento.foto_principal}
                    estado={evento.estado}
                  />
                ))}
              </div>
              
              {hasNextEvents && (
                <button 
                  className="carousel-arrow carousel-arrow-next" 
                  onClick={nextEvents}
                  aria-label="Ver más eventos"
                >
                  &#10095;
                </button>
              )}
            </div>
            
            <div className="carousel-dots">
              {Array.from({ length: Math.ceil(eventos.length / eventsPerPage) }).map((_, index) => (
                <span 
                  key={index} 
                  className={`carousel-dot ${index === Math.floor(currentIndex / eventsPerPage) ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index * eventsPerPage)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
