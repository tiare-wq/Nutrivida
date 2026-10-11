
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/registro.css';

function Registro() {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        setError('');
        setMensaje('');

        if (!nombre.trim() || !apellido.trim() || !email.trim()
            || !password || !confirmarPassword) {
            setError('Todos los campos son obligatorios');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Ingresa un correo electrónico válido');
            return;
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        if (password !== confirmarPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setMensaje('Formulario validado correctamente. El registro aún no está conectado a una base de datos.');
    };

    return (
        <main className="registro">
            <section className="registro-card">
                <h1>Crear cuenta</h1>
                <p>Regístrate y comienza tu experiencia en NutriVida 🍃</p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        id="nombre"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        autoComplete="given-name"
                        required
                    />

                    <label htmlFor="apellido">Apellido</label>
                    <input
                        id="apellido"
                        type="text"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        autoComplete="family-name"
                        required
                    />

                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />

                    <label htmlFor="confirmar">Confirmar contraseña</label>
                    <input
                        id="confirmar"
                        type="password"
                        value={confirmarPassword}
                        onChange={(e) => setConfirmarPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                    />

                    {error && <p className="registro-error" role="alert">{error}</p>}
                    {mensaje && <p className="registro-exito" role="status">{mensaje}</p>}

                    <button type="submit" className="btn btn-success">
                        Registrarse
                    </button>
                </form>

                <p className="registro-login">
                    ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </section>
        </main>
    );
}

export default Registro;
