import React from 'react';

const Footer = () => (
  <footer className="bg-gray-100 mt-12 py-4">
    <div className="container mx-auto text-center text-sm text-gray-600">
      © {new Date().getFullYear()} ClienteEventos. Todos los derechos reservados.
    </div>
  </footer>
);

export default Footer;