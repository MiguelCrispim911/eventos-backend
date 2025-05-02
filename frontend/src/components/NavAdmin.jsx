import { Link } from 'react-router-dom';

const NavAdmin = () => {
  return (
    <main className="flex-1 p-6 bg-gray-100">
      <h2 className="text-xl font-semibold mb-4">Menú de navegación</h2>
      <ul className="space-y-3">
        <li>
          <Link to="/administrador/dashboard/crearAdministrador" className="text-blue-500 hover:underline">
            Crear Administrador
          </Link>
        </li>
        <li>
          <Link to="/administrador/dashboard/crearEvento" className="text-blue-500 hover:underline">
            Crear Evento
          </Link>
        </li>
        <li>
          <Link to="/clientes" className="text-blue-500 hover:underline">
            Gestionar Clientes
          </Link>
        </li>
        <li>
          <Link to="/usuarios" className="text-blue-500 hover:underline">
            Gestionar Usuarios
          </Link>
        </li>
        <li>
          <Link to="/configuracion" className="text-blue-500 hover:underline">
            Configuración
          </Link>
        </li>
      </ul>
    </main>
  );
};

export default NavAdmin;