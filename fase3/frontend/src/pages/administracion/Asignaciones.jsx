import { useEffect, useState } from 'react';
import { solicitar } from '../../api/usuarios';

export default function Asignaciones() {
    const [pacientes, setPacientes] = useState([]);
    const [profesionales, setProfesionales] = useState([]);
    const [pacienteId, setPacienteId] = useState('');
    const [profesionalId, setProfesionalId] = useState('');
    const [actual, setActual] = useState(null);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [ocupado, setOcupado] = useState(false);

    useEffect(() => {
        let vigente = true;
        Promise.all([solicitar('/api/admin/pacientes'), solicitar('/api/admin/profesionales')])
            .then(([pacientes, profesionales]) => {
                if (vigente) {
                    setPacientes(pacientes);
                    setProfesionales(profesionales.filter((profesional) => profesional.activo));
                }
            })
            .catch((error) => {
                if (vigente) {
                    setError(error.message);
                }
            });
        return () => {
            vigente = false;
        };
    }, []);

    useEffect(() => {
        let vigente = true;
        if (!pacienteId) {
            return;
        }
        solicitar(`/api/admin/pacientes/${pacienteId}/profesional`)
            .then((profesional) => {
                if (vigente) {
                    setActual(profesional?.id ? profesional : null);
                    setProfesionalId(profesional?.id ? String(profesional.id) : '');
                }
            })
            .catch((error) => {
                if (vigente) {
                    setError(error.message);
                }
            });
        return () => {
            vigente = false;
        };
    }, [pacienteId]);

    async function asignar(evento) {
        evento.preventDefault();
        setOcupado(true);
        setError('');
        setMensaje('');
        try {
            const profesional = await solicitar(`/api/admin/pacientes/${pacienteId}/profesional`, {
                method: 'PUT',
                body: { profesionalId: Number(profesionalId) },
            });
            setActual(profesional);
            setMensaje('Profesional asignado correctamente.');
        } catch (error) {
            setError(error.message);
        } finally {
            setOcupado(false);
        }
    }

    return (
        <section className="card-private">
            <h1>Asignar profesional</h1>
            <p>Cada paciente puede tener un profesional responsable activo.</p>
            {error && <p role="alert">{error}</p>}
            {mensaje && <p role="status">{mensaje}</p>}
            <form onSubmit={asignar}>
                <label htmlFor="paciente-asignado">Paciente</label>
                <select
                    id="paciente-asignado"
                    className="form-select mb-3"
                    required
                    value={pacienteId}
                    onChange={(evento) => {
                        setPacienteId(evento.target.value);
                        setActual(null);
                        setProfesionalId('');
                        setMensaje('');
                    }}
                >
                    <option value="">Selecciona un paciente</option>
                    {pacientes.map((paciente) => (
                        <option key={paciente.id} value={paciente.id}>
                            ID {paciente.id} · {paciente.nombre}
                        </option>
                    ))}
                </select>
                {pacienteId && <p>Profesional actual: {actual?.nombre || 'Sin asignación'}</p>}
                <label htmlFor="profesional-asignado">Profesional</label>
                <select
                    id="profesional-asignado"
                    className="form-select mb-3"
                    required
                    value={profesionalId}
                    onChange={(evento) => setProfesionalId(evento.target.value)}
                >
                    <option value="">Selecciona un profesional activo</option>
                    {profesionales.map((profesional) => (
                        <option key={profesional.id} value={profesional.id}>
                            {profesional.nombre} · {profesional.especialidad}
                        </option>
                    ))}
                </select>
                <button
                    className="btn btn-success"
                    disabled={ocupado || !pacienteId || !profesionalId}
                >
                    Guardar asignación
                </button>
            </form>
        </section>
    );
}
