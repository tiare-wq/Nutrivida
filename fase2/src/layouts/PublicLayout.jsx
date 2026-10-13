import { Outlet, Link } from "react-router-dom";

import { useApp } from "../../context";

import Navbar from "../components/Navbar";

function PublicLayout() {
    const { user, items } = useApp();

    return (
        <div>
            <header>
                <div className="head-header"> 
                    <div>
                        <h1>NutriVida 🍃</h1>
                    </div>

                    <nav className="nav-main">
                        <Link to="/carrito" className="cart-nav">
                            Carrito{" "}
                            <span className="cart-badge">
                                {items.reduce((n, i) => n + i.quantity, 0)}
                            </span>
                        </Link>
                        
                        {user ? (
                            <>
                            <Link to="/perfil" className="cart-nav">
                                Mi perfil
                            </Link>
                            <Button className="cart-nav" variant="outline-success" size="sm" onClick={logout}>
                                Salir
                            </Button>
                            </>
                        ) : (
                            <Link to="/login" className="cart-nav">
                                Ingresar
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            <Navbar />

            <main>
                <Outlet />
            </main>

            <footer>
                <div>
                    <Link to="/" className="footer-brand">
                    NutriVida
                    </Link>
                    <br />
                    <p>Nutrición y bienestar, a tu medida.</p>
                </div>
                <div>
                    <Link to="/servicios">Servicios</Link>
                    <br />
                    <Link to="/reserva">Reservar una atención</Link>
                    <br />
                    <Link to="/cuenta">Mi cuenta</Link>
                </div>
                <div>
                    <p>
                        NutriVida © 2026
                        <br />
                        Proyecto académico · Sin cobros en línea
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default PublicLayout;