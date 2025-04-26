import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import "../components/Navbar.css"; // Importa tu archivo CSS para estilos personalizados

const Navbar = () => (
  <nav className="navbar">
    <div className="nav-container">
      <Link to="/" className="logo">EventTicket</Link>
      
      <div className="nav-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            isActive ? 'nav-link active-link' : 'nav-link'
          }
        >
          Inicio
        </NavLink>
        
        <NavLink 
          to="/eventos" 
          className={({ isActive }) => 
            isActive ? 'nav-link active-link' : 'nav-link'
          }
        >
          Eventos
        </NavLink>
        
        <NavLink 
          to="/contacto" 
          className={({ isActive }) => 
            isActive ? 'nav-link active-link' : 'nav-link'
          }
        >
          Contacto
        </NavLink>

        <div className="auth-buttons">
          <NavLink to="/login" className="login-button">
            Iniciar Sesión
          </NavLink>
          <NavLink to="/registro" className="register-button">
            Registrarse
          </NavLink>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;