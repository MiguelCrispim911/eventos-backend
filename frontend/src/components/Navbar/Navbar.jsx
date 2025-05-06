import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import "./Navbar.css"; 

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);
  
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };
  
  const toggleUserMenu = () => {
    if (!showUserMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right
      });
    }
    setShowUserMenu(!showUserMenu);
  };
  
  // Cerrar el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && 
          buttonRef.current && 
          !buttonRef.current.contains(event.target) &&
          !event.target.closest('.user-dropdown-menu')) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <img src="../src/assets/logoeventticket.png" alt="Logo" className="logo-img" />
          EventTicket
        </Link>
        
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

          {isAuthenticated ? (
            <div className="user-menu-container">
              <button 
                ref={buttonRef}
                className="user-menu-button"
                onClick={toggleUserMenu}
              >
                <div className="user-avatar">
                  {user.nombres ? user.nombres.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-name">{user.nombres || 'Usuario'}</span>
                <span className="dropdown-icon">{showUserMenu ? '▲' : '▼'}</span>
              </button>
              
              {showUserMenu && createPortal(
                <div 
                  className="user-dropdown-menu"
                  style={{
                    top: `${menuPosition.top}px`,
                    right: `${menuPosition.right}px`
                  }}
                >
                  <div className="user-info">
                    <div className="user-avatar-large">
                      {user.nombres ? user.nombres.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="user-details">
                      <span className="user-full-name">{`${user.nombres || ''} ${user.apellidos || ''}`}</span>
                      <span className="user-email">{user.email || ''}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/perfil" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <i className="dropdown-icon-profile">👤</i>
                    Mi Perfil
                  </Link>
                  <Link to="/mis-compras" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <i className="dropdown-icon-purchases">🎫</i>
                    Mis Compras
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout-button">
                    <i className="dropdown-icon-logout">🚪</i>
                    Cerrar Sesión
                  </button>
                </div>,
                document.body
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <NavLink to="/login" className="login-button">
                Iniciar Sesión
              </NavLink>
              <NavLink to="/registro" className="register-button">
                Registrarse
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
