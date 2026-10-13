import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import AdminServicios from './pages/privado/AdminServicios';
import Confirmacion from './pages/publico/Confirmacion';
import Consultas from './pages/publico/Consultas';
import Evaluaciones from './pages/publico/Evaluaciones';
import Inicio from './pages/publico/Inicio';
import Login from './pages/publico/Login';
import PerfilPaciente from './pages/privado/PerfilPaciente';
import Planes from './pages/publico/Planes';
import PrivateLayout from './layouts/PrivateLayout';
import PublicLayout from './layouts/PublicLayout';
import Reserva from './pages/publico/Reserva';
import Talleres from './pages/publico/Talleres';
import MisReservas from './pages/privado/MisReservas';

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/consultas" element={<Consultas />} />
          <Route path="/confirmacion-reserva" element={<Confirmacion />} />
          <Route path="/evaluaciones" element={<Evaluaciones />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/reservas" element={<Reserva />} />
          <Route path="/talleres" element={<Talleres />} />
        </Route>

        <Route element={<PrivateLayout />}>
          <Route path="admin-servicios" element={<AdminServicios />} />
          <Route path="mis-reservas" element={<MisReservas />} />
          <Route path="perfil" element={<PerfilPaciente />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;