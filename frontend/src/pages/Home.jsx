import React from "react";
import { Link } from "react-router-dom";
import "../pages/Home.css";

const Home = () => (
  <div className="home-container">
    <div className="content-wrapper">
      <h1 className="main-title">Bienvenido a EventTicket</h1>
      
      <p className="subtitle">
        Vive momentos inolvidables en los mejores eventos de tu ciudad.
        <span className="highlight-text">¡Compra tus entradas con hasta 30% de descuento!</span>
      </p>

      <div className="buttons-container">
        <Link to="/eventos" className="main-button primary-button">
          Explorar Eventos
        </Link>
        
        <Link to="/promociones" className="main-button secondary-button">
          Ver Promociones
        </Link>

        {/* Nuevo botón de Login */}
        <Link to="/login" className="main-button tertiary-button">
          Iniciar Sesión
        </Link>
      </div>

      <div className="info-card">
        <p className="card-title">
          <svg className="card-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          ¡Eventos nuevos cada semana!
        </p>
        <p className="card-subtitle">Suscríbete para recibir actualizaciones exclusivas</p>
      </div>
    </div>
  </div>
);

export default Home;