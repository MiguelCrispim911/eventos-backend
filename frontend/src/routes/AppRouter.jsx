import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLoginLayout from "../layouts/crpAdminLoginLayout/AdminLoginLayout";
import AdminLayout from "../layouts/crpAdminLayout/AdminLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ExplorarEventos from "../pages/ClientesExEventos/ExplorarEventos";
import LoginAdministrador from "../pages/crpLoginAdministrador/LoginAdministrador";
import AdminDashboard from "../pages/crpAdminDashboard/AdminDashboard";
import CrearAdministrador from "../pages/crpCrearAdministrador/CrearAdministrador";
import CrearEvento from "../pages/crpCrearEvento/CrearEvento";
import CrearUbicacion from "../pages/crpCrearUbicacion/CrearUbicacion";
import CrearFuncion from "../pages/crpCrearFuncion/CrearFuncion";
import CrearTipoBoleta from "../pages/crpCrearTipoBoleta/CrearTipoBoleta";
import ListarEventos from "../pages/crpListarEventos/ListarEventos";
import ListarAdministradores from "../pages/crpListarAdministradores/ListarAdministradores";
import ListarFunciones from "../pages/crpListarFunciones/ListarFunciones";
import ListarTipoBoleta from "../pages/crpListarTipoBoleta/ListarTipoBoleta";
import ListarUbicaciones from "../pages/crpListarUbicaciones/ListarUbicaciones";
import ProtectedRouteAdmin from './ProtectedRouteAdmin'; // Importa el componente ProtectedRoute

const AppRouter = () => (
  <Routes>
    {/* Layout de usuario normal */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/eventos" element={<ExplorarEventos />} />
      {/* más rutas públicas aquí */}
    </Route>

    <Route element={<AdminLoginLayout />}>
      <Route path="/administrador" element={<LoginAdministrador />} />
    </Route>


    {/* Layout de administrador */}
    <Route element={<AdminLayout />}>
      <Route path="/administrador" element={<LoginAdministrador />} />
      <Route path="/administrador/dashboard" element={<ProtectedRouteAdmin><AdminDashboard /></ProtectedRouteAdmin>} />
      <Route path="/administrador/dashboard/crearAdministrador" element={<ProtectedRouteAdmin><CrearAdministrador /></ProtectedRouteAdmin>} />
      <Route path="/administrador/dashboard/crearEvento" element={<ProtectedRouteAdmin><CrearEvento /></ProtectedRouteAdmin>} />
      <Route path="/administrador/dashboard/crearUbicacion" element={<ProtectedRouteAdmin><CrearUbicacion /></ProtectedRouteAdmin>} />
      <Route path="/administrador/dashboard/crearFuncion" element={<ProtectedRouteAdmin><CrearFuncion /></ProtectedRouteAdmin>} />
      <Route path="/administrador/dashboard/crearTipoBoleta" element={<ProtectedRouteAdmin><CrearTipoBoleta /></ProtectedRouteAdmin>} />
      <Route path="/administrador/dashboard/listarEventos" element={<ProtectedRouteAdmin><ListarEventos /></ProtectedRouteAdmin>} />
      <Route path="/administrador/dashboard/listarAdministradores" element={<ProtectedRouteAdmin><ListarAdministradores /></ProtectedRouteAdmin>} />
      <Route path="/administrador/dashboard/listarFunciones" element={<ProtectedRouteAdmin><ListarFunciones /></ProtectedRouteAdmin>} />
      <Route path="/administrador/dashboard/listarTipoBoleta" element={<ProtectedRouteAdmin><ListarTipoBoleta /></ProtectedRouteAdmin>} />
      <Route path="/administrador/dashboard/listarUbicaciones" element={<ProtectedRouteAdmin><ListarUbicaciones /></ProtectedRouteAdmin>} />
      {/* más rutas privadas o de admin aquí */}
    </Route>
  </Routes>
);

export default AppRouter;