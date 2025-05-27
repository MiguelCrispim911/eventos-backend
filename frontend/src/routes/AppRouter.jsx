import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLoginLayout from "../layouts/crpAdminLoginLayout/AdminLoginLayout";
import AdminLayout from "../layouts/crpAdminLayout/AdminLayout";
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
import ProtectedRouteAdmin from './ProtectedRouteAdmin';
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Contacto from "../pages/Contacto/Contacto";
import Registro from "../pages/Registro/Registro";
import Perfil from "../pages/Perfil/Perfil";
import EditarPerfil from "../pages/EditarPerfil/EditarPerfil";
import ExplorarEventos from "../pages/ClientesExEventos/ExplorarEventos";
import Funciones from "../pages/Funciones/Funciones";
import Compras from "../pages/Compras/Compras";

const AppRouter = () => (
  <Routes>
    {/* Rutas principales con MainLayout */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/editar-perfil" element={<EditarPerfil />} />
      <Route path="/eventos" element={<ExplorarEventos />} />
      <Route path="/funciones/:id_evento" element={<Funciones />} />
      <Route path="/comprar-boletos/:id_funcion" element={<Compras />} />
      {/* más rutas públicas aquí */}
    </Route>

    {/* Rutas de login de administrador */}
    <Route element={<AdminLoginLayout />}>
      <Route path="/administrador" element={<LoginAdministrador />} />
    </Route>

    {/* Rutas de administrador protegidas */}
    <Route element={<AdminLayout />}>
      <Route 
        path="/administrador/dashboard" 
        element={
          <ProtectedRouteAdmin>
            <AdminDashboard />
          </ProtectedRouteAdmin>
        } 
      />
      <Route 
        path="/administrador/dashboard/crearAdministrador" 
        element={
          <ProtectedRouteAdmin>
            <CrearAdministrador />
          </ProtectedRouteAdmin>
        } 
      />
      <Route 
        path="/administrador/dashboard/crearEvento" 
        element={
          <ProtectedRouteAdmin>
            <CrearEvento />
          </ProtectedRouteAdmin>
        } 
      />
      <Route 
        path="/administrador/dashboard/crearUbicacion" 
        element={
          <ProtectedRouteAdmin>
            <CrearUbicacion />
          </ProtectedRouteAdmin>
        } 
      />
      <Route 
        path="/administrador/dashboard/crearFuncion" 
        element={
          <ProtectedRouteAdmin>
            <CrearFuncion />
          </ProtectedRouteAdmin>
        } 
      />
      <Route 
        path="/administrador/dashboard/crearTipoBoleta" 
        element={
          <ProtectedRouteAdmin>
            <CrearTipoBoleta />
          </ProtectedRouteAdmin>
        } 
      />
      <Route 
        path="/administrador/dashboard/listarEventos" 
        element={
          <ProtectedRouteAdmin>
            <ListarEventos />
          </ProtectedRouteAdmin>
        } 
      />
      <Route 
        path="/administrador/dashboard/listarAdministradores" 
        element={
          <ProtectedRouteAdmin>
            <ListarAdministradores />
          </ProtectedRouteAdmin>
        } 
      />
      <Route 
        path="/administrador/dashboard/listarFunciones" 
        element={
          <ProtectedRouteAdmin>
            <ListarFunciones />
          </ProtectedRouteAdmin>
        } 
      />
      <Route 
        path="/administrador/dashboard/listarTipoBoleta" 
        element={
          <ProtectedRouteAdmin>
            <ListarTipoBoleta />
          </ProtectedRouteAdmin>
        } 
      />
      <Route 
        path="/administrador/dashboard/listarUbicaciones" 
        element={
          <ProtectedRouteAdmin>
            <ListarUbicaciones />
          </ProtectedRouteAdmin>
        } 
      />
    </Route>
  </Routes>
);

export default AppRouter;
