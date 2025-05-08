import React from "react";
import "./FooterAdmin.css";

const FooterAdmin = () => {
  return (
    <footer className="footer-admin">
      <div className="footer-admin__content">
        <p className="footer-admin__text">
          Administrador de Eventos - Plataforma académica desarrollada en React + FastAPI.
        </p>
        <p className="footer-admin__copyright">
          © 2025 Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default FooterAdmin;
