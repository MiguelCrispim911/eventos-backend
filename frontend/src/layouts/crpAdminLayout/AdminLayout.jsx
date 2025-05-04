import FooterAdmin from "../../components/crpFooterAdmin/FooterAdmin";
import NavAdmin from "../../components/crpNavAdmin/NavAdmin";
import HeaderAdmin from "../../components/crpHeaderAdmin/HeaderAdmin";
import { Outlet } from "react-router-dom";
import "./AdminLayout.css"; // Importa el CSS
import fotoAdminLateral from "../../assets/imagenes/fotoAdminLateral.jpg";

const AdminLayout = () => (
  <div className="admin-layout">
    <HeaderAdmin />
    <div className="admin-content-wrapper">
      <NavAdmin />
      <main className="admin-main-content">
        <Outlet />
      </main>
      <div className="admin-image-sidebar">
        {/* Aquí va tu imagen */}
        <img src={fotoAdminLateral} alt="Sidebar" />
      </div>
    </div>
    <FooterAdmin />
  </div>
);

export default AdminLayout;