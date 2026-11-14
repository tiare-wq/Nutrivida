import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'
import Navbar from '../components/Navbar';
import { cerrarSesion, leerCarrito, pacienteActual, planActivo } from '../data/almacen';

function PublicLayout() {
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState(() => pacienteActual());
    const [cantidad, setCantidad] = useState(() => leerCarrito(pacienteActual()?.id).reduce((total, plan) => total + plan.cantidad, 0));
    const [admin, setAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');

    useEffect(() => {
        const actualizar = () => {
            setAdmin(() => localStorage.getItem('isAdmin'));
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
                    {paciente && <Link className="usuario-actual" to="/perfil">{paciente.nombre}</Link>}
                    <Link className="link-header" to="/carrito">
                        <span>Carrito ({cantidad})</span>
                    </Link>
                    {paciente ? <>
                        <Link className="link-header" to="/mis-planes"><span>{planActivo(paciente) ? 'Mi plan activo' : 'Mis planes'}</span></Link>
                        <button className="link-header" type="button" onClick={salir}><span>Salir</span></button>
                    </> : admin ? (
                        <>
                            <Link className="link-header" to="/admin/agregar">
                                <span>Administración</span>
                            </Link>

                            <button className="link-header" type="button" onClick={salir}>
                                <span>Salir</span>
                            </button>
                        </>
                    ) : (
                        <div>
                            <Link className="link-header" to="/login">
                                <span>Iniciar sesión</span>
                            </Link>

                            <Link className="link-header" to="/registro">
                                <span>Registrarse</span>
                            </Link>
                        </div>
                    )}
                    </nav>
                    
                </div>
                <Navbar />
            </header>

            <main>
                <Outlet />
            </main>
            
            <Footer />
        </div>
    );
}

export default PublicLayout;
