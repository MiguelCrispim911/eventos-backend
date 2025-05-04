import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLoginLayout from "../layouts/crpAdminLoginLayout/AdminLoginLayout";
import AdminLayout from "../layouts/crpAdminLayout/AdminLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
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

const AppRouter = () => (
  <Routes>
    {/* Layout de usuario normal */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      {/* más rutas públicas aquí */}
    </Route>

    <Route element={<AdminLoginLayout />}>
      <Route path="/administrador" element={<LoginAdministrador />} />
    </Route>


    {/* Layout de administrador */}
    <Route element={<AdminLayout />}>
      <Route path="/administrador" element={<LoginAdministrador />} />
      <Route path="/administrador/dashboard" element={<AdminDashboard />} />
      <Route path="/administrador/dashboard/crearAdministrador" element={<CrearAdministrador />} />
      <Route path="/administrador/dashboard/crearEvento" element={<CrearEvento />} />
      <Route path="/administrador/dashboard/crearUbicacion" element={<CrearUbicacion />} />
      <Route path="/administrador/dashboard/crearFuncion" element={<CrearFuncion />} />
      <Route path="/administrador/dashboard/crearTipoBoleta" element={<CrearTipoBoleta />} />
      <Route path="/administrador/dashboard/listarEventos" element={<ListarEventos />} />
      <Route path="/administrador/dashboard/listarAdministradores" element={<ListarAdministradores />} />
      <Route path="/administrador/dashboard/listarFunciones" element={<ListarFunciones />} />
      <Route path="/administrador/dashboard/listarTipoBoleta" element={<ListarTipoBoleta />} />
      <Route path="/administrador/dashboard/listarUbicaciones" element={<ListarUbicaciones />} />
      {/* más rutas privadas o de admin aquí */}
    </Route>
  </Routes>
);

export default AppRouter;