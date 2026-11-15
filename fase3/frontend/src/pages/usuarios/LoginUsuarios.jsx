import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ingresar } from '../../api/usuarios';

export default function LoginUsuarios({ admin = false, profesional = false }) {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const navigate = useNavigate();
    const rol = profesional ? 'PROFESIONAL' : admin ? 'ADMIN' : 'PACIENTE';
    const titulo = profesional
        ? 'Acceso de profesionales'
        : admin
          ? 'Acceso de administración'
          : 'Iniciar sesión';
    async function enviar(e) {
        e.preventDefault();
        setOcupado(true);
        setError('');
        try {
            await ingresar(correo, password, rol);
            navigate(
                profesional ? '/profesional/pacientes' : admin ? '/admin/pacientes' : '/perfil',
            );
        } catch (e) {
            setError(e.message);
        } finally {
            setOcupado(false);
        }
    }
    return (
        <main className="login d-flex justify-content-center align-items-center min-vh-100">
            <section className="login-section">
                <h1>{titulo}</h1>
                <form onSubmit={enviar}>
                    <label htmlFor="correo">Correo electrónico</label>
                    <input
                        id="correo"
                        className="form-control"
                        type="email"
                        autoComplete="username"
                        required
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        className="form-control"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p role="alert">{error}</p>}
                    <button className="btn btn-success mt-3" disabled={ocupado}>
                        {ocupado ? 'Ingresando…' : 'Ingresar'}
                    </button>
                </form>
                <p>
                    <Link to={admin ? '/login' : '/login-admin'}>
                        {admin ? 'Acceso pacientes' : 'Acceso administración'}
                    </Link>
                </p>
                <p>
                    <Link to="/login-profesional">Acceso de profesionales</Link>
                </p>
                <Link to="/registro">Crear cuenta de paciente</Link>
            </section>
        </main>
    );
}
