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
  const [tiposBoleta, setTiposBoleta] = useState([]);
  const [selectedBoletaId, setSelectedBoletaId] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [metodoPago, setMetodoPago] = useState(""); // "" o "Efecty" o "Gane"
  
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

  // Efecto para cargar tipos de boleta al cambiar la función
  useEffect(() => {
    if (!funcion?.id_funcion) return;
    fetch(`http://localhost:8000/tiposboletas/por_funcion/${funcion.id_funcion}`)
      .then(res => {
        if (!res.ok) throw new Error('Error en la respuesta del servidor');
        return res.json();
      })
      .then(data => setTiposBoleta(data))
      .catch(() => setError('Error al cargar los tipos de boleta'));
  }, [funcion]);

  // Manejador para continuar con la compra
  const handleContinuar = async (e) => {
    e.preventDefault();

    if (!isLoggedIn || !boletaSeleccionada || !metodoPago) {
      alert("Por favor, completa todos los campos antes de finalizar la compra.");
      return;
    }

    const now = new Date();
    const fecha = now.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const hora = now.toTimeString().slice(0, 8);

    const compraData = {
      fecha,
      hora,
      cantidad,
      forma_pago: metodoPago,
      cedula: userData.cedula,
      id_tipoboleta: boletaSeleccionada.id_tipoboleta,
      estado: 1
    };

    try {
      const response = await fetch("http://localhost:8000/compras/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(compraData)
      });

      if (!response.ok) throw new Error("Error al registrar la compra");

      // Espera la respuesta con el id de la compra
      const data = await response.json();
      // Guarda el id en localStorage
      localStorage.setItem("ultimaCompraId", data.idcompra);

      alert("¡Compra realizada con éxito!");
      navigate("/factura");
    } catch (error) {
      alert("Hubo un error al registrar la compra. Intenta nuevamente.");
      console.error(error);
    }
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

  // Calculos para la boleta seleccionada
  const boletaSeleccionada = tiposBoleta.find(boleta => boleta.id_tipoboleta === selectedBoletaId);
  const precio = boletaSeleccionada ? boletaSeleccionada.precio : 0;
  const subtotal = precio * cantidad;
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  // Renderizado principal
  return (
    <div className="compras-container">
      <h1 className="compras-title">Proceso de Compra</h1>
      <div className="compra-sections">
        <DetallesEvento evento={evento} funcion={funcion} />
        {isLoggedIn ? (
          <DatosCompradorLogueado userData={userData} />
        ) : (
          <LoginRequired handleRedirectToLogin={handleRedirectToLogin} />
        )}
        <SeleccionBoleta
          tiposBoleta={tiposBoleta}
          selectedBoletaId={selectedBoletaId}
          setSelectedBoletaId={setSelectedBoletaId}
          cantidad={cantidad}
          setCantidad={setCantidad}
        />
        <MetodoPago
          metodoPago={metodoPago}
          setMetodoPago={setMetodoPago}
        />
        {/* Botón al final de todas las secciones */}
        <div style={{ textAlign: "center", margin: "2rem 0" }}>
          <button onClick={handleContinuar} className="btn-continuar">
            Finalizar Compra
          </button>
        </div>
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
const DatosCompradorLogueado = ({ userData }) => (
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

// Componente para la selección de boleta
const SeleccionBoleta = ({ tiposBoleta, selectedBoletaId, setSelectedBoletaId, cantidad, setCantidad }) => {
  const boletaSeleccionada = tiposBoleta.find(boleta => boleta.id_tipoboleta === selectedBoletaId);
  const precio = boletaSeleccionada ? boletaSeleccionada.precio : 0;
  const subtotal = precio * cantidad;
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  return (
    <div className="compra-section">
      <h2 className="section-title">Selecciona tu Boleta</h2>
      <table className="boleta-tabla">
        <thead>
          <tr>
            <th>Seleccionar</th>
            <th>Nombre</th>
            <th>Localización</th>
            <th>Precio</th>
            <th>Descripción</th>
            <th>Cupo Máximo</th>
            <th>Disponibles</th>
          </tr>
        </thead>
        <tbody>
          {tiposBoleta
            .filter(boleta => boleta.estado === 1)
            .map((boleta) => (
              <tr
                key={boleta.id_tipoboleta}
                className={selectedBoletaId === boleta.id_tipoboleta ? "selected-row" : ""}
              >
                <td>
                  <input
                    type="radio"
                    name="tipoBoleta"
                    value={boleta.id_tipoboleta}
                    checked={selectedBoletaId === boleta.id_tipoboleta}
                    onChange={() => setSelectedBoletaId(boleta.id_tipoboleta)}
                    disabled={boleta.disponibles === 0}
                  />
                </td>
                <td>{boleta.nombre}</td>
                <td>{boleta.localizacion}</td>
                <td>${boleta.precio}</td>
                <td>{boleta.descripcion}</td>
                <td>{boleta.cupo_maximo}</td>
                <td>{boleta.disponibles}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Sección de cantidad y totales */}
      {boletaSeleccionada && (
        <div style={{ marginTop: "1.5rem" }}>
          <div className="cantidad-section">
            <span>Cantidad</span>
            <button
              className="cantidad-btn"
              onClick={() => setCantidad(c => Math.max(1, c - 1))}
              disabled={cantidad <= 1}
              type="button"
            >-</button>
            <span className="cantidad-num">{cantidad}</span>
            <button
              className="cantidad-btn"
              onClick={() => setCantidad(c => boletaSeleccionada ? Math.min(boletaSeleccionada.disponibles, c + 1) : c + 1)}
              disabled={boletaSeleccionada && cantidad >= boletaSeleccionada.disponibles}
              type="button"
            >+</button>
          </div>
          <div style={{ marginTop: "1rem", fontWeight: 500 }}>
            <div>Subtotal: ${subtotal.toLocaleString()}</div>
            <div>IVA (19%): ${iva.toLocaleString()}</div>
            <div>Total a pagar: <strong>${total.toLocaleString()}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para el método de pago
const MetodoPago = ({ metodoPago, setMetodoPago }) => (
  <div className="compra-section">
    <h2 className="section-title">Método de Pago</h2>
    <div className="pago-btn-group pago-btn-center">
      <label className={`radio-btn pago${metodoPago === "Efecty" ? " selected" : ""}`}>
        <input
          type="radio"
          name="metodoPago"
          value="Efecty"
          checked={metodoPago === "Efecty"}
          onChange={() => setMetodoPago("Efecty")}
          style={{ display: "none" }}
        />
        <img
          src="https://tse1.mm.bing.net/th/id/OIP.9bnpdK2Ow6SGvDBF_ASWOAAAAA?rs=1&pid=ImgDetMain"
          alt="Efecty"
          className="metodo-logo"
        />
        Efecty
      </label>
      <label className={`radio-btn pago${metodoPago === "Gane" ? " selected" : ""}`}>
        <input
          type="radio"
          name="metodoPago"
          value="Gane"
          checked={metodoPago === "Gane"}
          onChange={() => setMetodoPago("Gane")}
          style={{ display: "none" }}
        />
        <img
          src="https://www.logotypes101.com/logos/1/AFF94F03E8D776AA1D0105993AD37269/ganesured_amarillo_ok.png"
          alt="Gane"
          className="metodo-logo"
        />
        Gane
      </label>
    </div>
  </div>
);

export default Compras;

