import Footer from "../components/Footer";
import NavAdmin from "../components/NavAdmin"; // Ajusta la ruta según tu estructura
import { Outlet } from "react-router-dom";
const AdminLayout = () => (
    <>
    <NavAdmin />
    <main className="container">
        <Outlet />
    </main>
    <Footer />
    </>
)

export default AdminLayout;