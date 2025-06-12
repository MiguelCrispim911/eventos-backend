import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './MisCompras.css';

const MisCompras = () => {
  // Estados para manejar los datos y la UI
  const [compras, setCompras] = useState([]);
  const [funciones, setFunciones] = useState({});
  const [eventos, setEventos] = useState({});
  const [tiposBoleta, setTiposBoleta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelando, setCancelando] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const navigate = useNavigate();

  // Efecto para verificar autenticación y cargar datos
  useEffect(() => {
    cargarCompras();
  }, [navigate]);

  const cargarCompras = async () => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Decodificar el token para obtener la cédula del usuario
      const decodedToken = jwtDecode(token);
      const cedula = decodedToken.cedula || decodedToken.id_usuario;
      
      console.log("Cargando compras para cédula:", cedula);

      // Cargar las compras del usuario
      const response = await fetch(`http://localhost:8000/compras/cedula/${cedula}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Compras cargadas:", data);
      setCompras(data);
      
      // Si no hay compras, no necesitamos cargar datos relacionados
      if (data.length === 0) {
        setLoading(false);
        return;
      }
      
      // Obtener información de tipos de boleta
      const tiposBoletaIds = [...new Set(data.map(compra => compra.id_tipoboleta))];
      const tiposBoletaData = {};
      const funcionesData = {};
      const eventosData = {};
      
      // Cargar tipos de boleta y sus relaciones
      for (const id of tiposBoletaIds) {
        try {
          const tipoBoletaResponse = await fetch(`http://localhost:8000/tiposboletas/${id}`);
          if (tipoBoletaResponse.ok) {
            const tipoBoleta = await tipoBoletaResponse.json();
            tiposBoletaData[id] = tipoBoleta;
            
            // Obtener la función relacionada con este tipo de boleta
            if (tipoBoleta.id_funcion && !funcionesData[tipoBoleta.id_funcion]) {
              try {
                const funcionResponse = await fetch(`http://localhost:8000/funciones/${tipoBoleta.id_funcion}`);
                if (funcionResponse.ok) {
                  const funcion = await funcionResponse.json();
                  funcionesData[tipoBoleta.id_funcion] = funcion;
                  
                  // Obtener el evento relacionado con esta función
                  if (funcion.id_evento && !eventosData[funcion.id_evento]) {
                    try {
                      const eventoResponse = await fetch(`http://localhost:8000/eventos/${funcion.id_evento}`);
                      if (eventoResponse.ok) {
                        const evento = await eventoResponse.json();
                        eventosData[funcion.id_evento] = evento;
                      }
                    } catch (eventoError) {
                      console.error(`Error al cargar evento para función ${funcion.id_funcion}:`, eventoError);
                    }
                  }
                }
              } catch (funcionError) {
                console.error(`Error al cargar función ${tipoBoleta.id_funcion}:`, funcionError);
              }
            }
          }
        } catch (error) {
          console.error(`Error al cargar tipo de boleta ${id}:`, error);
        }
      }
      
      setTiposBoleta(tiposBoletaData);
      setFunciones(funcionesData);
      setEventos(eventosData);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError(`No se pudieron cargar tus compras: ${err.message}. Por favor, intenta más tarde.`);
      setLoading(false);
    }
  };

  // Función para formatear fechas
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'No disponible';
    
    try {
      const fecha = new Date(fechaStr);
      if (isNaN(fecha.getTime())) {
        return fechaStr;
      }
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return fechaStr;
    }
  };

  // Función para formatear horas de manera más legible
  const formatearHora = (horaStr) => {
    if (!horaStr) return 'No disponible';
    
    try {
      // Si la hora viene en formato HH:MM:SS, la formateamos a HH:MM AM/PM
      const [horas, minutos, segundos] = horaStr.split(':');
      if (horas && minutos) {
        const hora = parseInt(horas, 10);
        const ampm = hora >= 12 ? 'PM' : 'AM';
        const hora12 = hora % 12 || 12; // Convertir a formato 12 horas
        return `${hora12}:${minutos} ${ampm}`;
      }
      return horaStr;
    } catch (error) {
      return horaStr;
    }
  };

  // Función para cancelar una compra
  const handleCancelarCompra = async () => {
    if (!compraSeleccionada) return;
    
    try {
      setCancelando(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`http://localhost:8000/compras/cancelar/${compraSeleccionada.idcompra}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al cancelar la compra');
      }
      
      // Actualizar la lista de compras
      await cargarCompras();
      
      // Mostrar mensaje de éxito
      alert('Compra cancelada con éxito. Las boletas han sido liberadas.');
    } catch (error) {
      console.error('Error al cancelar la compra:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setCancelando(false);
      setCompraSeleccionada(null);
    }
  };

  // Función para abrir el modal de confirmación
  const confirmarCancelacion = (compra) => {
    setCompraSeleccionada(compra);
  };

  // Función para generar la factura en PDF
  const generarFacturaPDF = (compra) => {
    try {
      // Verificar que tenemos todos los datos necesarios
      console.log("Generando factura para compra:", compra);
      
      // Obtener datos relacionados
      const tipoBoleta = tiposBoleta[compra.id_tipoboleta] || {};
      console.log("Tipo Boleta:", tipoBoleta);
      
      const funcion = tipoBoleta.id_funcion ? funciones[tipoBoleta.id_funcion] : {};
      console.log("Función:", funcion);
      
      const evento = funcion.id_evento ? eventos[funcion.id_evento] : {};
      console.log("Evento:", evento);
      
      // Crear nuevo documento PDF
      const doc = new jsPDF();
      console.log("Documento PDF creado");
      
      try {
        // Añadir título
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text('FACTURA DE COMPRA', 105, 20, { align: 'center' });
        
        // Información del evento
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.text(`Evento: ${evento?.nombre || 'No disponible'}`, 14, 40);
        doc.text(`Función: ${funcion?.nombre || 'No disponible'}`, 14, 48);
        
        // Información de la compra
        doc.text(`Factura: ${compra.idcompra}`, 14, 60);
        doc.text(`Fecha: ${formatearFecha(compra.fecha)}`, 14, 68);
        doc.text(`Hora: ${formatearHora(compra.hora)}`, 14, 76);
        
        // Información del cliente
        doc.text(`Cliente ID: ${compra.cedula}`, 14, 88);
        
        // Línea separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(14, 95, 196, 95);
        console.log("Línea separadora añadida");
        
        // Tabla de detalles - Usar autoTable como función independiente
        console.log("Intentando crear tabla...");
        
        // Definir datos de la tabla
        const tableHead = [['Descripción', 'Cantidad', 'Precio Unitario', 'Total']];
        const tableBody = [
          [
            `Boleta ${tipoBoleta?.nombre || 'Estándar'} - ${evento?.nombre || 'Evento'}`,
            compra.cantidad,
            `$${tipoBoleta?.precio || '0'}`,
            `$${(tipoBoleta?.precio || 0) * compra.cantidad}`
          ]
        ];
        const tableFoot = [
          ['', '', 'Subtotal', `$${(tipoBoleta?.precio || 0) * compra.cantidad}`],
          ['', '', 'IVA (19%)', `$${((tipoBoleta?.precio || 0) * compra.cantidad * 0.19).toFixed(2)}`],
          ['', '', 'Total', `$${((tipoBoleta?.precio || 0) * compra.cantidad * 1.19).toFixed(2)}`]
        ];
        
        // Intentar crear la tabla sin usar autoTable
        doc.setFontSize(10);
        doc.setTextColor(40, 40, 40);
        
        // Encabezado de tabla manual
        doc.setFillColor(255, 107, 53);
        doc.setTextColor(255, 255, 255);
        doc.rect(14, 100, 182, 10, 'F');
        doc.text('Descripción', 16, 106);
        doc.text('Cantidad', 80, 106);
        doc.text('Precio Unitario', 110, 106);
        doc.text('Total', 170, 106);
        
        // Cuerpo de tabla manual
        doc.setTextColor(40, 40, 40);
        doc.text(`Boleta ${tipoBoleta?.nombre || 'Estándar'} - ${evento?.nombre || 'Evento'}`, 16, 116);
        doc.text(`${compra.cantidad}`, 80, 116);
        doc.text(`$${tipoBoleta?.precio || '0'}`, 110, 116);
        doc.text(`$${(tipoBoleta?.precio || 0) * compra.cantidad}`, 170, 116);
        
        // Pie de tabla manual
        doc.setFillColor(240, 240, 240);
        doc.rect(14, 126, 182, 30, 'F');
        doc.text('Subtotal', 110, 136);
        doc.text(`$${(tipoBoleta?.precio || 0) * compra.cantidad}`, 170, 136);
        doc.text('IVA (19%)', 110, 146);
        doc.text(`$${((tipoBoleta?.precio || 0) * compra.cantidad * 0.19).toFixed(2)}`, 170, 146);
        doc.text('Total', 110, 156);
        doc.text(`$${((tipoBoleta?.precio || 0) * compra.cantidad * 1.19).toFixed(2)}`, 170, 156);
        
        // Información de pago
        const finalY = 166;
        doc.text('Información de Pago:', 14, finalY + 10);
        doc.text(`Método de Pago: ${compra.forma_pago}`, 14, finalY + 18);
        doc.text(`Estado: ${compra.estado === 1 ? 'Activo' : 'Cancelado'}`, 14, finalY + 26);
        
        // Términos y condiciones
        doc.setFontSize(10);
        doc.text('Términos y Condiciones:', 14, finalY + 40);
        doc.text('- Esta factura es un comprobante de su compra.', 14, finalY + 48);
        doc.text('- Presente este documento para ingresar al evento.', 14, finalY + 54);
        doc.text('- No se aceptan devoluciones después de la fecha del evento.', 14, finalY + 60);
        
        // Pie de página
        doc.setFontSize(8);
        doc.text('© 2023 Sistema de Boletería - Todos los derechos reservados', 105, 285, { align: 'center' });
        
        // Guardar el PDF con nombre personalizado
        const nombreArchivo = `Factura_${compra.idcompra}_${evento?.nombre || 'Evento'}.pdf`;
        doc.save(nombreArchivo);
        
      } catch (innerError) {
        console.error("Error específico durante la generación del PDF:", innerError);
        throw innerError;
      }
      
    } catch (error) {
      console.error('Error al generar la factura:', error);
      alert(`Hubo un error al generar la factura: ${error.message || 'Error desconocido'}. Por favor, intente nuevamente.`);
    }
  };

  // Renderizado condicional para estados de carga y error
  if (loading) {
    return (
      <div className="mis-compras-container">
        <div className="mis-compras-loading">
          <p>Cargando tus compras...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mis-compras-container">
        <div className="mis-compras-error">
          <p>{error}</p>
          <button 
            className="volver-btn"
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Renderizado principal
  return (
    <div className="mis-compras-container">
      <h1 className="mis-compras-title">Mis Compras</h1>
      
      {compras.length === 0 ? (
        <div className="no-compras-message">
          <p>No has realizado ninguna compra todavía.</p>
          <button 
            className="explorar-eventos-btn"
            onClick={() => navigate('/eventos')}
          >
            Explorar Eventos
          </button>
        </div>
      ) : (
        <div className="tabla-compras-container">
          <table className="tabla-compras">
            <thead>
              <tr>
                <th>ID</th>
                <th>Evento</th>
                <th>Función</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Cantidad</th>
                <th>Forma de Pago</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => {
                const tipoBoleta = tiposBoleta[compra.id_tipoboleta] || {};
                const funcion = tipoBoleta.id_funcion ? funciones[tipoBoleta.id_funcion] : {};
                const evento = funcion.id_evento ? eventos[funcion.id_evento] : {};
                
                return (
                  <tr key={compra.idcompra}>
                    <td>{compra.idcompra}</td>
                    <td>{evento?.nombre || 'No disponible'}</td>
                    <td>{funcion?.nombre || 'No disponible'}</td>
                    <td>{formatearFecha(compra.fecha)}</td>
                    <td>{formatearHora(compra.hora)}</td>
                    <td>{compra.cantidad}</td>
                    <td>{compra.forma_pago}</td>
                    <td>{tipoBoleta?.nombre || compra.id_tipoboleta}</td>
                    <td>
                      <span className={`estado-badge ${compra.estado === 1 ? 'activo' : 'inactivo'}`}>
                        {compra.estado === 1 ? 'Activa' : 'Cancelada'}
                      </span>
                    </td>
                    <td>
                      <div className="acciones-container">
                        <button 
                          className="ver-factura-btn"
                          onClick={() => generarFacturaPDF(compra)}
                        >
                          <i className="fa-solid fa-receipt"></i> Ver Factura
                        </button>
                        
                        {compra.estado === 1 && (
                          <button 
                            className="cancelar-btn"
                            onClick={() => confirmarCancelacion(compra)}
                          >
                            <i className="fa-solid fa-ban"></i> Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de confirmación de cancelación */}
      {compraSeleccionada && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirmar Cancelación</h2>
            <p>¿Estás seguro de que deseas cancelar esta compra?</p>
            <p>Esta acción no se puede deshacer y las boletas serán liberadas para su venta.</p>
            
            <div className="modal-buttons">
              <button 
                className="btn-cancelar-modal"
                onClick={() => setCompraSeleccionada(null)}
                disabled={cancelando}
              >
                No, mantener compra
              </button>
              <button 
                className="btn-confirmar-cancelar"
                onClick={handleCancelarCompra}
                disabled={cancelando}
              >
                {cancelando ? 'Procesando...' : 'Sí, cancelar compra'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisCompras;
