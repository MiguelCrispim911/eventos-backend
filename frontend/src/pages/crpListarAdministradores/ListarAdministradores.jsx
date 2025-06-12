import React, { useEffect, useState } from "react";
import "./ListarAdministradores.css";

// Componente principal para listar administradores
const ListarAdministradores = () => {
  // Estado para almacenar la lista de administradores
  const [administradores, setAdministradores] = useState([]);
  // Estado para manejar errores
  const [error, setError] = useState(null);

  // useEffect para obtener los administradores al montar el componente
  useEffect(() => {
    const obtenerAdministradores = async () => {
      try {
        // Llamada a la API para obtener los administradores
        const response = await fetch("http://localhost:8000/administradores/");
        if (!response.ok) {
          throw new Error("Error al obtener los administradores");
        }
        const data = await response.json();
        setAdministradores(data); // Guardar los datos en el estado
      } catch (err) {
        console.error("Error:", err);
        setError(err.message); // Guardar el mensaje de error
      }
    };

    obtenerAdministradores();
  }, []);

  // Función para asignar la clase CSS según el estado del administrador
  const getEstadoClass = (estado) => {
    return estado === 1 ? 'activo' : 'inactivo';
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Listado de Administradores</h2>
      
      {/* Mostrar mensaje de error si existe */}
      {error && <p className="admin-error">{error}</p>}
      
      {/* Mostrar mensaje si no hay administradores */}
      {administradores.length === 0 ? (
        <p className="admin-empty">No hay administradores disponibles.</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cédula</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Municipio</th>
                <th>Departamento</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {/* Renderizar cada administrador en una fila */}
              {administradores.map((admin) => (
                <tr key={admin.cedula_adm}>
                  <td>{admin.cedula_adm}</td>
                  <td>{admin.nombres}</td>
                  <td>{admin.apellidos}</td>
                  <td>{admin.nombre_municipio}</td>
                  <td>{admin.nombre_departamento}</td>
                  <td>{admin.email}</td>
                  <td>{admin.telefono}</td>
                  <td>
                    {/* Indicador visual del estado */}
                    <span className={`status-indicator ${getEstadoClass(admin.estado)}`}></span>
                    {admin.estado === 1 ? 'Activo' : 'Inactivo'}
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

export default ListarAdministradores;