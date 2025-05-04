import React from "react";
import { jwtDecode } from "jwt-decode"; // Importa la librería
import "./HeaderAdmin.css";

const HeaderAdmin = () => {
  // 1. Obtener y decodificar el token
  const getAdminName = () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return 'Administrador';
      
      const decoded = jwtDecode(token); // Decodifica el token
      return decoded.nombre_usuario || 'Administrador'; // Usa el campo correcto
    } catch (error) {
      console.error("Error decodificando token:", error);
      return 'Administrador';
    }
  };

  // 2. Función de logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/administrador';
  };

  return (
    <header className="header">
      <div className="header__brand">
        <img 
          src="/ruta-del-logo.png"
          alt="Logo" 
          className="header__logo" 
        />
        <h1 className="header__title">Event Ticket</h1>
      </div>

      {/* 3. Mostrar nombre desde el token */}
      <div className="header__user">
        <span className="header__username">
          {getAdminName()} {/* Muestra el nombre decodificado */}
        </span>
        <button 
          className="header__logout-btn"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default HeaderAdmin;