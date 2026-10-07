import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div>
            <div className="collapse" id="navbarToggleExternalContent" data-bs-theme="light">
                <div className="bg-light p-4">
                    <h5 className="text-body-emphasis h4">Menú</h5>
                    <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="/inicio">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link">Planes / Servicios</Link>
                        <ul>
                            <li><Link className="nav-item" to="html/consulta.html">Consulta Nutricional</Link></li>
                            <li><Link className="nav-item" to="html/evaluacion.html">Evaluaciones</Link></li>
                            <li><Link className="nav-item" to="/planes">Planes de Alimentación</Link></li>
                            <li><Link className="nav-item" to="html/taller.html">Talleres Grupales</Link></li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="html/reserva.html">Reservar</Link>
                    </li>
                </div>
                </div>
            <nav className="navbar navbar-light bg-light d-sm-none">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>

            <ul className="nav nav-pills d-none d-sm-flex">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/inicio">Home</Link>
                </li>
                <li className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" data-bs-toggle="dropdown" to="#" role="button" aria-expanded="false">Planes / Servicios</Link>
                    <ul className="dropdown-menu">
                        <li><Link className="dropdown-item" to="html/consulta.html">Consulta Nutricional</Link></li>
                        <li><Link className="dropdown-item" to="html/evaluacion.html">Evaluaciones</Link></li>
                        <li><Link className="dropdown-item" to="/planes">Planes de Alimentación</Link></li>
                        <li><Link className="dropdown-item" to="html/taller.html">Talleres Grupales</Link></li>
                    </ul>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="html/reserva.html">Reservar</Link>
                </li>
            </ul>
        </div>

    )
}
export default Navbar