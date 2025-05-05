import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Contacto from "../pages/Contacto";
import Registro from "../pages/Registro";


const AppRouter = () => (
    <MainLayout>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/registro" element={<Registro />} />
            
        </Routes>
    </MainLayout>
);

export default AppRouter;
