import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import "./Navbar.css";
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  // Función para cargar datos del usuario
  const loadUserData = () => {
    const storedToken = localStorage.getItem('authToken');
    
    if (storedToken) {
      try {
        // Decodifica el token JWT para obtener los datos del usuario
        const decodedToken = jwtDecode(storedToken);

        
        // Estructura los datos como espera el componente
        const userData = {
          nombres: decodedToken.nombre_usuario,  
          tipo_usuario: decodedToken.tipo_usuario,
          id_usuario: decodedToken.id_usuario,
        };

        
        setUser(userData);
        setUserType(decodedToken.tipo_usuario || 'cliente');
      } catch (e) {
        console.error("Error decodificando el token:", e);
        handleLogout();
      }
    } else {
      setUser(null);
      setUserType(null);
    }
  };

  // Cargar datos al montar y configurar listeners
  useEffect(() => {
    loadUserData();

    // Escuchar cambios en localStorage desde otras pestañas
    const handleStorageChange = (e) => {
      if (e.key === 'userData' || e.key === 'authToken' || e.key === null) {
        loadUserData();
      }
    };

    // Escuchar eventos personalizados desde la misma pestaña
    const handleAuthChange = () => loadUserData();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setUserType(null);
    setShowUserMenu(false);
    
    // Disparar eventos para sincronizar toda la app
    window.dispatchEvent(new Event('auth-change'));
    window.dispatchEvent(new StorageEvent('storage', { key: null }));
    
    navigate('/');
  };

  const toggleUserMenu = () => {
    if (!showUserMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 5,  // +5px de margen
        right: window.innerWidth - rect.right - 10  // -10px para alineación
      });
    }
    setShowUserMenu(!showUserMenu);
  };

  // Cerrar menú al hacer clic fuera
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
          
          {userType === 'admin' && (
            <NavLink 
              to="/admin" 
              className={({ isActive }) => 
                isActive ? 'nav-link active-link' : 'nav-link'
              }
            >
              Panel Admin
            </NavLink>
          )}

          <NavLink 
            to="/contacto" 
            className={({ isActive }) => 
              isActive ? 'nav-link active-link' : 'nav-link'
            }
          >
            Contacto
          </NavLink>

          {user ? (
            <div className="user-menu-container">
              <button 
                ref={buttonRef}
                className="user-menu-button"
                onClick={toggleUserMenu}
              >
                <div className="user-avatar">
                  {user.nombres ? user.nombres.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-name">
                  {user.nombres || (userType === 'cliente' ? 'Cliente' : 'Admin')}
                </span>
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
                      <span className="user-full-name">
                        {`${user.nombres || ''} ${user.apellidos || ''}`}
                      </span>
                      <span className="user-email">{user.correo || ''}</span>
                      <span className="user-type">
                        {userType === 'cliente' ? 'Cliente' : 'Administrador'}
                      </span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link 
                    to={userType === 'cliente' ? '/perfil' : '/admin/perfil'} 
                    className="dropdown-item" 
                    onClick={() => setShowUserMenu(false)}
                  >
                    <i className="dropdown-icon-profile">👤</i>
                    Mi Perfil
                  </Link>
                  
                  {userType === 'cliente' && (
                    <Link 
                      to="/mis-compras" 
                      className="dropdown-item" 
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="dropdown-icon-purchases">🎫</i>
                      Mis Compras
                    </Link>
                  )}
                  
                  <div className="dropdown-divider"></div>
                  <button 
                    onClick={handleLogout} 
                    className="dropdown-item logout-button"
                  >
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