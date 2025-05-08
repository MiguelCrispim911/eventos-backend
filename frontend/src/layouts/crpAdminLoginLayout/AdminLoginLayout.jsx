import "./AdminLoginLayout.css"; // Importa el CSS
import { Outlet } from "react-router-dom";

const AdminLoginLayout = () => (
  <div className="admin-login-layout-container">
    <Outlet /> {/* Esto renderizará tu formulario de login */}
  </div>
);

export default AdminLoginLayout;
