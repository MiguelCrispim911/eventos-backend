import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
const AdminLayout = () => (
    <>
    <main className="container">
        <Outlet />
    </main>
    <Footer />
    </>
)

export default AdminLayout;