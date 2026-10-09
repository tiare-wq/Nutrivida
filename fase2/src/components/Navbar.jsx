import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div>
            {/* MENÚ HAMBURGUESA: PANTALLAS < SM */}
            <div
                className="collapse"
                id="navbarToggleExternalContent"
                data-bs-theme="light"
            >
                <div className="bg-light p-4">
                    <h5 className="text-body-emphasis h4">
                        Menú
                    </h5>

                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link className="nav-link" to="/inicio">
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <span className="nav-link">
                                Planes / Servicios
                            </span>

                            <ul className="list-unstyled ps-3">
                                <li>
                                    <Link className="nav-link" to="/consultas">
                                        Consulta Nutricional
                                    </Link>
                                </li>
                                <li>
                                    <Link className="nav-link" to="/evaluaciones">
                                        Evaluaciones
                                    </Link>
                                </li>
                                <li>
                                    <Link className="nav-link" to="/planes">
                                        Planes de Alimentación
                                    </Link>
                                </li>
                                <li>
                                    <Link className="nav-link" to="/talleres">
                                        Talleres Grupales
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/reservas">
                                Reservar
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <nav className="navbar navbar-light bg-light d-sm-none">
                <div className="container-fluid">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarToggleExternalContent"
                        aria-controls="navbarToggleExternalContent"
                        aria-expanded="false"
                        aria-label="Abrir menú"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>

            {/* MENÚ HORIZONTAL: PANTALLAS >= SM */}
            <ul className="nav nav-pills d-none d-sm-flex">
                <li className="nav-item">
                    <Link className="nav-link" to="/inicio">
                        Home
                    </Link>
                </li>

                <li className="nav-item dropdown">
                    <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Planes / Servicios
                    </a>

                    <ul className="dropdown-menu">
                        <li>
                            <Link className="dropdown-item" to="/consultas">
                                Consulta Nutricional
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item" to="/evaluaciones">
                                Evaluaciones
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item" to="/planes">
                                Planes de Alimentación
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item" to="/talleres">
                                Talleres Grupales
                            </Link>
                        </li>
                    </ul>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" to="/reservas">
                        Reservar
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default Navbar;