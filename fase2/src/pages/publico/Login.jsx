import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { agregarPlan, iniciarSesion } from '../../data/almacen';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

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

        const paciente = iniciarSesion(email, password);

        if (!paciente) {
            setError('Es posible que el correo electrónico o la contraseña no esté conectado a ninguna cuenta.');
            return;
        }
        setError('');

        if (location.state?.planId) {
            const aviso = agregarPlan(location.state.planId);
            if (aviso) setError(aviso);
            else navigate('/carrito');
        } else {
            navigate(location.state?.next || '/perfil', { state: location.state?.reserva });
        }
    }
    return (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 100-vw login">
            <section className="login-section">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1 className='login-subtitulo'>Iniciar Sesión</h1>
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
                <p>¿No tienes una cuenta?
                    <br />
                    <Link to="/registro"> Regístrate aquí</Link>
                </p>
            </section>
        </div>
    )
}
export default Login;
