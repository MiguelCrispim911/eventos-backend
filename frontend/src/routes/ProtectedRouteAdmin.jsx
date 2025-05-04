import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

const ProtectedRouteAdmin = ({ children }) => {
  // 1. Obtener el token de localStorage (como lo guardas en LoginAdministrador)
  const token = localStorage.getItem('adminToken');

  if (!token) {
    // Si no hay token, redirige al login de admin
    return <Navigate to="/administrador" replace />;
  }

  try {
    // 2. Decodificar el token (usando la estructura exacta de tu backend)
    const decoded = jwtDecode(token);
    
    const now = Date.now() / 1000; // Tiempo actual en segundos
    if (decoded.exp < now) {
      localStorage.removeItem('adminToken'); // Limpiar token expirado
      return <Navigate to="/administrador" replace />;
    }

    // 3. Verificar el tipo de usuario (usando "tipo_usuario" como en tu Python)
    if (decoded.tipo_usuario !== 'admin') {
      // Si no es admin, redirige a página no autorizada
      return <Navigate to="/no-autorizado" replace />;
    }
    
    // 4. Si todo está bien, renderiza las rutas hijas
    return children;
    
  } catch (error) {
    console.error('Error validando token:', error);
    // Si hay error decodificando, redirige al login
    return <Navigate to="/administrador" replace />;
  }
};

export default ProtectedRouteAdmin;