import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Agregar from './pages/privado/Agregar';
import Confirmacion from './pages/publico/Confirmacion';
import Consultas from './pages/publico/Consultas';
import Eliminar from './pages/privado/Eliminar';
import Evaluaciones from './pages/publico/Evaluaciones';
import Inicio from './pages/publico/Inicio';
import Login from './pages/publico/Login';
import LoginAdmin from './pages/publico/LoginAdmin';
import PerfilPaciente from './pages/privado/PerfilPaciente';
import Planes from './pages/publico/Planes';
import PrivateLayout from './layouts/PrivateLayout';
import PublicLayout from './layouts/PublicLayout';
import Reserva from './pages/publico/Reserva';
import Talleres from './pages/publico/Talleres';
import MisReservas from './pages/privado/MisReservas';
import MisPlanes from './pages/privado/MisPlanes';
import Carrito from './pages/publico/Carrito';
import { pacienteActual } from './data/almacen';
import ScrollTop from './routes/ScrollTop';
import Registro from './pages/publico/Registro';
import Ver from './pages/privado/Ver';

function Acceso({ children }) {
  const location = useLocation();
  const paciente = pacienteActual();
  if (!paciente) return <Navigate to="/login" state={{ next: location.pathname }} replace />;
  return children;
}

function AccesoAdmin({ children }) {
  const location = useLocation();
  const admin = () => localStorage.getItem('isAdmin') === 'true';
  if (!admin) return <Navigate to="/login-admin" state={{ next: location.pathname }} replace />
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/consultas" element={<Consultas />} />
          <Route path="/confirmacion-reserva" element={<Confirmacion />} />
          <Route path="/evaluaciones" element={<Evaluaciones />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/reservas" element={<Reserva />} />
          <Route path="/talleres" element={<Talleres />} />
        </Route>

        <Route element={<Acceso><PrivateLayout /></Acceso>}>
          <Route path="mis-reservas" element={<MisReservas />} />
          <Route path="mis-planes" element={<MisPlanes />} />
          <Route path="perfil" element={<PerfilPaciente />} />
        </Route>
        <Route element={<AccesoAdmin><PrivateLayout /></AccesoAdmin>}>
          <Route path="admin/agregar" element={<Agregar />} />
          <Route path="admin/eliminar" element={<Eliminar />} />
          <Route path="admin/ver-todo" element={<Ver />} />
        </Route>
        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Routes>

    </BrowserRouter>
  )
}
export default App
