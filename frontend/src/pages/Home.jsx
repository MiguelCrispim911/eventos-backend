import React from "react";
import { Link } from "react-router-dom";
import "../pages/Home.css";

const Home = () => (
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
  </section>
);

export default Home;
