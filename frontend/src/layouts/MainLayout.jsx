import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const MainLayout = ({ children }) => (
    <>
    <Navbar />
    <main className="container">
        {children}
    </main>
    <Footer />
    </>
)

export default MainLayout;