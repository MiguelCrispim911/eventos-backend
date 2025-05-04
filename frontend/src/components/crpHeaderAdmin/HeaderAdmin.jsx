import React from "react";
import "./HeaderAdmin.css"; // Archivo CSS tradicional

const HeaderAdmin = () => {
  return (
    <header className="header">
      {/* Logo y nombre de la empresa */}
      <div className="header__brand">
        <img 
          src="/ruta-del-logo.png"  // Reemplaza con la ruta correcta
          alt="Logo de la empresa" 
          className="header__logo" 
        />
        <h1 className="header__title">Nombre de la Empresa</h1>
      </div>

      {/* Nombre de usuario y botón (estático, sin lógica) */}
      <div className="header__user">
        <span className="header__username">Usuario Ejemplo</span>
        <button className="header__logout-btn">Cerrar sesión</button>
      </div>
    </header>
  );
};

export default HeaderAdmin;