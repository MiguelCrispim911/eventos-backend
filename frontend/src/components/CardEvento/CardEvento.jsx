import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CardEvento.css';

const CardEvento = ({ id, nombre, descripcion, imagen, estado }) => {
  const navigate = useNavigate();

  return (
    <div className="card-evento-home">
      <div className="card-evento-home-header">
        <img src={imagen} alt={nombre} className="card-evento-home-img" />
        <span className={`card-evento-home-status ${estado === 1 ? 'activo' : 'inactivo'}`}>
          {estado === 1 ? 'Activo' : 'Inactivo'}
        </span>
      </div>
      <div className="card-evento-home-body">
        <h3 className="card-evento-home-title">{nombre}</h3>
        <p className="card-evento-home-description">{descripcion}</p>
        <button
          className={`btn-comprar-home${estado !== 1 ? ' btn-comprar-home--disabled' : ''}`}
          onClick={() => navigate(`/funciones/${id}`)}
          disabled={estado !== 1}
        >
          {estado === 1 ? 'Comprar boletos' : 'No disponible'}
        </button>
      </div>
    </div>
  );
};

export default CardEvento;