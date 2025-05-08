import React from 'react';
import { Link } from 'react-router-dom';
import './CardEvento.css';

const CardEvento = ({ id, nombre, descripcion, fecha, imagen, ubicacion }) => {
  return (
    <div className="event-card">
      <div className="event-image">
        <img src={imagen || '/placeholder-event.jpg'} alt={nombre} />
        <div className="event-badge">{ubicacion}</div>
      </div>
      <div className="event-content">
        <h3 className="event-title">{nombre}</h3>
        <p className="event-description">{descripcion}</p>
        <div className="event-details">
          <div className="event-date">
            <i className="fa fa-calendar"></i>
            <span>{fecha}</span>
          </div>
        </div>
        <div className="event-actions">
          <Link to={`/eventos/${id}`} className="btn-details">Ver detalles</Link>
          <button className="btn-buy">Comprar boletos</button>
        </div>
      </div>
    </div>
  );
};

export default CardEvento;