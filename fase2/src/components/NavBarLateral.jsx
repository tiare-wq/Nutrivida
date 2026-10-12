import { Link } from "react-router-dom";

function NavbarLateral() {
    return (
        <div className="nav-private">
            <div>
                <h3>NutriVida 🍃</h3>
                <hr />
            </div>
            <nav className="nav flex-column nav-private">
                <Link className="nav-link" to="/perfil">
                    <img src="../../img/perfil.png" alt="Perfil" />
                    Mi perfil
                </Link>
                <Link className="nav-link" to="/mis-reservas">
                    <img src="../../img/calendario.png" alt="Calendario" />
                    Mis reservas
                </Link>
                <Link className="nav-link" to="/inicio"
                onClick={() => localStorage.removeItem("pacienteId")}>
                    <img src="../../img/cerrarSesion.png" alt="Cerrar sesión" />
                    Cerrar sesión
                </Link>
            </nav>
        </div>
    )
}
export default NavbarLateral;