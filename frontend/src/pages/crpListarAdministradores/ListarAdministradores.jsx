import React, { useEffect, useState } from "react";

const ListarAdministradores = () => {
  const [administradores, setAdministradores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerAdministradores = async () => {
      try {
        const response = await fetch("http://localhost:8000/administradores/");
        if (!response.ok) {
          throw new Error("Error al obtener los administradores");
        }
        const data = await response.json();
        setAdministradores(data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      }
    };

    obtenerAdministradores();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Listado de Administradores</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {administradores.length === 0 ? (
        <p>No hay administradores disponibles.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Dirección</th>
              <th>Municipio</th>
              <th>Departamento</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Contraseña</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {administradores.map((admin) => (
              <tr key={admin.cedula_adm}>
                <td>{admin.cedula_adm}</td>
                <td>{admin.nombres}</td>
                <td>{admin.apellidos}</td>
                <td>{admin.direccion}</td>
                <td>{admin.municipio}</td>
                <td>{admin.departamento}</td>
                <td>{admin.email}</td>
                <td>{admin.telefono}</td>
                <td>********</td> {/* Contraseña oculta */}
                <td>{admin.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListarAdministradores;