import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "./Factura.css";

const Factura = () => {
  const navigate = useNavigate();
  const [compra, setCompra] = useState(null);
  const [tipoBoleta, setTipoBoleta] = useState({});
  const [funcion, setFuncion] = useState({});
  const [evento, setEvento] = useState({});

  // Cargar la última compra (puedes ajustar esto según tu lógica)
  useEffect(() => {
    // Supón que guardaste el ID de la última compra en localStorage
    const idUltimaCompra = localStorage.getItem("ultimaCompraId");
    if (!idUltimaCompra) return;

    // Cargar la compra desde el backend
    fetch(`http://localhost:8000/compras/${idUltimaCompra}`)
      .then(res => res.json())
      .then(async compraData => {
        setCompra(compraData);

        // Cargar tipo de boleta
        const tipoBoletaRes = await fetch(`http://localhost:8000/tiposboletas/${compraData.id_tipoboleta}`);
        const tipoBoletaData = await tipoBoletaRes.json();
        setTipoBoleta(tipoBoletaData);

        // Cargar función
        const funcionRes = await fetch(`http://localhost:8000/funciones/${tipoBoletaData.id_funcion}`);
        const funcionData = await funcionRes.json();
        setFuncion(funcionData);

        // Cargar evento
        const eventoRes = await fetch(`http://localhost:8000/eventos/${funcionData.id_evento}`);
        const eventoData = await eventoRes.json();
        setEvento(eventoData);
      });
  }, []);

  // Formatear fecha y hora
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'No disponible';
    try {
      const fecha = new Date(fechaStr);
      if (isNaN(fecha.getTime())) return fechaStr;
      return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return fechaStr;
    }
  };
  const formatearHora = (horaStr) => {
    if (!horaStr) return 'No disponible';
    try {
      const [horas, minutos] = horaStr.split(':');
      const hora = parseInt(horas, 10);
      const ampm = hora >= 12 ? 'PM' : 'AM';
      const hora12 = hora % 12 || 12;
      return `${hora12}:${minutos} ${ampm}`;
    } catch {
      return horaStr;
    }
  };

  // Generar PDF
  const generarFacturaPDF = () => {
    if (!compra || !tipoBoleta || !funcion || !evento) return;

    const doc = new jsPDF();

    // Título
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

    // Encabezado de tabla manual
    doc.setFontSize(10);
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

    // Guardar el PDF
    const nombreArchivo = `Factura_${compra.idcompra}_${evento?.nombre || 'Evento'}.pdf`;
    doc.save(nombreArchivo);
  };

  if (!compra) {
    return (
      <div className="factura-container">
        <h2>Cargando factura...</h2>
      </div>
    );
  }

  return (
    <div className="factura-container">
      <h2>¡Compra realizada con éxito!</h2>
      <p>Puedes descargar tu factura o ir a Mis Compras para ver todas tus compras.</p>
      <div style={{ margin: "2rem 0" }}>
        <button className="btn-descargar" onClick={generarFacturaPDF}>
          Descargar Factura
        </button>
        <button className="btn-miscompras" onClick={() => navigate("/mis-compras")} style={{ marginLeft: "1rem" }}>
          Ir a Mis Compras
        </button>
      </div>
    </div>
  );
};

export default Factura;