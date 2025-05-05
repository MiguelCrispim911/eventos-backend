import React, { useState } from "react";
import { Link } from "react-router-dom";
import CardEvento from "../components/CardEvento";
import "../pages/Home.css";


// Datos de ejemplo para eventos destacados
const eventosDestacados = [
  {
    id_evento: 1,
    nombre: "Festival de Música Electrónica",
    descripcion: "El festival más grande de música electrónica con los mejores DJs internacionales.",
    fecha: "15 Dic 2024",
    foto_principal: "/src/assets/festival.jpeg",
    ubicacion: "Arena Ciudad"
  },
  {
    id_evento: 2,
    nombre: "Concierto de Rock",
    descripcion: "Una noche llena de energía con las mejores bandas de rock del momento.",
    fecha: "20 Nov 2024",
    foto_principal: "/src/assets/festival.jpeg",
    ubicacion: "Estadio Central"
  },
  {
    id_evento: 3,
    nombre: "Festival de Jazz",
    descripcion: "Disfruta del mejor jazz en un ambiente único con artistas de renombre mundial.",
    fecha: "5 Ene 2025",
    foto_principal: "/src/assets/festival.jpeg",
    ubicacion: "Teatro Nacional"
  },
  {
    id_evento: 4,
    nombre: "Concierto Pop",
    descripcion: "Las mejores estrellas del pop en un concierto inolvidable.",
    fecha: "12 Feb 2025",
    foto_principal: "/src/assets/festival.jpeg",
    ubicacion: "Estadio Metropolitano"
  },
  {
    id_evento: 5,
    nombre: "Festival de Verano",
    descripcion: "El mejor festival para disfrutar del verano con música y actividades.",
    fecha: "20 Jul 2025",
    foto_principal: "/src/assets/festival.jpeg",
    ubicacion: "Parque Central"
  }
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const eventsPerPage = 3; // Número de eventos a mostrar a la vez
  
  // Función para ir al siguiente grupo de eventos
  const nextEvents = () => {
    if (currentIndex + eventsPerPage < eventosDestacados.length) {
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
  const visibleEvents = eventosDestacados.slice(
    currentIndex, 
    currentIndex + eventsPerPage
  );
  
  // Verificar si hay eventos anteriores o siguientes
  const hasPrevEvents = currentIndex > 0;
  const hasNextEvents = currentIndex + eventsPerPage < eventosDestacados.length;

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
            <h2 className="section-title">Eventos Destacados</h2>
            
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
                    fecha={evento.fecha}
                    imagen={evento.foto_principal}
                    ubicacion={evento.ubicacion}
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
              {Array.from({ length: Math.ceil(eventosDestacados.length / eventsPerPage) }).map((_, index) => (
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
