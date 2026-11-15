import { useState } from 'react';
import { salir, solicitar } from '../api/usuarios';

export default function CambiarPassword() {
    const [actual, setActual] = useState('');
    const [nueva, setNueva] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [ocupado, setOcupado] = useState(false);

    async function enviar(evento) {
        evento.preventDefault();
        setOcupado(true);
        setError('');
        setMensaje('');
        try {
            await solicitar('/api/cuenta/password', {
                method: 'PUT',
                body: { actual, nueva },
            });
            setMensaje('Contraseña actualizada. Inicia sesión de nuevo con la nueva.');
            setActual('');
            setNueva('');
            await salir();
        } catch (error) {
            setError(error.message);
        } finally {
            setOcupado(false);
        }
    }

    return (
        <form className="cambiar-password" onSubmit={enviar}>
            <h2>Cambiar contraseña</h2>
            <label htmlFor="password-actual">Contraseña actual</label>
            <input
                id="password-actual"
                className="form-control mb-3"
                type="password"
                autoComplete="current-password"
                required
                maxLength={72}
                value={actual}
                onChange={(evento) => setActual(evento.target.value)}
            />
            <label htmlFor="password-nueva">Contraseña nueva</label>
            <input
                id="password-nueva"
                className="form-control mb-3"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={72}
                value={nueva}
                onChange={(evento) => setNueva(evento.target.value)}
            />
            <p>Mínimo 8 caracteres, con letras y números. Se cerrarán tus sesiones.</p>
            {error && <p role="alert">{error}</p>}
            {mensaje && <p role="status">{mensaje}</p>}
            <button className="btn btn-success" disabled={ocupado}>
                Cambiar contraseña
            </button>
        </form>
    );
}
