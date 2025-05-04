import React from "react";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  // 1. Función para obtener el nombre del usuario desde el token
  const getUsername = () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return 'Administrador';
      
      const decoded = jwtDecode(token);
      return decoded.nombre_usuario || 'Administrador'; // Usa el campo que corresponda
    } catch (error) {
      console.error("Error decodificando token:", error);
      return 'Administrador';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header>
        Hola, {getUsername()} {/* Muestra el nombre aquí */}
      </header>
    </div>
  );
};

export default Dashboard;