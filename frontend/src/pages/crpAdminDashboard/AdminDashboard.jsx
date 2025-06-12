import React from "react";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  // 1. Función para obtener el nombre del usuario desde el token
  const getUsername = () => {
    try {
      // Obtiene el token del localStorage
      const token = localStorage.getItem('adminToken');
      if (!token) return 'Administrador';
      
      // Decodifica el token para extraer la información del usuario
      const decoded = jwtDecode(token);
      // Retorna el nombre de usuario si existe, si no, retorna 'Administrador'
      return decoded.nombre_usuario || 'Administrador'; // Usa el campo que corresponda
    } catch (error) {
      // Si hay un error al decodificar, muestra el error en consola y retorna 'Administrador'
      console.error("Error decodificando token:", error);
      return 'Administrador';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header>
        {/* Muestra el nombre del usuario obtenido del token */}
        Hola, {getUsername()}
      </header>
    </div>
  );
};

export default Dashboard;