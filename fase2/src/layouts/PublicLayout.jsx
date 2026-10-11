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

            <footer>
                <p>NutriVida © 2026 NutriVida SpA</p>
            </footer>
        </div>
    );
}

export default PublicLayout;