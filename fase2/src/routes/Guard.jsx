import { useLocation, Navigate } from "react-router-dom";
import { useApp } from "../../context";

function Guard({ children, admin = false }) {
  const { user } = useApp();
  const location = useLocation();

  // Verificar autenticación
  if (!user) {
    return (
      <Navigate
        to={
          "/login?next=" +
          encodeURIComponent(location.pathname + location.search)
        }
        replace
      />
    );
  }

  // Verificar permisos de administrador
  if (admin && user.role !== "admin") {
    return <Navigate to="/perfil" replace />;
  }

  return children;
}
export default Guard;