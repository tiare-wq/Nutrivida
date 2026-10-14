import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { cerrarSesion, leerCarrito, pacienteActual, planActivo } from '../data/almacen';

function PublicLayout() {
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState(() => pacienteActual());
    const [cantidad, setCantidad] = useState(() => leerCarrito(pacienteActual()?.id).reduce((total, plan) => total + plan.cantidad, 0));

    useEffect(() => {
        const actualizar = () => {
            const actual = pacienteActual();
            setPaciente(actual);
            setCantidad(leerCarrito(actual?.id).reduce((total, plan) => total + plan.cantidad, 0));
        };
        window.addEventListener('nutrivida:actualizar', actualizar);
        window.addEventListener('storage', actualizar);
        return () => {
            window.removeEventListener('nutrivida:actualizar', actualizar);
            window.removeEventListener('storage', actualizar);
        };
    }, []);

    function salir() {
        cerrarSesion();
        navigate('/inicio');
    }

    return (
        <div>
            <header>
                <div className="head-header"> 
                    <div>
                        <h1><Link to="/inicio">NutriVida 🍃</Link></h1>
                    </div>

                    <nav className="nav-main" aria-label="Cuenta y carrito">
                    {paciente && <Link className="usuario-actual" to="/perfil">{paciente.nombre} · ID {paciente.id}</Link>}
                    <Link className="btn-nutrivida" to="/carrito">
                        <img src="../../img/carrito.png" alt="" />
                        <span>Carrito ({cantidad})</span>
                    </Link>
                    {paciente ? <>
                        <Link className="btn-nutrivida" to="/mis-planes"><span>{planActivo(paciente) ? 'Mi plan activo' : 'Mis planes'}</span></Link>
                        <button className="btn-nutrivida" type="button" onClick={salir}><span>Salir</span></button>
                    </> : <Link className="justify-content-center btn-nutrivida" to="/login">
                        <img src="../../img/perfil.png" alt="" /><span>Iniciar sesión</span>
                    </Link>}
                    </nav>
                    
                </div>
            </header>

            <Navbar />

            <main>
                <Outlet />
            </main>

            <footer>
                <p>NutriVida © 2026 NutriVida SpA</p>
            </footer>
        </div>
    );
}

export default PublicLayout;
