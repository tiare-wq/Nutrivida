import { useSesion } from '../context/sesion';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cerrarSesion, pacienteActual, planActivo } from '../data/almacen';

function NavbarLateral() {
    const navigate = useNavigate();
    const { usuario } = useSesion();
    const [error, setError] = useState('');
    const [paciente, setPaciente] = useState(() => pacienteActual());
    useEffect(() => {
        const actualizar = () => setPaciente(pacienteActual());
        window.addEventListener('nutrivida:actualizar', actualizar);
        return () => window.removeEventListener('nutrivida:actualizar', actualizar);
    }, []);
    async function salir() {
        try {
            await cerrarSesion();
            navigate('/inicio');
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div className="nav-private">
            <div>
                {error && <p role="alert">{error}</p>}
                <h3>
                    <Link to="/inicio">NutriVida 🍃</Link>
                </h3>
                {paciente && <p>{paciente.nombre}</p>}
                <hr />
            </div>
            {usuario?.rol === 'PACIENTE' && (
                <nav className="nav flex-column nav-private">
                    <Link className="nav-link" to="/inicio">
                        <img src="../../img/inicio.png" alt="Inicio" />
                        Inicio
                    </Link>
                    <Link className="nav-link" to="/perfil">
                        <img src="../../img/perfil.png" alt="Perfil" />
                        Mi perfil
                    </Link>
                    <Link className="nav-link" to="/mis-mediciones">
                        Mis medidas
                    </Link>
                    <Link className="nav-link" to="/mis-reservas">
                        <img src="../../img/calendario.png" alt="Calendario" />
                        Mis reservas
                    </Link>
                    <Link className="nav-link" to="/carrito">
                        <img src="../../img/carrito.png" alt="" />
                        Carrito
                    </Link>
                    <Link className="nav-link" to="/mis-planes">
                        <img src="../../img/planesIcono.png" alt="" />
                        {planActivo(paciente) ? 'Mi plan activo' : 'Mis planes'}
                    </Link>
                    <button className="nav-link" type="button" onClick={salir}>
                        <img src="../../img/cerrarSesion.png" alt="" />
                        Salir
                    </button>
                </nav>
            )}
            {usuario?.rol === 'PROFESIONAL' && (
                <nav className="nav flex-column nav-private">
                    <p>{usuario.nombre}</p>
                    <p>{usuario.especialidad}</p>
                    <Link className="nav-link" to="/profesional/pacientes">
                        Pacientes asignados
                    </Link>
                    <button className="nav-link" type="button" onClick={salir}>
                        Salir
                    </button>
                </nav>
            )}
            {usuario?.rol === 'ADMIN' && (
                <nav className="nav flex-column nav-private">
                    <Link className="nav-link" to="/inicio">
                        <img src="../../img/inicio.png" alt="Inicio" />
                        Inicio
                    </Link>
                    <Link className="nav-link" to="/admin/pacientes">
                        Pacientes
                    </Link>
                    <Link className="nav-link" to="/admin/profesionales">
                        Profesionales
                    </Link>
                    <Link className="nav-link" to="/admin/asignaciones">
                        Asignar profesional
                    </Link>
                    <Link className="nav-link" to="/admin/usuarios">
                        Cuentas y permisos
                    </Link>
                    <Link className="nav-link" to="/admin/agregar">
                        <img src="../../img/agregar.png" alt="Agregar" />
                        Agregar servicio
                    </Link>
                    <Link className="nav-link" to="/admin/eliminar">
                        <img src="../../img/eliminar.png" alt="Eliminar" />
                        Eliminar
                    </Link>
                    <Link className="nav-link" to="/admin/ver-todo">
                        <img src="../../img/verTodo.png" alt="Ver todos" />
                        Ver todos
                    </Link>

                    <button className="nav-link" type="button" onClick={salir}>
                        <img src="../../img/cerrarSesion.png" alt="" />
                        Salir
                    </button>
                </nav>
            )}
        </div>
    );
}
export default NavbarLateral;
