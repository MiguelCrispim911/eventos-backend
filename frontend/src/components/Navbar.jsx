import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-white shadow-md">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">ClienteEventos</Link>
      <div className="space-x-4">
        <NavLink to="/eventos" className={({ isActive }) => isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}>
          Eventos
        </NavLink>
        <NavLink to="/compras" className={({ isActive }) => isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}>
          Mis Compras
        </NavLink>
        <NavLink to="/admin" className={({ isActive }) => isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}>
          Admin
        </NavLink>
      </div>
    </div>
  </nav>
);

export default Navbar;