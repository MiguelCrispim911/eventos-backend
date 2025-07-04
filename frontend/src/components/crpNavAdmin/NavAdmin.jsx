import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./NavAdmin.css";

const NavAdmin = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <aside className="nav-bar-admin">
      <h2>Menu Administrador</h2>
      <nav>
        <ul>
          {/* ADMINISTRADORES */}
          <li onClick={() => toggleSection("administradores")} className="menu-item">
            Administradores
            {openSection === "administradores" && (
              <ul className="submenu">
                <li>
                  <Link to="/administrador/dashboard/crearAdministrador" className="submenu-link">
                    Crear Administrador
                  </Link>
                </li>
                <li>
                  <Link to="/administrador/dashboard/listarAdministradores" className="submenu-link">
                    Listar Administradores
                  </Link>
                </li>
                <li>
                  <Link to="/administrador/dashboard/editarAdministrador" className="submenu-link">
                    Buscar/Editar Administrador
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* EVENTOS */}
          <li onClick={() => toggleSection("eventos")} className="menu-item">
            Eventos
            {openSection === "eventos" && (
              <ul className="submenu">
                <li>
                  <Link to="/administrador/dashboard/crearEvento" className="submenu-link">
                    Crear Evento
                  </Link>
                </li>
                <li>
                  <Link to="/administrador/dashboard/listarEventos" className="submenu-link">
                    Listar Eventos
                  </Link>
                </li>
                <li>
                  <Link to="/administrador/dashboard/editarEvento" className="submenu-link">
                    Buscar/Editar Eventos
                  </Link>                  
                </li>
              </ul>
            )}
          </li>

          {/* FUNCIONES */}
          <li onClick={() => toggleSection("funciones")} className="menu-item">
            Funciones
            {openSection === "funciones" && (
              <ul className="submenu">
                <li>
                  <Link to="/administrador/dashboard/crearFuncion" className="submenu-link">
                    Crear Funcion
                  </Link>
                </li>
                <li>
                  <Link to="/administrador/dashboard/listarFunciones" className="submenu-link">
                    Listar Funciones
                  </Link>
                </li>
                <li>
                  <Link to="/administrador/dashboard/editarFuncion" className="submenu-link">
                    Buscar/Editar Funcion
                  </Link>                   
                </li>
              </ul>
            )}
          </li>

          {/* TIPOS DE BOLETA */}
          <li onClick={() => toggleSection("boletas")} className="menu-item">
            Tipos de Boleta
            {openSection === "boletas" && (
              <ul className="submenu">
                <li>
                  <Link to="/administrador/dashboard/crearTipoBoleta" className="submenu-link">
                    Crear Tipo de Boleta
                  </Link>
                </li>
                <li>
                  <Link to="/administrador/dashboard/listarTipoBoleta" className="submenu-link">
                    Listar tipos de Boleta
                  </Link>
                </li>
                <li>
                  <Link to="/administrador/dashboard/editarTipoBoleta" className="submenu-link">
                    Buscar/Editar Tipo Boleta
                  </Link>                   
                </li>
              </ul>
            )}
          </li>

          {/* UBICACIONES */}
          <li onClick={() => toggleSection("ubicaciones")} className="menu-item">
            Ubicaciones
            {openSection === "ubicaciones" && (
              <ul className="submenu">
                <li>
                  <Link to="/administrador/dashboard/crearUbicacion" className="submenu-link">
                    Crear Ubicacion
                  </Link>
                </li>
                <li>
                  <Link to="/administrador/dashboard/listarUbicaciones" className="submenu-link">
                    Listar Ubicaciones
                  </Link>
                </li>
                <li>
                  <Link to="/administrador/dashboard/EditarUbicacion" className="submenu-link">
                    Buscar/Editar Ubicacion
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li onClick={() => toggleSection("compras")} className="menu-item">
            Compras
            {openSection === "compras" && (
              <ul className="submenu">
                <li>
                  <Link to="/administrador/dashboard/listarCompras" className="submenu-link">
                    Listar Compras
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default NavAdmin;