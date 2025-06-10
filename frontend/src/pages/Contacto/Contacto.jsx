import React from 'react';
import "./contacto.css";

const Contacto = () => {
  return (
    <div className="contacto-container">
      <div className="contacto-header">
        <h1>Contáctanos</h1>
        <p>Estamos aquí para ayudarte. Puedes comunicarte con nosotros a través de cualquiera de los siguientes medios.</p>
      </div>
      
      <div className="contacto-content-centered">
        <div className="contacto-info-grid">
          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Visítanos</h3>
            <p>Calle Principal #123</p>
            <p>Ciudad, Código Postal</p>
            <p>Colombia</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">📞</div>
            <h3>Llámanos</h3>
            <p>+57 300 123 4567</p>
            <p>Lun - Vie: 8:00 AM - 6:00 PM</p>
            <p>Sáb: 9:00 AM - 1:00 PM</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">✉️</div>
            <h3>Escríbenos</h3>
            <p>info@eventticket.com</p>
            <p>soporte@eventticket.com</p>
            <p>ventas@eventticket.com</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">🌐</div>
            <h3>Síguenos</h3>
            <div className="social-links">
              <a href="#" className="social-link">
                <img src="/src/assets/facebook.png" alt="Facebook" className="social-icon-img" />
                Facebook
              </a>
              <a href="#" className="social-link">
                <img src="/src/assets/instagram.png" alt="Instagram" className="social-icon-img" />
                Instagram
              </a>
              <a href="#" className="social-link">
                <img src="/src/assets/twitter.png" alt="Twitter" className="social-icon-img" />
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
