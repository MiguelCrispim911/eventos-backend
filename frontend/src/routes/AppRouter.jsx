import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import LoginAdministrador from "../pages/crpLoginAdministrador/LoginAdministrador";
import AdminDashboard from "../pages/crpAdminDashboard/AdminDashboard";
import CrearAdministrador from "../pages/crpCrearAdministrador/CrearAdministrador";
import CrearEvento from "../pages/crpCrearEvento/CrearEvento";

const AppRouter = () => (
  <Routes>
    {/* Layout de usuario normal */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      {/* más rutas públicas aquí */}
    </Route>

    {/* Layout de administrador */}
    <Route element={<AdminLayout />}>
      <Route path="/administrador" element={<LoginAdministrador />} />
      <Route path="/administrador/dashboard" element={<AdminDashboard />} />
      <Route path="/administrador/dashboard/crearAdministrador" element={<CrearAdministrador />} />
      <Route path="/administrador/dashboard/crearEvento" element={<CrearEvento />} />
      {/* más rutas privadas o de admin aquí */}
    </Route>
  </Routes>
);

export default AppRouter;