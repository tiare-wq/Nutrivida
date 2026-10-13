import { Container } from "react-bootstrap";
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function PublicLayout() {
    return (
        <div>
            <header>
                <div className="head-header"> 
                    <div>
                        <h1>NutriVida 🍃</h1>
                    </div>

                    <nav className="nav-main">
                    <Link className='btn-nutrivida'>
                        <img src="../../img/carrito.png" alt="Carrito" />
                    </Link>

                    {user ? (
                        <>
                        <Nav.Link as={NavLink} to="/cuenta">
                            Mi cuenta
                        </Nav.Link>
                        <Button variant="outline-success" size="sm" onClick={logout}>
                            Salir
                        </Button>
                        </>
                    ) : (
                        <Nav.Link as={NavLink} to="/login">
                        Ingresar
                        </Nav.Link>
                    )}

                    <Link className="justify-content-center btn-nutrivida" to="/login">
                        <img src="../../img/perfil.png" alt="Iniciar sesión" />
                        <span>Iniciar sesión</span>
                    </Link>
                    </nav>
                    
                </div>
            </header>

            <Navbar />

            <main>
                <Outlet />
            </main>

            <footer className="site-footer">
                <Container>
                <div>
                    <Link to="/" className="footer-brand">
                    NutriVida
                    </Link>
                    <p>Nutrición y bienestar, a tu medida.</p>
                </div>
                <div>
                    <Link to="/servicios">Servicios</Link>
                    <Link to="/reserva">Reservar una atención</Link>
                    <Link to="/cuenta">Mi cuenta</Link>
                </div>
                <p>
                    NutriVida © 2026
                    <br />
                    Proyecto académico · Sin cobros en línea
                </p>
                </Container>
            </footer>
        </div>
    );
}

export default PublicLayout;