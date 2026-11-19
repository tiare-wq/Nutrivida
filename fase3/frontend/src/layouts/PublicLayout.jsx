import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { actual, salir } from '../service/usuarioService';
import { cerrarSesion, leerCarrito, planActivo } from '../data/almacen';

function PublicLayout() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(actual());
    const [cantidad, setCantidad] = useState(() =>
        leerCarrito(usuario?.id).reduce((total, plan) => total + plan.cantidad, 0),
    );
    const [admin, setAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');

    useEffect(() => {
        const actualizar = () => {
            setAdmin(() => localStorage.getItem('isAdmin'));
            setUsuario(actual());
            setCantidad(leerCarrito(usuario?.id).reduce((total, plan) => total + plan.cantidad, 0));
        };
        window.addEventListener('nutrivida:actualizar', actualizar);
        window.addEventListener('storage', actualizar);
        return () => {
            window.removeEventListener('nutrivida:actualizar', actualizar);
            window.removeEventListener('storage', actualizar);
        };
    }, []);

    function salirLocal() {
        salir();
        cerrarSesion();

        setUsuario(null);
        setAdmin(false);
        setCantidad(0);

        navigate('/inicio', { replace: true });
    }

    return (
        <div>
            <header>
                <div className="head-header">
                    <div>
                        <h1>
                            <Link to="/inicio">NutriVida 🍃</Link>
                        </h1>
                    </div>

                    <nav className="nav-main" aria-label="Cuenta y carrito">
                        {usuario && (
                            <Link className="usuario-actual" to="/perfil">
                                {usuario.nombre}
                            </Link>
                        )}
                        <Link className="link-header" to="/carrito">
                            <span>Carrito ({cantidad})</span>
                        </Link>
                        {usuario ? (
                            <>
                                <Link className="link-header" to="/mis-planes">
                                    <span>
                                        {planActivo(usuario) ? 'Mi plan activo' : 'Mis planes'}
                                    </span>
                                </Link>
                                <button className="link-header" type="button" onClick={salir}>
                                    <span>Salir</span>
                                </button>
                            </>
                        ) : admin ? (
                            <>
                                <Link className="link-header" to="/admin/agregar">
                                    <span>Administración</span>
                                </Link>

                                <button className="link-header" type="button" onClick={salirLocal}>
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
