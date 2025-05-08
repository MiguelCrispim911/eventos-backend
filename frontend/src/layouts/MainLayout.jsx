import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";
const MainLayout = () => (
    <>
    <Navbar />
    <main className="container">
        <Outlet />
    </main>
    <Footer />
    </>
)

export default MainLayout;