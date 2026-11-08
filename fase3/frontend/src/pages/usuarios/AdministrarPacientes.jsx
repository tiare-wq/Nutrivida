import { useEffect, useState } from 'react';
import { solicitar } from '../../api/usuarios';
import Campos from '../../components/CamposPaciente';
import { normalizarRut, RUT_LARGO_MAX } from '../../constants/rut';

const vacio = { nombre: '', rut: '', fechaNac: '', telefono: '', correo: '' };

export default function AdministrarPacientes() {
    const [lista, setLista] = useState([]);
    const [datos, setDatos] = useState({ ...vacio, password: '' });
    const [buscarRut, setBuscarRut] = useState('');
    const [id, setId] = useState(null);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [ocupado, setOcupado] = useState(false);
    async function cargar() {
        setLista(await solicitar('/api/admin/pacientes'));
    }
    useEffect(() => {
        let activo = true;
        solicitar('/api/admin/pacientes')
            .then((datos) => {
                if (activo) {
                    setLista(datos);
                }
            })
            .catch((e) => {
                if (activo) {
                    setError(e.message);
                }
            });
        return () => {
            activo = false;
        };
    }, []);
    function nuevo() {
        setId(null);
        setDatos({ ...vacio, password: '' });
        setMensaje('');
    }
    async function enviar(e) {
        e.preventDefault();
        setOcupado(true);
        setError('');
        try {
            await solicitar('/api/admin/pacientes' + (id ? `/${id}` : ''), {
                method: id ? 'PUT' : 'POST',
                body: datos,
            });
            await cargar();
            nuevo();
            setMensaje('Paciente guardado correctamente.');
        } catch (e) {
            setError(e.message);
        } finally {
            setOcupado(false);
        }
    }
    async function eliminar(p) {
        if (!window.confirm(`¿Eliminar a ${p.nombre}?`)) {
            return;
        }
        setOcupado(true);
        setError('');
        try {
            await solicitar(`/api/admin/pacientes/${p.id}`, { method: 'DELETE' });
            await cargar();
            if (p.id === id) {
                nuevo();
            }
            setMensaje('Paciente eliminado.');
        } catch (e) {
            setError(e.message);
        } finally {
            setOcupado(false);
        }
    }
    const filtroRut = normalizarRut(buscarRut);
    const pacientesFiltrados = filtroRut
        ? lista.filter((paciente) => normalizarRut(paciente.rut).includes(filtroRut))
        : lista;
    return (
        <section className="card-private">
            <h1>Administración de pacientes</h1>
            {error && <p role="alert">{error}</p>}
            {mensaje && <p role="status">{mensaje}</p>}
            <div className="mb-3">
                <label htmlFor="buscar-paciente-rut">Buscar paciente por RUT</label>
                <input
                    id="buscar-paciente-rut"
                    className="form-control"
                    value={buscarRut}
                    onChange={(evento) => setBuscarRut(evento.target.value)}
                    maxLength={RUT_LARGO_MAX}
                    placeholder="RUT con o sin puntos y guion"
                />
            </div>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>RUT</th>
                            <th>Correo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pacientesFiltrados.map((p) => (
                            <tr key={p.id}>
                                <td>{p.nombre}</td>
                                <td>{p.rut}</td>
                                <td>{p.correo}</td>
                                <td>
                                    <button
                                        className="btn btn-outline-success me-2"
                                        onClick={() => {
                                            setId(p.id);
                                            setDatos(p);
                                            setMensaje('');
                                        }}
                                    >
                                        Editar {p.nombre}
                                    </button>
                                    <button
                                        disabled={ocupado}
                                        className="btn btn-outline-danger"
                                        onClick={() => eliminar(p)}
                                    >
                                        Eliminar {p.nombre}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {pacientesFiltrados.length === 0 && (
                            <tr>
                                <td colSpan="4">No hay pacientes con ese RUT.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <h2>{id ? 'Editar paciente' : 'Crear paciente'}</h2>
            <form onSubmit={enviar}>
                <Campos datos={datos} cambiar={setDatos} password={!id} />
                <button disabled={ocupado} className="btn btn-success">
                    Guardar paciente
                </button>{' '}
                <button type="button" className="btn btn-secondary" onClick={nuevo}>
                    Nuevo
                </button>
            </form>
        </section>
    );
}
