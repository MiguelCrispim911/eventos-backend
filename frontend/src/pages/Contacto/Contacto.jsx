import React, { useState } from 'react';
import "./contacto.css";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    
    try {
      // Aquí iría la lógica para enviar el formulario a un backend
      // Por ahora, simularemos un envío exitoso después de 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulamos un envío exitoso
      setMensajeEnviado(true);
      setFormData({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
      });
    } catch (err) {
      setError('Ocurrió un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
      console.error('Error al enviar formulario:', err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="contacto-container">
      <div className="contacto-header">
        <h1>Contáctanos</h1>
        <p>Estamos aquí para ayudarte. Envíanos tu consulta y te responderemos lo antes posible.</p>
      </div>
      
      <div className="contacto-content">
        <div className="contacto-info">
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
        
        <div className="contacto-form-container">
          {mensajeEnviado ? (
            <div className="mensaje-enviado">
              <div className="mensaje-enviado-icon">✅</div>
              <h2>¡Mensaje enviado con éxito!</h2>
              <p>Gracias por contactarnos. Nos pondremos en contacto contigo lo antes posible.</p>
              <button 
                className="nuevo-mensaje-btn"
                onClick={() => setMensajeEnviado(false)}
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contacto-form">
              <h2>Envíanos un mensaje</h2>
              
              <div className="form-explanation">
                <p>Completa el formulario a continuación para ponerte en contacto con nuestro equipo. Todos los campos son obligatorios para poder atender tu solicitud de manera eficiente.</p>
                <p>Recibirás una confirmación por correo electrónico y nos pondremos en contacto contigo en un plazo de 24-48 horas hábiles.</p>
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ingresa tu nombre completo"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ingresa tu correo electrónico"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="asunto">Asunto</label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  placeholder="¿Sobre qué nos quieres contactar?"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="mensaje">Mensaje</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="Escribe tu mensaje aquí..."
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className={`submit-button ${enviando ? 'loading' : ''}`}
                disabled={enviando}
              >
                {enviando ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacto;




