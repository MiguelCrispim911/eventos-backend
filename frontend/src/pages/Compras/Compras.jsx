import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Compras.css";

const Compras = () => {
  // Estados
  const [funcion, setFuncion] = useState(null);
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Hooks
  const { id_funcion } = useParams();
  const navigate = useNavigate();

  // Efecto para cargar datos del evento y función
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Obtener datos de la función
        const funcionResponse = await fetch(`http://localhost:8000/funciones/${id_funcion}`);
        if (!funcionResponse.ok) throw new Error("Error al cargar la función");
        const funcionData = await funcionResponse.json();
        setFuncion(funcionData);
        
        // Obtener datos del evento relacionado
        const eventoResponse = await fetch(`http://localhost:8000/eventos/${funcionData.id_evento}`);
        if (!eventoResponse.ok) throw new Error("Error al cargar el evento");
        const eventoData = await eventoResponse.json();
        setEvento(eventoData);
        
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (id_funcion) {
      cargarDatos();
    }
  }, [id_funcion]);

  // Efecto para verificar si el usuario está logueado
  useEffect(() => {
    const checkUserLogin = () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // Decodificar el token JWT para obtener los datos del usuario
          const decodedToken = jwtDecode(token);
          
          // Extraer datos relevantes del usuario
          const userInfo = {
            cedula: decodedToken.id_usuario,
            nombres: decodedToken.nombre_usuario,
            apellidos: decodedToken.apellido_usuario || '',
            email: decodedToken.email_usuario || ''
          };
          
          setUserData(userInfo);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error al decodificar el token:", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    
    checkUserLogin();
  }, []);

  // Manejador para continuar con la compra
  const handleContinuar = (e) => {
    e.preventDefault();
    // Por ahora solo mostraremos los datos en consola
    console.log("Datos del usuario:", userData);
    console.log("Función seleccionada:", funcion);
    console.log("Evento seleccionado:", evento);
    alert("Continuando con el proceso de compra (simulación)");
  };

  // Manejador para redirigir al login
  const handleRedirectToLogin = () => {
    // Guardar la URL actual para redirigir de vuelta después del login
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    navigate('/login');
  };

  // Componentes condicionales
  if (loading) return <div className="loading">Cargando información...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!funcion || !evento) return <div className="error-message">No se encontró la información solicitada</div>;

  // Renderizado principal
  return (
    <div className="compras-container">
      <h1 className="compras-title">Proceso de Compra</h1>
      
      <div className="compra-sections">
        {/* Sección 1: Detalles del Evento */}
        <DetallesEvento evento={evento} funcion={funcion} />
        
        {/* Sección 2: Datos del Comprador */}
        {isLoggedIn ? (
          <DatosCompradorLogueado userData={userData} handleContinuar={handleContinuar} />
        ) : (
          <LoginRequired handleRedirectToLogin={handleRedirectToLogin} />
        )}
      </div>
    </div>
  );
};

// Componente para la sección de detalles del evento
const DetallesEvento = ({ evento, funcion }) => (
  <div className="compra-section">
    <h2 className="section-title">Detalles del Evento</h2>
    <div className="evento-info">
      <div className="evento-imagen">
        <img src={evento.foto_principal} alt={evento.nombre} />
      </div>
      <div className="evento-detalles">
        <h3>{evento.nombre}</h3>
        <p className="evento-funcion">{funcion.nombre}</p>
        <p className="evento-fecha">
          <span>Fecha:</span> {new Date(funcion.fecha).toLocaleDateString()}
        </p>
        <p className="evento-hora">
          <span>Hora:</span> {funcion.hora_inicio}
        </p>
      </div>
    </div>
  </div>
);

// Componente para mostrar datos del comprador logueado
const DatosCompradorLogueado = ({ userData, handleContinuar }) => (
  <div className="compra-section">
    <h2 className="section-title">Datos del Comprador</h2>
    <div className="comprador-info-container">
      <div className="comprador-info-row">
        <span className="comprador-info-label">Cédula:</span>
        <span className="comprador-info-value">{userData.cedula}</span>
      </div>
      <div className="comprador-info-row">
        <span className="comprador-info-label">Nombres:</span>
        <span className="comprador-info-value">{userData.nombres}</span>
      </div>
      {userData.apellidos && (
        <div className="comprador-info-row">
          <span className="comprador-info-label">Apellidos:</span>
          <span className="comprador-info-value">{userData.apellidos}</span>
        </div>
      )}
      {userData.email && (
        <div className="comprador-info-row">
          <span className="comprador-info-label">Email:</span>
          <span className="comprador-info-value">{userData.email}</span>
        </div>
      )}
    </div>
    <button onClick={handleContinuar} className="btn-continuar">
      Finalizar Compra
    </button>
  </div>
);

// Componente para mostrar cuando el usuario no está logueado
const LoginRequired = ({ handleRedirectToLogin }) => (
  <div className="compra-section login-required">
    <h2 className="section-title">Iniciar Sesión Requerido</h2>
    <p className="login-message">
      Para continuar con la compra, es necesario iniciar sesión en su cuenta.
    </p>
    <button onClick={handleRedirectToLogin} className="btn-login">
      Iniciar Sesión
    </button>
  </div>
);

export default Compras;

