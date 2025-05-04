import React from "react";
import "./FooterAdmin.css";

const FooterAdmin = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p className="footer__text">
          Administrador de Eventos - Plataforma académica desarrollada en React + FastAPI.
        </p>
        <p className="footer__copyright">
          © 2025 Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default FooterAdmin;