import { Link } from 'react-router-dom';

const Dashboard = ({ username }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 text-2xl font-bold">
        Bienvenido, {username}
      </header>

      <main className="flex-1 p-6 bg-gray-100">
        <h2 className="text-xl font-semibold mb-4">Menú de navegación</h2>
        <ul className="space-y-3">
          <li>
            <Link to="/crear-evento" className="text-blue-500 hover:underline">
              Crear Evento
            </Link>
          </li>
          <li>
            <Link to="/eventos" className="text-blue-500 hover:underline">
              Ver Eventos
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

    </div>
  );
};

export default Dashboard;