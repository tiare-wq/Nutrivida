import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { iniciarSesionAdmin } from "../../data/almacen";

function LoginAdmin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!email.includes('@')) {
            setError('El correo electrónico no es válido');
            return
        }
        if (password.length < 4) {
            setError('La contraseña debe tener al menos 4 caracteres');
            return
        }

        const admin = iniciarSesionAdmin(email, password);

        if (!admin) {
            setError('Se necesita permisos de administrador para acceder a este recurso.');
            return;
        }
        setError('');

        navigate('/admin/agregar');
    }
    return (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 100-vw login">
            <section className="login-section">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1 className='login-subtitulo'>Iniciar Sesión de Administrador</h1>
                    <div className="mb-3">
                        <label className="login-label" htmlFor="login-correo">
                        Correo electrónico
                        </label>
                        <input
                        id="login-correo"
                        type="email"
                        className='login-input'
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="login-label" htmlFor="login-password">
                        Contraseña
                        </label>
                        <input
                        id="login-password"
                        type="password"
                        className='login-input'
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    {
                        error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}
                    <button
                    type="submit"
                    className="btn btn-success"
                    >
                    Ingresar
                    </button>
                </form>
                <a className='forgot-password' href="recuperar-contraseña">¿Olvidaste tu contraseña?</a>
            </section>
        </div>
    );
}
export default LoginAdmin;