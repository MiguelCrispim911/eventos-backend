import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Funciones.css";

const Funciones = () => {
  const [funciones, setFunciones] = useState([]);
  const [evento, setEvento] = useState(null);
  const [ubicaciones, setUbicaciones] = useState({});
  const [error, setError] = useState(null);
  const { id_evento } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerEvento = async () => {
      try {
        const response = await fetch(`http://localhost:8000/eventos/${id_evento}`);
        if (!response.ok) {
          throw new Error("Error al obtener el evento");
        }
        const data = await response.json();
        setEvento(data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      }
    };

    const obtenerUbicaciones = async () => {
      try {
        const response = await fetch("http://localhost:8000/ubicaciones/");
        if (!response.ok) {
          throw new Error("Error al obtener las ubicaciones");
        }
        const data = await response.json();
        // Crear un objeto con id_ubicacion como clave para acceso rápido
        const ubicacionesMap = {};
        data.forEach(ubicacion => {
          ubicacionesMap[ubicacion.id_ubicacion] = ubicacion;
        });
        setUbicaciones(ubicacionesMap);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    const obtenerFunciones = async () => {
      try {
        // Usar el endpoint general de funciones y filtrar en el frontend
        const response = await fetch("http://localhost:8000/funciones/");
        if (!response.ok) {
          throw new Error("Error al obtener las funciones");
        }
        const data = await response.json();
        // Filtrar las funciones que pertenecen al evento seleccionado
        const funcionesEvento = data.filter(funcion => funcion.id_evento === parseInt(id_evento));
        setFunciones(funcionesEvento);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      }
    };

    if (id_evento) {
      obtenerEvento();
      obtenerFunciones();
      obtenerUbicaciones();
    }
  }, [id_evento]);

  const seleccionarFuncion = (funcion) => {
    // Redirigir al proceso de compra con el ID de la función
    navigate(`/comprar-boletos/${funcion.id_funcion}`);
  };

  return (
    <div className="funciones-container">
      <h2 className="funciones-title">Funciones</h2>
      <div className="title-decoration"></div>
      
      {evento && (
        <div className="evento-banner" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${evento.foto_secundaria})`}}>
          <div className="evento-banner-content">
            <h1>{evento.nombre}</h1>
            <p>{evento.descripcion}</p>
          </div>
        </div>
      )}
      
      <p className="instruccion-texto">
        Seleccione la función deseada para continuar el proceso de compra
      </p>
      
      {error && <div className="error-message">Error: {error}</div>}
      
      {funciones.length === 0 ? (
        <p className="no-funciones-message">No hay funciones disponibles para este evento.</p>
      ) : (
        <div className="funciones-grid">
          {funciones.map((funcion) => (
            <div key={funcion.id_funcion} className="funcion-card">
              <div className="funcion-info">
                <h3 className="funcion-nombre">{funcion.nombre}</h3>
                <p className="funcion-descripcion">{funcion.descripcion}</p>
                <div className="funcion-detalles">
                  <p><span>Fecha:</span> {new Date(funcion.fecha).toLocaleDateString()}</p>
                  <p><span>Hora:</span> {funcion.hora_inicio}</p>
                  <p><span>Ubicación:</span> {ubicaciones[funcion.id_ubicacion]?.nombre || 'Cargando...'}</p>
                  
                  <p className={`funcion-estado ${funcion.estado === 1 ? 'funcion-disponible' : 'funcion-inactiva'}`}>
                    {funcion.estado === 1 ? 'Disponible' : 'No disponible'}
                  </p>
                </div>
              </div>
              <button 
                className="btn-seleccionar"
                onClick={() => seleccionarFuncion(funcion)}
                disabled={funcion.estado !== 1}
              >
                Seleccionar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Funciones;
