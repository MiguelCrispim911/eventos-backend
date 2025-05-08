import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

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