import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Contacto from "../pages/Contacto/Contacto";
import Registro from "../pages/Registro/Registro";
import Perfil from "../pages/Perfil/Perfil";


const AppRouter = () => (
    <MainLayout>
        <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/registro" element={<Registro />} />
            
            {/* Rutas protegidas que requieren autenticación de cliente */}
            <Route 
                path="/perfil" 
                element={
                    
                        <Perfil />
                    
                } 
            />
            
            {/* Puedes agregar más rutas protegidas aquí */}
        </Routes>
    </MainLayout>
);

export default AppRouter;
