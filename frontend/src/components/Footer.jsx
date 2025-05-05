import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-copyright">
        © {new Date().getFullYear()} EventTicket. Todos los derechos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
