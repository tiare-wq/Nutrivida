import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { cerrarSesion, pacienteActual, planActivo } from '../data/almacen';

function NavbarLateral() {
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState(() => pacienteActual());
    useEffect(() => {
        const actualizar = () => setPaciente(pacienteActual());
        window.addEventListener('nutrivida:actualizar', actualizar);
        return () => window.removeEventListener('nutrivida:actualizar', actualizar);
    }, []);
    function salir() {
        cerrarSesion();
        navigate('/inicio');
    }

    return (
        <div className="nav-private">
            <div>
                <h3><Link to="/inicio">NutriVida 🍃</Link></h3>
                {paciente && <p>{paciente.nombre}</p>}
                <hr />
            </div>
            {localStorage.getItem('pacienteId') && (
                <nav className="nav flex-column nav-private">
                    <Link className="nav-link" to="/inicio">
                        <img src="../../img/inicio.png" alt="Inicio" />
                        Inicio
                    </Link>
                    <Link className="nav-link" to="/perfil">
                        <img src="../../img/perfil.png" alt="Perfil" />
                        Mi perfil
                    </Link>
                    <Link className="nav-link" to="/mis-reservas">
                        <img src="../../img/calendario.png" alt="Calendario" />
                        Mis reservas
                    </Link>
                    <Link className="nav-link" to="/carrito"><img src="../../img/carrito.png" alt="" />Carrito</Link>
                    <Link className="nav-link" to="/mis-planes"><img src="../../img/planesIcono.png" alt="" />{planActivo(paciente) ? 'Mi plan activo' : 'Mis planes'}</Link>
                    <button className="nav-link" type="button" onClick={salir}>
                        <img src="../../img/cerrarSesion.png" alt="" />Salir
                    </button>
                </nav>
            )}
            {localStorage.getItem('isAdmin') && (
                <nav className="nav flex-column nav-private">
                    <Link className="nav-link" to="/inicio">
                        <img src="../../img/inicio.png" alt="Inicio" />
                        Inicio
                    </Link>
                    <Link className="nav-link" to="/admin/agregar">
                        <img src="../../img/agregar.png" alt="Agregar" />
                        Agregar servicio
                    </Link>
                    <Link className="nav-link" to="/admin/eliminar">
                        <img src="../../img/eliminar.png" alt="Eliminar" />
                        Eliminar
                    </Link>
                    <Link className="nav-link" to="/admin/ver-todo"><img src="../../img/verTodo.png" alt="Ver todos" />Ver todos</Link>
                    
                    <button className="nav-link" type="button" onClick={salir}>
                        <img src="../../img/cerrarSesion.png" alt="" />Salir
                    </button>
                </nav>
            )}
        </div>
    )
}
export default NavbarLateral;
