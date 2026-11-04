import Atencion from './pages/profesionales/Atencion';
import Profesionales from './pages/administracion/Profesionales';
import Asignaciones from './pages/administracion/Asignaciones';
import MisMediciones from './pages/usuarios/MisMediciones';
import { Protegida } from './components/Sesion';
import Cuentas from './pages/Cuentas';
import {
    LoginUsuarios,
    RegistroUsuarios,
    PerfilUsuarios,
    AdministrarPacientes,
} from './pages/Usuarios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Agregar from './pages/privado/Agregar';
import Confirmacion from './pages/publico/Confirmacion';
import Consultas from './pages/publico/Consultas';
import Eliminar from './pages/privado/Eliminar';
import Evaluaciones from './pages/publico/Evaluaciones';
import Inicio from './pages/publico/Inicio';

import Planes from './pages/publico/Planes';
import PrivateLayout from './layouts/PrivateLayout';
import PublicLayout from './layouts/PublicLayout';
import Reserva from './pages/publico/Reserva';
import Talleres from './pages/publico/Talleres';
import MisReservas from './pages/privado/MisReservas';
import MisPlanes from './pages/privado/MisPlanes';
import Carrito from './pages/publico/Carrito';

import ScrollTop from './routes/ScrollTop';

import Ver from './pages/privado/Ver';

function Acceso({ children }) {
    return <Protegida rol="PACIENTE">{children}</Protegida>;
}
function AccesoAdmin({ children }) {
    return <Protegida rol="ADMIN">{children}</Protegida>;
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
                    <Route path="/login" element={<LoginUsuarios />} />
                    <Route path="/login-profesional" element={<LoginUsuarios profesional />} />
                    <Route path="/login-admin" element={<LoginUsuarios admin />} />
                    <Route path="/planes" element={<Planes />} />
                    <Route path="/registro" element={<RegistroUsuarios />} />
                    <Route path="/reservas" element={<Reserva />} />
                    <Route path="/talleres" element={<Talleres />} />
                </Route>

                <Route
                    element={
                        <Acceso>
                            <PrivateLayout />
                        </Acceso>
                    }
                >
                    <Route path="mis-reservas" element={<MisReservas />} />
                    <Route path="mis-planes" element={<MisPlanes />} />
                    <Route path="mis-mediciones" element={<MisMediciones />} />
                    <Route path="perfil" element={<PerfilUsuarios />} />
                </Route>
                <Route
                    element={
                        <AccesoAdmin>
                            <PrivateLayout />
                        </AccesoAdmin>
                    }
                >
                    <Route path="admin/pacientes" element={<AdministrarPacientes />} />
                    <Route path="admin/profesionales" element={<Profesionales />} />
                    <Route path="admin/asignaciones" element={<Asignaciones />} />
                    <Route path="admin/usuarios" element={<Cuentas />} />
                    <Route path="admin/agregar" element={<Agregar />} />
                    <Route path="admin/eliminar" element={<Eliminar />} />
                    <Route path="admin/ver-todo" element={<Ver />} />
                </Route>
                <Route
                    element={
                        <Protegida rol="PROFESIONAL">
                            <PrivateLayout />
                        </Protegida>
                    }
                >
                    <Route path="profesional/pacientes" element={<Atencion />} />
                </Route>
                <Route path="*" element={<Navigate to="/inicio" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;
