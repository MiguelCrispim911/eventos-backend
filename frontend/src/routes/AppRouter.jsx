import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import LoginAdministrador from "../pages/crpLoginAdministrador/LoginAdministrador";

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
      {/* más rutas privadas o de admin aquí */}
    </Route>
  </Routes>
);

export default AppRouter;