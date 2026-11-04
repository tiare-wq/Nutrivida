import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrar } from '../../api/usuarios';
import Campos from '../../components/CamposPaciente';
import '../../css/registro.css';

const vacio = { nombre: '', rut: '', fechaNac: '', telefono: '', correo: '' };

export default function RegistroUsuarios() {
    const [datos, setDatos] = useState({ ...vacio, password: '' });
    const [confirmar, setConfirmar] = useState('');
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const navigate = useNavigate();
    async function enviar(e) {
        e.preventDefault();
        setError('');
        if (datos.password !== confirmar) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        setOcupado(true);
        try {
            await registrar(datos);
            navigate('/perfil');
        } catch (e) {
            setError(e.message);
        } finally {
            setOcupado(false);
        }
    }
    return (
        <main className="registro">
            <section className="registro-card">
                <h1>Crear cuenta</h1>
                <p>
                    Edad mínima 14 años. RUT con guion, por ejemplo 12.345.678-5. Celular 912345678.
                </p>
                <form onSubmit={enviar}>
                    <Campos datos={datos} cambiar={setDatos} password />
                    <label htmlFor="confirmar">Confirmar contraseña</label>
                    <input
                        className="form-control"
                        id="confirmar"
                        type="password"
                        required
                        value={confirmar}
                        onChange={(e) => setConfirmar(e.target.value)}
                    />
                    {error && <p role="alert">{error}</p>}
                    <button className="btn btn-success mt-3" disabled={ocupado}>
                        Registrarse
                    </button>
                </form>
            </section>
        </main>
    );
}
