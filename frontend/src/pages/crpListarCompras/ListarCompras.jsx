import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListarCompras.css";

const ListarCompras = () => {
  const [compras, setCompras] = useState([]);
  const [tiposBoleta, setTiposBoleta] = useState({});
  const [clientes, setClientes] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar todas las compras
        const comprasResponse = await axios.get("http://localhost:8000/compras/");
        const comprasData = comprasResponse.data;

        // Obtener IDs únicos de tipos de boleta y clientes
        const tiposBoletaIds = [...new Set(comprasData.map(c => c.id_tipoboleta))];
        const clienteIds = [...new Set(comprasData.map(c => c.cedula))];

        // Cargar información de tipos de boleta
        const tiposBoletaPromises = tiposBoletaIds.map(id =>
          axios.get(`http://localhost:8000/tiposboletas/${id}`)
        );
        const tiposBoletaResponses = await Promise.all(tiposBoletaPromises);
        const tiposBoletaMap = {};
        tiposBoletaResponses.forEach(response => {
          const tipoBoleta = response.data;
          tiposBoletaMap[tipoBoleta.id_tipoboleta] = tipoBoleta;
        });

        // Cargar información de clientes
        const clientesPromises = clienteIds.map(cedula =>
          axios.get(`http://localhost:8000/clientes/${cedula}`)
        );
        const clientesResponses = await Promise.all(clientesPromises);
        const clientesMap = {};
        clientesResponses.forEach(response => {
          const cliente = response.data;
          clientesMap[cliente.cedula] = cliente;
        });

        setCompras(comprasData);
        setTiposBoleta(tiposBoletaMap);
        setClientes(clientesMap);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError("Error al cargar los datos");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getEstadoClass = (estado) => {
    return estado === 1 ? 'activo' : 'inactivo';
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  return (
    <div className="compras-container">
      <h2 className="compras-title">Listado de Compras</h2>
      
      {error && <p className="compras-error">{error}</p>}
      
      {compras.length === 0 ? (
        <p className="compras-empty">No hay compras registradas.</p>
      ) : (
        <div className="table-responsive">
          <table className="compras-table">
            <thead>
              <tr>
                <th>ID Compra</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Tipo de Boleta</th>
                <th>Cantidad</th>
                <th>Forma de Pago</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => (
                <tr key={compra.idcompra}>
                  <td>{compra.idcompra}</td>
                  <td>{formatFecha(compra.fecha)}</td>
                  <td>
                    {clientes[compra.cedula] ? (
                      `${compra.cedula} - ${clientes[compra.cedula].nombres} ${clientes[compra.cedula].apellidos}`
                    ) : (
                      compra.cedula
                    )}
                  </td>
                  <td>
                    {tiposBoleta[compra.id_tipoboleta] ? (
                      `${compra.id_tipoboleta} - ${tiposBoleta[compra.id_tipoboleta].nombre}`
                    ) : (
                      compra.id_tipoboleta
                    )}
                  </td>
                  <td>{compra.cantidad}</td>
                  <td>{compra.forma_pago}</td>
                  <td>
                    <span className={`status-indicator ${getEstadoClass(compra.estado)}`}></span>
                    {compra.estado === 1 ? 'Activa' : 'Inactiva'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListarCompras;