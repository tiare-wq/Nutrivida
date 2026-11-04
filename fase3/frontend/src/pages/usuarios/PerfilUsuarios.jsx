import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { editarPerfil, solicitar, salir } from '../../api/usuarios';
import { useSesion } from '../../context/sesion';
import Campos from '../../components/CamposPaciente';
import CambiarPassword from '../../components/CambiarPassword';

const vacio = { nombre: '', rut: '', fechaNac: '', telefono: '', correo: '' };

export default function PerfilUsuarios() {
    const { usuario } = useSesion();
    const [datos, setDatos] = useState({ ...vacio, ...usuario });
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const navigate = useNavigate();
    async function enviar(e) {
        e.preventDefault();
        setOcupado(true);
        setError('');
        setMensaje('');
        try {
            setDatos(await editarPerfil(datos));
            setMensaje('Datos actualizados correctamente.');
        } catch (e) {
            setError(e.message);
        } finally {
            setOcupado(false);
        }
    }
    async function eliminar() {
        if (!window.confirm('¿Eliminar definitivamente tu cuenta de paciente?')) {
            return;
        }
        setError('');
        try {
            await solicitar('/api/pacientes/me', { method: 'DELETE' });
            await salir();
            navigate('/inicio');
        } catch (e) {
            setError(e.message);
        }
    }
    return (
        <section className="card-private">
            <h1>Mi perfil</h1>
            <form onSubmit={enviar}>
                <Campos datos={datos} cambiar={setDatos} />
                <button className="btn btn-success" disabled={ocupado}>
                    Guardar cambios
                </button>
            </form>
            {mensaje && <p role="status">{mensaje}</p>}
            {error && <p role="alert">{error}</p>}
            <CambiarPassword />
            <button className="btn btn-outline-danger mt-3" onClick={eliminar}>
                Eliminar mi cuenta
            </button>
        </section>
    );
}
